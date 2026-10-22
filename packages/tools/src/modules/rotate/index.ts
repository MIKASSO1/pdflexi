import type { ToolDefinition } from "../../../../core/src/index.ts";
import { rotateParameters } from "../../validation.ts";
export const definition: ToolDefinition = {
  id: "rotate",
  status: "ready",
  minInputs: 1,
  maxInputs: 1,
  parameters: rotateParameters,
};
