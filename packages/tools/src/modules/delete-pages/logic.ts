import type { InputDocument, Parameters } from "../../../../core/src/index.ts";
import { ExecutionError } from "../../../../core/src/index.ts";
import { checkedPages, loadPdf, result } from "../../pdf.ts";
export async function execute(inputs: InputDocument[], parameters: Parameters) {
  const pdf = await loadPdf(inputs[0]);
  const pages = checkedPages(parameters.pages as number[], pdf.getPageCount());
  if (pages.length === pdf.getPageCount())
    throw new ExecutionError("invalid-parameters", "Cannot delete every page.");
  pages.sort((a, b) => b - a).forEach((index) => pdf.removePage(index));
  return result(pdf, "pages-deleted.pdf");
}
