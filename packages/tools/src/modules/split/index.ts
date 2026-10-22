import type { ToolDefinition } from "../../../../core/src/index.ts";
import { noParameters } from "../../validation.ts";
export const definition: ToolDefinition = {
  id: "split",
  status: "ready",
  minInputs: 1,
  maxInputs: 1,
  parameters: noParameters,
};
