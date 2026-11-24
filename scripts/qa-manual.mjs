import { chromium } from "playwright";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import assert from "node:assert/strict";
await mkdir("artifacts/qa", { recursive: true });
const fixture = await PDFDocument.create();
const font = await fixture.embedFont(StandardFonts.Helvetica);
for (let i = 0; i < 12; i++) {
  const p = fixture.addPage([595, 842]);
  p.drawRectangle({
    x: 48,
    y: 760,
    width: 40,
    height: 5,
    color: rgb(0.44, 0.31, 0.71),
  });
  p.drawText("Service agreement", {
    x: 48,
    y: 710,
    size: 24,
    font,
    color: rgb(0.18, 0.2, 0.25),
  });
  p.drawText(`SECTION ${String(i + 1).padStart(2, "0")}  /  LOCAL PREVIEW`, {
    x: 48,
    y: 680,
    size: 10,
    font,
    color: rgb(0.45, 0.48, 0.55),
  });
  p.drawText("Your original document stays unchanged.", {
    x: 48,
    y: 620,
    size: 13,
    font,
  });
  p.drawText(`${i + 1} / 12`, { x: 500, y: 35, size: 10, font });
}
const original = Buffer.from(await fixture.save());
const fixturePath = "artifacts/qa/manual-fixture.pdf";
await writeFile(fixturePath, original);
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH,
  args: ["--no-sandbox"],
});
const results = [],
  errors = [],
  failed = [];
const url = process.env.TEST_URL || "http://localhost:5173";
const page = await browser.newPage({
  viewport: { width: 1336, height: 669 },
  reducedMotion: "reduce",
});
page.on("pageerror", (e) => errors.push(String(e)));
let uploads = 0;
page.on("request", (r) => {
  if (["POST", "PUT", "PATCH"].includes(r.method())) uploads++;
});
async function run(name, fn) {
  try {
    await fn();
    results.push({ name, status: "pass" });
    console.log("PASS " + name);
  } catch (error) {
    failed.push(name);
    results.push({ name, status: "fail", error: String(error) });
    console.error("FAIL " + name + ": " + error);
  }
}
async function capture(name) {
  await page
    .locator(".toast button")
    .click({ timeout: 200 })
    .catch(() => {});
  await page.screenshot({ path: `artifacts/qa/${name}.png` });
}
async function settle() {
  await page.waitForTimeout(250);
}
async function surface() {
  await settle();
  return page.locator(
    '.live-canvas-pane .pdf-page[data-page-number="1"] .annotation-layer',
  );
}
async function position(x, y) {
  const b = await (await surface()).boundingBox();
  assert.ok(b);
  return { x: b.x + b.width * x, y: b.y + b.height * y };
}
async function clickAt(x, y) {
  const p = await position(x, y);
  await page.mouse.click(p.x, p.y);
  await settle();
}
async function stroke(points) {
  const first = await position(...points[0]);
  await page.mouse.move(first.x, first.y);
  await page.mouse.down();
  for (const p of points.slice(1)) {
    const pos = await position(...p);
    await page.mouse.move(pos.x, pos.y, { steps: 5 });
  }
  await page.mouse.up();
  await settle();
}
async function tool(name) {
  await page.locator(`.live-canvas-pane [data-tool="${name}"]`).click();
  await settle();
}
async function count() {
  return Number(
    (
      await page.locator(".live-canvas-pane .editor-save-state").textContent()
    ).match(/^(\d+)/)?.[1] || 0,
  );
}
async function download(selector) {
  const event = page.waitForEvent("download");
  await page.locator(selector).click();
  const d = await event;
  const stream = await d.createReadStream();
  const chunks = [];
  for await (const part of stream) chunks.push(part);
  return { bytes: Buffer.concat(chunks), name: d.suggestedFilename() };
}
async function pixel(x, y, annotation = false) {
  return page
    .locator(
      `.live-canvas-pane .pdf-page[data-page-number="1"] ${annotation ? ".annotation-layer" : "canvas:not(.annotation-layer)"}`,
    )
    .evaluate(
      (canvas, p) =>
        Array.from(
          canvas
            .getContext("2d")
            .getImageData(
              Math.floor(canvas.width * p[0]),
              Math.floor(canvas.height * p[1]),
              1,
              1,
            ).data,
        ),
      [x, y],
    );
}
let edited;
try {
  await page.goto(url);
  await run(
    "one calm card with adjacent upload and request, tools hidden",
    async () => {
      await page.waitForSelector(".start-card");
      assert.equal(await page.locator(".start-card").count(), 1);
      assert.equal(await page.locator(".sidebar:visible").count(), 0);
      const a = await page.locator(".start-upload").boundingBox(),
        b = await page.locator(".start-request").boundingBox();
      assert.ok(a.x + a.width < b.x);
      assert.ok(await page.locator(".start-submit").isDisabled());
      await capture("new-entry-desktop");
    },
  );
  await run(
    "all 30 tools are available on demand; selecting one only drafts",
    async () => {
      await page.locator(".start-card-heading>button").click();
      assert.equal(await page.locator('dialog [data-tier="free"]').count(), 20);
      await page.locator(".capability-tabs button").last().click();
      assert.equal(await page.locator('dialog [data-tier="pro"]').count(), 10);
      await page
        .locator('dialog [data-capability="summarize-contract"]')
        .click();
      assert.match(await page.locator("#lexi-prompt").inputValue(), /summar/i);
      assert.equal(await page.locator(".is-split").count(), 0);
    },
  );
  await run(
    "invalid PDF is rejected; actual file appears inside upload box",
    async () => {
      await page.locator("input[type=file]").setInputFiles({
        name: "fake.pdf",
        mimeType: "application/pdf",
        buffer: Buffer.from("not pdf"),
      });
      await page.waitForSelector(".file-errors");
      assert.equal(await page.locator(".start-file").count(), 0);
      await page.locator(".file-errors button").click();
      await page.locator("input[type=file]").setInputFiles(fixturePath);
      await page.waitForSelector(".start-thumbnail canvas");
      await page.waitForFunction(
        () =>
          document.querySelector(".start-thumbnail canvas")?.style
            .visibility === "visible",
      );
      assert.equal(
        await page.locator(".start-dropzone .start-file").count(),
        1,
      );
      assert.equal(await page.locator(".is-split").count(), 0);
      await capture("new-entry-uploaded");
    },
  );
  await run("duplicate file is rejected without losing the draft", async () => {
    await page.locator("input[type=file]").setInputFiles(fixturePath);
    await page.waitForSelector(".file-errors");
    assert.equal(await page.locator(".start-file").count(), 1);
    assert.ok((await page.locator("#lexi-prompt").inputValue()).length > 0);
    await page.locator(".file-errors button").click();
  });
  await run(
    "first request opens full-height chat and a complete fitted page",
    async () => {
      await page
        .locator("#lexi-prompt")
        .fill("Summarize this agreement in three clear points.");
      await page.locator(".start-submit").click();
      await page.waitForSelector(".pdf-page .annotation-layer");
      await page.waitForFunction(
        () => document.querySelector(".pdf-page canvas")?.width > 0,
      );
      await settle();
      const g = await page.evaluate(() => {
        const b = (s) => {
          const r = document.querySelector(s).getBoundingClientRect();
          return {
            top: r.top,
            bottom: r.bottom,
            width: r.width,
            height: r.height,
          };
        };
        return {
          sheet: b(".pdf-page"),
          viewer: b(".pdf-viewer"),
          chat: b(".chat-card"),
          canvas: b(".studio-canvas"),
          composer: b(".chat-composer"),
        };
      });
      assert.ok(g.sheet.height <= g.viewer.height - 45);
      assert.ok(g.sheet.width <= g.viewer.width - 45);
      assert.ok(g.sheet.top >= g.viewer.top + 20);
      assert.ok(g.sheet.bottom <= g.viewer.bottom - 20);
      assert.ok(g.composer.bottom <= 669);
      assert.equal(g.chat.bottom, g.canvas.bottom);
      assert.equal(await page.locator(".live-canvas-pane iframe").count(), 0);
      assert.equal(
        await page
          .getByRole("combobox", { name: "Zoom", exact: true })
          .inputValue(),
        "page",
      );
      await capture("new-workspace-fit-page");
    },
  );
  await run(
    "explicit zoom-out, zoom-in, actual 100%, fit-width and fit-page",
    async () => {
      const zoom = page.getByRole("combobox", { name: "Zoom", exact: true });
      const scale = await page
        .locator(".pdf-page")
        .first()
        .getAttribute("data-render-scale");
      await page.getByRole("button", { name: "Zoom in", exact: true }).click();
      const bigger = Number(await zoom.inputValue());
      assert.ok(bigger > Number(scale));
      await page.getByRole("button", { name: "Zoom out", exact: true }).click();
      assert.ok(Number(await zoom.inputValue()) < bigger);
      await zoom.selectOption("1");
      await settle();
      assert.ok(
        Math.abs(
          (await page.locator(".pdf-page").first().boundingBox()).width - 595,
        ) < 2,
      );
      await zoom.selectOption("width");
      await settle();
      const b = await page.locator(".pdf-page").first().boundingBox(),
        v = await page.locator(".pdf-viewer").boundingBox();
      assert.ok(b.width > v.width - 65);
      await zoom.selectOption("page");
      await settle();
    },
  );
  await run(
    "real 12-page navigation and scrolling reach the final page",
    async () => {
      await page
        .getByRole("button", { name: "Next page", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Next page", exact: true })
        .click();
      await settle();
      assert.match(
        await page.locator(".studio-page-status").textContent(),
        /Page 3 of 12/,
      );
      await page
        .locator(".pdf-viewer")
        .evaluate((el) => (el.scrollTop = el.scrollHeight));
      await settle();
      assert.match(
        await page.locator(".studio-page-status").textContent(),
        /Page 12 of 12/,
      );
      await page.locator(".pdf-viewer").evaluate((el) => (el.scrollTop = 0));
      await settle();
    },
  );
  await run(
    "pen creates a real local addition; undo and redo work",
    async () => {
      await tool("pen");
      await stroke([
        [0.4, 0.5],
        [0.45, 0.5],
        [0.5, 0.55],
        [0.55, 0.5],
      ]);
      assert.equal(await count(), 1);
      assert.ok((await pixel(0.45, 0.5, true))[3] > 0);
      await page.getByRole("button", { name: "Undo", exact: true }).click();
      assert.equal(await count(), 0);
      await page.getByRole("button", { name: "Redo", exact: true }).click();
      assert.equal(await count(), 1);
      await capture("new-editor-pen");
    },
  );
  await run(
    "highlight, rectangle and arrow tools add editable marks",
    async () => {
      await tool("highlight");
      await stroke([
        [0.12, 0.34],
        [0.5, 0.39],
      ]);
      assert.equal(await count(), 2);
      const color = await pixel(0.3, 0.36, true);
      assert.ok(
        color[0] > 220 && color[1] > 150 && color[3] > 40 && color[3] < 120,
      );
      await tool("rectangle");
      await stroke([
        [0.7, 0.4],
        [0.9, 0.55],
      ]);
      await tool("arrow");
      await stroke([
        [0.6, 0.65],
        [0.8, 0.75],
      ]);
      assert.equal(await count(), 4);
    },
  );
  await run("eraser only removes additions, with undo and redo", async () => {
    await tool("eraser");
    assert.match(
      await page.locator(".editor-hint").textContent(),
      /original PDF/,
    );
    await clickAt(0.45, 0.5);
    assert.equal(await count(), 3);
    await page.getByRole("button", { name: "Undo", exact: true }).click();
    assert.equal(await count(), 4);
    await page.getByRole("button", { name: "Redo", exact: true }).click();
    assert.equal(await count(), 3);
  });
  await run(
    "formatted text is placed and can be edited after selection",
    async () => {
      await tool("text");
      await page
        .getByRole("textbox", { name: "Text to add or edit", exact: true })
        .fill("Approved for review");
      await page
        .getByRole("combobox", { name: "Font", exact: true })
        .selectOption("Georgia");
      await page
        .getByRole("combobox", { name: "Font size", exact: true })
        .selectOption("24");
      await page.getByRole("button", { name: "Bold", exact: true }).click();
      await page.getByRole("button", { name: "Italic", exact: true }).click();
      await page
        .getByRole("button", { name: "Underline", exact: true })
        .click();
      await clickAt(0.18, 0.6);
      assert.equal(await count(), 4);
      await page
        .getByRole("textbox", { name: "Text to add or edit", exact: true })
        .fill("Approved — revised");
      await page
        .getByRole("combobox", { name: "Font size", exact: true })
        .selectOption("20");
      await page
        .getByRole("button", { name: "Apply to selected text", exact: true })
        .click();
      await tool("select");
      await clickAt(0.2, 0.61);
      await page.locator('[data-tool="text"]').click();
      assert.equal(
        await page
          .getByRole("textbox", { name: "Text to add or edit", exact: true })
          .inputValue(),
        "Approved — revised",
      );
      assert.equal(
        await page
          .getByRole("combobox", { name: "Font size", exact: true })
          .inputValue(),
        "20",
      );
      assert.equal(
        await page
          .getByRole("button", { name: "Bold", exact: true })
          .getAttribute("aria-pressed"),
        "true",
      );
      await capture("new-editor-text-format");
    },
  );
  await run(
    "selection moves an addition and keyboard deletion can be undone",
    async () => {
      await tool("select");
      await clickAt(0.2, 0.61);
      await stroke([
        [0.2, 0.61],
        [0.24, 0.64],
      ]);
      assert.equal(await count(), 4);
      await page.keyboard.press("Delete");
      assert.equal(await count(), 3);
      await page.keyboard.press("Control+z");
      assert.equal(await count(), 4);
    },
  );
  await run(
    "downloaded edited PDF contains changes and 12 original pages",
    async () => {
      edited = await download(".live-canvas-pane .edited-download");
      assert.match(edited.name, /-edited\.pdf$/);
      assert.ok(!edited.bytes.equals(original));
      const pdf = await PDFDocument.load(edited.bytes);
      assert.equal(pdf.getPageCount(), 12);
      assert.match(
        await page.locator(".editor-save-state").textContent(),
        /downloaded/,
      );
      await writeFile("artifacts/qa/downloaded-edited.pdf", edited.bytes);
    },
  );
  await run(
    "exported additions render in the correct position on the PDF",
    async () => {
      await page.locator("input[type=file]").setInputFiles({
        name: edited.name,
        mimeType: "application/pdf",
        buffer: edited.bytes,
      });
      await page.waitForFunction(() =>
        document
          .querySelector(".studio-filename")
          ?.textContent.includes("-edited.pdf"),
      );
      await page.waitForFunction(
        () => document.querySelector(".pdf-page canvas")?.width > 0,
      );
      await page.waitForTimeout(500);
      assert.equal(await count(), 0);
      const color = await pixel(0.3, 0.36);
      assert.ok(
        color[0] > 240 && color[1] > 225 && color[2] < 225,
        `exported highlight color ${color}`,
      );
      await capture("new-editor-exported");
    },
  );
  await run(
    "switching files and opening a larger canvas preserve annotations",
    async () => {
      await page.locator(".file-options-button").click();
      await page
        .locator(".studio-file-options .attached-file>button:first-child")
        .filter({ hasText: "manual-fixture.pdf" })
        .click();
      await settle();
      assert.equal(await count(), 4);
      await page
        .getByRole("button", { name: "Expand canvas", exact: true })
        .click();
      await page.waitForSelector("dialog .studio-canvas");
      assert.match(
        await page.locator("dialog .editor-save-state").textContent(),
        /^4 /,
      );
      await page.locator("dialog .dialog-close").click();
      assert.equal(await count(), 4);
    },
  );
  await run("original download stays byte-for-byte unchanged", async () => {
    await page.locator(".file-options-button").click();
    const result = await download(".studio-file-options a[download]");
    assert.ok(result.bytes.equals(original));
    await page.locator(".file-options-button").click();
  });
  await run("unsaved file removal requires confirmation", async () => {
    await page.getByRole("button", { name: "Undo", exact: true }).click();
    assert.equal(await count(), 4);
    assert.match(
      await page.locator(".editor-save-state").textContent(),
      /Draft/,
    );
    await page.locator(".file-options-button").click();
    page.once("dialog", (d) => d.dismiss());
    await page
      .getByRole("button", {
        name: "Remove file: manual-fixture.pdf",
        exact: true,
      })
      .click();
    assert.ok(
      await page
        .locator(".studio-filename")
        .textContent()
        .then((x) => x.includes("manual-fixture.pdf")),
    );
    page.once("dialog", (d) => d.accept());
    await page
      .getByRole("button", {
        name: "Remove file: manual-fixture.pdf",
        exact: true,
      })
      .click();
    await settle();
    assert.equal(await count(), 0);
  });
  await run(
    "rotated cropped pages keep exported annotations aligned",
    async () => {
      const doc = await PDFDocument.create();
      const p = doc.addPage([700, 500]);
      p.setCropBox(40, 30, 600, 400);
      p.setRotation(degrees(90));
      const bytes = Buffer.from(await doc.save());
      await page.locator("input[type=file]").setInputFiles({
        name: "rotated.pdf",
        mimeType: "application/pdf",
        buffer: bytes,
      });
      await page.waitForFunction(() =>
        document
          .querySelector(".studio-filename")
          ?.textContent.includes("rotated.pdf"),
      );
      await page.waitForFunction(
        () => document.querySelector(".pdf-page canvas")?.width > 0,
      );
      await tool("highlight");
      await page.locator("input[type=color]").fill("#ff0000");
      await stroke([
        [0.2, 0.4],
        [0.6, 0.5],
      ]);
      const out = await download(".live-canvas-pane .edited-download");
      await page.locator("input[type=file]").setInputFiles({
        name: "rotated-result.pdf",
        mimeType: "application/pdf",
        buffer: out.bytes,
      });
      await page.waitForFunction(() =>
        document
          .querySelector(".studio-filename")
          ?.textContent.includes("rotated-result.pdf"),
      );
      await page.waitForFunction(
        () => document.querySelector(".pdf-page canvas")?.width > 0,
      );
      await page.waitForTimeout(400);
      const color = await pixel(0.4, 0.45);
      assert.ok(
        color[0] > 240 && color[1] < 225 && color[2] < 225,
        `rotated export ${color}`,
      );
    },
  );
  await run(
    "corrupt PDFs show an error with the original still downloadable",
    async () => {
      await page.locator("input[type=file]").setInputFiles({
        name: "corrupt.pdf",
        mimeType: "application/pdf",
        buffer: Buffer.from("%PDF-1.7\ninvalid\n%%EOF"),
      });
      await page.waitForSelector(".pdf-load-state[role=alert]");
      await page.locator(".file-options-button").click();
      assert.ok(
        await page.locator(".studio-file-options a[download]").isVisible(),
      );
      await page.locator(".file-options-button").click();
    },
  );
  await run(
    "mobile and translated entry/workspaces have no horizontal overflow",
    async () => {
      for (const locale of ["en", "ar", "fr"]) {
        const mobile = await browser.newPage({
          viewport: { width: 390, height: 844 },
          reducedMotion: "reduce",
        });
        try {
          mobile.on("pageerror", (e) => errors.push(String(e)));
          await mobile.goto(url);
          await mobile.evaluate(
            (locale) => localStorage.setItem("pdflexi:locale", locale),
            locale,
          );
          await mobile.reload();
          await mobile.waitForSelector(".start-card");
          assert.ok(
            await mobile.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          );
          await mobile.screenshot({
            path: `artifacts/qa/new-entry-mobile-${locale}.png`,
            fullPage: true,
          });
          await mobile.locator("input[type=file]").setInputFiles(fixturePath);
          await mobile.locator("#lexi-prompt").fill("Review");
          await mobile.locator(".start-submit").click();
          await mobile.waitForSelector(".annotation-layer");
          await mobile.locator(".studio-canvas").scrollIntoViewIfNeeded();
          await mobile.waitForTimeout(500);
          assert.ok(
            await mobile.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          );
          await mobile.screenshot({
            path: `artifacts/qa/new-workspace-mobile-${locale}.png`,
          });
          await mobile.locator('[data-tool="text"]').click();
          await mobile.setViewportSize({ width: 320, height: 740 });
          await mobile.waitForTimeout(250);
          assert.ok(
            await mobile.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          );
        } finally {
          await mobile.close();
        }
      }
    },
  );
  await run(
    "files stay local and no browser runtime errors occurred",
    async () => {
      assert.equal(uploads, 0);
      assert.deepEqual(errors, []);
    },
  );
} finally {
  await writeFile(
    "artifacts/qa/manual-results.json",
    JSON.stringify({ results, errors, uploads }, null, 2),
  );
  await browser.close();
}
if (failed.length) process.exit(1);
