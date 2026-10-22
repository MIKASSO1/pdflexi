import { PDFDocument } from "pdf-lib";
import type { Artifact, InputDocument } from "../../../../core/src/index.ts";
import { limits, ExecutionError } from "../../../../core/src/index.ts";
import { loadPdf } from "../../pdf.ts";
export async function execute(inputs: InputDocument[]) {
  const pdf = await loadPdf(inputs[0]);
  if (pdf.getPageCount() > limits.outputs)
    throw new ExecutionError(
      "limit",
      "Splitting is limited to 100 output files per job.",
    );
  const outputs: Artifact[] = [];
  for (const index of pdf.getPageIndices()) {
    const output = await PDFDocument.create();
    const [page] = await output.copyPages(pdf, [index]);
    output.addPage(page);
    outputs.push({
      name: `page-${index + 1}.pdf`,
      mime: "application/pdf",
      bytes: await output.save(),
    });
  }
  return outputs;
}
