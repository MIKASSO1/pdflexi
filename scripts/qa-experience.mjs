import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH,
  args: ["--no-sandbox"],
});
const url = process.env.TEST_URL || "http://localhost:5173";
try {
  await mkdir("artifacts/qa", { recursive: true });
  const page = await browser.newPage({
    viewport: { width: 1336, height: 646 },
    reducedMotion: "reduce",
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  for (const lang of ["en", "ar", "fr"]) {
    await page.goto(url);
    await page.evaluate(
      (lang) => localStorage.setItem("pdflexi:locale", lang),
      lang,
    );
    await page.reload();
    await page.waitForSelector(".chat-card");
    for (const [width, height] of [
      [1336, 646],
      [1500, 1050],
      [1024, 650],
      [800, 650],
      [768, 650],
    ]) {
      await page.setViewportSize({ width, height });
      const b = await page.evaluate(() => {
        const box = (s) => {
          const r = document.querySelector(s).getBoundingClientRect();
          return { top: r.top, left: r.left, right: r.right, bottom: r.bottom };
        };
        return {
          chat: box(".chat-card"),
          upload: box(".upload-first"),
          composer: box(".chat-composer"),
          overflow: document.documentElement.scrollWidth > innerWidth,
          headerOverflow:
            document.querySelector(".header-inner").scrollWidth > innerWidth,
        };
      });
      assert.ok(
        b.chat.right < b.upload.left,
        `${lang} ${width}: not side by side`,
      );
      assert.ok(Math.abs(b.chat.top - b.upload.top) < 2);
      assert.ok(
        b.composer.bottom <= height - 8,
        `${lang} ${width}: composer below fold`,
      );
      assert.equal(b.overflow, false, `${lang} ${width}: overflow`);
      assert.equal(
        b.headerOverflow,
        false,
        `${lang} ${width}: header overflow`,
      );
      if ([1336, 800].includes(width))
        await page.screenshot({
          path: `artifacts/qa/side-entry-${lang}-${width}.png`,
        });
    }
    for (const [width, height] of [
      [390, 844],
      [700, 650],
      [600, 650],
      [320, 740],
    ]) {
      await page.setViewportSize({ width, height });
      await page.evaluate(() => scrollTo(0, 0));
      assert.equal(await page.locator(".chat-card").isVisible(), true);
      assert.equal(await page.locator(".upload-first").isVisible(), false);
      assert.equal(await page.locator(".mobile-menu-button").isVisible(), true);
      const composer = await page.locator(".chat-composer").boundingBox();
      assert.ok(
        composer.y + composer.height <= height - 8,
        `${lang} ${width}: mobile composer below fold`,
      );
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      await page.screenshot({
        path: `artifacts/qa/side-mobile-${lang}-${width}-chat.png`,
      });
      await page.locator(".entry-pane-switch button").last().click();
      assert.equal(await page.locator(".upload-first").isVisible(), true);
      await page.screenshot({
        path: `artifacts/qa/side-mobile-${lang}-${width}-upload.png`,
      });
      await page.locator(".entry-pane-switch button").first().click();
    }
    console.log(
      `PASS ${lang}: 5 desktop widths; mobile 700/600/390/320 chat and uploader; composer above fold`,
    );
  }
  await page.setViewportSize({ width: 1336, height: 646 });
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
  await page.waitForSelector(".upload-first .embedded-canvas .attached-file");
  assert.equal(await page.locator(".is-split").count(), 0);
  await page.locator("#lexi-prompt").fill("Résume ce document");
  await page.locator(".send-button").click();
  await page.waitForSelector(".is-split");
  const composer = await page.locator(".chat-composer").boundingBox();
  assert.ok(composer.y + composer.height <= 646 - 8);
  await page.screenshot({ path: "artifacts/qa/side-live-original.png" });
  await page.locator(".remove-file").click();
  await page.locator(".live-demo-cta").click();
  await page.waitForSelector(".example-risk");
  await page.screenshot({ path: "artifacts/qa/side-live-demo.png" });
  await page.locator(".demo-back").click();
  assert.equal(await page.locator(".message.user").count(), 1);
  assert.deepEqual(errors, []);
  console.log(
    "PASS drag/drop, live transition, scripted sample isolation and preserved conversation",
  );
} finally {
  await browser.close();
}
