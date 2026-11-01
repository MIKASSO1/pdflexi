import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Folder,
  LayoutGrid,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";
import registry from "../../data/capabilities.json";
import type { Locale } from "../../data/languages";
import type { Profile } from "../../data/profile";
import type { Capability } from "../../lib/types";
import { CapabilityIcon } from "../../components/Icon";
import { pinnedToolIds, sampleProjects, shellCopy } from "./copy";

export function Sidebar({
  locale,
  profile,
  activeId,
  onSelect,
  onOpenTools,
  onNewTask,
  onMyPdfs,
  onUpgrade,
  onProject,
}: {
  locale: Locale;
  profile: Profile;
  activeId: string | null;
  onSelect: (capability: Capability) => void;
  onOpenTools: () => void;
  onNewTask: () => void;
  onMyPdfs: () => void;
  onUpgrade: () => void;
  onProject: (name: string) => void;
}) {
  const c = shellCopy[locale];
  const [query, setQuery] = useState("");
  const search = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        search.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const needle = query.trim().toLowerCase();
  const matches = useMemo(
    () =>
      needle
        ? registry
            .filter((cap) =>
              `${cap.name[locale]} ${cap.name.en} ${cap.name.ar}`
                .toLowerCase()
                .includes(needle),
            )
            .slice(0, 8)
        : [],
    [needle, locale],
  );
  const pinned = pinnedToolIds
    .map((id) => registry.find((cap) => cap.id === id))
    .filter((cap): cap is Capability => Boolean(cap));

  const choose = (capability: Capability) => {
    setQuery("");
    onSelect(capability);
  };

  return (
    <aside className="sh-sidebar" aria-label={c.navLabel}>
      <div className="sh-side-head">
        <a className="sh-brand" href="#main-workspace" aria-label="PDFlexi">
          <span className="sh-brand-mark">P</span>
          <span>PDFlexi.</span>
        </a>
        <button
          type="button"
          className="sh-ghost-btn"
          aria-label={c.backToTop}
          title={c.backToTop}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUpRight size={14} />
        </button>
      </div>

      <button type="button" className="sh-my-files" onClick={onMyPdfs}>
        <LayoutGrid size={15} />
        <span>{c.myPdfs}</span>
        <Menu size={14} aria-hidden="true" />
      </button>

      <button type="button" className="sh-new-task" onClick={onNewTask}>
        <span>{c.newTask}</span>
        <Plus size={18} />
      </button>

      <label className="sh-search">
        <Search size={14} aria-hidden="true" />
        <input
          ref={search}
          type="search"
          value={query}
          placeholder={c.search}
          aria-label={c.searchTools}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setQuery("");
          }}
        />
        <kbd>⌘K</kbd>
      </label>

      <section className="sh-section" aria-label={c.tools}>
        <h2>{c.tools}</h2>
        {needle ? (
          matches.length ? (
            matches.map((cap) => (
              <button
                type="button"
                key={cap.id}
                className="sh-nav-item"
                onClick={() => choose(cap)}
              >
                <span className="sh-nav-icon">
                  <CapabilityIcon name={cap.icon} />
                </span>
                <span>{cap.name[locale]}</span>
              </button>
            ))
          ) : (
            <p className="sh-empty">{c.noResults}</p>
          )
        ) : (
          <>
            <button
              type="button"
              className="sh-nav-item is-primary"
              onClick={onOpenTools}
            >
              <span className="sh-nav-icon is-green">
                <i />
              </span>
              <span>{c.aiTools}</span>
              <i className="sh-live-dot" aria-hidden="true" />
            </button>
            {pinned.map((cap) => (
              <button
                type="button"
                key={cap.id}
                className="sh-nav-item"
                aria-pressed={activeId === cap.id}
                onClick={() => choose(cap)}
              >
                <span className="sh-nav-icon is-folder">
                  <Folder size={14} />
                </span>
                <span>{cap.name[locale]}</span>
              </button>
            ))}
          </>
        )}
      </section>

      <section className="sh-section" aria-label={c.projects}>
        <h2>{c.projects}</h2>
        {sampleProjects.map((name) => (
          <button
            type="button"
            key={name}
            className="sh-nav-item"
            onClick={() => onProject(name)}
          >
            <span className="sh-nav-icon is-folder">
              <Folder size={14} />
            </span>
            <span>{name}</span>
          </button>
        ))}
      </section>

      <div className="sh-side-footer">
        <section className="sh-upgrade">
          <h2>{c.upgradeTitle}</h2>
          <p>{c.upgradeBody}</p>
          <button type="button" onClick={onUpgrade}>
            {c.upgradeCta}
          </button>
        </section>

        <div className="sh-user">
          <span className="sh-avatar" aria-hidden="true">
            {profile.name.charAt(0).toUpperCase()}
          </span>
          <span className="sh-user-text">
            <strong>{profile.name}</strong>
            <small>
              {c.freePlan} • {profile.city}
            </small>
          </span>
          <button
            type="button"
            className="sh-ghost-btn"
            aria-label={c.more}
            title={c.more}
            onClick={onMyPdfs}
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
