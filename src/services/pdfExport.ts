import { drawAnnotation } from "../lib/annotations";
import type { Annotation } from "../lib/annotations";

/** Local export adapter. No upload, original-file mutation, or AI execution. */
export async function exportAnnotatedPdf(file: File, marks: Annotation[]) {
  const { PDFDocument, degrees } = await import("pdf-lib");
  const pdf = await PDFDocument.load(await file.arrayBuffer());
  await document.fonts.ready;
  for (let index = 0; index < pdf.getPageCount(); index++) {
    const pageMarks = marks.filter((a) => a.page === index + 1);
    if (!pageMarks.length) continue;
    const page = pdf.getPage(index),
      crop = page.getCropBox(),
      angle = ((page.getRotation().angle % 360) + 360) % 360;
    const rotated = angle === 90 || angle === 270,
      width = rotated ? crop.height : crop.width,
      height = rotated ? crop.width : crop.height;
    const scale = Math.min(2, 4096 / Math.max(width, height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(width * scale);
    canvas.height = Math.ceil(height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    pageMarks.forEach((a) =>
      drawAnnotation(ctx, a, canvas.width, canvas.height),
    );
    const image = await pdf.embedPng(canvas.toDataURL("image/png"));
    const x = angle === 90 || angle === 180 ? crop.x + crop.width : crop.x;
    const y = angle === 180 || angle === 270 ? crop.y + crop.height : crop.y;
    page.drawImage(image, { x, y, width, height, rotate: degrees(angle) });
    canvas.width = 0;
    canvas.height = 0;
  }
  return pdf.save();
}
