import { degrees } from "pdf-lib";
import type { InputDocument, Parameters } from "../../../../core/src/index.ts";
import { checkedPages, loadPdf, result } from "../../pdf.ts";
export async function execute(inputs: InputDocument[], parameters: Parameters) {
  const pdf = await loadPdf(inputs[0]);
  const indices = parameters.pages
    ? checkedPages(parameters.pages as number[], pdf.getPageCount())
    : pdf.getPageIndices();
  indices.forEach((index) => {
    const page = pdf.getPage(index);
    page.setRotation(
      degrees((page.getRotation().angle + Number(parameters.degrees)) % 360),
    );
  });
  return result(pdf, "rotated.pdf");
}
