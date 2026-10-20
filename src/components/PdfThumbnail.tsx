import { useEffect, useRef, useState } from "react";
import { FileText } from "lucide-react";
import type { PDFPageProxy } from "pdfjs-dist";
import { openPdf } from "../lib/pdfRuntime";
export default function PdfThumbnail({
  file,
  label,
}: {
  file: File;
  label: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    let task: ReturnType<typeof openPdf> | undefined,
      render: ReturnType<PDFPageProxy["render"]> | undefined;
    void file
      .arrayBuffer()
      .then((bytes) => {
        if (cancelled) return;
        task = openPdf(bytes);
        return task.promise;
      })
      .then(async (pdf) => {
        if (!pdf || cancelled) return;
        const page = await pdf.getPage(1);
        if (cancelled || !ref.current) return;
        const size = page.getViewport({ scale: 1 }),
          view = page.getViewport({
            scale: Math.min(200 / size.width, 260 / size.height),
          }),
          canvas = ref.current;
        canvas.width = view.width * 2;
        canvas.height = view.height * 2;
        canvas.style.width = `${view.width}px`;
        canvas.style.height = `${view.height}px`;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        render = page.render({
          canvas,
          canvasContext: ctx,
          viewport: view,
          transform: [2, 0, 0, 2, 0, 0],
        });
        await render.promise;
        if (!cancelled) setReady(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      render?.cancel();
      void task?.destroy();
    };
  }, [file]);
  return (
    <div className="start-thumbnail">
      {!ready && <FileText size={32} />}
      <canvas
        ref={ref}
        role="img"
        aria-label={label}
        style={{ visibility: ready ? "visible" : "hidden" }}
      />
    </div>
  );
}
