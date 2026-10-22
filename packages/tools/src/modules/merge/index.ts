import type { ToolDefinition } from "../../../../core/src/index.ts";
import { noParameters } from "../../validation.ts";
export const definition: ToolDefinition = {
  id: "merge",
  status: "ready",
  minInputs: 2,
  maxInputs: 10,
  parameters: noParameters,
};
