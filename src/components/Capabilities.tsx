import { useState } from "react";
import { ArrowUpRight, LockKeyhole, Search, Sparkles } from "lucide-react";
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
}: {
  locale: Locale;
  t: Copy;
  onSelect: (c: Capability) => void;
  tier: "free" | "pro";
  compact?: boolean;
}) {
  const [query, setQuery] = useState("");
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
      <div className={tier === "free" ? "free-list" : "pro-list"}>
        {list.map((c) => (
          <button
            key={c.id}
            data-capability={c.id}
            data-tier={tier}
            className={tier === "free" ? "free-tool" : "pro-tool"}
            onClick={() => onSelect(c)}
          >
            {tier === "free" ? (
              <>
                <span className="free-icon">
                  <CapabilityIcon name={c.icon} />
                </span>
                <span className="tool-names">
                  <strong>{c.name[locale]}</strong>
                  <small lang="en" dir="ltr">
                    {locale === "en" ? c.description.en : c.name.en}
                  </small>
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
      </div>
      {!list.length && <p className="empty-search">{t.noTools}</p>}
      <p className="panel-footnote">
        {tier === "free" ? t.toolHint : t.proFoot}
      </p>
    </div>
  );
}
