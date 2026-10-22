import { usePdfExport } from "../features/editor/usePdfExport";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Bold,
  ChevronLeft,
  ChevronRight,
  Download,
  Ellipsis,
  Eraser,
  Highlighter,
  Info,
  Italic,
  Maximize2,
  Minus,
  MousePointer2,
  PencilLine,
  Plus,
  Redo2,
  Share2,
  Square,
  Trash2,
  Type,
  Underline,
  Undo2,
  X,
} from "lucide-react";
import type { KeyboardEvent } from "react";
import type { Attachment } from "../lib/types";
import type { Copy } from "../data/copy";
import type { Locale } from "../data/languages";
import { studioCopy } from "../data/studio";
import { editorCopy } from "../data/editor";
import {
  annotationBounds,
  defaultMarkStyle,
  moveAnnotation,
} from "../lib/annotations";
import type {
  Annotation,
  EditController,
  EditTool,
  MarkStyle,
} from "../lib/annotations";
import { PdfViewport } from "./PdfViewport";
import type { ZoomValue } from "./PdfViewport";
const emptyEditor: EditController = {
  annotations: [],
  commit: () => {},
  undo: () => {},
  redo: () => {},
  canUndo: false,
  canRedo: false,
  dirty: false,
  markExported: () => {},
};
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
  editor = emptyEditor,
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
  editor?: EditController;
}) {
  const s = studioCopy[locale],
    e = editorCopy[locale];
  const selected = files.find((f) => f.id === selectedId) || files[0];
  const [page, setPage] = useState(1),
    [count, setCount] = useState(0),
    [options, setOptions] = useState(false),
    [note, setNote] = useState(""),
    [zoom, setZoom] = useState<ZoomValue>("page"),
    [actualScale, setActualScale] = useState(1),
    [tool, setTool] = useState<EditTool>("select"),
    [style, setStyle] = useState<MarkStyle>(defaultMarkStyle),
    [selectedMark, setSelectedMark] = useState<string | null>(null);
  const { exporting, downloadEdits: exportEdits } = usePdfExport();
  const mark = editor.annotations.find((a) => a.id === selectedMark);
  const isPdf = selected.kind === "pdf";
  const activeDocument = useRef(selected.id);
  activeDocument.current = selected.id;
  useEffect(() => {
    setPage(1);
    setCount(0);
    setOptions(false);
    setNote("");
    setZoom("page");
    setTool("select");
    setSelectedMark(null);
  }, [selected.id]);
  useEffect(() => {
    if (selectedMark && !editor.annotations.some((a) => a.id === selectedMark))
      setSelectedMark(null);
  }, [editor.annotations, selectedMark]);
  function selectMark(a: Annotation | null) {
    setSelectedMark(a?.id || null);
    if (a)
      setStyle({
        color: a.color,
        strokeWidth: a.strokeWidth,
        fontSize: a.fontSize,
        fontFamily: a.fontFamily,
        bold: a.bold,
        italic: a.italic,
        underline: a.underline,
        align: a.align,
        text: a.text,
      });
  }
  function chooseTool(value: EditTool) {
    setTool(value);
    setNote("");
    if (value !== "text" || mark?.type !== "text") setSelectedMark(null);
    if (value === "highlight")
      setStyle((old) => ({ ...old, color: "#f4cc45" }));
    else if (style.color === "#f4cc45")
      setStyle((old) => ({ ...old, color: "#7050b7" }));
  }
  function removeSelected() {
    if (!mark) return;
    editor.commit(editor.annotations.filter((a) => a.id !== mark.id));
    setSelectedMark(null);
  }
  function applyText() {
    if (!mark || mark.type !== "text" || !style.text.trim()) return;
    const canvas = document.createElement("canvas"),
      ctx = canvas.getContext("2d");
    if (!ctx) return;
    const height = mark.pageHeight;
    const updated = { ...mark, ...style };
    if (annotationBounds(ctx, updated, mark.pageWidth, height).height > 0.98) {
      setNote(e.textError);
      return;
    }
    const positioned = moveAnnotation(
      ctx,
      updated,
      { x: 0, y: 0 },
      mark.pageWidth,
      height,
    );
    editor.commit(
      editor.annotations.map((a) => (a.id === mark.id ? positioned : a)),
    );
    setNote("");
  }
  async function downloadEdits() {
    setNote("");
    const documentId = selected.id;
    try {
      await exportEdits(selected, editor);
    } catch {
      // Do not attach an old document's export error to another selected file.
      if (activeDocument.current === documentId) setNote(e.exportError);
    }
  }
  async function share() {
    try {
      if (navigator.canShare?.({ files: [selected.file] })) {
        await navigator.share({
          files: [selected.file],
          title: selected.file.name,
        });
        return;
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
    }
    setNote(s.shareUnavailable);
  }
  function keyboard(event: KeyboardEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest("input,textarea,select")) return;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
      event.preventDefault();
      if (event.shiftKey) editor.redo();
      else editor.undo();
    } else if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "y"
    ) {
      event.preventDefault();
      editor.redo();
    } else if (event.key === "Delete" || event.key === "Backspace") {
      if (mark) {
        event.preventDefault();
        removeSelected();
      }
    } else if (event.key === "Escape") {
      setSelectedMark(null);
      setOptions(false);
      setNote("");
    }
  }
  const tools = [
    ["select", MousePointer2],
    ["text", Type],
    ["pen", PencilLine],
    ["highlight", Highlighter],
    ["rectangle", Square],
    ["arrow", ArrowUpRight],
    ["eraser", Eraser],
  ] as const;
  const hint =
    tool === "eraser"
      ? e.eraserHint
      : tool === "text"
        ? e.textHint
        : tool === "select"
          ? e.selectionHint
          : e.drawingHint;
  return (
    <section
      className={`document-canvas studio-canvas ${expanded ? "expanded-canvas" : ""} ${isPdf ? "pdf-editable" : ""}`}
      aria-label={t.canvas}
      onKeyDown={keyboard}
    >
      <header className="studio-heading">
        <div className="studio-filename">
          <span className="studio-file-dot" />
          <h2 title={selected.file.name}>
            <bdi>{selected.file.name}</bdi>
          </h2>
        </div>
        {isPdf && editor.annotations.length > 0 ? (
          <button
            className="studio-download edited-download"
            disabled={exporting}
            onClick={() => void downloadEdits()}
            title={e.downloadEdited}
            aria-label={e.downloadEdited}
          >
            <Download size={16} />
            <span>{exporting ? e.exporting : e.downloadEdited}</span>
          </button>
        ) : (
          <a
            className="studio-download"
            href={selected.url}
            download={selected.file.name}
            aria-label={t.download}
          >
            <Download size={16} />
            <span>{s.download}</span>
          </a>
        )}
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
      <div className="editor-toolbar" role="toolbar" aria-label={e.layer}>
        {isPdf && (
          <div className="editor-tool-group">
            {tools.map(([name, Icon]) => (
              <button
                key={name}
                type="button"
                className="edit-tool"
                data-tool={name}
                aria-label={e[name]}
                title={e[name]}
                aria-pressed={tool === name}
                onClick={() => chooseTool(name)}
              >
                <Icon size={18} />
                <span className="tool-caption">{e[name]}</span>
              </button>
            ))}
            <span className="toolbar-divider" />
            <button
              className="edit-tool"
              aria-label={e.undo}
              title={e.undo}
              disabled={!editor.canUndo}
              onClick={editor.undo}
            >
              <Undo2 size={18} />
            </button>
            <button
              className="edit-tool"
              aria-label={e.redo}
              title={e.redo}
              disabled={!editor.canRedo}
              onClick={editor.redo}
            >
              <Redo2 size={18} />
            </button>
            <button
              className="edit-tool"
              aria-label={e.delete}
              title={e.delete}
              disabled={!mark}
              onClick={removeSelected}
            >
              <Trash2 size={17} />
            </button>
          </div>
        )}
        <div className="editor-zoom-group">
          <button
            className="edit-tool"
            aria-label={e.zoomOut}
            title={e.zoomOut}
            disabled={typeof zoom === "number" && zoom <= 0.1}
            onClick={() =>
              setZoom(
                Math.max(0.1, Math.round((actualScale - 0.1) * 100) / 100),
              )
            }
          >
            <Minus size={17} />
          </button>
          <select
            aria-label={s.zoom}
            value={zoom}
            onChange={(event) =>
              setZoom(
                ["page", "width"].includes(event.target.value)
                  ? (event.target.value as ZoomValue)
                  : Number(event.target.value),
              )
            }
          >
            <option value="page">{e.fitPage}</option>
            <option value="width">{e.fitWidth}</option>
            {Array.from(
              new Set([
                0.25,
                0.5,
                0.75,
                1,
                1.25,
                1.5,
                2,
                3,
                4,
                ...(typeof zoom === "number" ? [zoom] : []),
              ]),
            )
              .sort((a, b) => a - b)
              .map((n) => (
                <option key={n} value={n}>
                  {Math.round(n * 100)}%
                </option>
              ))}
          </select>
          <button
            className="edit-tool"
            aria-label={e.zoomIn}
            title={e.zoomIn}
            disabled={typeof zoom === "number" && zoom >= 4}
            onClick={() =>
              setZoom(Math.min(4, Math.round((actualScale + 0.1) * 100) / 100))
            }
          >
            <Plus size={17} />
          </button>
          <button
            className="edit-tool"
            aria-label={s.share}
            title={`${s.share} · ${e.originalDownload}`}
            onClick={() => void share()}
          >
            <Share2 size={17} />
          </button>
        </div>
      </div>
      {isPdf && tool === "text" && (
        <div className="text-properties" aria-label={e.text}>
          <div className="text-content-row">
            <textarea
              rows={1}
              aria-label={e.textInput}
              placeholder={e.textInput}
              value={style.text}
              maxLength={2000}
              onChange={(event) =>
                setStyle((old) => ({ ...old, text: event.target.value }))
              }
            />
            {mark?.type === "text" && (
              <button
                className="apply-text"
                onClick={applyText}
                disabled={!style.text.trim()}
              >
                {e.apply}
              </button>
            )}
          </div>
          <div className="text-format-row">
            <select
              aria-label={e.font}
              value={style.fontFamily}
              onChange={(event) =>
                setStyle((old) => ({
                  ...old,
                  fontFamily: event.target.value as MarkStyle["fontFamily"],
                }))
              }
            >
              <option>Arial</option>
              <option>Georgia</option>
              <option>Courier New</option>
            </select>
            <select
              aria-label={e.size}
              value={style.fontSize}
              onChange={(event) =>
                setStyle((old) => ({
                  ...old,
                  fontSize: Number(event.target.value),
                }))
              }
            >
              {[10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
            {[
              ["bold", Bold],
              ["italic", Italic],
              ["underline", Underline],
            ].map(([name, Icon]) => {
              const key = name as "bold" | "italic" | "underline";
              const I = Icon as typeof Bold;
              return (
                <button
                  key={key}
                  className="edit-tool"
                  aria-label={e[key]}
                  title={e[key]}
                  aria-pressed={style[key]}
                  onClick={() =>
                    setStyle((old) => ({ ...old, [key]: !old[key] }))
                  }
                >
                  <I size={17} />
                </button>
              );
            })}
            <select
              aria-label={e.align}
              value={style.align}
              onChange={(event) =>
                setStyle((old) => ({
                  ...old,
                  align: event.target.value as MarkStyle["align"],
                }))
              }
            >
              <option value="left">{e.left}</option>
              <option value="center">{e.center}</option>
              <option value="right">{e.right}</option>
            </select>
            <label className="mark-color">
              <span className="sr-only">{e.color}</span>
              <input
                type="color"
                aria-label={e.color}
                value={style.color}
                onChange={(event) =>
                  setStyle((old) => ({ ...old, color: event.target.value }))
                }
              />
            </label>
          </div>
        </div>
      )}
      {isPdf && ["pen", "highlight", "rectangle", "arrow"].includes(tool) && (
        <div className="draw-properties">
          <label>
            {e.color}
            <input
              type="color"
              aria-label={e.color}
              value={style.color}
              onChange={(event) =>
                setStyle((old) => ({ ...old, color: event.target.value }))
              }
            />
          </label>
          <label>
            {e.width}
            <input
              type="range"
              aria-label={e.width}
              min={1}
              max={12}
              value={style.strokeWidth}
              onChange={(event) =>
                setStyle((old) => ({
                  ...old,
                  strokeWidth: Number(event.target.value),
                }))
              }
            />
            <output>{style.strokeWidth}</output>
          </label>
        </div>
      )}
      {isPdf && tool !== "select" && (
        <p
          className={`editor-hint ${tool === "eraser" ? "eraser-warning" : ""}`}
        >
          {hint}
        </p>
      )}
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
          <a
            href={selected.url}
            download={selected.file.name}
            aria-label={t.download}
          >
            <Download size={16} />
            {e.originalDownload}
          </a>
          <button onClick={onHistory}>{t.history}</button>
          <p className="export-note">{e.exportNote}</p>
        </div>
      )}
      {note && (
        <div className="editor-notice" role="status">
          <Info size={15} />
          <span>{note}</span>
          <button onClick={() => setNote("")} aria-label={t.close}>
            <X size={14} />
          </button>
        </div>
      )}
      <div className="studio-document actual-document">
        {isPdf ? (
          <PdfViewport
            key={selected.id}
            file={selected.file}
            zoom={zoom}
            page={page}
            onPage={setPage}
            onCount={setCount}
            onScale={setActualScale}
            loading={s.loading}
            errorText={e.pageError}
            editing={{
              editor,
              tool,
              style,
              selectedId: selectedMark,
              onSelect: selectMark,
              onHint: () => setNote(e.textError),
              label: e.layer,
            }}
          />
        ) : ["jpg", "jpeg", "png"].includes(selected.kind) ? (
          <div className="studio-image image-preview">
            <img
              src={selected.url}
              alt={selected.file.name}
              style={{
                width: typeof zoom === "number" ? `${zoom * 100}%` : "100%",
                objectFit: "contain",
              }}
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
        <span
          className={`editor-save-state ${editor.dirty ? "unsaved" : ""}`}
          title={e.exportNote}
        >
          <span />
          {editor.annotations.length
            ? `${editor.annotations.length} ${e.annotationCount} · ${editor.dirty ? e.draft : e.exported}`
            : s.original}
          <Info size={12} />
        </span>
      </footer>
    </section>
  );
}
