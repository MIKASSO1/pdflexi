import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Download,
  FilePlus2,
  FileText,
  FolderOpen,
  Maximize2,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import type { Attachment } from "../lib/types";
import type { Copy } from "../data/copy";
import { formatBytes } from "../lib/files.mjs";
export function DocumentCanvas({
  t,
  files,
  selectedId,
  setSelectedId,
  removeFile,
  upload,
  expanded = false,
  onExpand,
  onHistory,
  onClose,
}: {
  t: Copy;
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
  const [isDragging, setDragging] = useState(false);
  const selected = files.find((f) => f.id === selectedId) || files[0];
  return (
    <section
      className={`document-canvas ${expanded ? "expanded-canvas" : ""}`}
      aria-label={t.canvas}
    >
      <div className="canvas-heading">
        <span className="canvas-symbol">
          <FileText size={20} />
        </span>
        <div>
          <h2>{t.canvas}</h2>
          <p>{t.canvasSub}</p>
        </div>
        <div className="canvas-heading-actions">
          {selected && (
            <a
              className="icon-button"
              href={selected.url}
              download={selected.file.name}
              aria-label={t.download}
              title={t.download}
            >
              <Download size={17} />
            </a>
          )}
          {expanded ? (
            <button
              className="icon-button"
              onClick={onClose}
              aria-label={t.normalSize}
            >
              <X size={18} />
            </button>
          ) : (
            <button
              className="icon-button"
              onClick={onExpand}
              aria-label={t.enlarge}
              title={t.enlarge}
            >
              <Maximize2 size={17} />
            </button>
          )}
        </div>
      </div>
      <div className="canvas-toolbar">
        <div className="canvas-current">
          <FileText size={14} />
          <span>{selected ? <bdi>{selected.file.name}</bdi> : t.sample}</span>
        </div>
        <button
          className={`file-version ${selected ? "version-original" : ""}`}
          onClick={onHistory}
          aria-label={t.history}
          title={t.history}
        >
          {selected ? (
            <>
              <Check size={11} />
              {t.original}
            </>
          ) : (
            t.examplePage
          )}
        </button>
      </div>
      {files.length > 0 && (
        <div className="attached-file-list" aria-label={t.files}>
          {files.map((f) => (
            <div
              className={`attached-file ${selected?.id === f.id ? "selected" : ""}`}
              key={f.id}
            >
              <button
                onClick={() => setSelectedId(f.id)}
                aria-pressed={selected?.id === f.id}
              >
                <FileText size={14} />
                <span>
                  <bdi>{f.file.name}</bdi>
                  <small>{formatBytes(f.file.size)}</small>
                </span>
              </button>
              <button
                className="remove-file"
                onClick={() => removeFile(f.id)}
                aria-label={`${t.remove}: ${f.file.name}`}
              >
                <X size={13} />
              </button>
            </div>
          ))}
          <button
            className="add-file-tile"
            onClick={upload}
            aria-label={t.addFiles}
          >
            <FilePlus2 size={18} />
          </button>
        </div>
      )}
      {selected ? (
        <div className="actual-document">
          {selected.kind === "pdf" ? (
            <>
              <iframe
                src={selected.url}
                title={`${t.canvas}: ${selected.file.name}`}
                className="pdf-frame"
              />
              <p className="pdf-fallback">
                {t.previewUnavailable}{" "}
                <a
                  href={selected.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.open}
                  <ArrowUpRight size={12} />
                </a>
              </p>
            </>
          ) : ["jpg", "jpeg", "png"].includes(selected.kind) ? (
            <div className="image-preview">
              <img src={selected.url} alt={selected.file.name} />
            </div>
          ) : (
            <div className="unpreviewable">
              <FolderOpen size={40} />
              <h3>
                <bdi>{selected.file.name}</bdi>
              </h3>
              <p>{t.unsupported}</p>
              <a
                className="secondary-button"
                href={selected.url}
                download={selected.file.name}
              >
                <Download size={16} />
                {t.download}
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="sample-stage">
          <div className="sample-caption">
            <span className="sample-dot" />
            {t.sampleOnly}
          </div>
          <article className="sample-sheet">
            <div className="sample-brand-row">
              <span className="sample-brand-symbol">
                n<span>↗</span>
              </span>
              <span>{t.sampleKicker}</span>
              <span className="sample-year">2026</span>
            </div>
            <div className="sample-line" />
            <div className="sample-label">{t.sampleLabel}</div>
            <h3>{t.sampleTitle}</h3>
            <p className="sample-lead">{t.sampleSubtitle}</p>
            <div className="sample-sections">
              <div>
                <h4>{t.sampleSection}</h4>
                <p>{t.sampleBody}</p>
              </div>
              <div>
                <h4>{t.sampleSection2}</h4>
                <p>{t.sampleBody2}</p>
              </div>
            </div>
            <div className="sample-signature-line">
              <span>{t.sampleFooter}</span>
              <span>01</span>
            </div>
          </article>
        </div>
      )}
      <div
        className={`upload-area ${isDragging ? "drag-hint" : ""}`}
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDrop={() => setDragging(false)}
      >
        <span className="upload-area-icon">
          <Upload size={21} />
        </span>
        <div>
          <h3>{files.length ? t.addFiles : t.dropTitle}</h3>
          <p>{t.dropSub}</p>
        </div>
        <button className="primary-button upload-button" onClick={upload}>
          {t.upload}
          <ArrowUpRight size={15} />
        </button>
      </div>
      <p className="upload-limits">{t.formats}</p>
      <div className="canvas-footer">
        <ShieldCheck size={13} />
        <span>{t.privacySub}</span>
        <span className="canvas-footer-brand">
          PDFlexi Canvas
          <ChevronDown size={12} />
        </span>
      </div>
    </section>
  );
}
