import { ChevronDown, Globe2, Layers3, Menu, Plus } from "lucide-react";
import type { Copy } from "../../data/copy";
import type { Locale } from "../../data/languages";

export function TopBar({
  t,
  locale,
  executionLabel,
  onHow,
  onPlans,
  onExecution,
  onLanguage,
  onNewChat,
  onMenu,
}: {
  t: Copy;
  locale: Locale;
  executionLabel: string;
  onHow: () => void;
  onPlans: () => void;
  onExecution: () => void;
  onLanguage: () => void;
  onNewChat: () => void;
  onMenu: () => void;
}) {
  return (
    <header className="sh-topbar">
      <a
        className="sh-topbar-brand"
        href="#main-workspace"
        aria-label="PDFlexi"
      >
        <span className="sh-brand-mark">P</span>
        <span>PDFlexi.</span>
      </a>

      <nav className="sh-topnav" aria-label={t.workspace}>
        <a className="is-active" href="#main-workspace">
          <span className="sh-ws-icon" aria-hidden="true" />
          {t.workspace}
        </a>
        <button type="button" onClick={onHow}>
          {t.how}
        </button>
        <button type="button" onClick={onPlans}>
          {t.pricing}
        </button>
      </nav>

      <div className="sh-topbar-actions">
        <button
          type="button"
          className="sh-square-btn"
          onClick={onExecution}
          aria-label={executionLabel}
          title={executionLabel}
        >
          <Layers3 size={15} />
        </button>
        <button
          type="button"
          className="sh-lang"
          onClick={onLanguage}
          aria-label={t.language}
        >
          <Globe2 size={14} />
          <span>{locale.toUpperCase()}</span>
          <ChevronDown size={10} />
        </button>
        <button type="button" className="sh-new-chat" onClick={onNewChat}>
          <Plus size={14} />
          <span>{t.newChat}</span>
        </button>
        <button
          type="button"
          className="sh-menu"
          onClick={onMenu}
          aria-label="Menu"
        >
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
}
