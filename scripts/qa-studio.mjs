import { access, mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import assert from "node:assert/strict";
// Generate a portable multi-page PDF fixture when running in a fresh checkout.
await mkdir("artifacts/qa", { recursive: true });
try {
  await access("artifacts/qa/studio-12-pages.pdf");
} catch {
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Count 12 /Kids [${Array.from({ length: 12 }, (_, i) => `${4 + i * 2} 0 R`).join(" ")}] >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  for (let i = 0; i < 12; i++) {
    const content = `BT /F1 24 Tf 48 740 Td (Service agreement) Tj /F1 12 Tf 0 -38 Td (PDFlexi - page ${i + 1} of 12) Tj 0 -70 Td (Your original stays unchanged in this local preview.) Tj ET`;
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${5 + i * 2} 0 R >>`,
      `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`,
    );
  }
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (let i = 0; i < objects.length; i++) {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const offset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets
    .slice(1)
    .map((n) => String(n).padStart(10, "0") + " 00000 n ")
    .join(
      "\n",
    )}\ntrailer\n<< /Root 1 0 R /Size ${objects.length + 1} >>\nstartxref\n${offset}\n%%EOF`;
  await writeFile("artifacts/qa/studio-12-pages.pdf", pdf);
}
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH,
  args: ["--no-sandbox"],
});
const errors = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1336, height: 669 },
    reducedMotion: "reduce",
  });
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(process.env.TEST_URL || "http://localhost:5173");
  await page
    .locator("input[type=file]")
    .setInputFiles("artifacts/qa/studio-12-pages.pdf");
  await page
    .locator("#lexi-prompt")
    .fill("Summarize this agreement in three clear points.");
  await page.locator(".send-button").click();
  await page.waitForSelector(".pdf-page canvas");
  await page.waitForFunction(
    () => document.querySelector(".pdf-page canvas")?.width > 0,
  );
  await page
    .locator(".toast button")
    .click()
    .catch(() => {});
  await page.waitForTimeout(6500);
  assert.equal(await page.locator(".processing-pending").count(), 0);
  assert.equal(await page.locator(".live-toolbar").count(), 0);
  assert.equal(await page.locator(".live-canvas-pane iframe").count(), 0);
  assert.match(
    await page.locator(".studio-page-status").textContent(),
    /Page 1 of 12/,
  );
  const layout = await page.evaluate(() => {
    const box = (s) => {
      const b = document.querySelector(s).getBoundingClientRect();
      return { top: b.top, bottom: b.bottom, height: b.height };
    };
    return {
      chat: box(".chat-card"),
      canvas: box(".studio-canvas"),
      viewer: box(".pdf-viewer"),
      footer: box(".studio-footer"),
      composer: box(".chat-composer"),
      overflow: document.documentElement.scrollWidth > innerWidth,
    };
  });
  assert.equal(layout.overflow, false);
  assert.ok(layout.viewer.height > 350);
  assert.ok(layout.footer.bottom <= 669);
  assert.ok(layout.composer.bottom <= 669);
  assert.equal(layout.chat.top, layout.canvas.top);
  assert.equal(layout.chat.bottom, layout.canvas.bottom);
  await page.screenshot({ path: "artifacts/qa/studio-desktop.png" });
  await page.getByRole("button", { name: "Next page", exact: true }).click();
  await page.getByRole("button", { name: "Next page", exact: true }).click();
  assert.match(
    await page.locator(".studio-page-status").textContent(),
    /Page 3 of 12/,
  );
  await page.waitForTimeout(800);
  await page.screenshot({ path: "artifacts/qa/studio-page3.png" });
  await page
    .locator(".pdf-viewer")
    .evaluate((el) => (el.scrollTop = el.scrollHeight));
  await page.waitForTimeout(1000);
  assert.match(
    await page.locator(".studio-page-status").textContent(),
    /Page 12 of 12/,
  );
  await page.screenshot({ path: "artifacts/qa/studio-page12.png" });
  await page
    .getByRole("combobox", { name: "Zoom", exact: true })
    .selectOption("1.5");
  assert.equal(
    await page.evaluate(() => localStorage.getItem("pdflexi:view-zoom")),
    "1.5",
  );
  assert.equal(
    await page.locator('.studio-toolbar [aria-disabled="true"]').count(),
    2,
  );
  await page
    .getByRole("combobox", { name: "Zoom", exact: true })
    .selectOption("1");
  for (const [width, height] of [
    [1024, 700],
    [800, 700],
    [390, 844],
    [320, 740],
  ]) {
    await page.setViewportSize({ width, height });
    await page.waitForTimeout(500);
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow ${width}`,
    );
    if (width >= 768) {
      const b = await page.locator(".studio-footer").boundingBox();
      assert.ok(b.y + b.height <= height);
    } else {
      await page.locator(".studio-canvas").scrollIntoViewIfNeeded();
      await page.screenshot({
        path: `artifacts/qa/studio-mobile-${width}.png`,
      });
    }
  }
  for (const locale of ["ar", "fr"]) {
    await page.setViewportSize({ width: 1336, height: 669 });
    await page.evaluate(
      (locale) => localStorage.setItem("pdflexi:locale", locale),
      locale,
    );
    await page.reload();
    await page
      .locator("input[type=file]")
      .setInputFiles("artifacts/qa/studio-12-pages.pdf");
    await page.locator("#lexi-prompt").fill("Review");
    await page.locator(".send-button").click();
    await page.waitForSelector(".pdf-page canvas");
    await page.waitForTimeout(1300);
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await page.screenshot({ path: `artifacts/qa/studio-${locale}.png` });
  }
  assert.deepEqual(errors, []);
  console.log(
    "PASS studio: full-height panels, 12 actual pages, page navigation, scroll to last page, zoom persistence, honest controls, 5 widths, Arabic/French, no runtime errors",
  );
} finally {
  await browser.close();
}
