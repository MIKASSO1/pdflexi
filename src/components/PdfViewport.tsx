import { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
GlobalWorkerOptions.workerSrc = workerUrl;

function PdfPage({
  doc,
  number,
  width,
  root,
}: {
  doc: PDFDocumentProxy;
  number: number;
  width: number;
  root: HTMLDivElement | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);
  const [ratio, setRatio] = useState(1.414);
  const [error, setError] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { root, rootMargin: "600px 0px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [root]);
  useEffect(() => {
    if (!visible || !canvas.current || width < 1) return;
    let cancelled = false;
    let task: ReturnType<PDFPageProxy["render"]> | undefined;
    const target = canvas.current;
    void doc
      .getPage(number)
      .then(async (page) => {
        if (cancelled) return;
        const original = page.getViewport({ scale: 1 });
        setRatio(original.height / original.width);
        const view = page.getViewport({ scale: width / original.width });
        const pixelRatio = Math.min(devicePixelRatio || 1, 2);
        target.width = Math.ceil(view.width * pixelRatio);
        target.height = Math.ceil(view.height * pixelRatio);
        const ctx = target.getContext("2d");
        if (!ctx) return;
        task = page.render({
          canvas: target,
          canvasContext: ctx,
          viewport: view,
          transform: [pixelRatio, 0, 0, pixelRatio, 0, 0],
        });
        await task.promise;
      })
      .catch((e) => {
        if (!cancelled && e?.name !== "RenderingCancelledException")
          setError(true);
      });
    return () => {
      cancelled = true;
      task?.cancel();
      target.width = 0;
      target.height = 0;
    };
  }, [doc, number, width, visible]);
  return (
    <div
      ref={ref}
      className="pdf-page"
      data-page-number={number}
      style={{ width, height: width * ratio }}
    >
      <canvas
        ref={canvas}
        role="img"
        aria-label={`PDF · ${number}`}
        style={{ width: "100%", height: "100%" }}
      />
      {error && <span role="alert">⚠ {number}</span>}
    </div>
  );
}
export function PdfViewport({
  file,
  zoom,
  page,
  onPage,
  onCount,
  loading,
  errorText,
}: {
  file: File;
  zoom: number;
  page: number;
  onPage: (n: number) => void;
  onCount: (n: number) => void;
  loading: string;
  errorText: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [width, setWidth] = useState(500);
  const [error, setError] = useState(false);
  const current = useRef(1);
  useEffect(() => {
    let cancelled = false;
    let task: ReturnType<typeof getDocument> | undefined;
    setDoc(null);
    setError(false);
    onCount(0);
    current.current = 1;
    void file
      .arrayBuffer()
      .then((bytes) => {
        if (cancelled) return;
        task = getDocument({
          data: new Uint8Array(bytes),
          isEvalSupported: false,
          cMapUrl: new URL(
            `${import.meta.env.BASE_URL}pdfjs/cmaps/`,
            document.baseURI,
          ).href,
          cMapPacked: true,
          standardFontDataUrl: new URL(
            `${import.meta.env.BASE_URL}pdfjs/standard_fonts/`,
            document.baseURI,
          ).href,
          wasmUrl: new URL(
            `${import.meta.env.BASE_URL}pdfjs/wasm/`,
            document.baseURI,
          ).href,
          useWorkerFetch: !import.meta.env.PDFLEXI_STANDALONE,
        });
        return task.promise;
      })
      .then((pdf) => {
        if (pdf && !cancelled) {
          setDoc(pdf);
          onCount(pdf.numPages);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
      void task?.destroy();
    };
  }, [file, onCount]);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new ResizeObserver(() =>
      setWidth(Math.max(120, el.clientWidth - 48)),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (page === current.current || !doc) return;
    const el = root.current;
    const target = el?.querySelector(`[data-page-number="${page}"]`);
    if (el && target)
      el.scrollTo({
        top:
          target.getBoundingClientRect().top -
          el.getBoundingClientRect().top +
          el.scrollTop -
          24,
        behavior: "instant",
      });
    current.current = page;
  }, [page, doc]);
  function scrolled() {
    const el = root.current;
    if (!el) return;
    const viewport = el.getBoundingClientRect();
    let candidate = current.current;
    let largest = 0;
    for (const item of el.querySelectorAll<HTMLElement>("[data-page-number]")) {
      const box = item.getBoundingClientRect();
      const visible = Math.max(
        0,
        Math.min(box.bottom, viewport.bottom) - Math.max(box.top, viewport.top),
      );
      if (visible > largest) {
        largest = visible;
        candidate = Number(item.dataset.pageNumber);
      }
      if (box.top > viewport.bottom) break;
    }
    if (candidate !== current.current) {
      current.current = candidate;
      onPage(candidate);
    }
  }
  return (
    <div
      className="pdf-viewer"
      ref={root}
      onScroll={scrolled}
      tabIndex={0}
      aria-label={file.name}
    >
      {error ? (
        <p className="pdf-load-state" role="alert">
          {errorText}
        </p>
      ) : !doc ? (
        <p className="pdf-load-state" role="status">
          {loading}
        </p>
      ) : (
        <div
          className="pdf-pages"
          style={{ minWidth: Math.round(width * zoom) + 48 }}
        >
          {Array.from({ length: doc.numPages }, (_, i) => (
            <PdfPage
              key={i}
              doc={doc}
              number={i + 1}
              width={Math.round(width * zoom)}
              root={root.current}
            />
          ))}
        </div>
      )}
    </div>
  );
}
