import { PDFDocument } from "pdf-lib";
import type { InputDocument } from "../../../../core/src/index.ts";
import { ExecutionError } from "../../../../core/src/index.ts";
import { result } from "../../pdf.ts";
export async function execute(inputs: InputDocument[]) {
  const pdf = await PDFDocument.create();
  for (const input of inputs) {
    const bytes = new Uint8Array(await input.blob.arrayBuffer());
    const png =
      bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71;
    const jpg = bytes[0] === 255 && bytes[1] === 216;
    if (!png && !jpg)
      throw new ExecutionError(
        "processing",
        "Only JPEG and PNG images are supported.",
      );
    const image = png ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
    if (image.width * image.height > 40_000_000)
      throw new ExecutionError("limit", "Image pixel count is too large.");
    const scale = Math.min(1, 14400 / Math.max(image.width, image.height));
    const page = pdf.addPage([image.width * scale, image.height * scale]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width * scale,
      height: image.height * scale,
    });
  }
  return result(pdf, "images.pdf");
}
