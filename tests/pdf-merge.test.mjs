import test from "node:test";
import assert from "node:assert/strict";
import { PDFDocument } from "pdf-lib";
import registryJson from "../src/data/capabilities.json" with { type: "json" };
import { CONTRACT_VERSION, buildMenu, runTicket } from "../src/core/capabilities/contract.mjs";
import { listEngines, registerEngine, resolveEngine } from "../src/core/engines/registry.ts";
import { pdfEngine } from "../src/core/engines/pdfEngine.ts";

const { menu } = buildMenu(registryJson);

if (!listEngines().includes(pdfEngine.id)) registerEngine(pdfEngine);

const makePdf = async (pages) => {
  const doc = await PDFDocument.create();
  for (let index = 0; index < pages; index += 1) {
    doc.addPage([595, 842]);
  }
  return new Uint8Array(await doc.save());
};

const mergeTicket = (files) => ({
  schemaVersion: CONTRACT_VERSION,
  goal: "Merge PDF from the tools list",
  steps: [{ id: "s1", capabilityId: "merge", params: { files }, provenance: "Merge PDF button test" }],
});

test("the pdf engine is registered for the merge capability", () => {
  assert.deepEqual(listEngines(), ["pdf"]);
  const capability = menu.get("merge");
  assert.equal(capability.engine, "pdf");
  assert.equal(resolveEngine(capability)?.id, "pdf");
});

test("merge joins two PDFs through the orchestrator and verifies the page count", async () => {
  const files = [
    { name: "a.pdf", bytes: await makePdf(1) },
    { name: "b.pdf", bytes: await makePdf(2) },
  ];
  const run = await runTicket(mergeTicket(files), { menu, resolveEngine });
  assert.equal(run.status, "ok");
  assert.equal(run.ok, true);
  const output = run.results[0].result.outputs[0];
  assert.ok(output instanceof Uint8Array);
  const merged = await PDFDocument.load(output);
  assert.equal(merged.getPageCount(), 3);
});

test("merge rejects a single file before reaching the engine", async () => {
  const run = await runTicket(mergeTicket([{ name: "a.pdf", bytes: await makePdf(2) }]), { menu, resolveEngine });
  assert.equal(run.status, "invalid");
  assert.equal(run.ok, false);
});

test("the engine reports unreadable input instead of producing a broken file", async () => {
  const files = [
    { name: "a.pdf", bytes: await makePdf(1) },
    { name: "bad.pdf", bytes: new Uint8Array([1, 2, 3, 4]) },
  ];
  const run = await runTicket(mergeTicket(files), { menu, resolveEngine });
  assert.equal(run.status, "failed");
  assert.equal(run.results.at(-1).result.error.code, "unreadable_pdf");
});

test("pdf capabilities the engine does not implement resolve as unavailable", async () => {
  const split = menu.get("split");
  assert.equal(split.engine, "pdf");
  assert.equal(resolveEngine(split), undefined);
});
