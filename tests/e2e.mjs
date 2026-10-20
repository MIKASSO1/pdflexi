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
  await run(
    "laptop first viewport contains chat, composer and adjacent upload",
    async () => {
      await page.setViewportSize({ width: 1336, height: 646 });
      const boxes = await page.evaluate(() => {
        const b = (selector) => {
          const r = document.querySelector(selector).getBoundingClientRect();
          return { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
        };
        return {
          chat: b(".chat-card"),
          upload: b(".upload-first"),
          composer: b(".chat-composer"),
          headerTitle: document.querySelector("header h1").textContent,
          innerHeight,
          scrollY,
        };
      });
      assert.ok(boxes.chat.right < boxes.upload.left);
      assert.ok(Math.abs(boxes.chat.top - boxes.upload.top) < 2);
      assert.ok(boxes.composer.bottom <= boxes.innerHeight - 8);
      assert.equal(boxes.scrollY, 0);
      assert.match(boxes.headerTitle, /Your documents/);
      assert.equal(await page.locator(".middle-column h1").count(), 0);
      await noOverflow();
      await capture("first-screen-laptop");
      await page.setViewportSize({ width: 1500, height: 1050 });
    },
  );
  await run(
    "sidebars stay inside the viewport and scroll internally",
    async () => {
      await page.setViewportSize({ width: 1336, height: 646 });
      for (const selector of [".left-sidebar", ".right-sidebar"]) {
        const before = await page.locator(selector).evaluate((el) => {
          const rect = el.getBoundingClientRect();
          const list = el.querySelector("[role=region]");
          return {
            top: rect.top,
            bottom: rect.bottom,
            overflow: getComputedStyle(list).overflowY,
            scrolls: list.scrollHeight > list.clientHeight,
            header: el.querySelector(".panel-title").getBoundingClientRect()
              .top,
          };
        });
        assert.ok(before.bottom <= 646 - 8);
        assert.equal(before.overflow, "auto");
        assert.ok(before.scrolls);
        await page
          .locator(`${selector} [role=region]`)
          .evaluate((el) => (el.scrollTop = el.scrollHeight));
        const after = await page.locator(selector).evaluate((el) => ({
          header: el.querySelector(".panel-title").getBoundingClientRect().top,
          scrollY,
        }));
        assert.equal(after.header, before.header);
        assert.equal(after.scrollY, 0);
        const last = page.locator(`${selector} [data-capability]`).last();
        const b = await last.boundingBox();
        assert.ok(b.y + b.height <= before.bottom);
        await page
          .locator(`${selector} [role=region]`)
          .evaluate((el) => (el.scrollTop = 0));
      }
      const radius = await page
        .locator(".left-sidebar .free-tool")
        .first()
        .evaluate((el) => getComputedStyle(el).borderRadius);
      assert.equal(radius, "999px");
      await page.setViewportSize({ width: 1500, height: 1050 });
    },
  );
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
    assert.equal(
      await page
        .locator('.left-sidebar [data-capability="rotate"]')
        .getAttribute("aria-pressed"),
      "true",
    );
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
      assert.equal(bounds.chatH, 660);
      assert.equal(await page.locator(".is-split").count(), 0);
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
    assert.equal(
      await page.locator(".upload-first .image-preview img").count(),
      1,
    );
    assert.equal(
      await page.locator(".entry-upload-pane > .document-canvas").count(),
      0,
    );
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
    assert.equal(await page.locator(".upload-first .pdf-frame").count(), 1);
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
    assert.equal(await page.locator(".is-split").count(), 0);
    await page.locator("#lexi-prompt").fill("Summarize section 2");
    await page
      .getByRole("button", { name: "Send request", exact: true })
      .click();
    await page.waitForSelector(".is-split");
    assert.equal(await page.locator(".actual-document mark").count(), 0);
    assert.equal(await page.locator(".example-risk").count(), 0);
    assert.match(
      await page.locator(".processing-pending").textContent(),
      /not connected/,
    );
    const positions = await page.evaluate(() => ({
      chat: document.querySelector(".conversation-pane").getBoundingClientRect()
        .left,
      canvas: document
        .querySelector(".live-canvas-pane")
        .getBoundingClientRect().left,
    }));
    assert.ok(positions.chat < positions.canvas);
    await page.evaluate(() => window.scrollTo(0, 0));
    await capture("live-original");
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
    await page.locator(".attached-file .remove-file").click();
    assert.equal(await page.locator(".is-split").count(), 0);
  });
  await run("scripted Live Canvas is isolated from actual files", async () => {
    await page.locator(".live-demo-cta").click();
    await page.waitForSelector(".example-risk");
    assert.equal(await page.locator(".demo-clause mark.revealed").count(), 2);
    assert.match(
      await page.locator(".demo-notice").textContent(),
      /fictional document/,
    );
    assert.equal(await page.locator(".pdf-frame").count(), 0);
    await page.evaluate(() => window.scrollTo(0, 0));
    await capture("live-demo");
    await page.setViewportSize({ width: 390, height: 844 });
    await noOverflow();
    await page.locator(".live-demo").scrollIntoViewIfNeeded();
    await capture("live-demo-mobile");
    await page.locator(".demo-back").click();
    assert.equal(await page.locator(".is-split").count(), 0);
    await page.setViewportSize({ width: 1500, height: 1050 });
    await page.evaluate(() => window.scrollTo(0, 0));
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
    "mobile opens chat first and switches to upload without scrolling",
    async () => {
      const mobile = await browser.newPage({
        viewport: { width: 390, height: 844 },
      });
      try {
        await mobile.goto(url);
        await mobile.waitForSelector(".chat-card");
        assert.equal(await mobile.locator(".upload-first").isVisible(), false);
        const composer = await mobile.locator(".chat-composer").boundingBox();
        assert.ok(composer.y + composer.height <= 844 - 8);
        await mobile.locator("#lexi-prompt").fill("Keep my draft");
        await mobile.locator(".entry-pane-switch button").last().click();
        assert.equal(await mobile.locator(".upload-first").isVisible(), true);
        assert.equal(await mobile.locator(".chat-card").isVisible(), false);
        await mobile.locator("input[type=file]").setInputFiles({
          name: "mobile.docx",
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          buffer: Buffer.from("original"),
        });
        await mobile.waitForSelector(".upload-first .embedded-canvas");
        assert.equal(await mobile.locator(".upload-first").isVisible(), true);
        await mobile.locator(".preview-chat-button").click();
        await mobile.waitForSelector(".chat-card");
        assert.equal(
          await mobile.locator("#lexi-prompt").inputValue(),
          "Keep my draft",
        );
        assert.equal(
          await mobile.locator(".attachment-count").textContent(),
          "1",
        );
        assert.equal(await mobile.locator(".is-split").count(), 0);
        await mobile.locator(".send-button").click();
        await mobile.waitForSelector(".is-split");
      } finally {
        await mobile.close();
      }
    },
  );
  await run("reduced motion disables Aurora", async () => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    assert.equal(
      await page
        .locator(".aurora-background i")
        .first()
        .evaluate((e) => getComputedStyle(e).animationName),
      "none",
    );
  });
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
