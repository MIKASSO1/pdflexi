import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Ellipsis,
  Highlighter,
  Info,
  Maximize2,
  PencilLine,
  Plus,
  Share2,
  X,
  ZoomIn,
} from "lucide-react";
import type { Attachment } from "../lib/types";
import type { Copy } from "../data/copy";
import type { Locale } from "../data/languages";
import { studioCopy } from "../data/studio";
import { PdfViewport } from "./PdfViewport";
export function WorkspaceCanvas({
  t,
  locale,
  files,
  selectedId,
  setSelectedId,
  removeFile,
  upload,
  expanded,
  onExpand,
  onHistory,
  onClose,
}: {
  t: Copy;
  locale: Locale;
  files: Attachment[];
  selectedId: string | null;
  setSelectedId: (id: string) => void;
  removeFile: (id: string) => void;
  upload: () => void;
  expanded?: boolean;
  onExpand?: () => void;
  onHistory: () => void;
  onClose?: () => void;
}) {
  const s = studioCopy[locale];
  const selected = files.find((f) => f.id === selectedId) || files[0];
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [options, setOptions] = useState(false);
  const [shareNote, setShareNote] = useState(false);
  const [zoom, setZoom] = useState(() => {
    try {
      const n = Number(localStorage.getItem("pdflexi:view-zoom"));
      return [1, 1.25, 1.5, 2].includes(n) ? n : 1;
    } catch {
      return 1;
    }
  });
  const [saved, setSaved] = useState(true);
  const [tip, setTip] = useState(() => {
    try {
      return !localStorage.getItem("pdflexi:original-tip");
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("pdflexi:view-zoom", String(zoom));
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }, [zoom]);
  useEffect(() => {
    setPage(1);
    setOptions(false);
    setShareNote(false);
  }, [selected.id]);
  useEffect(() => {
    if (!tip) return;
    try {
      localStorage.setItem("pdflexi:original-tip", "1");
    } catch {
      /* optional preference */
    }
    const timer = setTimeout(() => setTip(false), 6000);
    return () => clearTimeout(timer);
  }, [tip]);
  async function share() {
    try {
      if (navigator.canShare?.({ files: [selected.file] })) {
        await navigator.share({
          files: [selected.file],
          title: selected.file.name,
        });
        return;
      }
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
    }
    setShareNote(true);
  }
  return (
    <section
      className={`document-canvas studio-canvas ${expanded ? "expanded-canvas" : ""}`}
      aria-label={t.canvas}
    >
      <header className="studio-heading">
        <div className="studio-filename">
          <span className="studio-file-dot" />
          <h2 title={selected.file.name}>
            <bdi>{selected.file.name}</bdi>
          </h2>
        </div>
        <a
          className="studio-download"
          href={selected.url}
          download={selected.file.name}
          aria-label={t.download}
        >
          <Download size={16} />
          <span>{s.download}</span>
        </a>
        <button
          className="icon-button"
          onClick={expanded ? onClose : onExpand}
          aria-label={expanded ? t.normalSize : t.enlarge}
        >
          {expanded ? <X size={17} /> : <Maximize2 size={17} />}
        </button>
        <button
          className="icon-button file-options-button"
          aria-label={s.more}
          aria-expanded={options}
          onClick={() => setOptions(!options)}
        >
          <Ellipsis size={19} />
        </button>
      </header>
      <div className="studio-toolbar" aria-label={t.canvas}>
        <button
          aria-disabled="true"
          title={s.unavailable}
          onClick={() => setTip(true)}
        >
          <Highlighter size={16} />
          <span>{s.highlight}</span>
        </button>
        <button
          aria-disabled="true"
          title={s.unavailable}
          onClick={() => setTip(true)}
        >
          <PencilLine size={16} />
          <span>{s.edit}</span>
        </button>
        <label>
          <ZoomIn size={16} />
          <span className="sr-only">{s.zoom}</span>
          <select
            aria-label={s.zoom}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          >
            <option value={1}>{s.fit}</option>
            <option value={1.25}>125%</option>
            <option value={1.5}>150%</option>
            <option value={2}>200%</option>
          </select>
        </label>
        <button className="studio-share" onClick={() => void share()}>
          <Share2 size={16} />
          <span>{s.share}</span>
        </button>
      </div>
      {options && (
        <div className="studio-file-options">
          <div className="attached-file-list">
            {files.map((f) => (
              <div
                key={f.id}
                className={`attached-file ${selected.id === f.id ? "selected" : ""}`}
              >
                <button
                  onClick={() => setSelectedId(f.id)}
                  aria-pressed={selected.id === f.id}
                >
                  <bdi>{f.file.name}</bdi>
                </button>
                <button
                  className="remove-file"
                  aria-label={`${t.remove}: ${f.file.name}`}
                  onClick={() => removeFile(f.id)}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={upload}>
            <Plus size={16} />
            {t.addFiles}
          </button>
          <button onClick={onHistory}>{t.history}</button>
        </div>
      )}
      {tip && (
        <div className="canvas-once-tip" role="status">
          <Info size={15} />
          <span>{s.tip}</span>
          <button onClick={() => setTip(false)} aria-label={t.close}>
            <X size={14} />
          </button>
        </div>
      )}
      {shareNote && (
        <div className="canvas-once-tip" role="status">
          <span>{s.shareUnavailable}</span>
          <button onClick={() => setShareNote(false)} aria-label={t.close}>
            <X size={14} />
          </button>
        </div>
      )}
      <div className="studio-document actual-document">
        {selected.kind === "pdf" ? (
          <PdfViewport
            key={selected.id}
            file={selected.file}
            zoom={zoom}
            page={page}
            onPage={setPage}
            onCount={setCount}
            loading={s.loading}
            errorText={s.error}
          />
        ) : ["jpg", "jpeg", "png"].includes(selected.kind) ? (
          <div className="studio-image image-preview">
            <img
              src={selected.url}
              alt={selected.file.name}
              style={{ width: `${zoom * 100}%` }}
            />
          </div>
        ) : (
          <div className="unpreviewable">
            <h3>{selected.file.name}</h3>
            <p>{t.unsupported}</p>
            <a href={selected.url} download={selected.file.name}>
              {s.download}
            </a>
          </div>
        )}
      </div>
      <footer className="studio-footer">
        <div className="studio-page-controls">
          <button
            className="icon-button"
            disabled={page <= 1 || !count}
            onClick={() => setPage(page - 1)}
            aria-label={s.previous}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="studio-page-status">
            {count ? `${s.page} ${page} ${s.of} ${count}` : s.original}
          </span>
          <button
            className="icon-button"
            disabled={page >= count || !count}
            onClick={() => setPage(page + 1)}
            aria-label={s.next}
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <span className="studio-save" title={s.saveHint}>
          <span className={saved ? "view-saved-dot" : ""} />
          {saved ? s.viewSave : s.original}
          <Info size={12} />
        </span>
      </footer>
    </section>
  );
}
