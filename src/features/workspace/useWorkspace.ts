import { useState, useRef, useEffect, useImperativeHandle } from "react";
import type { Ref } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import type { WorkspaceHandle, WorkspaceProps } from "./workspaceTypes";
import { freeTools } from "../../data/showcase";

GlobalWorkerOptions.workerSrc = workerUrl;

export type WorkspaceState = ReturnType<typeof useWorkspace>;

export function useWorkspace(
  { activeTool, fileName, setFileName, setView, initialFile, initialMsg, onConsumed }: WorkspaceProps,
  ref: Ref<WorkspaceHandle>,
) {
  const [pdfFile, setPdfFile] = useState<any | null>(null);
  const [queueFiles, setQueueFiles] = useState<string[]>(["Contract.pdf"]);
  const [queueFileObjs, setQueueFileObjs] = useState<Record<string, any>>({});
  const [queueMenuOpen, setQueueMenuOpen] = useState<any>(null);
  const [wsMobileTab, setWsMobileTab] = useState<'doc' | 'lexi' | 'queue'>('doc'); // phone only: which panel is visible
  const [panMode, setPanMode] = useState(false);
  const [overlays, setOverlays] = useState<{ id: number, page: number, text: string, bold: boolean, italic: boolean, underline: boolean, size: number, color: string, x: number, y: number, font: string, align: string, highlight: string }[]>([]);
  const [overlayText, setOverlayText] = useState("");
  const [overlayBold, setOverlayBold] = useState(false);
  const [overlayItalic, setOverlayItalic] = useState(false);
  const [overlayUnderline, setOverlayUnderline] = useState(false);
  const [overlaySize, setOverlaySize] = useState(14);
  const [overlayColor, setOverlayColor] = useState("#111111");
  const [manualOpen, setManualOpen] = useState(false);
  const [overlayFont, setOverlayFont] = useState("Inter, sans-serif");
  const [overlayAlign, setOverlayAlign] = useState("left" as "left" | "center" | "right");
  const [overlayHighlight, setOverlayHighlight] = useState("transparent");
  const [textStrike, setTextStrike] = useState(false);
  const [textCase, setTextCase] = useState("normal" as "normal" | "upper" | "lower");
  const [textSelected, setTextSelected] = useState(false);
  const [editingLine, setEditingLine] = useState<number | null>(null);
  const [overlayDraft, setOverlayDraft] = useState<{ x: number, y: number } | null>(null);
  const [pdfPages, setPdfPages] = useState<string[]>([]);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const [wsAttached, setWsAttached] = useState<string | null>(null);
  const docScrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState(40);
  const [isDragging, setIsDragging] = useState(false);
  useEffect(() => {
    const move = (e: MouseEvent) => { if (!isDragging || !containerRef.current) return; const r = containerRef.current.getBoundingClientRect(); setLeftWidth(Math.min(60, Math.max(25, ((e.clientX - r.left) / r.width) * 100))); };
    const up = () => setIsDragging(false);
    if (isDragging) { window.addEventListener('mousemove', move); window.addEventListener('mouseup', up); }
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
  }, [isDragging]);
  const wsFileRef = useRef<HTMLInputElement>(null);
  const queueFileRef = useRef<HTMLInputElement>(null);
  const docUploadRef = useRef<HTMLInputElement>(null);
  const wsChatScrollRef = useRef<HTMLDivElement>(null);
  const wsChatScrollRefMobile = useRef<HTMLDivElement>(null);
  const [queuePickerLoading, setQueuePickerLoading] = useState(false); // QUEUE ONLY
  const [wsMsgs, setWsMsgs] = useState<{ role: "user" | "lexi", text: string }[]>([]);
  const [wsInput, setWsInput] = useState("");
  const [wsTool, setWsTool] = useState("Sign");
  const [wsToolsMenu, setWsToolsMenu] = useState<'free' | 'pro' | null>(null);
  const [wsToolsAnchor, setWsToolsAnchor] = useState<{ left: number, top: number } | null>(null); // FIX-DROPDOWN-ABOVE-DOC: fixed position from button rect, escapes overflow:hidden + doc stacking // WORKSPACE ONLY — which tools dropdown is open (Free / Advanced). One state for desktop + mobile rows, only one row is visible at a time.
  const wsFullToShort: Record<string, string> = { "Edit PDF": "Edit", "Merge PDF": "Merge", "Split PDF": "Split", "Compress PDF": "Compress", "Sign PDF": "Sign" }; // keep Sign/Compress preview checks (wsTool === 'Sign' / 'Compress') working
  const wsShortToFull: Record<string, string> = { Edit: "Edit PDF", Merge: "Merge PDF", Split: "Split PDF", Compress: "Compress PDF", Sign: "Sign PDF" };
  const wsFreeMatch = freeTools.find((f: any) => f.en === wsTool || wsShortToFull[wsTool] === f.en); // active free tool, legacy short names included
  const wsFreeIsActive = !!wsFreeMatch;
  const wsFreeLabel = wsFreeMatch ? `${wsFreeMatch.en} ▾` : "Free Tools ▾";
  // WORKSPACE ONLY — document viewer state (zoom / page / live preview). Workspace only, no other page.
  const [docZoom, setDocZoom] = useState(30); // WORKSPACE ONLY - EDIT 1: first appearance = 30% (small), user zooms in if they want
  const [autoFit, setAutoFit] = useState(1); // desktop 1, phone/tablet <1 — scales page visually, never reflows text
  const [docLive, setDocLive] = useState(true);
  const [, setDocPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState<string | null>(null);
  const [hiddenPages, setHiddenPages] = useState<number[]>([]);
  const [lockedPages, setLockedPages] = useState<number[]>([]); // WORKSPACE ONLY - EDIT 2: go-to-page input value (empty = show current page)
  // WORKSPACE ONLY - EDIT 2: jump directly to page N (1-based). Clamps to 1..total, scrolls that page into view.
  const goToPage = (n: number) => {
    const total = pdfPages.length > 0 ? pdfPages.length : 3 + extraPages;
    const clamped = Math.min(Math.max(1, Math.floor(n) || 1), total);
    setSelectedPage(clamped - 1); setDocPage(clamped); setGoToPageInput("");
    setTimeout(() => {
      const container: any = (docScrollRef as any)?.current;
      if (!container) return;
      const el = container.querySelector(`[data-doc-page="${clamped - 1}"]`) as any;
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };
  const [docRotate] = useState(0);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [docText, setDocText] = useState("");
  const [selectedPara, setSelectedPara] = useState<number | null>(null);
  const [redoMsgs, setRedoMsgs] = useState<{ role: "user" | "lexi", text: string }[]>([]);
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const [extraPages, setExtraPages] = useState<number>(0);
  // Real PDF rendering — progressive: first 5 pages instantly, rest in background chunks (fixes 120-page 60s freeze).
  const [wsNarrow, setWsNarrow] = useState(false); // workspace only: <900px => one panel at a time, document 100%
  // Real PDF rendering — progressive: first 5 pages instantly, rest in background chunks (fixes 120-page 60s freeze).
  useEffect(() => {
    if (!pdfFile) return;
    let cancelled = false;
    setPdfLoading(true); setPdfError("");
    const renderPdf = async () => {
      try {
        const pdfjsLib = { getDocument, GlobalWorkerOptions };
        const buf = await pdfFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
        // FIX-MOBILE-ONLY: phones NEVER use these JPEGs — they display SharpPdfCanvas (vector) instead.
        // Old code still rendered 120 JPEGs on phones (wasted) + 120 vector pages (heavy) = 1 min + freeze.
        // Now on phones: only count pages, show placeholders instantly, vector renders only visible pages.
        if (window.innerWidth < 900) {
          const totalMobile = pdf.numPages;
          setPdfPages(Array.from({ length: totalMobile }, () => "MOBILE_VECTOR"));
          setPdfLoading(false);
          return;
        }
        // FIX-PERF-120PAGES: old code rendered ALL pages at 4x to PNG, THEN showed anything.
        // 120 pages x 4x = ~120 huge canvases + huge PNG strings = ~60s freeze. New: progressive.
        // 1) First 5 pages fast (scale 2 desktop / 1.5 phone, JPEG 0.85 = ~5x lighter than PNG), show them at once.
        // 2) Rest in background, 5 pages per chunk, yielding to UI between chunks, appended as they finish.
        const renderScale = window.innerWidth < 900 ? 1.5 : 2;
        const renderOne = async (pageNum: number) => {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: renderScale });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width; canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return "";
          await page.render({ canvas, canvasContext: ctx, viewport }).promise;
          const url = canvas.toDataURL("image/jpeg", 0.85);
          canvas.width = 0; canvas.height = 0; // free canvas memory at once
          return url;
        };
        const yieldUI = () => new Promise<void>(r => setTimeout(r, 0));
        const total = pdf.numPages;
        const firstBatch = Math.min(5, total);
        const firstUrls: string[] = [];
        for (let i = 1; i <= firstBatch; i++) {
          if (cancelled) return;
          const u = await renderOne(i);
          if (u) firstUrls.push(u);
        }
        if (cancelled) return;
        setPdfPages(firstUrls);
        setPdfLoading(false); // user can already edit page 1-5, no more full-screen wait
        // Background: remaining pages, 5 at a time
        for (let start = firstBatch + 1; start <= total; start += 5) {
          if (cancelled) return;
          const chunk: string[] = [];
          for (let i = start; i < Math.min(start + 5, total + 1); i++) {
            if (cancelled) return;
            const u = await renderOne(i);
            if (u) chunk.push(u);
          }
          if (cancelled) return;
          if (chunk.length) setPdfPages(prev => [...prev, ...chunk]);
          await yieldUI();
        }
      } catch (e: any) {
        if (!cancelled) setPdfError("Could not render this PDF in this preview. The real file still opens correctly on export.");
      } finally { if (!cancelled) setPdfLoading(false); }
    };
    renderPdf();
    return () => { cancelled = true; };
  }, [pdfFile]);
  useEffect(() => {
    const el = docScrollRef.current;
    if (!el) return;
    const update = () => {
      // Workspace only: desktop => 1 (zoom is exactly docZoom, stable). Phone => fit to window, never reflow.
      const ww = el.clientWidth || window.innerWidth;
      const s = ww > 900 ? 1 : Math.min(1, Math.max(0.35, (ww - 32) / 580));
      setAutoFit(s);
      // Workspace narrow detection: container width < 900 => stacked layout (document 100%, queue below, never squeezed)
      const cw = (containerRef.current as any)?.clientWidth || ww;
      setWsNarrow(cw < 900);
    };
    update();
    const ro = (window as any).ResizeObserver ? new (window as any).ResizeObserver(update) : null;
    if (ro) { ro.observe(el); if (containerRef.current) ro.observe(containerRef.current); }
    window.addEventListener("resize", update);
    return () => { if (ro) ro.disconnect(); window.removeEventListener("resize", update); };
  }, []);
  useEffect(() => {
    const scrollBoth = () => {
      const els = [wsChatScrollRef.current, wsChatScrollRefMobile.current];
      els.forEach((el) => { if (el) { el.scrollTop = el.scrollHeight; } });
    };
    const t1 = requestAnimationFrame(scrollBoth);
    const t2 = setTimeout(scrollBoth, 50);
    return () => { cancelAnimationFrame(t1); clearTimeout(t2); };
  }, [wsMsgs]);
  const loadFileForEdit = (f: any) => {
    const name = f.name || "";
    setFileName(name);
    setSelectedPage(0); setSelectedPara(0); setTextSelected(false); setEditingLine(null); setOverlayDraft(null);
    if (name.toLowerCase().endsWith(".pdf")) {
      setPdfFile(f); setPdfPages([]); setPdfError(""); setDocText("");
    } else if (name.toLowerCase().endsWith(".txt") || name.toLowerCase().endsWith(".rtf") || name.toLowerCase().endsWith(".md") || name.toLowerCase().endsWith(".json") || name.toLowerCase().endsWith(".csv")) {
      setPdfFile(null); setPdfPages([]);
      const r = new FileReader(); r.onload = () => setDocText(String(r.result || "")); r.readAsText(f);
    } else {
      setPdfFile(null); setPdfPages([]); setDocText("");
    }
  };
  const openQueuePicker = () => { setQueuePickerLoading(true); const onFocus = () => { window.removeEventListener("focus", onFocus); window.setTimeout(() => setQueuePickerLoading(false), 400); }; window.addEventListener("focus", onFocus); queueFileRef.current?.click(); window.setTimeout(() => { window.removeEventListener("focus", onFocus); setQueuePickerLoading(false); }, 60000); }; // QUEUE ONLY

  useImperativeHandle(ref, () => ({
    goWorkspace: (name: string, msg?: string) => {
      setFileName(name);
      setWsMsgs([
        { role: "lexi", text: `File ${name} loaded - Ready to edit.` },
        { role: "lexi", text: `Ready to edit — ask me to sign, compress, merge or split this file.` },
        ...(msg ? [{ role: "user" as const, text: msg }] : []),
      ]);
      setView('workspace');
    },
    loadFileForEdit: (f: any) => {
      const name = f.name || "";
      setFileName(name);
      setSelectedPage(0); setSelectedPara(0); setTextSelected(false); setEditingLine(null);
      if (name.toLowerCase().endsWith(".pdf")) {
        setPdfFile(f); setPdfPages([]); setPdfError(""); setDocText("");
      } else if (name.toLowerCase().endsWith(".txt") || name.toLowerCase().endsWith(".rtf") || name.toLowerCase().endsWith(".md") || name.toLowerCase().endsWith(".json") || name.toLowerCase().endsWith(".csv")) {
        setPdfFile(null); setPdfPages([]);
        const r = new FileReader(); r.onload = () => setDocText(String(r.result || "")); r.readAsText(f);
      } else {
        setPdfFile(null); setPdfPages([]); setDocText("");
      }
      setView('workspace');
    },
  }));

  // FIX-SPLIT-UPLOAD: consume the file/message handed over from the homepage on mount
  // (App switches view before Workspace exists, so the ref call previously dropped it).
  const consumedInitial = useRef(false);
  useEffect(() => {
    if (consumedInitial.current) return;
    consumedInitial.current = true;
    if (initialFile) {
      loadFileForEdit(initialFile);
      if (initialMsg) setWsMsgs(p => [...p, { role: "user" as const, text: initialMsg }]);
    } else if (initialMsg !== undefined) {
      setWsMsgs([
        { role: "lexi", text: `File ${fileName} loaded - Ready to edit.` },
        { role: "lexi", text: `Ready to edit — ask me to sign, compress, merge or split this file.` },
        ...(initialMsg ? [{ role: "user" as const, text: initialMsg }] : []),
      ]);
    }
    onConsumed?.();
  }, []);

  const isArabicFile = /[\u0600-\u06FF]/.test(fileName);
  const isCodeFile = fileName.toLowerCase().includes("app.py") || fileName.toLowerCase().endsWith(".py") || fileName.toLowerCase().endsWith(".js") || fileName.toLowerCase().endsWith(".ts") || fileName.toLowerCase().endsWith(".json") || fileName.toLowerCase().endsWith(".csv");
  const cleanTitle = fileName.replace(/\.(rtf|pdf|txt|docx?)$/i, "");
  const handleUndo = () => { if (wsMsgs.length > 0) { const last = wsMsgs[wsMsgs.length - 1]; setWsMsgs(prev => prev.slice(0, -1)); setRedoMsgs(prev => [last, ...prev]); } };
  const handleRedo = () => { if (redoMsgs.length > 0) { const first = redoMsgs[0]; setWsMsgs(prev => [...prev, first]); setRedoMsgs(prev => prev.slice(1)); } };

  return {
    pdfFile,
    setPdfFile,
    queueFiles,
    setQueueFiles,
    queueFileObjs,
    setQueueFileObjs,
    queueMenuOpen,
    setQueueMenuOpen,
    wsMobileTab,
    setWsMobileTab,
    panMode,
    setPanMode,
    overlays,
    setOverlays,
    overlayText,
    setOverlayText,
    overlayBold,
    setOverlayBold,
    overlayItalic,
    setOverlayItalic,
    overlayUnderline,
    setOverlayUnderline,
    overlaySize,
    setOverlaySize,
    overlayColor,
    setOverlayColor,
    manualOpen,
    setManualOpen,
    overlayFont,
    setOverlayFont,
    overlayAlign,
    setOverlayAlign,
    overlayHighlight,
    setOverlayHighlight,
    textStrike,
    setTextStrike,
    textCase,
    setTextCase,
    textSelected,
    setTextSelected,
    editingLine,
    setEditingLine,
    overlayDraft,
    setOverlayDraft,
    pdfPages,
    setPdfPages,
    pdfLoading,
    setPdfLoading,
    pdfError,
    setPdfError,
    wsAttached,
    setWsAttached,
    docScrollRef,
    containerRef,
    leftWidth,
    setLeftWidth,
    isDragging,
    setIsDragging,
    wsFileRef,
    queueFileRef,
    docUploadRef,
    wsChatScrollRef,
    wsChatScrollRefMobile,
    queuePickerLoading,
    setQueuePickerLoading,
    wsMsgs,
    setWsMsgs,
    wsInput,
    setWsInput,
    wsTool,
    setWsTool,
    wsToolsMenu,
    setWsToolsMenu,
    wsToolsAnchor,
    setWsToolsAnchor,
    wsFullToShort,
    wsShortToFull,
    wsFreeMatch,
    wsFreeIsActive,
    wsFreeLabel,
    docZoom,
    setDocZoom,
    autoFit,
    setAutoFit,
    docLive,
    setDocLive,
    setDocPage,
    goToPageInput,
    setGoToPageInput,
    hiddenPages,
    setHiddenPages,
    lockedPages,
    setLockedPages,
    goToPage,
    docRotate,
    showExportMenu,
    setShowExportMenu,
    docText,
    setDocText,
    selectedPara,
    setSelectedPara,
    redoMsgs,
    setRedoMsgs,
    selectedPage,
    setSelectedPage,
    extraPages,
    setExtraPages,
    wsNarrow,
    setWsNarrow,
    loadFileForEdit,
    openQueuePicker,
    consumedInitial,
    isArabicFile,
    isCodeFile,
    cleanTitle,
    handleUndo,
    handleRedo,
    activeTool,
    fileName,
    setFileName,
    setView,
    initialFile,
    initialMsg,
    onConsumed,
  };
}
