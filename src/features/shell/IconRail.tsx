import {
  Droplet,
  LayoutGrid,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import type { Locale } from "../../data/languages";
import type { Profile } from "../../data/profile";
import { shellCopy } from "./copy";

export type RailActions = {
  privacy: () => void;
  smart: () => void;
  chat: () => void;
  watermark: () => void;
  tools: () => void;
  files: () => void;
  account: () => void;
};

export function IconRail({
  locale,
  profile,
  actions,
}: {
  locale: Locale;
  profile: Profile;
  actions: RailActions;
}) {
  const c = shellCopy[locale];
  return (
    <aside className="sh-rail" aria-label={c.railLabel}>
      <div className="sh-rail-group">
        <button
          type="button"
          className="sh-rail-btn is-danger"
          aria-label={c.railPrivacy}
          title={c.railPrivacy}
          onClick={actions.privacy}
        >
          <ShieldCheck size={17} />
        </button>
        <button
          type="button"
          className="sh-rail-btn is-gold"
          aria-label={c.railSmart}
          title={c.railSmart}
          onClick={actions.smart}
        >
          <Sparkles size={17} />
        </button>
        <button
          type="button"
          className="sh-rail-btn"
          aria-label={c.railChat}
          title={c.railChat}
          onClick={actions.chat}
        >
          <MessageSquare size={17} />
        </button>
        <button
          type="button"
          className="sh-rail-btn is-blue"
          aria-label={c.railWatermark}
          title={c.railWatermark}
          onClick={actions.watermark}
        >
          <Droplet size={17} />
        </button>
      </div>

      <div className="sh-rail-group is-bottom">
        <button
          type="button"
          className="sh-rail-bolt"
          aria-label={c.railTools}
          title={c.railTools}
          onClick={actions.tools}
        >
          <Zap size={19} />
        </button>
        <button
          type="button"
          className="sh-rail-btn is-tile"
          aria-label={c.railFiles}
          title={c.railFiles}
          onClick={actions.files}
        >
          <LayoutGrid size={17} />
        </button>
        <button
          type="button"
          className="sh-rail-avatar"
          aria-label={c.account}
          title={c.account}
          onClick={actions.account}
        >
          {profile.name.charAt(0).toUpperCase()}
        </button>
      </div>
    </aside>
  );
}
