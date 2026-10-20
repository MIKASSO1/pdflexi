import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  FileText,
  Globe2,
  Info,
  Layers3,
  ListFilter,
  Menu,
  MessageSquare,
  Plus,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { LiveDemo } from "./components/LiveDemo";
import { experience } from "./data/experience";
import { translations } from "./data/copy";
import { languages } from "./data/languages";
import type { Locale } from "./data/languages";
import registry from "./data/capabilities.json";
import type { Attachment, Capability, Message } from "./lib/types";
import {
  extension,
  fileKey,
  formatBytes,
  MAX_FILES,
  validateMetadata,
} from "./lib/files.mjs";
import { Capabilities } from "./components/Capabilities";
import { Chat } from "./components/Chat";
import { Dialog } from "./components/Dialog";
import { DocumentCanvas } from "./components/DocumentCanvas";

type Modal =
  | "languages"
  | "how"
  | "plans"
  | "privacy"
  | "capabilities"
  | "reset"
  | "files"
  | "history"
  | "canvas"
  | "menu"
  | null;
function savedLocale(): Locale {
  try {
    const value = localStorage.getItem("pdflexi:locale");
    return value === "ar" || value === "fr" ? value : "en";
  } catch {
    return "en";
  }
}
export default function App() {
  const [locale, setLocale] = useState<Locale>(savedLocale),
    [modal, setModal] = useState<Modal>(null),
    [capTier, setCapTier] = useState<"free" | "pro">("free");
  const [draft, setDraft] = useState(""),
    [messages, setMessages] = useState<Message[]>([]),
    [files, setFiles] = useState<Attachment[]>([]),
    [selectedId, setSelectedId] = useState<string | null>(null),
    [notice, setNotice] = useState(""),
    [fileErrors, setFileErrors] = useState<string[]>([]),
    [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null),
    prompt = useRef<HTMLTextAreaElement>(null),
    filesRef = useRef<Attachment[]>([]),
    uploadQueue = useRef(Promise.resolve()),
    dragDepth = useRef(0);
  const w = experience[locale];
  const t = {
    ...translations[locale],
    conversation: w.chat,
    companion: w.agentPending,
    welcome: w.welcome,
    placeholder: w.placeholder,
    canvas: "Live Canvas",
  };
  const [mobilePane, setMobilePane] = useState<"chat" | "files">("chat");
  const [hasStarted, setHasStarted] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [demoStage, setDemoStage] = useState(0);
  const isLive = demoMode || (hasStarted && files.length > 0);
  useEffect(() => {
    if (isLive) window.scrollTo({ top: 0, behavior: "instant" });
  }, [isLive]);
  useEffect(() => {
    if (!demoMode) {
      setDemoStage(0);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDemoStage(3);
      return;
    }
    const timers = [450, 1100, 1800].map((delay, index) =>
      setTimeout(() => setDemoStage(index + 1), delay),
    );
    return () => timers.forEach(clearTimeout);
  }, [demoMode]);
  const demoMessages: Message[] = [
    { id: "sample-request", role: "user", content: w.demoRequest },
    { id: "sample-response", role: "lexi", content: w.demoReply },
  ];
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem("pdflexi:locale", locale);
    } catch {
      /* storage can be unavailable */
    }
  }, [locale]);
  useEffect(
    () => () => {
      filesRef.current.forEach((f) => URL.revokeObjectURL(f.url));
    },
    [],
  );
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 6000);
    return () => clearTimeout(timer);
  }, [notice]);
  const updateFiles = (next: Attachment[]) => {
    filesRef.current = next;
    setFiles(next);
    if (!next.length) setHasStarted(false);
  };
  const upload = () => fileInput.current?.click();
  const addFiles = (incoming: File[]) => {
    uploadQueue.current = uploadQueue.current
      .then(async () => {
        const current = [...filesRef.current],
          errors: string[] = [];
        let added = 0;
        for (const file of incoming) {
          if (current.length >= MAX_FILES) {
            errors.push(t.limit);
            break;
          }
          const invalid = validateMetadata(file);
          if (invalid) {
            errors.push(`${file.name}: ${t[invalid]}`);
            continue;
          }
          if (current.some((f) => fileKey(f.file) === fileKey(file))) {
            errors.push(`${file.name}: ${t.duplicate}`);
            continue;
          }
          const kind = extension(file.name);
          try {
            if (kind === "pdf") {
              const header = new TextDecoder().decode(
                await file.slice(0, 1024).arrayBuffer(),
              );
              if (!header.includes("%PDF-")) {
                errors.push(`${file.name}: ${t.badPdf}`);
                continue;
              }
            }
            current.push({
              id: crypto.randomUUID(),
              file,
              url: URL.createObjectURL(file),
              kind,
            });
            added++;
          } catch {
            errors.push(`${file.name}: ${t.readError}`);
          }
        }
        updateFiles(current);
        setFileErrors(errors);
        if (added) {
          setSelectedId(current[current.length - added].id);
          setNotice(t.added);
          setMobilePane("chat");
        }
      })
      .catch(() => {
        setFileErrors([t.readError]);
      });
  };
  const removeFile = (id: string) => {
    const old = filesRef.current.find((f) => f.id === id);
    updateFiles(filesRef.current.filter((f) => f.id !== id));
    if (old) URL.revokeObjectURL(old.url);
    if (id === selectedId) setSelectedId(null);
  };
  const chooseCapability = (capability: Capability) => {
    setMobilePane("chat");
    setDraft(capability.prompt[locale]);
    setModal(null);
    setNotice(t.selected);
    window.setTimeout(() => {
      prompt.current?.focus({ preventScroll: true });
      prompt.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "center",
      });
    }, 60);
  };
  const suggest = (id: string) => {
    const cap = registry.find((c) => c.id === id);
    if (cap) chooseCapability(cap);
  };
  const send = () => {
    if (!draft.trim()) return;
    const text = draft.trim();
    setDemoMode(false);
    if (files.length) setHasStarted(true);
    setMessages((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        attachmentNames: files.map((f) => f.file.name),
      },
      { id: crypto.randomUUID(), role: "lexi", content: t.reply },
    ]);
    setDraft("");
  };
  const newChat = () => {
    setMobilePane("chat");
    if (messages.length || draft.trim() || demoMode) setModal("reset");
    else {
      prompt.current?.focus();
      setNotice(t.resetNotice);
    }
  };
  const openCapabilities = (tier: "free" | "pro") => {
    setCapTier(tier);
    setModal("capabilities");
  };
  const reset = () => {
    setHasStarted(false);
    setMobilePane("chat");
    setDemoMode(false);
    setMessages([]);
    setDraft("");
    setModal(null);
    setNotice(t.resetNotice);
  };
  const canvasProps = {
    onHistory: () => setModal("history"),
    t,
    files,
    selectedId,
    setSelectedId,
    removeFile,
    upload,
  };
  return (
    <div
      className="app"
      onDragEnter={(e) => {
        if (e.dataTransfer.types.includes("Files")) {
          e.preventDefault();
          dragDepth.current++;
          setDragging(true);
        }
      }}
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes("Files")) e.preventDefault();
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        dragDepth.current = Math.max(0, dragDepth.current - 1);
        if (!dragDepth.current) setDragging(false);
      }}
      onDrop={(e) => {
        if (!e.dataTransfer.types.includes("Files")) return;
        e.preventDefault();
        dragDepth.current = 0;
        setDragging(false);
        addFiles(Array.from(e.dataTransfer.files));
      }}
    >
      <div className="aurora-background" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <a className="skip-link" href="#main-workspace">
        {t.workspace}
      </a>
      <header className="site-header">
        <div className="header-inner">
          <div className="header-lockup">
            <a className="brand" href="#main-workspace" aria-label="PDFlexi">
              <span className="brand-icon">
                <FileText size={22} />
              </span>
              <span>
                PDF<span className="brand-light">lexi</span>
                <i />
              </span>
            </a>
            <div
              className="header-promise"
              dir={locale === "ar" ? "rtl" : "ltr"}
            >
              <h1>{w.hero}</h1>
            </div>
          </div>
          <nav className="desktop-navigation" aria-label={t.workspace}>
            <a className="nav-active" href="#main-workspace">
              <MessageSquare size={16} />
              {t.workspace}
            </a>
            <button onClick={() => setModal("how")}>{t.how}</button>
            <button onClick={() => setModal("plans")}>{t.pricing}</button>
          </nav>
          <div className="header-actions">
            <button
              className="language-button"
              onClick={() => setModal("languages")}
              aria-label={t.language}
            >
              <Globe2 size={17} />
              <span>{locale.toUpperCase()}</span>
              <ChevronDown size={12} />
            </button>
            <button className="new-chat-button" onClick={newChat}>
              <Plus size={16} />
              <span>{t.newChat}</span>
            </button>
            <button
              className="mobile-menu-button icon-button"
              onClick={() => setModal("menu")}
              aria-label="Menu"
            >
              <Menu size={21} />
            </button>
          </div>
        </div>
      </header>
      <div className={`workspace-layout ${isLive ? "is-live" : "is-entry"}`}>
        <aside className="sidebar left-sidebar" aria-label={t.freeTools}>
          <Capabilities
            locale={locale}
            t={t}
            onSelect={chooseCapability}
            tier="free"
          />
          <div className="sidebar-trust">
            <ShieldCheck size={16} />
            <div>
              <strong>{t.privacy}</strong>
              <p>{t.privacySub}</p>
            </div>
          </div>
          <button className="sidebar-about" onClick={() => setModal("privacy")}>
            PDFlexi · {t.privacy}
            <ArrowRight size={12} />
          </button>
        </aside>
        <main className="middle-column" id="main-workspace">
          <div className="mobile-shortcuts">
            <button onClick={() => openCapabilities("free")}>
              <ListFilter size={16} />
              {t.freeTools}
              <span>20</span>
            </button>
            <button onClick={() => openCapabilities("pro")}>
              <Sparkles size={16} />
              {t.smart}
              <span className="pro-badge">PRO</span>
            </button>
          </div>
          {isLive && (
            <section
              className="experience-heading live-toolbar"
              aria-label="Live Canvas"
            >
              <h2>Live Canvas</h2>
              <div className="live-tools">
                <button onClick={() => openCapabilities("free")}>
                  {t.freeTools} <b>20</b>
                </button>
                <button onClick={() => openCapabilities("pro")}>
                  {t.smart} <b>10</b>
                </button>
                <button onClick={upload}>
                  <Plus size={16} />
                  {t.addFiles}
                </button>
              </div>
            </section>
          )}
          {!isLive && (
            <div
              className="entry-pane-switch"
              role="group"
              aria-label={t.workspace}
            >
              <button
                aria-pressed={mobilePane === "chat"}
                aria-controls="lexi-chat-panel"
                onClick={() => setMobilePane("chat")}
              >
                <MessageSquare size={16} />
                Lexi
              </button>
              <button
                aria-pressed={mobilePane === "files"}
                aria-controls="document-upload-panel"
                onClick={() => setMobilePane("files")}
              >
                <Upload size={16} />
                {t.files}
                {files.length > 0 && <span>{files.length}</span>}
              </button>
            </div>
          )}
          <div
            className={`conversation-workspace ${isLive ? "is-split" : "entry-workspace"}`}
            data-mobile-pane={mobilePane}
          >
            <div
              className="conversation-pane"
              id="lexi-chat-panel"
              dir={locale === "ar" ? "rtl" : "ltr"}
            >
              <Chat
                t={t}
                messages={demoMode ? demoMessages : messages}
                demoLabel={demoMode ? w.demoTag : undefined}
                draft={draft}
                setDraft={setDraft}
                send={send}
                attach={upload}
                newChat={newChat}
                suggest={suggest}
                attachments={files}
                inputRef={prompt}
              />
              {!isLive && (
                <button
                  className="live-demo-cta"
                  onClick={() => setDemoMode(true)}
                >
                  <Sparkles size={17} />
                  <strong>{w.demoCta}</strong>
                  <span>{w.demoTag}</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
            {!isLive && (
              <div
                className="entry-upload-pane"
                id="document-upload-panel"
                dir={locale === "ar" ? "rtl" : "ltr"}
              >
                <section className="upload-first" aria-label={w.uploadTitle}>
                  <div className="upload-step">{w.step}</div>
                  <div className="upload-first-main">
                    <div className="upload-glow-icon">
                      <Upload size={30} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2>{w.uploadTitle}</h2>
                      <p>{w.uploadLead}</p>
                    </div>
                    <button className="primary-button" onClick={upload}>
                      {w.browse}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                  <p className="drop-instruction">{w.drop}</p>
                  <div className="upload-first-footer">
                    <span>
                      <ShieldCheck size={14} />
                      {w.local}
                    </span>
                    <span>{t.formats}</span>
                  </div>
                  {files.length > 0 && (
                    <div className="entry-file-chips">
                      {files.map((f) => (
                        <span key={f.id}>
                          <FileText size={14} />
                          <bdi>{f.file.name}</bdi>
                          <button
                            className="icon-button"
                            onClick={() => removeFile(f.id)}
                            aria-label={`${t.remove}: ${f.file.name}`}
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </section>
                <div className="entry-capability-links">
                  <button onClick={() => openCapabilities("free")}>
                    <ListFilter size={15} />
                    {t.freeTools} <b>20</b>
                  </button>
                  <button onClick={() => openCapabilities("pro")}>
                    <Sparkles size={15} />
                    {t.smart} <span className="pro-badge">PRO</span>
                  </button>
                </div>
                {files.length > 0 && (
                  <DocumentCanvas
                    {...canvasProps}
                    onExpand={() => setModal("canvas")}
                  />
                )}
              </div>
            )}
            {isLive && (
              <div
                className="live-canvas-pane"
                dir={locale === "ar" ? "rtl" : "ltr"}
              >
                {demoMode ? (
                  <LiveDemo
                    words={w}
                    stage={demoStage}
                    back={() => setDemoMode(false)}
                  />
                ) : (
                  <>
                    <div className="processing-pending">
                      <ShieldCheck size={18} />
                      <div>
                        <strong>{w.pending}</strong>
                        <p>{w.pendingBody}</p>
                      </div>
                    </div>
                    <DocumentCanvas
                      {...canvasProps}
                      onExpand={() => setModal("canvas")}
                    />
                  </>
                )}
              </div>
            )}
          </div>
          <div className="workspace-meta">
            <span>
              <ShieldCheck size={13} />
              {t.localShort}
            </span>
            <button onClick={() => setModal("files")}>
              <Layers3 size={13} />
              {files.length} {t.fileCount}
            </button>
            <span className="execution-status">{t.previewLabel}</span>
          </div>
          {fileErrors.length > 0 && (
            <section className="file-errors" role="alert">
              <div>
                <Info size={17} />
                <strong>{t.fileErrorTitle}</strong>
                <button
                  className="icon-button"
                  aria-label={t.close}
                  onClick={() => setFileErrors([])}
                >
                  <X size={16} />
                </button>
              </div>
              <ul>
                {fileErrors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </section>
          )}
          <footer className="workspace-footer">
            <span>{t.footer}</span>
            <button onClick={() => setModal("privacy")}>
              PDFlexi © 2026
              <ShieldCheck size={12} />
            </button>
          </footer>
        </main>
        <aside className="sidebar right-sidebar" aria-label={t.proTitle}>
          <Capabilities
            locale={locale}
            t={t}
            onSelect={chooseCapability}
            tier="pro"
          />
          <p className="right-disclaimer">{t.legal}</p>
        </aside>
      </div>
      <input
        ref={fileInput}
        className="sr-only"
        type="file"
        multiple
        accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png"
        aria-label={t.upload}
        tabIndex={-1}
        onChange={(e) => {
          addFiles(Array.from(e.target.files || []));
          e.target.value = "";
        }}
      />
      {modal === "languages" && (
        <Dialog
          title={t.languagesTitle}
          subtitle={t.languagesSub}
          closeLabel={t.close}
          onClose={() => setModal(null)}
          wide
        >
          <div className="language-grid">
            {languages.map((language) => (
              <button
                key={language.code}
                className={`language-option ${language.code === locale ? "chosen" : ""}`}
                disabled={!language.ready}
                onClick={() => {
                  setLocale(language.code as Locale);
                  setModal(null);
                }}
              >
                <span>
                  <strong lang={language.code}>{language.native}</strong>
                  <small>{language.name}</small>
                </span>
                {language.ready ? (
                  language.code === locale ? (
                    <Check size={17} />
                  ) : (
                    <span className="available-dot" />
                  )
                ) : (
                  <span className="planned-label">{t.planned}</span>
                )}
              </button>
            ))}
          </div>
        </Dialog>
      )}
      {modal === "how" && (
        <Dialog
          title={t.howTitle}
          subtitle={t.howSub}
          closeLabel={t.close}
          onClose={() => setModal(null)}
        >
          <div className="how-steps">
            {[
              [t.how1, t.how1body],
              [t.how2, t.how2body],
              [t.how3, t.how3body],
            ].map(([title, body], i) => (
              <div key={title}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="modal-notice">
            <Info size={16} />
            {t.welcomeNote}
          </div>
        </Dialog>
      )}
      {modal === "plans" && (
        <Dialog
          title={t.plansTitle}
          subtitle={t.plansSub}
          closeLabel={t.close}
          onClose={() => setModal(null)}
          wide
        >
          <div className="plans-grid">
            <div className="plan-card">
              <span className="plan-icon">
                <FileText size={24} />
              </span>
              <h3>{t.essentials}</h3>
              <strong>{t.essentialPrice}</strong>
              <p>{t.essentialsBody}</p>
              <span className="plan-status">20 {t.soon}</span>
            </div>
            <div className="plan-card premium">
              <span className="plan-icon">
                <Sparkles size={24} />
              </span>
              <h3>{t.intelligent}</h3>
              <strong>{t.intelligentPrice}</strong>
              <p>{t.intelligentBody}</p>
              <span className="plan-status">10 {t.soon}</span>
            </div>
          </div>
          <p className="billing-note">
            <ShieldCheck size={14} />
            {t.noBilling}
          </p>
        </Dialog>
      )}
      {modal === "privacy" && (
        <Dialog
          title={t.privacyTitle}
          closeLabel={t.close}
          onClose={() => setModal(null)}
        >
          <div className="privacy-modal-icon">
            <ShieldCheck size={32} />
          </div>
          <p className="privacy-body">{t.privacyBody}</p>
        </Dialog>
      )}
      {modal === "reset" && (
        <Dialog
          title={t.clearTitle}
          subtitle={t.clearBody}
          closeLabel={t.close}
          onClose={() => setModal(null)}
        >
          <div className="dialog-buttons">
            <button className="secondary-button" onClick={() => setModal(null)}>
              {t.cancel}
            </button>
            <button className="primary-button" onClick={reset}>
              {t.confirm}
            </button>
          </div>
        </Dialog>
      )}
      {modal === "capabilities" && (
        <Dialog
          title={t.capabilitiesTitle}
          subtitle={t.capabilitiesSub}
          closeLabel={t.close}
          onClose={() => setModal(null)}
          wide
        >
          <div
            className="capability-tabs"
            role="group"
            aria-label={t.allCapabilities}
          >
            <button
              aria-pressed={capTier === "free"}
              onClick={() => setCapTier("free")}
            >
              {t.freeTools}
              <span>20</span>
            </button>
            <button
              aria-pressed={capTier === "pro"}
              onClick={() => setCapTier("pro")}
            >
              {t.proTitle}
              <span>10</span>
            </button>
          </div>
          <Capabilities
            key={capTier}
            locale={locale}
            t={t}
            onSelect={chooseCapability}
            tier={capTier}
            compact
          />
        </Dialog>
      )}
      {modal === "files" && (
        <Dialog
          title={`${t.files} · ${files.length}`}
          subtitle={t.local}
          closeLabel={t.close}
          onClose={() => setModal(null)}
        >
          <div className="modal-file-list">
            {files.length ? (
              files.map((file) => (
                <div key={file.id}>
                  <FileText size={22} />
                  <span>
                    <bdi>{file.file.name}</bdi>
                    <small>{formatBytes(file.file.size)}</small>
                  </span>
                  <button
                    className="icon-button"
                    onClick={() => removeFile(file.id)}
                    aria-label={`${t.remove}: ${file.file.name}`}
                  >
                    <X size={17} />
                  </button>
                </div>
              ))
            ) : (
              <p>{t.emptyFiles}</p>
            )}
          </div>
          <button className="primary-button" onClick={upload}>
            <Upload size={16} />
            {t.addFiles}
          </button>
        </Dialog>
      )}
      {modal === "history" && (
        <Dialog
          title={t.history}
          subtitle={t.historyNote}
          closeLabel={t.close}
          onClose={() => setModal(null)}
        >
          <div className="history-empty">
            <Layers3 size={28} />
            <h3>{t.historyEmpty}</h3>
          </div>
          <div className="history-originals">
            {files.map((file) => (
              <button
                key={file.id}
                onClick={() => {
                  setSelectedId(file.id);
                  setModal(null);
                }}
              >
                <FileText size={20} />
                <span>
                  <bdi>{file.file.name}</bdi>
                  <small>
                    {t.original} · {formatBytes(file.file.size)}
                  </small>
                </span>
                <Check size={15} />
              </button>
            ))}
          </div>
        </Dialog>
      )}
      {modal === "canvas" && (
        <Dialog
          title={t.canvas}
          closeLabel={t.close}
          onClose={() => setModal(null)}
          wide
        >
          <DocumentCanvas
            {...canvasProps}
            expanded
            onClose={() => setModal(null)}
          />
        </Dialog>
      )}
      {modal === "menu" && (
        <Dialog
          title="PDFlexi"
          closeLabel={t.close}
          onClose={() => setModal(null)}
        >
          <nav className="mobile-nav">
            <button onClick={() => setModal(null)}>
              <MessageSquare size={19} />
              {t.workspace}
            </button>
            <button onClick={() => setModal("how")}>
              <Info size={19} />
              {t.how}
            </button>
            <button onClick={() => setModal("plans")}>
              <Sparkles size={19} />
              {t.pricing}
            </button>
            <button onClick={() => setModal("languages")}>
              <Globe2 size={19} />
              {t.language}
            </button>
            <button
              onClick={() => {
                setModal(null);
                newChat();
              }}
            >
              <Plus size={19} />
              {t.newChat}
            </button>
          </nav>
        </Dialog>
      )}
      {notice && (
        <div className="toast" role="status">
          <span className="toast-check">
            <Check size={15} />
          </span>
          <p>{notice}</p>
          <button
            className="icon-button"
            onClick={() => setNotice("")}
            aria-label={t.close}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {dragging && (
        <div className="global-drop-overlay" aria-hidden="true">
          <div>
            <Upload size={36} />
            <h2>{t.upload}</h2>
            <p>{t.formats}</p>
          </div>
        </div>
      )}
    </div>
  );
}
