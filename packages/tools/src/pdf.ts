import { PDFDocument } from "pdf-lib";
import { ExecutionError, limits } from "../../core/src/index.ts";
import type { InputDocument, Artifact } from "../../core/src/index.ts";
export async function loadPdf(input: InputDocument) {
  const bytes = new Uint8Array(await input.blob.arrayBuffer());
  if (!new TextDecoder().decode(bytes.subarray(0, 1024)).includes("%PDF-"))
    throw new ExecutionError("processing", "This tool requires a PDF file.");
  const pdf = await PDFDocument.load(bytes, { updateMetadata: false });
  if (!pdf.getPageCount() || pdf.getPageCount() > limits.pages)
    throw new ExecutionError(
      "limit",
      "PDF page count exceeds the local limit.",
    );
  return pdf;
}
export async function result(
  pdf: PDFDocument,
  name: string,
): Promise<Artifact[]> {
  if (pdf.getPageCount() > limits.pages)
    throw new ExecutionError("limit", "Result has too many pages.");
  return [{ name, mime: "application/pdf", bytes: await pdf.save() }];
}
export function checkedPages(pages: number[], count: number) {
  if (pages.some((page) => page > count))
    throw new ExecutionError(
      "invalid-parameters",
      "A page number is outside this document.",
    );
  return pages.map((page) => page - 1);
}
