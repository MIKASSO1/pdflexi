import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
const url = process.env.TEST_URL || "http://127.0.0.1:5173";
const browser = await chromium.launch({
  ...(process.env.CHROMIUM_PATH
    ? { executablePath: process.env.CHROMIUM_PATH }
    : {}),
  headless: true,
  args: ["--no-sandbox"],
});
const failures = [];
const results = [];
await mkdir("artifacts/qa", { recursive: true });
const page = await browser.newPage({
  viewport: { width: 1500, height: 1050 },
  deviceScaleFactor: 1,
});
page.on("pageerror", (error) => failures.push(String(error)));
let uploadRequests = 0;
page.on("request", (request) => {
  if (["POST", "PUT", "PATCH"].includes(request.method())) uploadRequests++;
});
async function run(name, fn) {
  try {
    await fn();
    results.push({ name, status: "pass" });
    console.log(`PASS ${name}`);
  } catch (error) {
    results.push({ name, status: "fail", error: String(error) });
    console.error(`FAIL ${name}: ${error}`);
  }
}
async function noOverflow() {
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    "horizontal page overflow",
  );
}
async function capture(name) {
  await page
    .locator(".toast button")
    .click({ timeout: 300 })
    .catch(() => {});
  await page.screenshot({ path: `artifacts/qa/${name}.png`, fullPage: false });
}
try {
  await page.goto(url);
  await page.waitForSelector(".chat-card");
  await run("30 capabilities and desktop layout", async () => {
    assert.equal(
      await page.locator('.left-sidebar [data-tier="free"]').count(),
      20,
    );
    assert.equal(
      await page.locator('.right-sidebar [data-tier="pro"]').count(),
      10,
    );
    const grid = await page
      .locator(".workspace-layout")
      .evaluate((e) => getComputedStyle(e).gridTemplateColumns);
    assert.equal(grid, "240px 760px 320px");
    await noOverflow();
    await capture("desktop");
  });
  await run("capability search and draft, not manual execution", async () => {
    await page
      .getByRole("textbox", { name: "Search tools…", exact: true })
      .fill("rotate");
    assert.equal(
      await page.locator(".left-sidebar [data-capability]").count(),
      1,
    );
    await page.locator('.left-sidebar [data-capability="rotate"]').click();
    assert.match(await page.locator("#lexi-prompt").inputValue(), /rotate/i);
    await page
      .getByRole("textbox", { name: "Search tools…", exact: true })
      .fill("");
  });
  await run(
    "chat explicitly says not executed, composer remains attached",
    async () => {
      for (let i = 0; i < 8; i++) {
        await page
          .locator("#lexi-prompt")
          .fill(`Merge my files, request ${i + 1}`);
        await page
          .getByRole("button", { name: "Send request", exact: true })
          .click();
      }
      assert.equal(await page.locator(".message.user").count(), 8);
      assert.equal(await page.locator(".not-executed").count(), 8);
      const bounds = await page.evaluate(() => {
        const c = document.querySelector(".chat-card").getBoundingClientRect();
        const f = document
          .querySelector(".chat-composer")
          .getBoundingClientRect();
        const m = document.querySelector(".chat-messages");
        return {
          chatH: c.height,
          bottom: c.bottom,
          composerBottom: f.bottom,
          scroll: m.scrollHeight > m.clientHeight,
          overflow: getComputedStyle(m).overflowY,
        };
      });
      assert.equal(bounds.chatH, 620);
      assert.ok(Math.abs(bounds.bottom - bounds.composerBottom) <= 2);
      assert.ok(bounds.scroll);
      assert.equal(bounds.overflow, "auto");
      await capture("chat-overflow");
    },
  );
  await run("new conversation requires confirmation", async () => {
    await page
      .getByRole("button", { name: "New conversation", exact: true })
      .first()
      .click();
    await page
      .getByRole("button", { name: "Keep conversation", exact: true })
      .click();
    assert.equal(await page.locator(".message.user").count(), 8);
    await page
      .getByRole("button", { name: "New conversation", exact: true })
      .first()
      .click();
    await page
      .getByRole("button", { name: "Start fresh", exact: true })
      .click();
    assert.equal(await page.locator(".message.user").count(), 0);
  });
  await run("reject disguised PDF", async () => {
    await page.locator("input[type=file]").setInputFiles({
      name: "invalid.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("not a PDF"),
    });
    await page.waitForSelector(".file-errors");
    assert.match(
      await page.locator(".file-errors").textContent(),
      /PDF header/,
    );
    assert.equal(await page.locator(".attached-file").count(), 0);
    await page.locator(".file-errors").scrollIntoViewIfNeeded();
    await capture("file-error");
    await page.locator(".file-errors button").click();
  });
  await run("local image preview, duplicate handling, remove", async () => {
    const image = {
      name: "sample.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a2ioAAAAASUVORK5CYII=",
        "base64",
      ),
    };
    await writeFile("artifacts/qa/sample.png", image.buffer);
    await page
      .locator("input[type=file]")
      .setInputFiles("artifacts/qa/sample.png");
    await page.waitForSelector(".image-preview img");
    assert.equal(await page.locator(".attached-file").count(), 1);
    await page
      .locator("input[type=file]")
      .setInputFiles("artifacts/qa/sample.png");
    await page.waitForSelector(".file-errors");
    assert.equal(await page.locator(".attached-file").count(), 1);
    await page.locator(".attached-file .remove-file").click();
    assert.equal(await page.locator(".attached-file").count(), 0);
    await page.locator(".file-errors button").click();
  });
  await run("Word original-only preview, expansion, download", async () => {
    await page.locator("input[type=file]").setInputFiles({
      name: "notes.docx",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      buffer: Buffer.from("test fixture, not a real Word document"),
    });
    await page.waitForSelector(".unpreviewable");
    assert.match(
      await page.locator(".unpreviewable").textContent(),
      /No conversion/,
    );
    await page
      .getByRole("button", { name: "Expand canvas", exact: true })
      .click();
    await page.waitForSelector("dialog[open] .expanded-canvas");
    await capture("expanded-canvas");
    await page
      .getByRole("button", { name: "Close", exact: true })
      .first()
      .click();
    await page.locator(".attached-file .remove-file").click();
  });
  await run("valid PDF preview and original download bytes", async () => {
    const objects = [
      "<< /Type /Catalog /Pages 2 0 R >>",
      "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 300] /Contents 4 0 R >>",
      "<< /Length 0 >>\nstream\n\nendstream",
    ];
    let pdf = "%PDF-1.4\n",
      offsets = [0];
    for (let i = 0; i < objects.length; i++) {
      offsets.push(Buffer.byteLength(pdf));
      pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
    }
    const xref = Buffer.byteLength(pdf);
    pdf += `xref\n0 5\n0000000000 65535 f \n${offsets
      .slice(1)
      .map((x) => String(x).padStart(10, "0") + " 00000 n ")
      .join(
        "\n",
      )}\ntrailer\n<< /Root 1 0 R /Size 5 >>\nstartxref\n${xref}\n%%EOF`;
    const buffer = Buffer.from(pdf);
    await page.locator("input[type=file]").setInputFiles({
      name: "valid.pdf",
      mimeType: "application/pdf",
      buffer,
    });
    await page.waitForSelector(".pdf-frame");
    assert.match(
      await page.locator(".pdf-frame").getAttribute("src"),
      /^blob:/,
    );
    const downloadEvent = page.waitForEvent("download");
    await page
      .getByRole("link", { name: "Download original", exact: true })
      .click();
    const download = await downloadEvent;
    const stream = await download.createReadStream();
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    assert.ok(Buffer.concat(chunks).equals(buffer));
    await page.locator(".document-canvas").scrollIntoViewIfNeeded();
    await capture("pdf-original");
    await page.locator(".attached-file .remove-file").click();
    await page.evaluate(() => window.scrollTo(0, 0));
  });
  await run("version history does not invent edited files", async () => {
    await page
      .getByRole("button", { name: "Version history", exact: true })
      .click();
    await page.waitForSelector(".history-empty");
    assert.match(
      await page.locator(".history-empty").textContent(),
      /No processed versions/,
    );
    await capture("history");
    await page.keyboard.press("Escape");
  });
  await run("plans and how dialogs show honest phase status", async () => {
    await page.getByRole("button", { name: "Plans", exact: true }).click();
    assert.match(await page.locator("dialog").textContent(), /No checkout/);
    await capture("plans");
    await page.keyboard.press("Escape");
    await page
      .getByRole("button", { name: "How it works", exact: true })
      .click();
    assert.equal(await page.locator(".how-steps>div").count(), 3);
    await capture("how");
    await page.keyboard.press("Escape");
  });
  await run("language chooser lists 29, only 3 enabled", async () => {
    await page.getByRole("button", { name: "Language", exact: true }).click();
    assert.equal(await page.locator(".language-option").count(), 29);
    assert.equal(
      await page.locator(".language-option:not(:disabled)").count(),
      3,
    );
    await capture("languages");
    await page
      .getByRole("button", { name: "العربية Arabic", exact: false })
      .click();
    assert.equal(await page.locator("html").getAttribute("dir"), "rtl");
    await noOverflow();
    await page.evaluate(() => window.scrollTo(0, 0));
    await capture("arabic-desktop");
  });
  await run("Arabic search and prompts", async () => {
    await page.locator(".left-sidebar input").fill("دمج");
    assert.equal(
      await page.locator(".left-sidebar [data-capability]").count(),
      1,
    );
    await page.locator('.left-sidebar [data-capability="merge"]').click();
    assert.match(await page.locator("#lexi-prompt").inputValue(), /اجمع/);
    await page.locator(".left-sidebar input").fill("");
  });
  await run("mobile Arabic responsive workspace and capabilities", async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await noOverflow();
    await capture("arabic-mobile");
    await page.locator(".mobile-shortcuts>button").first().click();
    assert.equal(await page.locator('dialog [data-tier="free"]').count(), 20);
    await capture("arabic-mobile-tools");
    await page.keyboard.press("Escape");
  });
  await run("French complete interface and mobile menu", async () => {
    await page.getByRole("button", { name: "اللغة", exact: true }).click();
    await page
      .getByRole("button", { name: "Français French", exact: false })
      .click();
    assert.equal(await page.locator("html").getAttribute("lang"), "fr");
    assert.equal(await page.locator("html").getAttribute("dir"), "ltr");
    await page.evaluate(() => window.scrollTo(0, 0));
    await noOverflow();
    await capture("french-mobile");
    await page.getByRole("button", { name: "Menu", exact: true }).click();
    assert.equal(await page.locator(".mobile-nav button").count(), 5);
    await capture("mobile-menu");
    await page.keyboard.press("Escape");
  });
  await run("English mobile and 320px edge width", async () => {
    await page.getByRole("button", { name: "Langue", exact: true }).click();
    await page
      .getByRole("button", { name: "English English", exact: false })
      .click();
    await page.evaluate(() => window.scrollTo(0, 0));
    await capture("english-mobile");
    await noOverflow();
    await page.setViewportSize({ width: 320, height: 740 });
    await noOverflow();
    await capture("small-mobile");
  });
  await run(
    "tablet and intermediate desktop have no page overflow",
    async () => {
      for (const width of [768, 1024, 1280]) {
        await page.setViewportSize({ width, height: 1000 });
        await noOverflow();
      }
      await capture("compact-desktop");
    },
  );
  await run(
    "documents do not upload and no browser runtime errors",
    async () => {
      assert.equal(uploadRequests, 0);
      assert.deepEqual(failures, []);
    },
  );
} finally {
  await writeFile(
    "artifacts/qa/results.json",
    JSON.stringify(
      { results, runtimeErrors: failures, uploadRequests },
      null,
      2,
    ),
  );
  await browser.close();
}
if (results.some((r) => r.status === "fail")) process.exit(1);
