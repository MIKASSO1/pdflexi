import { degrees, StandardFonts, rgb } from "pdf-lib";
import type { InputDocument, Parameters } from "../../../../core/src/index.ts";
import { loadPdf, result } from "../../pdf.ts";
export async function execute(inputs: InputDocument[], parameters: Parameters) {
  const pdf = await loadPdf(inputs[0]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  for (const page of pdf.getPages()) {
    const box = page.getCropBox(),
      text = String(parameters.text);
    const size = Math.min(
      40,
      (box.width * 0.7) / Math.max(font.widthOfTextAtSize(text, 1), 1),
    );
    page.drawText(text, {
      x: box.x + box.width * 0.12,
      y: box.y + box.height * 0.45,
      size,
      font,
      color: rgb(0.45, 0.45, 0.45),
      opacity: 0.3,
      rotate: degrees(30),
    });
  }
  return result(pdf, "watermarked.pdf");
}
