import type { ToolDefinition } from "../../../../core/src/index.ts";
import { pagesParameters } from "../../validation.ts";
export const definition: ToolDefinition = {
  id: "delete-pages",
  status: "ready",
  minInputs: 1,
  maxInputs: 1,
  parameters: pagesParameters,
};
