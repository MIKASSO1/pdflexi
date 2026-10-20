import { lazy, Suspense } from "react";
import {
  ArrowRight,
  FilePlus2,
  FileText,
  ListFilter,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import type { Attachment } from "../lib/types";
import type { Locale } from "../data/languages";
import type { Copy } from "../data/copy";
import { startCopy } from "../data/editor";
import { formatBytes } from "../lib/files.mjs";
const PdfThumbnail = lazy(() => import("./PdfThumbnail"));
export function StartCard({
  locale,
  t,
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
  suggest,
  tools,
  demo,
  inputRef,
}: {
  locale: Locale;
  t: Copy;
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
  suggest: (id: string) => void;
  tools: () => void;
  demo: () => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const s = startCopy[locale],
    first = files.find((file) => file.id === selectedId) || files[0];
  return (
    <div className="start-screen" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="start-intro">
        <span className="start-eyebrow">
          <Sparkles size={16} /> PDFlexi Workspace
        </span>
        <h1>{s.title}</h1>
        <p>{s.lead}</p>
      </div>
      <section className="start-card" aria-label={t.workspace}>
        <div className="start-card-heading">
          <span>
            <span className="ready-dot" /> Lexi{" "}
            <span className="start-preview-label">
              •{" "}
              {locale === "ar"
                ? "معاينة"
                : locale === "fr"
                  ? "Aperçu"
                  : "Preview"}
            </span>
          </span>
          <button onClick={tools}>
            <ListFilter size={16} />
            {s.tools}
          </button>
        </div>
        {errors.length > 0 && (
          <div className="file-errors start-file-errors" role="alert">
            <div>
              <strong>{t.fileErrorTitle}</strong>
              <button
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
        <div className="start-columns">
          <div className="start-upload">
            <h2>
              <span>01</span>
              {s.upload}
            </h2>
            <div className={`start-dropzone ${first ? "has-file" : ""}`}>
              {!first ? (
                <button className="start-drop-button" onClick={upload}>
                  <span className="start-upload-icon">
                    <Upload size={25} />
                  </span>
                  <strong>{s.drop}</strong>
                  <span className="start-browse">
                    {s.browse}
                    <ArrowRight size={15} />
                  </span>
                  <small>{s.formats}</small>
                </button>
              ) : (
                <>
                  <div className="start-file-preview">
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
                      <FileText size={38} />
                    )}
                  </div>
                  <div className="start-file-details">
                    <span className="start-file-ready">
                      <ShieldCheck size={14} />
                      {s.ready}
                    </span>
                    <div className="start-file-list">
                      {files.map((file) => (
                        <div className="start-file" key={file.id}>
                          <button
                            className="start-file-select"
                            onClick={() => setSelectedId(file.id)}
                            aria-pressed={first?.id === file.id}
                          >
                            <bdi title={file.file.name}>{file.file.name}</bdi>
                            <small>{formatBytes(file.file.size)}</small>
                          </button>
                          <button
                            className="icon-button remove-file"
                            aria-label={`${t.remove}: ${file.file.name}`}
                            onClick={() => removeFile(file.id)}
                          >
                            <X size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button className="start-add-files" onClick={upload}>
                      <FilePlus2 size={16} />
                      {s.addMore}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          <form
            className="start-request"
            onSubmit={(event) => {
              event.preventDefault();
              if (files.length) send();
            }}
          >
            <label htmlFor="lexi-prompt">
              <span>02</span>
              {s.request}
            </label>
            <textarea
              ref={inputRef}
              id="lexi-prompt"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={8000}
              rows={5}
              placeholder={s.placeholder}
              dir="auto"
            />
            <div className="start-suggestions">
              <button
                type="button"
                onClick={() => suggest("summarize-contract")}
              >
                {s.summary}
              </button>
              <button type="button" onClick={() => suggest("translate-layout")}>
                {s.translate}
              </button>
              <button type="button" onClick={() => suggest("contract-risks")}>
                {s.extract}
              </button>
            </div>
            <button
              type="submit"
              className="start-submit"
              disabled={!files.length || !draft.trim()}
              title={!files.length ? s.needFile : undefined}
            >
              {s.send}
              <ArrowRight size={17} />
            </button>
          </form>
        </div>
        <p className="start-privacy">
          <ShieldCheck size={14} />
          {s.local}
        </p>
      </section>
      <button className="start-demo-link" onClick={demo}>
        <Sparkles size={15} />
        {s.demo}
        <ArrowRight size={15} />
      </button>
    </div>
  );
}
