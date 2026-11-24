import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import { openPdf } from "../lib/pdfRuntime";
import { AnnotationLayer } from "./AnnotationLayer";
import type { EditingProps } from "./AnnotationLayer";
export type ZoomValue = "page" | "width" | number;
type Size = { width: number; height: number };
const noop = () => {};
function scaleFor(size: Size, available: Size, zoom: ZoomValue) {
  return zoom === "page"
    ? Math.min(1, available.width / size.width, available.height / size.height)
    : zoom === "width"
      ? available.width / size.width
      : zoom;
}
function PdfPage({
  doc,
  number,
  size,
  scale,
  root,
  editing,
  errorText,
}: {
  doc: PDFDocumentProxy;
  number: number;
  size: Size;
  scale: number;
  root: HTMLDivElement | null;
  editing?: EditingProps;
  errorText: string;
}) {
  const ref = useRef<HTMLDivElement>(null),
    canvas = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false),
    [error, setError] = useState(false);
  const width = size.width * scale,
    height = size.height * scale;
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { root, rootMargin: "600px 0px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [root]);
  useEffect(() => {
    const target = canvas.current;
    if (!target) return;
    if (!visible) {
      target.width = 0;
      target.height = 0;
      return;
    }
    let cancelled = false;
    let task: ReturnType<PDFPageProxy["render"]> | undefined;
    setError(false);
    void doc
      .getPage(number)
      .then(async (page) => {
        if (cancelled) return;
        const view = page.getViewport({ scale });
        const dpr = Math.min(devicePixelRatio || 1, 2);
        target.width = Math.ceil(view.width * dpr);
        target.height = Math.ceil(view.height * dpr);
        const ctx = target.getContext("2d");
        if (!ctx) return;
        task = page.render({
          canvas: target,
          canvasContext: ctx,
          viewport: view,
          transform: [dpr, 0, 0, dpr, 0, 0],
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
  }, [doc, number, scale, visible]);
  return (
    <div
      ref={ref}
      className="pdf-page"
      data-page-number={number}
      data-render-scale={scale}
      style={{ width, height }}
    >
      <canvas
        ref={canvas}
        role="img"
        aria-label={`PDF · ${number}`}
        style={{ width: "100%", height: "100%" }}
      />
      {editing && !error && (
        <AnnotationLayer
          width={width}
          height={height}
          page={number}
          pageWidth={size.width}
          editing={editing}
          visible={visible}
        />
      )}
      {error && (
        <p className="pdf-page-error" role="alert">
          {errorText}
        </p>
      )}
    </div>
  );
}
export function PdfViewport({
  file,
  zoom = "page",
  page = 1,
  onPage = noop,
  onCount = noop,
  onScale = noop,
  loading,
  errorText,
  editing,
}: {
  file: File;
  zoom?: ZoomValue;
  page?: number;
  onPage?: (n: number) => void;
  onCount?: (n: number) => void;
  onScale?: (n: number) => void;
  loading: string;
  errorText: string;
  editing?: EditingProps;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null),
    [sizes, setSizes] = useState<Size[]>([]),
    [available, setAvailable] = useState<Size>({ width: 500, height: 450 }),
    [error, setError] = useState(false);
  const current = useRef(1);
  useEffect(() => {
    let cancelled = false;
    let task: ReturnType<typeof openPdf> | undefined;
    setDoc(null);
    setSizes([]);
    setError(false);
    onCount(0);
    current.current = 1;
    void file
      .arrayBuffer()
      .then((bytes) => {
        if (cancelled) return;
        task = openPdf(bytes);
        return task.promise;
      })
      .then(async (pdf) => {
        if (!pdf || cancelled) return;
        const first = await pdf.getPage(1);
        if (cancelled) return;
        const v = first.getViewport({ scale: 1 });
        const dimensions: Size[] = Array.from({ length: pdf.numPages }, () => ({
          width: v.width,
          height: v.height,
        }));
        setSizes(dimensions);
        setDoc(pdf);
        onCount(pdf.numPages);
        let next = 2;
        await Promise.all(
          Array.from({ length: Math.min(4, pdf.numPages - 1) }, async () => {
            while (!cancelled && next <= pdf.numPages) {
              const n = next++;
              try {
                const p = await pdf.getPage(n),
                  view = p.getViewport({ scale: 1 });
                dimensions[n - 1] = { width: view.width, height: view.height };
              } catch {
                /* The page displays a recoverable error when rendered. */
              }
            }
          }),
        );
        if (!cancelled) setSizes([...dimensions]);
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
      setAvailable({
        width: Math.max(80, el.clientWidth - 48),
        height: Math.max(80, el.clientHeight - 48),
      }),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const active = sizes[page - 1] || sizes[0];
  useEffect(() => {
    if (active) onScale(scaleFor(active, available, zoom));
  }, [active, available, zoom, onScale]);
  function scrollToPage(n: number) {
    const el = root.current,
      target = el?.querySelector(`[data-page-number="${n}"]`);
    if (el && target)
      el.scrollTo({
        top:
          target.getBoundingClientRect().top -
          el.getBoundingClientRect().top +
          el.scrollTop -
          24,
        behavior: "instant",
      });
  }
  useEffect(() => {
    if (page !== current.current && doc) {
      scrollToPage(page);
      current.current = page;
    }
  }, [page, doc]);
  useEffect(() => {
    if (doc) scrollToPage(current.current);
  }, [zoom, available, doc]);
  function scrolled() {
    const el = root.current;
    if (!el) return;
    const viewport = el.getBoundingClientRect();
    let candidate = current.current,
      largest = 0;
    for (const item of el.querySelectorAll<HTMLElement>("[data-page-number]")) {
      const box = item.getBoundingClientRect();
      const overlap = Math.max(
        0,
        Math.min(box.bottom, viewport.bottom) - Math.max(box.top, viewport.top),
      );
      if (overlap > largest) {
        largest = overlap;
        candidate = Number(item.dataset.pageNumber);
      }
      if (box.top > viewport.bottom) break;
    }
    if (candidate !== current.current) {
      current.current = candidate;
      onPage(candidate);
    }
  }
  const widest = Math.max(
    available.width,
    ...sizes.map((size) => size.width * scaleFor(size, available, zoom)),
  );
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
        <div className="pdf-pages" style={{ minWidth: widest + 48 }}>
          {sizes.map((size, i) => (
            <PdfPage
              key={i}
              doc={doc}
              number={i + 1}
              size={size}
              scale={scaleFor(size, available, zoom)}
              root={root.current}
              editing={editing}
              errorText={errorText}
            />
          ))}
        </div>
      )}
    </div>
  );
}
