/** Contracts shared by the UI, planner and isolated execution adapters. */
export type Parameters = Record<string, unknown>;
export type InputDocument = { id: string; name: string; blob: Blob };
export type Artifact = { name: string; mime: string; bytes: Uint8Array };
export type ToolDefinition = {
  id: string;
  status: "ready" | "planned";
  minInputs: number;
  maxInputs: number;
  parameters: (value: unknown) => Parameters;
};
export type PlanStep = {
  id: string;
  toolId: string;
  inputs: string[];
  parameters: Parameters;
};
export type ExecutionPlan = { version: 1; steps: PlanStep[] };
export type Progress = { step: string; completed: number; total: number };
export type ExecutionAdapter = (
  toolId: string,
  inputs: InputDocument[],
  parameters: Parameters,
  signal: AbortSignal,
) => Promise<Artifact[]>;
export const limits = Object.freeze({
  steps: 10,
  inputs: 10,
  inputBytes: 20 * 1024 * 1024,
  jobBytes: 100 * 1024 * 1024,
  outputs: 100,
  pages: 1000,
  timeoutMs: 120000,
});
export class ExecutionError extends Error {
  readonly code:
    | "invalid-plan"
    | "unsupported"
    | "invalid-parameters"
    | "limit"
    | "cancelled"
    | "timeout"
    | "processing";
  constructor(code: ExecutionError["code"], message: string) {
    super(message);
    this.name = "ExecutionError";
    this.code = code;
  }
}
export function record(value: unknown): Parameters {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new ExecutionError("invalid-parameters", "Expected an object.");
  return value as Parameters;
}
export function exactKeys(value: Parameters, keys: string[]) {
  if (Object.keys(value).some((key) => !keys.includes(key)))
    throw new ExecutionError("invalid-parameters", "Unexpected parameter.");
}
export function pageList(value: unknown): number[] {
  if (
    !Array.isArray(value) ||
    !value.length ||
    value.length > limits.pages ||
    value.some((n) => !Number.isInteger(n) || n < 1 || n > limits.pages) ||
    new Set(value).size !== value.length
  )
    throw new ExecutionError(
      "invalid-parameters",
      "Pages must be unique positive page numbers (1-based).",
    );
  return [...value] as number[];
}
export function validatePlan(
  raw: unknown,
  definitions: readonly ToolDefinition[],
  inputs: InputDocument[],
): ExecutionPlan {
  const plan = record(raw);
  exactKeys(plan, ["version", "steps"]);
  if (
    plan.version !== 1 ||
    !Array.isArray(plan.steps) ||
    !plan.steps.length ||
    plan.steps.length > limits.steps
  )
    throw new ExecutionError(
      "invalid-plan",
      "Invalid plan version or step count.",
    );
  if (
    !inputs.length ||
    inputs.length > limits.inputs ||
    new Set(inputs.map((i) => i.id)).size !== inputs.length ||
    inputs.some(
      (i) => !i.id || !i.blob.size || i.blob.size > limits.inputBytes,
    ) ||
    inputs.reduce((n, i) => n + i.blob.size, 0) > limits.jobBytes
  )
    throw new ExecutionError(
      "limit",
      "Input count or file size exceeds the local processing limits.",
    );
  const available = new Set(inputs.map((i) => i.id));
  const originals = new Set(available);
  const steps: PlanStep[] = [];
  for (const rawStep of plan.steps) {
    const s = record(rawStep);
    exactKeys(s, ["id", "toolId", "inputs", "parameters"]);
    if (
      typeof s.id !== "string" ||
      !/^[a-zA-Z0-9-]{1,80}$/.test(s.id) ||
      available.has(s.id) ||
      typeof s.toolId !== "string" ||
      !Array.isArray(s.inputs) ||
      !s.inputs.length ||
      new Set(s.inputs).size !== s.inputs.length ||
      s.inputs.some((id) => typeof id !== "string" || !available.has(id))
    )
      throw new ExecutionError(
        "invalid-plan",
        "Invalid step ID or input reference. Only earlier outputs are available.",
      );
    const tool = definitions.find((t) => t.id === s.toolId);
    if (!tool || tool.status !== "ready")
      throw new ExecutionError(
        "unsupported",
        "This tool has no verified local executor yet.",
      );
    if (
      s.inputs.every((id) => originals.has(id)) &&
      (s.inputs.length < tool.minInputs || s.inputs.length > tool.maxInputs)
    )
      throw new ExecutionError(
        "invalid-plan",
        "Invalid number of source files for this tool.",
      );
    steps.push({
      id: s.id,
      toolId: s.toolId,
      inputs: s.inputs as string[],
      parameters: tool.parameters(s.parameters),
    });
    available.add(s.id);
  }
  return { version: 1, steps };
}
export async function executePlan(
  raw: unknown,
  definitions: readonly ToolDefinition[],
  inputs: InputDocument[],
  adapter: ExecutionAdapter,
  signal: AbortSignal,
  onProgress: (p: Progress) => void = () => {},
) {
  const plan = validatePlan(raw, definitions, inputs);
  const values = new Map(inputs.map((input) => [input.id, [input]]));
  let final: Artifact[] = [];
  for (const [index, step] of plan.steps.entries()) {
    if (signal.aborted)
      throw new ExecutionError("cancelled", "Execution cancelled.");
    const tool = definitions.find((t) => t.id === step.toolId)!;
    const documents = step.inputs.flatMap((id) => values.get(id)!);
    if (
      documents.length < tool.minInputs ||
      documents.length > tool.maxInputs ||
      documents.reduce((n, d) => n + d.blob.size, 0) > limits.jobBytes
    )
      throw new ExecutionError(
        "limit",
        "This step has an invalid number or size of input files.",
      );
    onProgress({ step: step.id, completed: index, total: plan.steps.length });
    final = await adapter(step.toolId, documents, step.parameters, signal);
    if (signal.aborted)
      throw new ExecutionError("cancelled", "Execution cancelled.");
    if (
      !final.length ||
      final.length > limits.outputs ||
      final.reduce((n, a) => n + a.bytes.byteLength, 0) > limits.jobBytes ||
      final.some(
        (a) =>
          a.mime !== "application/pdf" ||
          !a.bytes.byteLength ||
          !new TextDecoder().decode(a.bytes.subarray(0, 8)).startsWith("%PDF-"),
      )
    )
      throw new ExecutionError(
        "processing",
        "The processor returned an invalid or oversized PDF result.",
      );
    values.set(
      step.id,
      final.map((a, i) => ({
        id: `${step.id}-${i}`,
        name: a.name,
        blob: new Blob([new Uint8Array(a.bytes)], { type: a.mime }),
      })),
    );
    const required = new Set(
      plan.steps.slice(index + 1).flatMap((next) => next.inputs),
    );
    for (const key of values.keys()) if (!required.has(key)) values.delete(key);
    onProgress({
      step: step.id,
      completed: index + 1,
      total: plan.steps.length,
    });
  }
  return final;
}
