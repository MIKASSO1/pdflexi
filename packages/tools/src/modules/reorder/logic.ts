import { PDFDocument } from "pdf-lib";
import type { InputDocument, Parameters } from "../../../../core/src/index.ts";
import { ExecutionError } from "../../../../core/src/index.ts";
import { checkedPages, loadPdf, result } from "../../pdf.ts";
export async function execute(inputs: InputDocument[], parameters: Parameters) {
  const pdf = await loadPdf(inputs[0]);
  const order = checkedPages(parameters.pages as number[], pdf.getPageCount());
  if (order.length !== pdf.getPageCount())
    throw new ExecutionError(
      "invalid-parameters",
      "Reorder must include every page exactly once.",
    );
  const output = await PDFDocument.create();
  for (const page of await output.copyPages(pdf, order)) output.addPage(page);
  return result(output, "reordered.pdf");
}
