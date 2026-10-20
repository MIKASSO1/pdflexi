import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  allowedExtensions,
  MAX_FILES,
  MAX_FILE_BYTES,
  validateMetadata,
  fileKey,
  formatBytes,
} from "../src/lib/files.mjs";
const registry = JSON.parse(
  await readFile(new URL("../src/data/capabilities.json", import.meta.url)),
);
test("exactly 30 unique capabilities: 20 free, 10 Pro", () => {
  assert.equal(registry.length, 30);
  assert.equal(new Set(registry.map((c) => c.id)).size, 30);
  assert.equal(registry.filter((c) => c.tier === "free").length, 20);
  assert.equal(registry.filter((c) => c.tier === "pro").length, 10);
});
test("every capability has English, Arabic, French names, prompts and descriptions", () => {
  for (const c of registry)
    for (const locale of ["en", "ar", "fr"])
      for (const key of ["name", "description", "prompt"])
        assert.ok(c[key][locale].trim(), `${c.id} ${key} ${locale}`);
});
test("OCR remains in the 20 free capabilities", () =>
  assert.equal(registry.find((c) => c.id === "ocr").tier, "free"));
test("metadata validation rejects dangerous extensions and empty files", () => {
  assert.equal(
    validateMetadata({ name: "payload.html", size: 100 }),
    "badFormat",
  );
  assert.equal(validateMetadata({ name: "zero.pdf", size: 0 }), "readError");
  assert.equal(allowedExtensions.has("svg"), false);
});
test("size and file count limits are explicit", () => {
  assert.equal(MAX_FILES, 10);
  assert.equal(MAX_FILE_BYTES, 20 * 1024 * 1024);
  assert.equal(
    validateMetadata({ name: "big.pdf", size: MAX_FILE_BYTES + 1 }),
    "tooLarge",
  );
  assert.equal(
    validateMetadata({ name: "ok.PDF", size: MAX_FILE_BYTES }),
    null,
  );
});
test("file duplicate key uses name, size, and lastModified", () => {
  const f = { name: "a.pdf", size: 123, lastModified: 42 };
  assert.equal(fileKey(f), fileKey({ ...f }));
  assert.notEqual(fileKey(f), fileKey({ ...f, name: "b.pdf" }));
});
test("readable file size formatting", () => {
  assert.equal(formatBytes(2048), "2 KB");
  assert.equal(formatBytes(1048576), "1.0 MB");
});
