import { toolDefinitions } from "../../packages/tools/src/index.ts";
import { executionCopy } from "../i18n/execution";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  LockKeyhole,
  Search,
  Sparkles,
} from "lucide-react";
import registry from "../data/capabilities.json";
import type { Locale } from "../data/languages";
import type { Copy } from "../data/copy";
import type { Capability } from "../lib/types";
import { CapabilityIcon } from "./Icon";
export function Capabilities({
  locale,
  t,
  onSelect,
  tier,
  compact = false,
  activeId,
}: {
  locale: Locale;
  t: Copy;
  onSelect: (c: Capability) => void;
  tier: "free" | "pro";
  compact?: boolean;
  activeId?: string | null;
}) {
  const [query, setQuery] = useState("");
  const [scrollable, setScrollable] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = listRef.current;
    if (!element) return;
    element.scrollTop = 0;
    const update = () =>
      setScrollable(element.scrollHeight > element.clientHeight + 1);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [query, locale, tier]);
  const list = registry.filter(
    (c) =>
      c.tier === tier &&
      `${c.name[locale]} ${c.name.en} ${c.name.ar}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <div
      className={`${tier === "free" ? "free-panel" : "pro-panel"} ${compact ? "compact-panel" : ""}`}
    >
      {tier === "pro" && (
        <div className="insights-eyebrow">
          <Sparkles size={14} /> PDFlexi Insights
        </div>
      )}
      <div className="panel-title">
        <h2>{tier === "free" ? t.freeTools : t.proTitle}</h2>
        {tier === "free" ? (
          <span className="count-badge">20</span>
        ) : (
          <span className="pro-badge">PRO</span>
        )}
      </div>
      <p className="panel-subtitle">{tier === "free" ? t.freeSub : t.proSub}</p>
      {tier === "free" && (
        <label className="tool-search">
          <Search size={16} />
          <input
            placeholder={t.search}
            aria-label={t.search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      )}
      <div
        className={tier === "free" ? "free-list" : "pro-list"}
        ref={listRef}
        role="region"
        aria-label={tier === "free" ? t.freeTools : t.proTitle}
        tabIndex={0}
      >
        {list.map((c) => (
          <button
            key={c.id}
            data-capability={c.id}
            data-tier={tier}
            className={tier === "free" ? "free-tool" : "pro-tool"}
            onClick={() => onSelect(c)}
            aria-pressed={activeId === c.id}
            title={`${c.description[locale]} — ${toolDefinitions.find((tool) => tool.id === c.id)?.status === "ready" ? executionCopy[locale].ready : executionCopy[locale].planned}`}
          >
            {tier === "free" ? (
              <>
                <span className="free-icon">
                  <CapabilityIcon name={c.icon} />
                </span>
                <span className="tool-names">
                  <strong>{c.name[locale]}</strong>
                  <small>
                    {toolDefinitions.find((tool) => tool.id === c.id)
                      ?.status === "ready"
                      ? executionCopy[locale].ready
                      : executionCopy[locale].planned}
                  </small>
                  {locale !== "en" && (
                    <small lang="en" dir="ltr">
                      {c.name.en}
                    </small>
                  )}
                </span>
                <ArrowUpRight className="tool-arrow" size={14} />
              </>
            ) : (
              <>
                <div className="pro-top">
                  <span className="pro-icon">
                    <CapabilityIcon name={c.icon} />
                  </span>
                  <span className="pro-status">
                    <LockKeyhole size={11} />
                    <span className="pro-badge">PRO</span>
                  </span>
                </div>
                <h3>{c.name[locale]}</h3>
                <p>{c.description[locale]}</p>
              </>
            )}
          </button>
        ))}
        {!list.length && <p className="empty-search">{t.noTools}</p>}
      </div>
      {scrollable && (
        <div className="sidebar-scroll-cue">
          <ChevronDown size={13} />
          {t.scrollMore}
        </div>
      )}
      <p className="panel-footnote">
        {tier === "free" ? t.toolHint : t.proFoot}
      </p>
    </div>
  );
}
