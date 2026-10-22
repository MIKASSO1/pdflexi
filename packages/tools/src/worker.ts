/// <reference lib="webworker" />
import { loaders } from "./loaders.ts";
import { toolDefinitions } from "./index.ts";
import { ExecutionError, limits } from "../../core/src/index.ts";
import type { InputDocument, Parameters } from "../../core/src/index.ts";
declare const self: DedicatedWorkerGlobalScope;
self.onmessage = async (
  event: MessageEvent<{
    toolId: string;
    inputs: InputDocument[];
    parameters: Parameters;
  }>,
) => {
  try {
    const { toolId, inputs, parameters } = event.data;
    const definition = toolDefinitions.find((t) => t.id === toolId),
      load = loaders[toolId];
    if (!definition || definition.status !== "ready" || !load)
      throw new ExecutionError("unsupported", "No local executor.");
    if (
      inputs.length < definition.minInputs ||
      inputs.length > definition.maxInputs ||
      inputs.reduce((n, d) => n + d.blob.size, 0) > limits.jobBytes
    )
      throw new ExecutionError("limit", "Worker input limit exceeded.");
    const validated = definition.parameters(parameters);
    const module = await load();
    const artifacts = await module.execute(inputs, validated);
    self.postMessage(
      { ok: true, artifacts },
      artifacts.map((a) => a.bytes.buffer as ArrayBuffer),
    );
  } catch (error) {
    self.postMessage({
      ok: false,
      code: error instanceof ExecutionError ? error.code : "processing",
      message: error instanceof Error ? error.message : "Processing failed.",
    });
  }
};
