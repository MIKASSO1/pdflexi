import { StandardFonts } from "pdf-lib";
import type { InputDocument } from "../../../../core/src/index.ts";
import { loadPdf, result } from "../../pdf.ts";
export async function execute(inputs: InputDocument[]) {
  const pdf = await loadPdf(inputs[0]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  pdf.getPages().forEach((page, i) => {
    const box = page.getCropBox(),
      text = `${i + 1} / ${pdf.getPageCount()}`;
    page.drawText(text, {
      x: box.x + (box.width - font.widthOfTextAtSize(text, 10)) / 2,
      y: box.y + 18,
      size: 10,
      font,
    });
  });
  return result(pdf, "numbered.pdf");
}
