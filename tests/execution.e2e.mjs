import { chromium } from "playwright";
import { PDFDocument } from "pdf-lib";
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
const url = process.env.TEST_URL || "http://localhost:5173";
await mkdir("artifacts/qa", { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH,
  args: ["--no-sandbox"],
});
const context = await browser.newContext({
  viewport: { width: 1336, height: 850 },
  acceptDownloads: true,
});
await context.addInitScript(() => {
  const Native = window.Worker;
  window.__toolWorkers = 0;
  window.__toolTerminations = 0;
  window.__holdTool = false;
  window.Worker = class extends Native {
    constructor(url, options) {
      super(url, options);
      this.isTool = /\/worker[-.]/.test(String(url));
      if (this.isTool) window.__toolWorkers++;
    }
    postMessage(...args) {
      if (!this.isTool || !window.__holdTool) super.postMessage(...args);
    }
    terminate() {
      if (this.isTool) window.__toolTerminations++;
      super.terminate();
    }
  };
});
const page = await context.newPage(),
  errors = [],
  badRequests = [],
  results = [];
page.on("pageerror", (error) => errors.push(String(error)));
page.on("request", (request) => {
  if (["POST", "PUT", "PATCH"].includes(request.method()))
    badRequests.push(request.url());
});
let downloadedBytes;
async function run(name, fn) {
  try {
    await fn();
    results.push({ name, status: "pass" });
    console.log("PASS " + name);
  } catch (error) {
    results.push({ name, status: "fail", error: String(error) });
    console.error("FAIL " + name + ": " + error);
    throw error;
  }
}
async function fixture(name, count) {
  const pdf = await PDFDocument.create();
  for (let i = 0; i < count; i++) pdf.addPage([200, 400]);
  return {
    name,
    mimeType: "application/pdf",
    buffer: Buffer.from(await pdf.save()),
  };
}
const fixtures = [await fixture("alpha.pdf", 2), await fixture("beta.pdf", 2)];
const panel = () => page.locator(".execution-panel");
async function openPanel() {
  await page
    .getByRole("button", { name: "Local tool execution", exact: true })
    .click();
  await panel().waitFor();
}
async function closePanel() {
  await page.locator("dialog .dialog-close").click();
}
try {
  await page.goto(url);
  await run(
    "uploading originals does not execute tools or send files to a server",
    async () => {
      await page.locator("input[type=file]").setInputFiles(fixtures);
      await page.waitForSelector(".start-file");
      assert.equal(await page.locator(".start-file").count(), 2);
      assert.equal(await page.evaluate(() => window.__toolWorkers), 0);
      assert.equal(badRequests.length, 0);
    },
  );
  await run(
    "chat builds a validated pipeline and waits for explicit confirmation",
    async () => {
      await page
        .locator("#lexi-prompt")
        .fill("merge files then delete pages 2 then rotate 90");
      await page.locator(".start-submit").click();
      await panel().waitFor();
      assert.equal(await panel().locator("ol li").count(), 3);
      assert.equal(await page.evaluate(() => window.__toolWorkers), 0);
      await page.screenshot({ path: "artifacts/qa/architecture-plan.png" });
    },
  );
  await run(
    "real worker pipeline produces correct pages and rotation",
    async () => {
      await panel()
        .getByRole("button", { name: "Run this plan", exact: true })
        .click();
      const link = panel().getByRole("link", { name: /Download: rotated.pdf/ });
      await link.waitFor({ timeout: 30000 });
      const pending = page.waitForEvent("download");
      await link.click();
      const download = await pending;
      downloadedBytes = await readFile(await download.path());
      const pdf = await PDFDocument.load(downloadedBytes);
      assert.equal(pdf.getPageCount(), 3);
      assert.equal(pdf.getPage(0).getRotation().angle, 90);
      assert.equal(await page.evaluate(() => window.__toolWorkers), 3);
      assert.equal(await page.evaluate(() => window.__toolTerminations), 3);
      assert.equal(badRequests.length, 0);
      await page.screenshot({ path: "artifacts/qa/architecture-result.png" });
    },
  );
  await run(
    "saving is explicit and IndexedDB survives page reload",
    async () => {
      await panel()
        .getByRole("button", { name: "Saved documents", exact: true })
        .click();
      await panel()
        .getByText("No documents saved on this device.", { exact: true })
        .waitFor();
      await panel()
        .getByRole("button", { name: "Save on this device", exact: true })
        .click();
      await panel()
        .getByRole("button", { name: "Saved on this device", exact: true })
        .waitFor();
      await page.reload();
      await openPanel();
      await panel()
        .getByRole("button", { name: "Saved documents", exact: true })
        .click();
      await panel()
        .getByRole("button", { name: "Download", exact: true })
        .waitFor();
      await panel()
        .getByRole("button", { name: "Download", exact: true })
        .click();
      const link = panel().getByRole("link", { name: /Download: rotated.pdf/ });
      await link.waitFor();
      const pending = page.waitForEvent("download");
      await link.click();
      assert.deepEqual(
        await readFile(await (await pending).path()),
        downloadedBytes,
      );
    },
  );
  await run(
    "saved documents can be deleted without leaving download URLs",
    async () => {
      await panel()
        .getByRole("button", { name: "Delete", exact: true })
        .click();
      await panel()
        .getByText("No documents saved on this device.", { exact: true })
        .waitFor();
      assert.equal(
        await panel()
          .getByRole("link", { name: /rotated.pdf/ })
          .count(),
        0,
      );
    },
  );
  await run(
    "planned tools are visible but cannot produce fake results",
    async () => {
      await panel().getByRole("combobox").selectOption("forgery-signals");
      await panel()
        .getByText("This tool is planned. No processing has been performed.", {
          exact: true,
        })
        .waitFor();
      assert.equal(
        await panel()
          .getByRole("button", { name: "Preview plan", exact: true })
          .count(),
        0,
      );
    },
  );
  await closePanel();
  await run(
    "invalid structured parameters are rejected before a worker starts",
    async () => {
      await page.locator("input[type=file]").setInputFiles(fixtures[0]);
      await page.waitForSelector(".start-file");
      await openPanel();
      await panel().getByRole("combobox").selectOption("rotate");
      await panel().getByRole("textbox").fill('{"degrees":45}');
      await panel()
        .getByRole("button", { name: "Preview plan", exact: true })
        .click();
      await panel().getByRole("alert").waitFor();
      assert.match(await panel().getByRole("alert").innerText(), /Rotation/);
      assert.equal(
        await panel()
          .getByRole("button", { name: "Run this plan", exact: true })
          .count(),
        0,
      );
    },
  );
  await run(
    "cancellation terminates a busy worker without publishing a result",
    async () => {
      await panel().getByRole("textbox").fill('{"degrees":90}');
      await panel()
        .getByRole("button", { name: "Preview plan", exact: true })
        .click();
      await page.evaluate(() => {
        window.__holdTool = true;
      });
      await panel()
        .getByRole("button", { name: "Run this plan", exact: true })
        .click();
      await page.waitForFunction(() => window.__toolWorkers >= 1);
      await panel()
        .getByRole("button", { name: "Cancel", exact: true })
        .click();
      await panel().getByRole("alert").waitFor();
      assert.match(await panel().getByRole("alert").innerText(), /cancelled/);
      assert.ok(await page.evaluate(() => window.__toolTerminations >= 1));
      assert.equal(await panel().getByRole("link").count(), 0);
      await page.evaluate(() => {
        window.__holdTool = false;
      });
    },
  );
  await run(
    "cached app and a previously used tool execute offline",
    async () => {
      if (new URL(url).port === "5173") return; // service worker intentionally disabled in dev mode.
      await page.evaluate(async () => {
        await navigator.serviceWorker.ready;
      });
      await closePanel();
      await page.reload();
      await page.waitForFunction(() => !!navigator.serviceWorker.controller);
      await page.locator("input[type=file]").setInputFiles(fixtures[0]);
      await page.waitForSelector(".start-file");
      await openPanel();
      await panel().getByRole("combobox").selectOption("rotate");
      await panel()
        .getByRole("button", { name: "Preview plan", exact: true })
        .click();
      await panel()
        .getByRole("button", { name: "Run this plan", exact: true })
        .click();
      await panel()
        .getByRole("link", { name: /Download: rotated.pdf/ })
        .waitFor();
      await closePanel();
      // Wait for runtime cache writes before switching network off.
      await page.waitForFunction(async () => {
        const keys = await caches.keys();
        const cache = await caches.open(
          keys.find((k) => k.startsWith("pdflexi-shell-")),
        );
        return (await cache.keys()).some((r) => /\/worker-/.test(r.url));
      });
      await context.setOffline(true);
      await page.reload();
      await page.locator(".start-card").waitFor();
      await page.locator("input[type=file]").setInputFiles(fixtures[0]);
      await page.waitForSelector(".start-file");
      await openPanel();
      await panel().getByRole("combobox").selectOption("rotate");
      await panel()
        .getByRole("button", { name: "Preview plan", exact: true })
        .click();
      await panel()
        .getByRole("button", { name: "Run this plan", exact: true })
        .click();
      await panel()
        .getByRole("link", { name: /Download: rotated.pdf/ })
        .waitFor({ timeout: 15000 });
      await page.screenshot({ path: "artifacts/qa/architecture-offline.png" });
      await context.setOffline(false);
    },
  );
  await run("no document uploads or uncaught browser errors", async () => {
    assert.deepEqual(errors, []);
    assert.deepEqual(badRequests, []);
  });
} finally {
  await writeFile(
    "artifacts/qa/architecture-results.json",
    JSON.stringify({ results, errors, badRequests }, null, 2),
  );
  await browser.close();
}
