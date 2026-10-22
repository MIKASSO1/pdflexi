import type { ToolDefinition } from "../../../../core/src/index.ts";
import { noParameters } from "../../validation.ts";
export const definition: ToolDefinition = {
  id: "ocr",
  status: "planned",
  minInputs: 1,
  maxInputs: 10,
  parameters: noParameters,
};
