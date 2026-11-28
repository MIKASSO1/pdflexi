import React from "react";

export type RightBarProps = {
  sideBg: string;
  sideBorder: string;
  isSun: boolean;
  isLight: boolean;
  rightActive: string | null;
  setRightActive: (key: string | null) => void;
  rightHover: string | null;
  setRightHover: (key: string | null) => void;
  setTheme: (theme: "light" | "dark") => void;
  setShowSettingsPopup: (open: boolean) => void;
  setShowHelpPopup: (open: boolean) => void;
  setUserMenuOpen: (open: boolean) => void;
  copiedEmail: string | null;
  setCopiedEmail: (value: string | null) => void;
  settingsLang: string;
  setSettingsLang: (value: string) => void;
  settingsNotifications: boolean;
  setSettingsNotifications: (value: boolean) => void;
  middleCard: string;
  middleCardBorder: string;
  middleBg: string;
  middleText: string;
  middleMuted: string;
  showSettingsPopup: boolean;
  showHelpPopup: boolean;
  navTo: (view: "homepage" | "how" | "plans" | "privacy" | "terms" | "why-private") => void;
};

export function RightBar(props: RightBarProps) {
  const {
    sideBg, sideBorder, isSun, isLight, rightActive, setRightActive, rightHover, setRightHover, setTheme,
    setShowSettingsPopup, setShowHelpPopup, setUserMenuOpen, copiedEmail, setCopiedEmail,
    settingsLang, setSettingsLang, settingsNotifications, setSettingsNotifications,
    middleCard, middleCardBorder, middleBg, middleText, middleMuted,
    showSettingsPopup, showHelpPopup, navTo,
  } = props;

  const rightSidebarStyle: React.CSSProperties = { width: "56px", background: sideBg, borderLeft: `1px solid ${sideBorder}`, flexDirection: "column", alignItems: "center", padding: "12px 0", justifyContent: "space-between", height: "100vh", position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 90, flexShrink: 0 };

  const rightMuted = isSun ? "#64748B" : "#94A3B8";
  const rightIconStyle = (key: string, accent: string, active: boolean): React.CSSProperties => ({
    width: "44px",
    height: "36px",
    background: active || rightHover === key ? accent + "1A" : "transparent",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
    color: active || rightHover === key ? accent : rightMuted,
    transition: "all 0.2s ease",
  });
  const rightLabelStyle = (key: string, accent: string, active: boolean): React.CSSProperties => ({
    fontSize: "8.5px",
    fontWeight: 600,
    lineHeight: 1,
    textAlign: "center",
    whiteSpace: "nowrap",
    color: active || rightHover === key ? accent : rightMuted,
  });
  const rightItemWrap: React.CSSProperties = { display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" };

  const rightBar = (
    <>
    <aside className="rightBar" style={rightSidebarStyle}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", paddingTop: "8px" }}>
        <div style={rightItemWrap} onMouseEnter={() => setRightHover(isSun ? 'moon' : 'sun')} onMouseLeave={() => setRightHover(null)}>
          <button onClick={() => { if (isSun) { setTheme('light'); setRightActive('moon'); } else { setTheme('dark'); setRightActive('sun'); } }} title={isSun ? "Moon mode" : "Sun mode"} style={rightIconStyle(isSun ? 'moon' : 'sun', isSun ? "#4F46E5" : "#F59E0B", true)}>
            {isSun ? (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>) : (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>)}
          </button>
          <span style={rightLabelStyle(isSun ? 'moon' : 'sun', isSun ? "#4F46E5" : "#F59E0B", true)}>{isSun ? "Moon" : "Sun"}</span>
        </div>
        <div style={{ width: "20px", height: "1px", background: "#BFDBFE", margin: "4px 0" }} />
        <div style={rightItemWrap} onMouseEnter={() => setRightHover('private')} onMouseLeave={() => setRightHover(null)}>
          <button onClick={() => { setRightActive('private'); navTo('why-private'); }} title="Private" style={rightIconStyle('private', "#22C55E", rightActive === 'private')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></svg>
          </button>
          <span style={rightLabelStyle('private', "#22C55E", rightActive === 'private')}>Private</span>
        </div>
        <div style={rightItemWrap} onMouseEnter={() => setRightHover('quick')} onMouseLeave={() => setRightHover(null)}>
          <button onClick={() => setRightActive('quick')} title="Quick actions" style={rightIconStyle('quick', "#F59E0B", rightActive === 'quick')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></svg>
          </button>
          <span style={rightLabelStyle('quick', "#F59E0B", rightActive === 'quick')}>Quick</span>
        </div>
        <div style={rightItemWrap} onMouseEnter={() => setRightHover('invite')} onMouseLeave={() => setRightHover(null)}>
          <button onClick={() => setRightActive('invite')} title="Invite" style={rightIconStyle('invite', "#7C3AED", rightActive === 'invite')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="8" r="4" /><path d="M3 20c0-3.6 3.1-6 7-6 1.6 0 3 .4 4.1 1.1" /><path d="M17 15v6" /><path d="M14 18h6" /></svg>
          </button>
          <span style={rightLabelStyle('invite', "#7C3AED", rightActive === 'invite')}>Invite</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", paddingBottom: "8px" }}>
        <div style={rightItemWrap} onMouseEnter={() => setRightHover('settings')} onMouseLeave={() => setRightHover(null)}>
          <button onClick={() => { setRightActive('settings'); setShowSettingsPopup(true); setUserMenuOpen(false); setShowHelpPopup(false); }} title="Settings" style={rightIconStyle('settings', "#2563EB", rightActive === 'settings' || showSettingsPopup)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
          </button>
          <span style={rightLabelStyle('settings', "#2563EB", rightActive === 'settings' || showSettingsPopup)}>Settings</span>
        </div>
        <div style={rightItemWrap} onMouseEnter={() => setRightHover('help')} onMouseLeave={() => setRightHover(null)}>
          <button onClick={() => { setRightActive('help'); setShowHelpPopup(true); setShowSettingsPopup(false); }} title="Help" style={rightIconStyle('help', "#06B6D4", rightActive === 'help')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
          </button>
          <span style={rightLabelStyle('help', "#06B6D4", rightActive === 'help')}>Help</span>
        </div>
      </div>
    </aside>
    {showHelpPopup && (
      <div onClick={() => { setShowHelpPopup(false); setRightActive(null); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 200, display: "grid", placeItems: "center", padding: "16px" }}>
        <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: "420px", background: middleBg, border: `1px solid ${middleCardBorder}`, borderRadius: "20px", padding: "24px", boxShadow: "0 24px 60px rgba(0,0,0,0.35)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: middleText }}>Help</div>
              <div style={{ fontSize: "12px", color: middleMuted, marginTop: "4px" }}>Need help? We are here.</div>
            </div>
            <button onClick={() => { setShowHelpPopup(false); setRightActive(null); }} aria-label="Close help" style={{ width: "32px", height: "32px", borderRadius: "999px", border: `1px solid ${middleCardBorder}`, background: "transparent", color: middleText, cursor: "pointer", fontSize: "14px", flexShrink: 0 }}>✕</button>
          </div>
          <div style={{ marginTop: "20px", background: middleCard, border: `1px solid ${middleCardBorder}`, borderRadius: "14px", padding: "16px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: middleText }}>Contact support</div>
            <div style={{ fontSize: "12px", color: middleMuted, marginTop: "6px", lineHeight: 1.6 }}>For questions or feedback about the product, your account, or payment, please contact our support at</div>
            <div style={{ marginTop: "12px", display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: middleText, background: isSun ? "#EFF6FF" : "rgba(59,130,246,0.15)", border: `1px solid ${middleCardBorder}`, borderRadius: "999px", padding: "7px 12px", wordBreak: "break-all" }}>support@pdflexi.com</span>
              <button onClick={() => { navigator.clipboard?.writeText("support@pdflexi.com"); setCopiedEmail("support"); setTimeout(() => setCopiedEmail(null), 2000); }} style={{ fontSize: "12px", fontWeight: 600, background: isSun ? "#111" : "white", color: isSun ? "white" : "black", border: "none", borderRadius: "999px", padding: "7px 14px", cursor: "pointer" }}>{copiedEmail === "support" ? "Copied ✓" : "Copy"}</button>
              <a href="mailto:support@pdflexi.com" style={{ fontSize: "12px", fontWeight: 600, color: "#2563EB", textDecoration: "none" }}>Email →</a>
            </div>
          </div>
          <div style={{ marginTop: "12px", background: middleCard, border: `1px solid ${middleCardBorder}`, borderRadius: "14px", padding: "16px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: middleText }}>Business inquiries</div>
            <div style={{ fontSize: "12px", color: middleMuted, marginTop: "6px", lineHeight: 1.6 }}>For business inquiries, please reach out to our founders at</div>
            <div style={{ marginTop: "12px", display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: middleText, background: isSun ? "#F5F3FF" : "rgba(124,58,237,0.15)", border: `1px solid ${middleCardBorder}`, borderRadius: "999px", padding: "7px 12px", wordBreak: "break-all" }}>founders@pdflexi.com</span>
              <button onClick={() => { navigator.clipboard?.writeText("founders@pdflexi.com"); setCopiedEmail("founders"); setTimeout(() => setCopiedEmail(null), 2000); }} style={{ fontSize: "12px", fontWeight: 600, background: isSun ? "#111" : "white", color: isSun ? "white" : "black", border: "none", borderRadius: "999px", padding: "7px 14px", cursor: "pointer" }}>{copiedEmail === "founders" ? "Copied ✓" : "Copy"}</button>
              <a href="mailto:founders@pdflexi.com" style={{ fontSize: "12px", fontWeight: 600, color: "#7C3AED", textDecoration: "none" }}>Email →</a>
            </div>
          </div>
          <div style={{ fontSize: "11px", color: middleMuted, textAlign: "center", marginTop: "14px" }}>We usually reply within 1 business day.</div>
        </div>
      </div>
    )}
    {showSettingsPopup && (
      <div onClick={() => { setShowSettingsPopup(false); setRightActive(null); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 200, display: "grid", placeItems: "center", padding: "16px" }}>
        <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: "420px", background: middleBg, border: `1px solid ${middleCardBorder}`, borderRadius: "20px", padding: "24px", boxShadow: "0 24px 60px rgba(0,0,0,0.35)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: middleText }}>Settings</div>
              <div style={{ fontSize: "12px", color: middleMuted, marginTop: "4px" }}>Preferences for everyone. No account needed.</div>
            </div>
            <button onClick={() => { setShowSettingsPopup(false); setRightActive(null); }} aria-label="Close settings" style={{ width: "32px", height: "32px", borderRadius: "999px", border: `1px solid ${middleCardBorder}`, background: "transparent", color: middleText, cursor: "pointer", fontSize: "14px", flexShrink: 0 }}>✕</button>
          </div>
          <div style={{ marginTop: "20px", background: middleCard, border: `1px solid ${middleCardBorder}`, borderRadius: "14px", padding: "16px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: middleText }}>Language</div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>{["English", "Français", "العربية"].map(l => <button key={l} onClick={() => setSettingsLang(l)} style={{ fontSize: "12px", fontWeight: 600, padding: "7px 14px", borderRadius: "999px", border: `1px solid ${middleCardBorder}`, background: settingsLang === l ? "#2563EB" : "transparent", color: settingsLang === l ? "white" : middleText, cursor: "pointer" }}>{l}</button>)}</div>
          </div>
          <div style={{ marginTop: "12px", background: middleCard, border: `1px solid ${middleCardBorder}`, borderRadius: "14px", padding: "16px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: middleText }}>Appearance</div>
            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
              <button onClick={() => setTheme('dark')} style={{ flex: 1, fontSize: "12px", fontWeight: 600, padding: "8px", borderRadius: "999px", border: `1px solid ${middleCardBorder}`, background: isSun ? "#2563EB" : "transparent", color: isSun ? "white" : middleText, cursor: "pointer" }}>☀️ Light</button>
              <button onClick={() => setTheme('light')} style={{ flex: 1, fontSize: "12px", fontWeight: 600, padding: "8px", borderRadius: "999px", border: `1px solid ${middleCardBorder}`, background: isLight ? "#2563EB" : "transparent", color: isLight ? "white" : middleText, cursor: "pointer" }}>🌙 Dark</button>
            </div>
          </div>
          <div style={{ marginTop: "12px", background: middleCard, border: `1px solid ${middleCardBorder}`, borderRadius: "14px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><div style={{ fontSize: "13px", fontWeight: 700, color: middleText }}>Notifications</div><div style={{ fontSize: "11px", color: middleMuted, marginTop: "2px" }}>Updates about your files and tasks.</div></div>
            <button onClick={() => setSettingsNotifications(!settingsNotifications)} aria-label="Toggle notifications" style={{ width: "44px", height: "24px", borderRadius: "999px", border: "none", background: settingsNotifications ? "#22C55E" : "#9CA3AF", cursor: "pointer", position: "relative", flexShrink: 0 }}><span style={{ position: "absolute", top: "2px", left: settingsNotifications ? "22px" : "2px", width: "20px", height: "20px", borderRadius: "999px", background: "white", transition: "left 0.2s" }} /></button>
          </div>
          <div style={{ marginTop: "12px", background: middleCard, border: `1px solid ${middleCardBorder}`, borderRadius: "14px", padding: "16px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: middleText }}>Privacy & Terms</div>
            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
              <button onClick={() => navTo('privacy')} style={{ fontSize: "12px", fontWeight: 600, padding: "7px 14px", borderRadius: "999px", border: `1px solid ${middleCardBorder}`, background: "transparent", color: middleText, cursor: "pointer" }}>Privacy →</button>
              <button onClick={() => navTo('terms')} style={{ fontSize: "12px", fontWeight: 600, padding: "7px 14px", borderRadius: "999px", border: `1px solid ${middleCardBorder}`, background: "transparent", color: middleText, cursor: "pointer" }}>Terms →</button>
            </div>
          </div>
          <div style={{ fontSize: "11px", color: middleMuted, textAlign: "center", marginTop: "14px" }}>These settings apply to this device only.</div>
        </div>
      </div>
    )}
    </>
  );


  return rightBar;
}
