import { useEffect, useRef, useState } from "react";
import { getDocument } from "pdfjs-dist";
import type { PDFDocumentProxy } from "pdfjs-dist";

// PERF-FIX: parse the PDF once per file and share the document across pages —
// previously every page called getDocument() again, re-parsing the whole file
// (noticeable on desktop since the Workspace remounts on each entry).
const docCache = new Map<string, Promise<PDFDocumentProxy>>();
function getCachedDoc(pdfFile: any): Promise<PDFDocumentProxy> {
  const key = `${pdfFile.name || "file"}:${pdfFile.size || 0}`;
  const cached = docCache.get(key);
  if (cached) return cached;
  const p: Promise<PDFDocumentProxy> = pdfFile.__cachedBuf
    ? Promise.resolve(pdfFile.__cachedBuf as ArrayBuffer).then((buf: ArrayBuffer) => getDocument({ data: buf.slice(0) }).promise)
    : pdfFile.arrayBuffer().then((buf: ArrayBuffer) => { pdfFile.__cachedBuf = buf; return getDocument({ data: buf.slice(0) }).promise; });
  docCache.set(key, p);
  return p;
}

// MOBILE-ONLY canvas renderer for PDF pages: renders lazily (IntersectionObserver),
// caches file bytes once per file, draws at exact display size. No visual/behavioral change.
export function SharpPdfCanvas({ pdfFile, pageIndex, zoomFactor, opacity }: { pdfFile: any; pageIndex: number; zoomFactor: number; opacity?: number }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const drawRef = useRef<HTMLDivElement>(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  // MOBILE-ONLY FIX: old code rendered ALL 120 pages at once, each re-parsing the whole PDF.
  // Now: render only when the page is actually on screen (+800px around it), else keep a light placeholder.
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    if (typeof (window as any).IntersectionObserver === "undefined") { setIsVisible(true); return; }
    const io = new (window as any).IntersectionObserver((entries: any[]) => {
      if (entries[0] && entries[0].isIntersecting) { setIsVisible(true); io.disconnect(); }
    }, { rootMargin: "800px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!isVisible) return;
    let cancelled = false;
    const draw = async () => {
      try {
        // MOBILE-ONLY: cache the file bytes ONCE — old code called arrayBuffer() per page (120 full copies = freeze).
        if (!(pdfFile as any).__cachedBuf) { (pdfFile as any).__cachedBuf = await pdfFile.arrayBuffer(); }
        // PERF-FIX: reuse the parsed document from docCache instead of re-parsing per page.
        const pdf2 = await getCachedDoc(pdfFile);
        const pg = await pdf2.getPage(pageIndex + 1);
        const base = pg.getViewport({ scale: 1 });
        const dpr = Math.min(3, window.devicePixelRatio || 1);
        const vp = pg.getViewport({ scale: Math.max(0.4, Math.min(4, (580 * zoomFactor * dpr) / base.width)) });
        const cv = document.createElement("canvas");
        cv.width = Math.round(vp.width); cv.height = Math.round(vp.height);
        cv.style.width = "100%"; cv.style.height = "auto"; cv.style.display = "block";
        const cx = cv.getContext("2d"); if (cx) { await pg.render({ canvas: cv, canvasContext: cx, viewport: vp }).promise; }
        const box2 = drawRef.current; if (box2 && !cancelled) { box2.innerHTML = ""; box2.appendChild(cv); setHasDrawn(true); }
        return;
      } catch (e) { /* keep previous frame — never blank the page */ }
    };
    const id = setTimeout(draw, 60);
    return () => { cancelled = true; clearTimeout(id); };
  }, [pdfFile, pageIndex, zoomFactor, isVisible]);
  return (<div ref={boxRef} style={{ width: "100%", height: "auto", display: "block", borderRadius: "6px", opacity: opacity ?? 1 }}>
    {!hasDrawn && (<div style={{ width: "100%", aspectRatio: "1 / 1.414" as any, background: "white", border: "1px solid #F3F4F6", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#9CA3AF" }}>Loading page {pageIndex + 1}…</div>)}
    <div ref={drawRef} style={{ width: "100%", display: hasDrawn ? "block" : "none" }} />
  </div>);
}
