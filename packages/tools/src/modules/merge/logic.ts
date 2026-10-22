import { PDFDocument } from "pdf-lib";
import type { InputDocument } from "../../../../core/src/index.ts";
import { limits, ExecutionError } from "../../../../core/src/index.ts";
import { loadPdf, result } from "../../pdf.ts";
export async function execute(inputs: InputDocument[]) {
  const output = await PDFDocument.create();
  for (const input of inputs) {
    const pdf = await loadPdf(input);
    if (output.getPageCount() + pdf.getPageCount() > limits.pages)
      throw new ExecutionError(
        "limit",
        "Merged document exceeds the page limit.",
      );
    for (const page of await output.copyPages(pdf, pdf.getPageIndices()))
      output.addPage(page);
  }
  return result(output, "merged.pdf");
}
