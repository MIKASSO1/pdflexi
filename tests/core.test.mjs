import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  buildMenu,
  validateOrder,
  validateTicket,
  runTicket,
  redactOrder,
  CONTRACT_VERSION,
} from "../src/core/capabilities/contract.mjs";

const registry = JSON.parse(readFileSync(new URL("../src/data/capabilities.json", import.meta.url)));
const { menu, issues } = buildMenu(registry);

const order = (capabilityId, params, provenance = "merge my three PDFs into one") => ({
  capabilityId,
  params,
  provenance,
});

test("the menu binds every registry capability to exactly one engine operation", () => {
  assert.equal(menu.size, 30);
  assert.deepEqual(issues, []);
  for (const capability of menu.values()) {
    assert.ok(capability.engine, `${capability.id} needs an engine`);
    assert.ok(capability.op, `${capability.id} needs an operation`);
    assert.ok(capability.params, `${capability.id} needs a parameter contract`);
  }
  assert.equal([...menu.values()].filter((c) => c.tier === "free").length, 20);
  assert.equal([...menu.values()].filter((c) => c.tier === "pro").length, 10);
});

test("an unknown capability is refused instead of guessed", () => {
  const found = validateOrder(order("summarize-everything", {}), menu);
  assert.equal(found[0].code, "unknown_capability");
});

test("an order must quote the request that produced it", () => {
  const found = validateOrder(order("merge", { files: ["a", "b"] }, ""), menu);
  assert.ok(found.some((i) => i.code === "missing_provenance"));
});

test("parameters are checked against the capability contract", () => {
  assert.deepEqual(validateOrder(order("merge", { files: ["a", "b"] }), menu), []);
  assert.ok(validateOrder(order("merge", { files: ["a"] }), menu).some((i) => i.code === "invalid_param"));
  assert.ok(validateOrder(order("rotate", { pages: [1], angle: 45 }), menu).some((i) => i.code === "invalid_param"));
  assert.deepEqual(validateOrder(order("rotate", { pages: [1], angle: 90 }), menu), []);
  assert.ok(validateOrder(order("delete-pages", {}), menu).some((i) => i.code === "missing_param"));
  assert.ok(validateOrder(order("compress", { level: "medium", files: ["a"] }), menu).some((i) => i.code === "unknown_param"));
  assert.ok(validateOrder(order("rotate", { pages: { from: 5, to: 2 }, angle: 90 }), menu).some((i) => i.code === "invalid_param"));
  assert.deepEqual(validateOrder(order("rotate", { pages: { from: 2, to: 5 }, angle: 90 }), menu), []);
});

test("a ticket refuses steps that depend on steps which have not run", () => {
  const ticket = {
    schemaVersion: CONTRACT_VERSION,
    goal: "merge then delete the last page of the second file",
    steps: [
      { id: "s2", capabilityId: "delete-pages", params: { pages: [3] }, provenance: "delete the last page", dependsOn: ["s1"] },
      { id: "s1", capabilityId: "merge", params: { files: ["a", "b"] }, provenance: "merge the files" },
    ],
  };
  const found = validateTicket(ticket, menu);
  assert.ok(found.some((i) => i.code === "out_of_order_dependency"));
});

test("a ticket without steps, goal or version is refused", () => {
  assert.ok(validateTicket({ schemaVersion: CONTRACT_VERSION, goal: "done", steps: [] }, menu).some((i) => i.code === "empty_ticket"));
  assert.ok(validateTicket({ schemaVersion: CONTRACT_VERSION, goal: "", steps: [order("merge", { files: ["a", "b"] })] }, menu).some((i) => i.code === "missing_goal"));
  const legacy = { goal: "merge", steps: [{ ...order("merge", { files: ["a", "b"] }), id: "s1" }] };
  assert.ok(validateTicket(legacy, menu).some((i) => i.code === "unsupported_version"));
});

test("the orchestrator runs verified steps in order and stops at the first failure", async () => {
  const calls = [];
  const engine = (behaviour) => ({
    id: "fake",
    supports: () => true,
    execute: async ({ order: step }) => {
      calls.push(step.capabilityId);
      return behaviour(step);
    },
  });
  const ticket = {
    schemaVersion: CONTRACT_VERSION,
    goal: "merge then number the pages",
    steps: [
      { id: "s1", capabilityId: "merge", params: { files: ["a", "b"] }, provenance: "merge the files" },
      { id: "s2", capabilityId: "page-numbers", params: { start: 1 }, provenance: "number the pages", dependsOn: ["s1"] },
    ],
  };

  const done = await runTicket(ticket, { menu, resolveEngine: () => engine(() => ({ ok: true, verified: true, outputs: ["out.pdf"] })) });
  assert.equal(done.status, "ok");
  assert.deepEqual(calls, ["merge", "page-numbers"]);

  calls.length = 0;
  const failing = await runTicket(ticket, {
    menu,
    resolveEngine: () => engine((step) => (step.id === "s1" ? { ok: false, verified: false, outputs: [], error: { code: "broken", message: "no" } } : { ok: true, verified: true, outputs: [] })),
  });
  assert.equal(failing.status, "failed");
  assert.equal(failing.failedStep, "s1");
  assert.deepEqual(calls, ["merge"]);

  calls.length = 0;
  const unverified = await runTicket(ticket, { menu, resolveEngine: () => engine(() => ({ ok: true, verified: false, outputs: [] })) });
  assert.equal(unverified.status, "unverified");
  assert.deepEqual(calls, ["merge"]);
});

test("a ticket stops when the required engine is not installed", async () => {
  const ticket = {
    schemaVersion: CONTRACT_VERSION,
    goal: "rotate page one",
    steps: [{ id: "s1", capabilityId: "rotate", params: { pages: [1], angle: 90 }, provenance: "rotate page one" }],
  };
  const outcome = await runTicket(ticket, { menu, resolveEngine: () => undefined });
  assert.equal(outcome.status, "unavailable");
});

test("invalid tickets never reach an engine", async () => {
  let called = false;
  const outcome = await runTicket(
    { schemaVersion: CONTRACT_VERSION, goal: "bad", steps: [{ id: "s1", capabilityId: "merge", params: { files: [] }, provenance: "" }] },
    { menu, resolveEngine: () => ({ execute: async () => { called = true; return { ok: true, verified: true, outputs: [] }; } }) },
  );
  assert.equal(outcome.status, "invalid");
  assert.equal(called, false);
});

test("secrets are redacted before an order is shown", () => {
  const shown = redactOrder(order("protect", { password: "my-secret" }));
  assert.equal(shown.params.password, "••••••");
  assert.equal(order("protect", { password: "my-secret" }).params.password, "my-secret");
});
