import { useEffect, useRef } from "react";
import {
  ArrowUp,
  ArrowUpRight,
  FileText,
  Paperclip,
  Plus,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import type { Copy } from "../data/copy";
import type { Attachment, Message } from "../lib/types";
type Props = {
  t: Copy;
  demoLabel?: string;
  messages: Message[];
  draft: string;
  setDraft: (s: string) => void;
  send: () => void;
  attach: () => void;
  newChat: () => void;
  suggest: (id: string) => void;
  attachments: Attachment[];
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
};
export function Chat({
  t,
  demoLabel,
  messages,
  draft,
  setDraft,
  send,
  attach,
  newChat,
  suggest,
  attachments,
  inputRef,
}: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = messages.length ? el.scrollHeight : 0;
  }, [messages]);
  return (
    <section className="chat-card" aria-label={t.conversation}>
      <div className="chat-heading">
        <div className="lexi-mark">
          <Sparkles size={22} strokeWidth={1.7} />
        </div>
        <div>
          <h2>{t.conversation}</h2>
          <p>
            <span className="status-dot" />
            {t.companion}
          </p>
        </div>
        <button
          className="icon-button new-conversation"
          onClick={newChat}
          aria-label={t.newChat}
          title={t.newChat}
        >
          <Plus size={20} />
        </button>
      </div>
      <div
        className="chat-messages"
        ref={scroller}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {!messages.length ? (
          <>
            <div className="conversation-start">
              <span />
              {t.greeting}
              <span />
            </div>
            <div className="welcome-message">
              <span className="small-lexi">
                <Sparkles size={16} />
              </span>
              <div className="welcome-bubble">
                <h3>{t.welcomeTitle}</h3>
                <p>{t.welcome}</p>
              </div>
            </div>
            <div className="chat-inspiration">
              <span>{t.try}</span>
              <button onClick={() => suggest("merge")}>
                <span className="suggestion-dot blue" />
                {t.suggestion1}
                <ArrowUpRight size={15} />
              </button>
              <button onClick={() => suggest("summarize-contract")}>
                <span className="suggestion-dot amber" />
                {t.suggestion2}
                <ArrowUpRight size={15} />
              </button>
              <button onClick={() => suggest("translate-layout")}>
                <span className="suggestion-dot purple" />
                {t.suggestion3}
                <ArrowUpRight size={15} />
              </button>
            </div>
            <div className="preview-disclaimer">
              <span className="tiny-spark">
                <Sparkles size={13} />
              </span>
              <p>{t.welcomeNote}</p>
            </div>
          </>
        ) : (
          messages.map((m) => (
            <div className={`message ${m.role}`} key={m.id}>
              <span className={m.role === "lexi" ? "small-lexi" : "small-user"}>
                {m.role === "lexi" ? <Sparkles size={15} /> : "Y"}
              </span>
              <div className="message-content">
                <span className="message-name">
                  {m.role === "lexi" ? "Lexi" : t.you}
                </span>
                {m.role === "lexi" && (
                  <span className="not-executed">
                    {demoLabel || t.replyTitle}
                  </span>
                )}
                <p dir="auto" className="message-bubble">
                  {m.content}
                </p>
                {m.attachmentNames?.length ? (
                  <div className="message-attachments">
                    {m.attachmentNames.map((name, i) => (
                      <span key={`${name}-${i}`}>
                        <FileText size={12} />
                        <bdi>{name}</bdi>
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="chat-composer">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <label className="sr-only" htmlFor="lexi-prompt">
            {t.placeholder}
          </label>
          <textarea
            ref={inputRef}
            id="lexi-prompt"
            placeholder={t.placeholder}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={8000}
            rows={2}
            dir="auto"
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                !e.nativeEvent.isComposing
              ) {
                e.preventDefault();
                send();
              }
            }}
          />
          <div className="composer-toolbar">
            <button type="button" className="attach-button" onClick={attach}>
              <Paperclip size={16} />
              {t.attach}
              {attachments.length > 0 && (
                <span className="attachment-count">{attachments.length}</span>
              )}
            </button>
            <div className="composer-end">
              {draft && (
                <button
                  className="icon-button clear-draft"
                  type="button"
                  onClick={() => setDraft("")}
                  aria-label={t.clearDraft}
                >
                  <X size={14} />
                </button>
              )}
              <span className="enter-hint">{t.enter}</span>
              <button
                className="send-button"
                type="submit"
                disabled={!draft.trim()}
                aria-label={t.send}
              >
                <ArrowUp size={19} />
              </button>
            </div>
          </div>
        </form>
        <p className="composer-privacy">
          <ShieldCheck size={12} />
          {t.noSecrets}
        </p>
      </div>
    </section>
  );
}
