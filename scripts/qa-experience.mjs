import { chromium } from "playwright";
import assert from "node:assert/strict";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH,
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage({
    viewport: { width: 1500, height: 1050 },
    reducedMotion: "reduce",
  });
  await page.goto(process.env.TEST_URL || "http://localhost:5173");
  await page.waitForSelector(".upload-first");
  await page.screenshot({ path: "artifacts/qa/final-entry.png" });
  for (const lang of ["en", "ar", "fr"]) {
    await page.evaluate(
      (lang) => localStorage.setItem("pdflexi:locale", lang),
      lang,
    );
    await page.reload();
    await page.waitForSelector(".upload-first");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: `artifacts/qa/final-${lang}-mobile.png`,
      fullPage: true,
    });
  }
  await page.evaluate(() => localStorage.setItem("pdflexi:locale", "ar"));
  await page.reload();
  await page.setViewportSize({ width: 1500, height: 1050 });
  const data = await page.evaluateHandle(() => {
    const dt = new DataTransfer();
    dt.items.add(
      new File(["original sample"], "notes.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }),
    );
    return dt;
  });
  await page
    .locator(".upload-first")
    .dispatchEvent("dragenter", { dataTransfer: data });
  await page.waitForSelector(".global-drop-overlay");
  await page.locator(".app").dispatchEvent("drop", { dataTransfer: data });
  await page.waitForSelector(".entry-file-chips");
  assert.equal(await page.locator(".is-split").count(), 0);
  await page.locator("#lexi-prompt").fill("لخص الوثيقة");
  await page.locator(".send-button").click();
  await page.waitForSelector(".is-split");
  const box = await page.evaluate(() => ({
    chat: document.querySelector(".conversation-pane").getBoundingClientRect()
      .left,
    canvas: document.querySelector(".live-canvas-pane").getBoundingClientRect()
      .left,
  }));
  assert.ok(box.chat < box.canvas);
  assert.equal(
    await page.locator(".conversation-pane").getAttribute("dir"),
    "rtl",
  );
  await page.screenshot({ path: "artifacts/qa/final-ar-live-original.png" });
  await page.locator(".remove-file").click();
  await page.locator(".live-demo-cta").click();
  await page.waitForSelector(".example-risk");
  await page.screenshot({ path: "artifacts/qa/final-ar-live-demo.png" });
  await page.locator(".demo-back").click();
  assert.equal(await page.locator(".message.user").count(), 1);
  console.log(
    "PASS actual drag/drop, RTL physical layout, reduced-motion demo and preserved conversation",
  );
} finally {
  await browser.close();
}
