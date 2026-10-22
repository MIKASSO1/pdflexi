import type { ToolDefinition } from "../../../../core/src/index.ts";
import { watermarkParameters } from "../../validation.ts";
export const definition: ToolDefinition = {
  id: "watermark",
  status: "ready",
  minInputs: 1,
  maxInputs: 1,
  parameters: watermarkParameters,
};
