export type Point = { x: number; y: number };
export type EditTool =
  "select" | "text" | "pen" | "highlight" | "rectangle" | "arrow" | "eraser";
export type TextAlign = "left" | "center" | "right";
export type MarkStyle = {
  color: string;
  strokeWidth: number;
  fontSize: number;
  fontFamily: "Arial" | "Georgia" | "Courier New";
  bold: boolean;
  italic: boolean;
  underline: boolean;
  align: TextAlign;
  text: string;
};
export type Annotation = MarkStyle & {
  id: string;
  page: number;
  type: Exclude<EditTool, "select" | "eraser">;
  points: Point[];
  pageWidth: number;
  pageHeight: number;
  textWidth: number;
};
export type EditController = {
  annotations: Annotation[];
  commit: (marks: Annotation[]) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  dirty: boolean;
  markExported: (marks: Annotation[]) => void;
};
export const defaultMarkStyle: MarkStyle = {
  color: "#7050b7",
  strokeWidth: 2,
  fontSize: 18,
  fontFamily: "Arial",
  bold: false,
  italic: false,
  underline: false,
  align: "left",
  text: "",
};
const xy = (p: Point, w: number, h: number) => ({ x: p.x * w, y: p.y * h });
function textLayout(ctx: CanvasRenderingContext2D, a: Annotation, w: number) {
  const size = (a.fontSize * w) / a.pageWidth;
  ctx.font = `${a.italic ? "italic " : ""}${a.bold ? "bold " : ""}${size}px "${a.fontFamily}"`;
  const max = a.textWidth * w;
  const lines: string[] = [];
  for (const paragraph of a.text.split("\n")) {
    let line = "";
    for (const word of paragraph.split(" ")) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width <= max) line = test;
      else {
        if (line) lines.push(line);
        line = "";
        for (const character of word) {
          if (line && ctx.measureText(line + character).width > max) {
            lines.push(line);
            line = "";
          }
          line += character;
        }
      }
    }
    lines.push(line);
  }
  return {
    size,
    lines,
    width: Math.min(
      max,
      Math.max(1, ...lines.map((line) => ctx.measureText(line).width)),
    ),
    lineHeight: size * 1.3,
  };
}
export function annotationBounds(
  ctx: CanvasRenderingContext2D,
  a: Annotation,
  w: number,
  h: number,
) {
  if (a.type === "text") {
    const layout = textLayout(ctx, a, w);
    return {
      x: a.points[0].x,
      y: a.points[0].y,
      width: layout.width / w,
      height: (layout.lines.length * layout.lineHeight) / h,
    };
  }
  const xs = a.points.map((p) => p.x),
    ys = a.points.map((p) => p.y);
  return {
    x: Math.min(...xs),
    y: Math.min(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
}
export function drawAnnotation(
  ctx: CanvasRenderingContext2D,
  a: Annotation,
  w: number,
  h: number,
) {
  ctx.save();
  ctx.strokeStyle = a.color;
  ctx.fillStyle = a.color;
  ctx.lineWidth = (a.strokeWidth * w) / a.pageWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const start = xy(a.points[0], w, h),
    end = xy(a.points[a.points.length - 1], w, h);
  if (a.type === "text") {
    const layout = textLayout(ctx, a, w);
    ctx.textBaseline = "top";
    layout.lines.forEach((line, i) => {
      const firstStrong = line.match(/[A-Za-z\u0590-\u08ff]/)?.[0] || "";
      ctx.direction = /[\u0590-\u08ff]/.test(firstStrong) ? "rtl" : "ltr";
      ctx.textAlign = a.align;
      const offset =
        a.align === "right"
          ? layout.width
          : a.align === "center"
            ? layout.width / 2
            : 0;
      const x = start.x + offset,
        y = start.y + i * layout.lineHeight;
      ctx.fillText(line, x, y);
      if (a.underline) {
        const lineWidth = ctx.measureText(line).width;
        const left =
          a.align === "right"
            ? x - lineWidth
            : a.align === "center"
              ? x - lineWidth / 2
              : x;
        ctx.beginPath();
        ctx.lineWidth = Math.max(1, layout.size / 16);
        ctx.moveTo(left, y + layout.size * 1.08);
        ctx.lineTo(left + lineWidth, y + layout.size * 1.08);
        ctx.stroke();
      }
    });
  } else if (a.type === "highlight" || a.type === "rectangle") {
    if (a.type === "highlight") {
      ctx.globalAlpha = 0.28;
      ctx.fillRect(
        Math.min(start.x, end.x),
        Math.min(start.y, end.y),
        Math.abs(end.x - start.x),
        Math.abs(end.y - start.y),
      );
    } else
      ctx.strokeRect(
        Math.min(start.x, end.x),
        Math.min(start.y, end.y),
        Math.abs(end.x - start.x),
        Math.abs(end.y - start.y),
      );
  } else {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    for (const p of a.points.slice(1)) {
      const point = xy(p, w, h);
      ctx.lineTo(point.x, point.y);
    }
    if (a.points.length === 1) ctx.lineTo(start.x + 0.1, start.y + 0.1);
    ctx.stroke();
    if (a.type === "arrow") {
      const angle = Math.atan2(end.y - start.y, end.x - start.x),
        length = Math.max(8, (12 * w) / a.pageWidth);
      ctx.beginPath();
      ctx.moveTo(
        end.x - length * Math.cos(angle - Math.PI / 6),
        end.y - length * Math.sin(angle - Math.PI / 6),
      );
      ctx.lineTo(end.x, end.y);
      ctx.lineTo(
        end.x - length * Math.cos(angle + Math.PI / 6),
        end.y - length * Math.sin(angle + Math.PI / 6),
      );
      ctx.stroke();
    }
  }
  ctx.restore();
}
export function hitAnnotation(
  ctx: CanvasRenderingContext2D,
  marks: Annotation[],
  p: Point,
  w: number,
  h: number,
) {
  const point = xy(p, w, h);
  return [...marks].reverse().find((a) => {
    if (["text", "highlight", "rectangle"].includes(a.type)) {
      const b = annotationBounds(ctx, a, w, h),
        pad = 6;
      return (
        point.x >= b.x * w - pad &&
        point.x <= (b.x + b.width) * w + pad &&
        point.y >= b.y * h - pad &&
        point.y <= (b.y + b.height) * h + pad
      );
    }
    for (let i = 0; i < a.points.length; i++) {
      const from = xy(a.points[Math.max(0, i - 1)], w, h),
        to = xy(a.points[i], w, h);
      const dx = to.x - from.x,
        dy = to.y - from.y;
      const t = Math.max(
        0,
        Math.min(
          1,
          ((point.x - from.x) * dx + (point.y - from.y) * dy) /
            (dx * dx + dy * dy || 1),
        ),
      );
      if (
        Math.hypot(point.x - from.x - t * dx, point.y - from.y - t * dy) <
        Math.max(7, (a.strokeWidth * w) / a.pageWidth + 3)
      )
        return true;
    }
    return false;
  });
}
export function moveAnnotation(
  ctx: CanvasRenderingContext2D,
  a: Annotation,
  delta: Point,
  w: number,
  h: number,
) {
  const b = annotationBounds(ctx, a, w, h);
  const dx = Math.max(0.005 - b.x, Math.min(delta.x, 0.995 - b.x - b.width));
  const dy = Math.max(0.005 - b.y, Math.min(delta.y, 0.995 - b.y - b.height));
  return { ...a, points: a.points.map((p) => ({ x: p.x + dx, y: p.y + dy })) };
}
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
