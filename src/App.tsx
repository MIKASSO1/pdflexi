import { StartCard } from "./components/StartCard";
import { useDocumentEdits } from "./features/editor/useDocumentEdits";
import { editorCopy } from "./data/editor";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
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
import type { Capability, Message } from "./lib/types";
import { formatBytes } from "./lib/files.mjs";
import { useAttachments } from "./features/attachments/useAttachments";
import { useConversation } from "./features/conversation/useConversation";
import { Capabilities } from "./components/Capabilities";
import { Chat } from "./components/Chat";
import { Dialog } from "./components/Dialog";
import { DocumentCanvas } from "./components/DocumentCanvas";

import { useExecution } from "./features/execution/useExecution";
import { executionCopy } from "./i18n/execution";
const ExecutionPanel = lazy(
  () => import("./features/execution/ExecutionPanel"),
);

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
  const edits = useDocumentEdits();
  const execution = useExecution();
  const [executionOpen, setExecutionOpen] = useState(false);
  const [locale, setLocale] = useState<Locale>(savedLocale),
    [modal, setModal] = useState<Modal>(null),
    [capTier, setCapTier] = useState<"free" | "pro">("free");
  const [notice, setNotice] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null),
    prompt = useRef<HTMLTextAreaElement>(null),
    dragDepth = useRef(0);
  const {
    draft,
    setDraft,
    messages,
    hasStarted,
    acknowledgeRequest,
    resetConversation,
  } = useConversation();
  const w = experience[locale];

  const t = {
    ...translations[locale],
    comingSoon: {
      en: "Coming soon",
      ar: "قريبًا",
      fr: "À venir",
    }[locale],
    replyNoFile: {
      en: "Message saved in this tab. AI replies are not connected yet, so this is not an AI-generated answer. You can attach a document whenever you’re ready.",
      ar: "حُفظت رسالتك في علامة التبويب هذه. ردود الذكاء الاصطناعي غير متصلة بعد؛ هذا إشعار استلام وليس إجابة مولّدة. يمكنك إرفاق مستند متى أردت.",
      fr: "Message conservé dans cet onglet. Les réponses IA ne sont pas encore connectées : ceci est un accusé de réception, pas une réponse générée. Vous pouvez joindre un document quand vous le souhaitez.",
    }[locale],
    conversation: w.chat,
    companion: w.agentPending,
    welcome: w.welcome,
    placeholder: w.placeholder,
    canvas: "Live Canvas",
  };

  const [activeCapabilityId, setActiveCapabilityId] = useState<string | null>(
    null,
  );
  const {
    files,
    selectedId,
    setSelectedId,
    fileErrors,
    clearErrors,
    addFiles,
    removeAttachment,
  } = useAttachments(t);
  const [demoMode, setDemoMode] = useState(false);
  const [demoStage, setDemoStage] = useState(0);

  const isLive = demoMode || hasStarted;

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
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 6000);
    return () => clearTimeout(timer);
  }, [notice]);
  const upload = () => fileInput.current?.click();
  const removeFile = (id: string) => {
    if (
      edits.controller(id).dirty &&
      !window.confirm(editorCopy[locale].discard)
    ) {
      return;
    }
    execution.reset();
    edits.remove(id);
    removeAttachment(id);
  };

  const chooseCapability = (capability: Capability) => {
    setActiveCapabilityId(capability.id);
    setDraft(capability.prompt[locale]);
    setModal(null);

    window.setTimeout(() => {
      prompt.current?.focus({ preventScroll: true });
      prompt.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "nearest",
      });
    }, 60);
  };

  const suggest = (id: string) => {
    const cap = registry.find((c) => c.id === id);
    if (cap) chooseCapability(cap);
  };

  const send = () => {
    if (!draft.trim()) return;
    if (execution.running) return;
    if (!files.length) {
      acknowledgeRequest(files, t.replyNoFile);
      setDemoMode(false);
      return;
    }
    const request = draft;
    if (acknowledgeRequest(files, t.reply)) {
      setDemoMode(false);
      void execution.propose(request, files).then((ready) => {
        if (ready) setExecutionOpen(true);
      });
    }
  };

  const newChat = () => {
    if (messages.length || draft.trim() || demoMode) {
      setModal("reset");
    } else {
      prompt.current?.focus();
      setNotice(t.resetNotice);
    }
  };

  const openCapabilities = (tier: "free" | "pro") => {
    setCapTier(tier);
    setModal("capabilities");
  };

  const reset = () => {
    execution.reset();
    setExecutionOpen(false);
    resetConversation();
    setDemoMode(false);
    setActiveCapabilityId(null);
    setModal(null);
    setNotice(t.resetNotice);
  };

  const canvasProps = {
    editor: edits.controller(selectedId || files[0]?.id || ""),
    locale,
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
              className="icon-button"
              onClick={() => setExecutionOpen(true)}
              aria-label={executionCopy[locale].title}
              title={executionCopy[locale].title}
            >
              <Layers3 size={20} />
            </button>
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
            activeId={activeCapabilityId}
            tier="free"
          />

          <button className="sidebar-about" onClick={() => setModal("privacy")}>
            <ShieldCheck size={14} />
            {t.privacy}
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
              <span className="coming-soon-badge">{t.comingSoon}</span>
            </button>
          </div>
          {executionOpen && !demoMode && !modal && (
            <Dialog
              title={executionCopy[locale].title}
              closeLabel={executionCopy[locale].close}
              onClose={() => setExecutionOpen(false)}
              wide
            >
              <Suspense
                fallback={<p role="status">{executionCopy[locale].running}</p>}
              >
                <ExecutionPanel
                  execution={execution}
                  files={files}
                  locale={locale}
                  initialTool={activeCapabilityId}
                  close={() => setExecutionOpen(false)}
                />
              </Suspense>
            </Dialog>
          )}
          {!isLive ? (
            <StartCard
              locale={locale}
              t={t}
              files={files}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              errors={fileErrors}
              clearErrors={clearErrors}
              draft={draft}
              setDraft={setDraft}
              send={send}
              upload={upload}
              removeFile={removeFile}
              suggest={suggest}
              tools={() => openCapabilities("free")}
              demo={() => setDemoMode(true)}
              inputRef={prompt}
            />
          ) : (
            <div
              className={`conversation-workspace is-split ${!demoMode && !files.length ? "is-chat-only" : ""}`}
            >
              <div
                className="conversation-pane"
                id="lexi-chat-panel"
                dir={locale === "ar" ? "rtl" : "ltr"}
              >
                <Chat
                  t={t}
                  locale={locale}
                  tools={() => openCapabilities("free")}
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
              </div>

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
                  <DocumentCanvas
                    {...canvasProps}
                    onExpand={() => setModal("canvas")}
                  />
                )}
              </div>
            </div>
          )}

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

          {isLive && fileErrors.length > 0 && (
            <section className="file-errors" role="alert">
              <div>
                <Info size={17} />
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
            activeId={activeCapabilityId}
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
            activeId={activeCapabilityId}
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
