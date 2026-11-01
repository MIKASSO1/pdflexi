import { lazy, Suspense, useLayoutEffect } from "react";
import {
  ArrowUpRight,
  FileText,
  Paperclip,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import type { Attachment } from "../../lib/types";
import type { Locale } from "../../data/languages";
import type { Copy } from "../../data/copy";
import type { Profile } from "../../data/profile";
import { formatBytes } from "../../lib/files.mjs";
import { heroChipTools, heroCopy } from "./heroCopy";

const PdfThumbnail = lazy(() => import("../../components/PdfThumbnail"));

export function Hero({
  locale,
  t,
  profile,
  files,
  selectedId,
  setSelectedId,
  errors,
  clearErrors,
  draft,
  setDraft,
  send,
  upload,
  removeFile,
  clearFiles,
  suggest,
  tools,
  demo,
  inputRef,
}: {
  locale: Locale;
  t: Copy;
  profile: Profile;
  files: Attachment[];
  selectedId: string | null;
  setSelectedId: (id: string) => void;
  errors: string[];
  clearErrors: () => void;
  draft: string;
  setDraft: (text: string) => void;
  send: () => void;
  upload: () => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  suggest: (id: string) => void;
  tools: () => void;
  demo: () => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const h = heroCopy[locale];
  const first = files.find((file) => file.id === selectedId) || files[0];

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    const resize = () => {
      input.style.height = "0px";
      input.style.height = `${Math.min(280, Math.max(104, input.scrollHeight))}px`;
      input.style.overflowY = input.scrollHeight > 280 ? "auto" : "hidden";
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [inputRef, draft, locale]);

  return (
    <section className="hero-card" aria-labelledby="hero-title">
      <div className="hero-glow" aria-hidden="true" />

      <button type="button" className="hero-pill" onClick={upload}>
        <span className="hero-pill-plus" aria-hidden="true">
          <Plus size={11} />
        </span>
        {h.pill}
        <ArrowUpRight size={12} aria-hidden="true" />
      </button>

      <h1 id="hero-title" className="hero-title">
        {h.title.replace("{name}", profile.name)}
      </h1>
      <p className="hero-from">{h.from.replace("{city}", profile.city)}</p>
      <p className="hero-lead">{h.lead}</p>

      {errors.length > 0 && (
        <div className="file-errors hero-errors" role="alert">
          <div>
            <strong>{t.fileErrorTitle}</strong>
            <button
              type="button"
              className="icon-button"
              aria-label={t.close}
              onClick={clearErrors}
            >
              <X size={16} />
            </button>
          </div>
          <ul>
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="hero-panels">
        <form
          className="hero-panel hero-composer"
          onSubmit={(event) => {
            event.preventDefault();
            send();
          }}
        >
          <div className="hero-modes">
            <span className="hero-mode">
              <i aria-hidden="true" />
              {h.mode}
            </span>
            <button type="button" onClick={upload}>
              {h.addPdf}
            </button>
            <button type="button" onClick={upload}>
              {h.image}
            </button>
            <button type="button" onClick={upload}>
              {h.doc}
            </button>
            <button type="button" className="hero-tools-chip" onClick={tools}>
              <Sparkles size={12} aria-hidden="true" />
              {h.task}
            </button>
          </div>

          <label className="sr-only" htmlFor="lexi-prompt">
            {h.request}
          </label>
          <textarea
            ref={inputRef}
            id="lexi-prompt"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            maxLength={8000}
            rows={4}
            placeholder={h.placeholder}
            dir="auto"
            aria-describedby="hero-message-hint"
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                send();
              }
            }}
          />

          <div className="hero-composer-foot">
            <span className="hero-limit">
              <span className="hero-limit-icon" aria-hidden="true">
                <Paperclip size={12} />
              </span>
              {h.limit}
            </span>
            <button
              type="submit"
              className="hero-send"
              disabled={!draft.trim()}
              aria-describedby="hero-message-hint"
            >
              {h.send}
              <Send size={14} aria-hidden="true" />
            </button>
          </div>
          <p className="sr-only" id="hero-message-hint">
            {h.hint}
          </p>
        </form>

        <div className="hero-panel hero-drop">
          <div className="hero-drop-head">
            <span>{h.drop}</span>
            <button type="button" className="hero-choose" onClick={upload}>
              <Upload size={13} aria-hidden="true" />
              {h.choose}
            </button>
          </div>
          <span className="hero-formats">{h.formats}</span>

          <div className={`hero-dropzone ${first ? "has-file" : ""}`}>
            {first ? (
              <>
                <div className="hero-preview">
                  {first.kind === "pdf" ? (
                    <Suspense fallback={<FileText size={30} />}>
                      <PdfThumbnail
                        key={first.id}
                        file={first.file}
                        label={first.file.name}
                      />
                    </Suspense>
                  ) : ["png", "jpg", "jpeg"].includes(first.kind) ? (
                    <img src={first.url} alt={first.file.name} />
                  ) : (
                    <FileText size={34} />
                  )}
                </div>
                <ul className="hero-file-list">
                  {files.map((file) => (
                    <li className="hero-file" key={file.id}>
                      <button
                        type="button"
                        className="hero-file-select"
                        onClick={() => setSelectedId(file.id)}
                        aria-pressed={first.id === file.id}
                      >
                        <FileText size={14} aria-hidden="true" />
                        <bdi title={file.file.name}>{file.file.name}</bdi>
                        <small>{formatBytes(file.file.size)}</small>
                      </button>
                      <button
                        type="button"
                        className="hero-file-remove remove-file"
                        aria-label={`${t.remove}: ${file.file.name}`}
                        onClick={() => removeFile(file.id)}
                      >
                        <X size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="hero-empty">
                <FileText size={14} aria-hidden="true" />
                {h.empty}
              </p>
            )}
          </div>

          <button
            type="button"
            className="hero-clear"
            onClick={clearFiles}
            disabled={!files.length}
          >
            {h.clear}
          </button>
          <p className="hero-drag-hint">{h.dragHint}</p>
        </div>
      </div>

      <div className="hero-chips" role="group" aria-label={h.suggestions}>
        {heroChipTools.map((id, index) => (
          <button type="button" key={id} onClick={() => suggest(id)}>
            {h.chips[index]}
          </button>
        ))}
      </div>

      <button type="button" className="hero-demo" onClick={demo}>
        <ShieldCheck size={13} aria-hidden="true" />
        {h.demo}
        <ArrowUpRight size={12} aria-hidden="true" />
      </button>
    </section>
  );
}
