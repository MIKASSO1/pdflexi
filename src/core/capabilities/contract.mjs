// The order contract shared by both Lexi agents, the orchestrator and the engines.
// Nothing here touches a document: this module only describes, validates and dispatches.

export const CONTRACT_VERSION = 1;

const BINDINGS = {
  merge: { engine: "pdf", op: "merge", output: "pdf", requiresAi: false, params: { files: { type: "files", min: 2, max: 10, required: true } } },
  split: { engine: "pdf", op: "split", output: "files", requiresAi: false, params: { mode: { type: "enum", values: ["ranges", "each"], required: true }, pages: { type: "pages" } } },
  compress: { engine: "pdf", op: "compress", output: "pdf", requiresAi: false, params: { level: { type: "enum", values: ["low", "medium", "high"] } } },
  "pdf-to-word": { engine: "convert", op: "pdfToWord", output: "files", requiresAi: false, params: {} },
  "word-to-pdf": { engine: "convert", op: "wordToPdf", output: "pdf", requiresAi: false, params: {} },
  "pdf-to-excel": { engine: "convert", op: "pdfToExcel", output: "files", requiresAi: false, params: {} },
  "excel-to-pdf": { engine: "convert", op: "excelToPdf", output: "pdf", requiresAi: false, params: {} },
  "pdf-to-jpg": { engine: "pdf", op: "pdfToImages", output: "files", requiresAi: false, params: { pages: { type: "pages" } } },
  "jpg-to-pdf": { engine: "convert", op: "imagesToPdf", output: "pdf", requiresAi: false, params: { files: { type: "files", min: 1, max: 10, required: true } } },
  "delete-pages": { engine: "pdf", op: "deletePages", output: "pdf", requiresAi: false, params: { pages: { type: "pages", required: true } } },
  rotate: { engine: "pdf", op: "rotate", output: "pdf", requiresAi: false, params: { pages: { type: "pages", required: true }, angle: { type: "enum", values: [90, 180, 270], required: true } } },
  reorder: { engine: "pdf", op: "reorder", output: "pdf", requiresAi: false, params: { order: { type: "order", required: true } } },
  watermark: { engine: "pdf", op: "watermark", output: "pdf", requiresAi: false, params: { text: { type: "text", min: 1, max: 120, required: true }, opacity: { type: "number", min: 0.05, max: 1 }, position: { type: "enum", values: ["center", "top", "bottom", "diagonal"] } } },
  "page-numbers": { engine: "pdf", op: "pageNumbers", output: "pdf", requiresAi: false, params: { start: { type: "integer", min: 1, max: 9999 }, position: { type: "enum", values: ["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"] } } },
  protect: { engine: "pdf", op: "protect", output: "pdf", requiresAi: false, params: { password: { type: "secret", required: true } } },
  unlock: { engine: "pdf", op: "unlock", output: "pdf", requiresAi: false, params: { password: { type: "secret", required: true } } },
  sign: { engine: "pdf", op: "sign", output: "pdf", requiresAi: false, params: { signature: { type: "text", min: 1, max: 64, required: true }, page: { type: "integer", min: 1 }, x: { type: "number", min: 0, max: 1 }, y: { type: "number", min: 0, max: 1 } } },
  "edit-text": { engine: "pdf", op: "editText", output: "pdf", requiresAi: true, params: { instructions: { type: "text", min: 3, max: 500, required: true } } },
  repair: { engine: "pdf", op: "repair", output: "pdf", requiresAi: false, params: {} },
  ocr: { engine: "ocr", op: "extractText", output: "text", requiresAi: false, params: { pages: { type: "pages" }, language: { type: "language" } } },
  "chat-pdf": { engine: "ai", op: "chat", output: "text", requiresAi: true, params: { question: { type: "text", min: 2, max: 500, required: true } } },
  "summarize-contract": { engine: "ai", op: "summarize", output: "text", requiresAi: true, params: {} },
  "contract-risks": { engine: "ai", op: "contractRisks", output: "json", requiresAi: true, params: {} },
  "forgery-signals": { engine: "ai", op: "forgerySignals", output: "json", requiresAi: true, params: {} },
  "compare-contracts": { engine: "ai", op: "compareContracts", output: "json", requiresAi: true, params: { files: { type: "files", min: 2, max: 5, required: true } } },
  "invoice-excel": { engine: "ai", op: "invoicesToRows", output: "json", requiresAi: true, params: {} },
  "fill-form": { engine: "ai", op: "fillForm", output: "json", requiresAi: true, params: { fields: { type: "record", required: true } } },
  "translate-layout": { engine: "ai", op: "translateLayout", output: "pdf", requiresAi: true, params: { targetLanguage: { type: "language", required: true } } },
  "tailor-cv": { engine: "ai", op: "tailorCv", output: "text", requiresAi: true, params: { role: { type: "text", min: 3, max: 200, required: true } } },
  "batch-stamp": { engine: "pdf", op: "batchStamp", output: "files", requiresAi: false, params: { files: { type: "files", min: 1, max: 100, required: true }, text: { type: "text", min: 1, max: 120, required: true } } },
};

const issue = (code, message, extra) => ({ code, message, ...extra });

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPageSelection(value) {
  if (Array.isArray(value)) {
    return value.length > 0 && value.every((n) => Number.isInteger(n) && n > 0);
  }
  if (isPlainObject(value)) {
    const fromOk = Number.isInteger(value.from) && value.from > 0;
    const toOk = value.to === undefined || (Number.isInteger(value.to) && value.to > 0);
    return fromOk && toOk && (value.to === undefined || value.to >= value.from);
  }
  return false;
}

function checkParam(rule, value, name, prefix, issues) {
  if (value === undefined || value === null) {
    if (rule.required) issues.push(issue("missing_param", `${prefix}${name} is required`, { param: name }));
    return;
  }
  const fail = (expected) => issues.push(issue("invalid_param", `${prefix}${name} must be ${expected}`, { param: name }));
  switch (rule.type) {
    case "files":
      if (!Array.isArray(value) || value.length < rule.min || value.length > (rule.max ?? Infinity)) fail(`${rule.min}-${rule.max ?? "∞"} files`);
      break;
    case "pages":
      if (!isPageSelection(value)) fail("a page list or a {from,to} range");
      break;
    case "order":
      if (!Array.isArray(value) || value.length === 0 || !value.every((n) => Number.isInteger(n) && n > 0)) fail("a non-empty list of page numbers");
      break;
    case "integer":
      if (!Number.isInteger(value) || value < (rule.min ?? -Infinity) || value > (rule.max ?? Infinity)) fail(`an integer within ${rule.min}-${rule.max}`);
      break;
    case "number":
      if (typeof value !== "number" || !Number.isFinite(value) || value < (rule.min ?? -Infinity) || value > (rule.max ?? Infinity)) fail(`a number within ${rule.min}-${rule.max}`);
      break;
    case "text":
      if (typeof value !== "string" || value.trim().length < (rule.min ?? 0) || value.length > (rule.max ?? Infinity)) fail(`text of ${rule.min ?? 0}-${rule.max ?? "∞"} characters`);
      break;
    case "enum":
      if (!rule.values.includes(value)) fail(`one of: ${rule.values.join(", ")}`);
      break;
    case "record":
      if (!isPlainObject(value)) fail("an object of field values");
      break;
    case "language":
      if (typeof value !== "string" || !/^[a-z]{2}(-[A-Za-z]{2,4})?$/.test(value)) fail("a language tag such as ar or en-GB");
      break;
    case "secret":
      if (typeof value !== "string" || value.trim().length === 0) fail("a non-empty secret");
      break;
    default:
      issues.push(issue("unknown_param_rule", `${prefix}${name} has an unsupported rule type`, { param: name }));
  }
}

export function buildMenu(registry) {
  if (!Array.isArray(registry)) throw new Error("registry must be an array");
  const menu = new Map();
  const issues = [];
  for (const entry of registry) {
    if (!entry || typeof entry.id !== "string") {
      issues.push(issue("invalid_entry", "registry entry without an id"));
      continue;
    }
    if (menu.has(entry.id)) {
      issues.push(issue("duplicate_capability", `duplicate capability ${entry.id}`, { capabilityId: entry.id }));
      continue;
    }
    const binding = BINDINGS[entry.id];
    menu.set(entry.id, {
      id: entry.id,
      tier: entry.tier === "pro" ? "pro" : "free",
      names: entry.name ?? {},
      descriptions: entry.description ?? {},
      prompts: entry.prompt ?? {},
      engine: binding?.engine ?? null,
      op: binding?.op ?? null,
      output: binding?.output ?? null,
      requiresAi: binding?.requiresAi ?? false,
      params: binding?.params ?? null,
    });
    if (!binding) issues.push(issue("unbound_capability", `${entry.id} has no engine binding`, { capabilityId: entry.id }));
  }
  for (const id of Object.keys(BINDINGS)) {
    if (!menu.has(id)) issues.push(issue("orphan_binding", `${id} is bound but not in the registry`, { capabilityId: id }));
  }
  return { menu, issues };
}

export function validateOrder(order, menu) {
  const issues = [];
  if (!isPlainObject(order)) return [issue("invalid_order", "order must be an object")];
  const capability = menu.get(order.capabilityId);
  if (!capability) {
    return [issue("unknown_capability", `unknown capability: ${String(order.capabilityId)}`, { capabilityId: order.capabilityId })];
  }
  if (typeof order.provenance !== "string" || order.provenance.trim().length < 3) {
    issues.push(issue("missing_provenance", "an order must quote the user request that asked for it", { capabilityId: capability.id }));
  }
  if (!capability.params) {
    issues.push(issue("unbound_capability", `${capability.id} is not executable yet`, { capabilityId: capability.id }));
    return issues;
  }
  const params = order.params ?? {};
  if (!isPlainObject(params)) return [...issues, issue("invalid_params", "params must be an object")];
  for (const key of Object.keys(params)) {
    if (!(key in capability.params)) issues.push(issue("unknown_param", `${capability.id} does not take ${key}`, { param: key }));
  }
  for (const [name, rule] of Object.entries(capability.params)) {
    checkParam(rule, params[name], name, `${capability.id}.`, issues);
  }
  return issues;
}

export function validateTicket(ticket, menu) {
  const issues = [];
  if (!isPlainObject(ticket)) return [issue("invalid_ticket", "ticket must be an object")];
  if (ticket.schemaVersion !== CONTRACT_VERSION) issues.push(issue("unsupported_version", `ticket.schemaVersion must be ${CONTRACT_VERSION}`));
  if (typeof ticket.goal !== "string" || ticket.goal.trim().length < 3) issues.push(issue("missing_goal", "ticket must state the user's goal"));
  const steps = ticket.steps;
  if (!Array.isArray(steps) || steps.length === 0) return [...issues, issue("empty_ticket", "ticket must contain at least one step")];
  const seen = new Set();
  steps.forEach((step, index) => {
    if (!isPlainObject(step) || typeof step.id !== "string" || step.id.length === 0) {
      issues.push(issue("invalid_step", `step ${index + 1} has no id`));
      return;
    }
    if (seen.has(step.id)) issues.push(issue("duplicate_step", `duplicate step id ${step.id}`));
    for (const dep of step.dependsOn ?? []) {
      if (dep === step.id) issues.push(issue("bad_dependency", `step ${step.id} depends on itself`));
      else if (!seen.has(dep)) issues.push(issue("out_of_order_dependency", `step ${step.id} depends on ${dep}, which has not run yet`));
    }
    seen.add(step.id);
    for (const problem of validateOrder(step, menu)) issues.push({ ...problem, stepId: step.id });
  });
  return issues;
}

export function redactOrder(order) {
  const capability = typeof order?.capabilityId === "string" ? order.capabilityId : "";
  const ruleSet = BINDINGS[capability]?.params ?? {};
  const params = {};
  for (const [key, value] of Object.entries(order?.params ?? {})) {
    params[key] = ruleSet[key]?.type === "secret" ? "••••••" : value;
  }
  return { ...order, params };
}

export async function runTicket(ticket, { menu, resolveEngine, signal, onStep } = {}) {
  const issues = validateTicket(ticket, menu);
  if (issues.length > 0) return { status: "invalid", ok: false, results: [], issues };
  const results = [];
  for (const [index, step] of ticket.steps.entries()) {
    if (signal?.aborted) return { status: "aborted", ok: false, results, issues: [], failedStep: step.id };
    onStep?.({ step, index, state: "running" });
    const capability = menu.get(step.capabilityId);
    const engine = resolveEngine?.(capability);
    if (!engine) {
      onStep?.({ step, index, state: "unavailable" });
      return { status: "unavailable", ok: false, results, issues: [], failedStep: step.id };
    }
    const result = await engine.execute({ capability, order: step, signal });
    if (!result || result.ok !== true) {
      onStep?.({ step, index, state: "failed" });
      return { status: "failed", ok: false, results: [...results, { stepId: step.id, result }], issues: [], failedStep: step.id };
    }
    if (result.verified !== true) {
      onStep?.({ step, index, state: "unverified" });
      return { status: "unverified", ok: false, results: [...results, { stepId: step.id, result }], issues: [], failedStep: step.id };
    }
    results.push({ stepId: step.id, result });
    onStep?.({ step, index, state: "done" });
  }
  return { status: "ok", ok: true, results, issues: [] };
}
