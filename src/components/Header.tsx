import { useState } from "react";

interface HeaderProps {
  isSun: boolean;
  setTheme: (v: 'light' | 'dark') => void;
  headerBg: string;
  headerBorder: string;
  sideBg: string;
  sideBorder: string;
  sideText: string;
  sideMuted: string;
  isLoggedIn: boolean;
  view: string;
  handleUserClick: () => void;
  navTo: (v: 'homepage' | 'how' | 'plans' | 'privacy' | 'terms' | 'why-private') => void;
  setUserMenuOpen: (v: boolean) => void;
  setMobileMenuOpen: (v: boolean) => void;
  circleOpen: boolean;
  setCircleOpen: (v: boolean) => void;
  rightActive: string | null;
  setRightActive: (v: string | null) => void;
  rightHover: string | null;
  setRightHover: (v: string | null) => void;
  setShowHelpPopup: (v: boolean) => void;
  setShowSettingsPopup: (v: boolean) => void;
}

export default function Header({ isSun, setTheme, headerBg, headerBorder, sideBg, sideBorder, sideText, sideMuted, isLoggedIn, view, handleUserClick, navTo, setUserMenuOpen, setMobileMenuOpen, circleOpen, setCircleOpen, rightActive, setRightActive, rightHover, setRightHover, setShowHelpPopup, setShowSettingsPopup }: HeaderProps) {
  const headerText = isSun ? '#FFFFFF' : '#2563EB';
  const headerSubText = isSun ? 'rgba(255,255,255,0.7)' : '#3B82F6';
  const [bellOpen, setBellOpen] = useState(false);
  const [notifications, setNotifications] = useState<{ id: number; title: string; time: string; read: boolean }[]>([]);
  const unreadCount = notifications.filter((n) => !n.read).length;
  return (
    <div className="headerFixed" style={{ height: "57px", boxSizing: "border-box", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", padding: "0 16px", background: headerBg, borderBottom: `1px solid ${headerBorder}`, position: "fixed", top: 0, left: "280px", right: "56px", zIndex: 100, fontFamily: "'Inter',sans-serif", letterSpacing: "-0.01em" }}>
      <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        <button onClick={() => setMobileMenuOpen(true)} aria-label="Menu" style={{ width: "36px", height: "36px", borderRadius: "8px", background: "transparent", border: "none", cursor: "pointer", display: "grid", placeItems: "center" }} className="hamburgerBtn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={headerText} strokeWidth="1.5" strokeLinecap="round"><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></svg>
        </button>
      </div>
      <div style={{ display: "flex", gap: "28px", alignItems: "center", whiteSpace: "nowrap", flexShrink: 0, margin: "0 auto" }}>
        <span onClick={() => navTo('homepage')} style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "13.5px", fontWeight: 600, color: headerText, cursor: "pointer", padding: "6px 0", borderBottom: view === 'homepage' || view === 'workspace' ? `2px solid ${headerText}` : "2px solid transparent" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
          Workspace
        </span>
        <span onClick={() => navTo('how')} style={{ fontSize: "13.5px", fontWeight: 500, color: headerText, cursor: "pointer", padding: "6px 0", borderBottom: view === 'how' ? `2px solid ${headerText}` : "2px solid transparent" }} className="hideOnSmall">How it works</span>
        <span onClick={() => navTo('plans')} style={{ fontSize: "13.5px", fontWeight: 500, color: headerText, cursor: "pointer", padding: "6px 0", borderBottom: view === 'plans' ? `2px solid ${headerText}` : "2px solid transparent" }} className="hideOnSmall">Plans</span>
      </div>
      <div style={{ display: "flex", gap: "20px", alignItems: "center", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px", cursor: "pointer", whiteSpace: "nowrap" }} className="hideOnSmall">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={headerText} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
          <span style={{ fontSize: "13.5px", fontWeight: 600, color: headerText }}>English</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={headerText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
        </div>
        {isLoggedIn ? (
          <>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <button onClick={() => { setBellOpen((v) => !v); }} aria-label="Notifications" title="Notifications" style={{ width: "32px", height: "32px", borderRadius: "999px", background: "transparent", border: `1px solid ${headerBorder}`, cursor: "pointer", display: "grid", placeItems: "center", position: "relative" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={headerText} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                {unreadCount > 0 && (<span style={{ position: "absolute", top: "2px", right: "2px", width: "8px", height: "8px", borderRadius: "999px", background: "#EF4444", border: "2px solid white" }} />)}
              </button>
              {bellOpen && (
                <div style={{ position: "absolute", top: "40px", right: 0, width: "300px", background: "white", border: `1px solid ${headerBorder}`, borderRadius: "12px", padding: "8px", zIndex: 210, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: headerText }}>Notifications</span>
                    {unreadCount > 0 && (<span onClick={() => setNotifications((list) => list.map((n) => ({ ...n, read: true })))} style={{ fontSize: "11px", fontWeight: 600, color: "#2563EB", cursor: "pointer" }}>Mark all read</span>)}
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: "18px 8px", fontSize: "12px", color: headerSubText, textAlign: "center" }}>No notifications yet</div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} style={{ padding: "8px", fontSize: "12px", color: headerText, borderRadius: "8px", background: n.read ? "transparent" : "rgba(37,99,235,0.08)" }}>
                        <div style={{ fontWeight: 600 }}>{n.title}</div>
                        <div style={{ fontSize: "11px", color: headerSubText, marginTop: "2px" }}>{n.time}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <div onClick={() => { setBellOpen(false); handleUserClick(); }} style={{ display: "flex", alignItems: "center", gap: "9px", cursor: "pointer", whiteSpace: "nowrap" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "999px", background: "#2563EB", display: "grid", placeItems: "center", color: "white", fontWeight: 600, fontSize: "13px", flexShrink: 0 }}>K</div>
            <div style={{ lineHeight: 1.25 }} className="hideOnSmall">
              <div style={{ fontSize: "13px", fontWeight: 600, color: headerText }}>kamalhohoud2</div>
              <div style={{ fontSize: "11px", fontWeight: 500, color: headerSubText }}>Free plan</div>
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={headerText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hideOnSmall"><path d="m6 9 6 6 6-6" /></svg>
          </div>
          </>
        ) : (
          <>
            <span style={{ fontSize: "13.5px", fontWeight: 500, color: headerText, cursor: "pointer", whiteSpace: "nowrap" }}>Sign In</span>
            <button style={{ background: "#2563EB", color: "white", borderRadius: "999px", padding: "8px 16px", fontSize: "13.5px", fontWeight: 600, border: "none", cursor: "pointer", whiteSpace: "nowrap", letterSpacing: "-0.01em", boxShadow: "0 4px 12px rgba(37,99,235,0.35)" }}>Get Started</button>
          </>
        )}
        {circleOpen && (<div onClick={() => setCircleOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 190, background: "transparent" }} />)}
        <div className="mobileCircleWrap" style={{ position: "relative", zIndex: 192, flexShrink: 0 }}>
          <button onClick={() => setCircleOpen(!circleOpen)} aria-label="Tools" style={{ width: "34px", height: "34px", borderRadius: "999px", background: "#FFFFFF", border: "1.5px solid #2563EB", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2.5px", flexShrink: 0, padding: 0 }}>
            <span style={{ width: "4px", height: "4px", borderRadius: "999px", background: "#2563EB" }} />
            <span style={{ width: "4px", height: "4px", borderRadius: "999px", background: "#2563EB" }} />
            <span style={{ width: "4px", height: "4px", borderRadius: "999px", background: "#2563EB" }} />
          </button>
          {circleOpen && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 191, width: "180px", background: sideBg, border: `1px solid ${sideBorder}`, borderRadius: "14px", padding: "6px", boxShadow: "0 16px 40px rgba(0,0,0,0.25)", maxHeight: "calc(100vh - 70px)", overflowY: "auto" }}>
              <div style={{ padding: "2px 10px 4px", fontSize: "10px", letterSpacing: "0.08em", color: sideMuted, fontWeight: 700 }}>NAVIGATION</div>
              <button onClick={() => { navTo('how'); setCircleOpen(false); }} onMouseEnter={() => setRightHover('how')} onMouseLeave={() => setRightHover(null)} onTouchStart={() => setRightHover('how')} onTouchEnd={() => setRightHover(null)} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "9px 10px", borderRadius: "10px", border: "none", background: (view === 'how' || rightHover === 'how') ? "#2563EB" + "1A" : "transparent", color: sideText, fontSize: "13px", fontWeight: 600, cursor: "pointer", textAlign: "left" }}><span style={{ display: "grid", placeItems: "center", width: "28px", height: "28px", borderRadius: "8px", background: (view === 'how' || rightHover === 'how') ? "#2563EB" + "1A" : "transparent", color: (view === 'how' || rightHover === 'how') ? "#2563EB" : isSun ? "#64748B" : "#94A3B8", flexShrink: 0 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg></span>How it works</button>
              <button onClick={() => { navTo('plans'); setCircleOpen(false); }} onMouseEnter={() => setRightHover('plans')} onMouseLeave={() => setRightHover(null)} onTouchStart={() => setRightHover('plans')} onTouchEnd={() => setRightHover(null)} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "9px 10px", borderRadius: "10px", border: "none", background: (view === 'plans' || rightHover === 'plans') ? "#7C3AED" + "1A" : "transparent", color: sideText, fontSize: "13px", fontWeight: 600, cursor: "pointer", textAlign: "left" }}><span style={{ display: "grid", placeItems: "center", width: "28px", height: "28px", borderRadius: "8px", background: (view === 'plans' || rightHover === 'plans') ? "#7C3AED" + "1A" : "transparent", color: (view === 'plans' || rightHover === 'plans') ? "#7C3AED" : isSun ? "#64748B" : "#94A3B8", flexShrink: 0 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg></span>Plans</button>
              <button onClick={() => { setRightActive('help'); setShowHelpPopup(true); setShowSettingsPopup(false); setCircleOpen(false); }} onMouseEnter={() => setRightHover('help')} onMouseLeave={() => setRightHover(null)} onTouchStart={() => setRightHover('help')} onTouchEnd={() => setRightHover(null)} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "9px 10px", borderRadius: "10px", border: "none", background: (rightActive === 'help' || rightHover === 'help') ? "#06B6D4" + "1A" : "transparent", color: sideText, fontSize: "13px", fontWeight: 600, cursor: "pointer", textAlign: "left" }}><span style={{ display: "grid", placeItems: "center", width: "28px", height: "28px", borderRadius: "8px", background: (rightActive === 'help' || rightHover === 'help') ? "#06B6D4" + "1A" : "transparent", color: (rightActive === 'help' || rightHover === 'help') ? "#06B6D4" : isSun ? "#64748B" : "#94A3B8", flexShrink: 0 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg></span>Help</button>
              <div style={{ height: "1px", background: sideBorder, margin: "6px 10px" }} />
              <div style={{ padding: "2px 10px 4px", fontSize: "10px", letterSpacing: "0.08em", color: sideMuted, fontWeight: 700 }}>LANGUAGE</div>
              <button onClick={() => { setRightActive('settings'); setShowSettingsPopup(true); setUserMenuOpen(false); setShowHelpPopup(false); setCircleOpen(false); }} onMouseEnter={() => setRightHover('english')} onMouseLeave={() => setRightHover(null)} onTouchStart={() => setRightHover('english')} onTouchEnd={() => setRightHover(null)} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "9px 10px", borderRadius: "10px", border: "none", background: (false || rightHover === 'english') ? "#059669" + "1A" : "transparent", color: sideText, fontSize: "13px", fontWeight: 600, cursor: "pointer", textAlign: "left" }}><span style={{ display: "grid", placeItems: "center", width: "28px", height: "28px", borderRadius: "8px", background: (false || rightHover === 'english') ? "#059669" + "1A" : "transparent", color: (false || rightHover === 'english') ? "#059669" : isSun ? "#64748B" : "#94A3B8", flexShrink: 0 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg></span>English</button>
              <div style={{ height: "1px", background: sideBorder, margin: "6px 10px" }} />
              <div style={{ padding: "2px 10px 4px", fontSize: "10px", letterSpacing: "0.08em", color: sideMuted, fontWeight: 700 }}>DISPLAY</div>
              <button onClick={() => { if (isSun) { setTheme('light'); setRightActive('moon'); } else { setTheme('dark'); setRightActive('sun'); } setCircleOpen(false); }} onMouseEnter={() => setRightHover('theme')} onMouseLeave={() => setRightHover(null)} onTouchStart={() => setRightHover('theme')} onTouchEnd={() => setRightHover(null)} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "9px 10px", borderRadius: "10px", border: "none", background: rightHover === 'theme' ? (isSun ? "#6366F11A" : "#F59E0B1A") : "transparent", color: sideText, fontSize: "13px", fontWeight: 600, cursor: "pointer", textAlign: "left" }}>{isSun ? (<span style={{ display: "grid", placeItems: "center", width: "28px", height: "28px", borderRadius: "8px", background: rightHover === 'theme' ? "#6366F11A" : "transparent", color: rightHover === 'theme' ? "#6366F1" : isSun ? "#64748B" : "#94A3B8", flexShrink: 0 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg></span>) : (<span style={{ display: "grid", placeItems: "center", width: "28px", height: "28px", borderRadius: "8px", background: rightHover === 'theme' ? "#F59E0B1A" : "transparent", color: rightHover === 'theme' ? "#F59E0B" : isSun ? "#64748B" : "#94A3B8", flexShrink: 0 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg></span>)}{isSun ? "Moon" : "Sun"}</button>
              <div style={{ height: "1px", background: sideBorder, margin: "6px 10px" }} />
              <div style={{ padding: "2px 10px 4px", fontSize: "10px", letterSpacing: "0.08em", color: sideMuted, fontWeight: 700 }}>WORKSPACE</div>
              <button onClick={() => { setRightActive('private'); navTo('why-private'); setCircleOpen(false); }} onMouseEnter={() => setRightHover('private')} onMouseLeave={() => setRightHover(null)} onTouchStart={() => setRightHover('private')} onTouchEnd={() => setRightHover(null)} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "9px 10px", borderRadius: "10px", border: "none", background: (rightActive === 'private' || rightHover === 'private') ? "#22C55E" + "1A" : "transparent", color: sideText, fontSize: "13px", fontWeight: 600, cursor: "pointer", textAlign: "left" }}><span style={{ display: "grid", placeItems: "center", width: "28px", height: "28px", borderRadius: "8px", background: (rightActive === 'private' || rightHover === 'private') ? "#22C55E" + "1A" : "transparent", color: (rightActive === 'private' || rightHover === 'private') ? "#22C55E" : isSun ? "#64748B" : "#94A3B8", flexShrink: 0 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></svg></span>Private Mode</button>
              <button onClick={() => { setRightActive('quick'); setCircleOpen(false); }} onMouseEnter={() => setRightHover('quick')} onMouseLeave={() => setRightHover(null)} onTouchStart={() => setRightHover('quick')} onTouchEnd={() => setRightHover(null)} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "9px 10px", borderRadius: "10px", border: "none", background: (rightActive === 'quick' || rightHover === 'quick') ? "#F59E0B" + "1A" : "transparent", color: sideText, fontSize: "13px", fontWeight: 600, cursor: "pointer", textAlign: "left" }}><span style={{ display: "grid", placeItems: "center", width: "28px", height: "28px", borderRadius: "8px", background: (rightActive === 'quick' || rightHover === 'quick') ? "#F59E0B" + "1A" : "transparent", color: (rightActive === 'quick' || rightHover === 'quick') ? "#F59E0B" : isSun ? "#64748B" : "#94A3B8", flexShrink: 0 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></svg></span>Quick Mode</button>
              <button onClick={() => { setRightActive('invite'); setCircleOpen(false); }} onMouseEnter={() => setRightHover('invite')} onMouseLeave={() => setRightHover(null)} onTouchStart={() => setRightHover('invite')} onTouchEnd={() => setRightHover(null)} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "9px 10px", borderRadius: "10px", border: "none", background: (rightActive === 'invite' || rightHover === 'invite') ? "#7C3AED" + "1A" : "transparent", color: sideText, fontSize: "13px", fontWeight: 600, cursor: "pointer", textAlign: "left" }}><span style={{ display: "grid", placeItems: "center", width: "28px", height: "28px", borderRadius: "8px", background: (rightActive === 'invite' || rightHover === 'invite') ? "#7C3AED" + "1A" : "transparent", color: (rightActive === 'invite' || rightHover === 'invite') ? "#7C3AED" : isSun ? "#64748B" : "#94A3B8", flexShrink: 0 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6" /><path d="M22 11h-6" /></svg></span>Invite</button>
              <button onClick={() => { setRightActive('settings'); setShowSettingsPopup(true); setUserMenuOpen(false); setShowHelpPopup(false); setCircleOpen(false); }} onMouseEnter={() => setRightHover('settings')} onMouseLeave={() => setRightHover(null)} onTouchStart={() => setRightHover('settings')} onTouchEnd={() => setRightHover(null)} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "9px 10px", borderRadius: "10px", border: "none", background: (rightActive === 'settings' || rightHover === 'settings') ? "#2563EB" + "1A" : "transparent", color: sideText, fontSize: "13px", fontWeight: 600, cursor: "pointer", textAlign: "left" }}><span style={{ display: "grid", placeItems: "center", width: "28px", height: "28px", borderRadius: "8px", background: (rightActive === 'settings' || rightHover === 'settings') ? "#2563EB" + "1A" : "transparent", color: (rightActive === 'settings' || rightHover === 'settings') ? "#2563EB" : isSun ? "#64748B" : "#94A3B8", flexShrink: 0 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg></span>Settings</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface UserMenuProps {
  userMenuOpen: boolean;
  setUserMenuOpen: (v: boolean) => void;
  menuRecentOpen: boolean;
  setMenuRecentOpen: (v: boolean) => void;
  menuProjectsOpen: boolean;
  setMenuProjectsOpen: (v: boolean) => void;
  accountType: 'personal' | 'professional' | 'company';
  isSun: boolean;
  sideText: string;
  sideMuted: string;
  sideCard: string;
  sideCardBorder: string;
  navTo: (v: 'homepage' | 'how' | 'plans' | 'privacy' | 'terms' | 'why-private') => void;
}

export function UserMenu({ userMenuOpen, setUserMenuOpen, menuRecentOpen, setMenuRecentOpen, menuProjectsOpen, setMenuProjectsOpen, accountType, isSun, sideText, sideMuted, sideCard, sideCardBorder, navTo }: UserMenuProps) {
  return userMenuOpen ? (
    <>
      <div onClick={() => setUserMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "transparent", zIndex: 199 }} />
      <div style={{ position: "fixed", right: "16px", top: "65px", width: "292px", maxHeight: "calc(100vh - 32px)", overflow: "visible", background: isSun ? '#FFFFFF' : '#1A1A24', border: `1px solid ${sideCardBorder}`, borderRadius: "16px", padding: "6px", zIndex: 200, boxShadow: isSun ? "0 20px 40px rgba(0,0,0,0.15)" : "0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)" }}>
        <div style={{ padding: "10px", borderBottom: `1px solid ${sideCardBorder}`, marginBottom: "4px", display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "999px", background: "#7C3AED", display: "grid", placeItems: "center", color: "white", fontWeight: 700, fontSize: "14px", flexShrink: 0 }}>K</div>
          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: "13px", fontWeight: 600, color: sideText }}>{accountType === 'company' ? "Kamal • Acme Law" : accountType === 'professional' ? "Kamal • Lawyer" : "Kamal"}</div><div style={{ fontSize: "11px", color: sideMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{accountType === 'company' ? "kamal@acme-law.com • Admin" : "kamal@pdflexi.com"}</div></div>
          <span style={{ fontSize: "10px", fontWeight: 700, color: accountType === 'company' ? "#111" : accountType === 'professional' ? "#1E40AF" : "#7C3AED", background: accountType === 'company' ? "#F3F4F6" : accountType === 'professional' ? "#EFF6FF" : "rgba(124,58,237,0.1)", padding: "3px 8px", borderRadius: "999px", whiteSpace: "nowrap" }}>{accountType === 'company' ? "Enterprise" : accountType === 'professional' ? "Teams" : "Free plan"}</span>
        </div>
        <div style={{ padding: "6px 10px 4px", fontSize: "10px", letterSpacing: "0.08em", color: sideMuted, fontWeight: 600 }}>MY ACCOUNT</div>
        <div style={{ padding: "8px 10px", fontSize: "12px", color: sideText, cursor: "pointer", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}><span>👤 My Profile</span><span style={{ fontSize: "10px", color: sideMuted }}>Name • Email • Language ▸</span></div>
        <div style={{ padding: "8px 10px", fontSize: "12px", color: sideText, cursor: "pointer", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}><span>⚙ Account Settings</span><span style={{ fontSize: "10px", color: sideMuted }}>Password • Preferences ▸</span></div>
        <div style={{ padding: "8px 10px 4px", fontSize: "10px", letterSpacing: "0.08em", color: sideMuted, fontWeight: 600 }}>MY FILES</div>
        <div style={{ position: "relative" }}>
          <div onClick={() => { setMenuRecentOpen(!menuRecentOpen); setMenuProjectsOpen(false); }} style={{ padding: "8px 10px", fontSize: "12px", color: sideText, cursor: "pointer", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center", background: menuRecentOpen ? sideCard : "transparent" }}><span>📁 My Recent Files</span><span style={{ fontSize: "11px", color: sideMuted }}>◂ 3 recent</span></div>
          {menuRecentOpen && (
            <div style={{ position: "absolute", right: "100%", top: "-6px", marginRight: "10px", width: "260px", background: isSun ? '#FFFFFF' : '#1A1A24', border: `1px solid ${sideCardBorder}`, borderRadius: "12px", padding: "8px", zIndex: 210, boxShadow: isSun ? "0 20px 40px rgba(0,0,0,0.15)" : "0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)" }}>
              <div style={{ padding: "6px 8px 8px", fontSize: "10px", letterSpacing: "0.08em", color: sideMuted, fontWeight: 600 }}>MY RECENT FILES</div>
              {[{ n: "Contract-Tangier-2024.pdf", d: "2h ago" }, { n: "Q3 Invoices.pdf", d: "Yesterday" }, { n: "Report-2024.pdf", d: "3 days ago" }].map(f => (
                <div key={f.n} onClick={() => { navTo('homepage'); setUserMenuOpen(false); }} style={{ padding: "8px 10px", fontSize: "12px", color: sideText, cursor: "pointer", borderRadius: "6px", display: "flex", justifyContent: "space-between" }}><span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "170px" }}>📄 {f.n}</span><span style={{ fontSize: "10px", color: sideMuted, flexShrink: 0 }}>{f.d}</span></div>
              ))}
            </div>
          )}
        </div>
        <div style={{ position: "relative", borderBottom: `1px solid ${sideCardBorder}`, paddingBottom: "4px", marginBottom: "4px" }}>
          <div onClick={() => { setMenuProjectsOpen(!menuProjectsOpen); setMenuRecentOpen(false); }} style={{ padding: "8px 10px", fontSize: "12px", color: sideText, cursor: "pointer", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center", background: menuProjectsOpen ? sideCard : "transparent" }}><span>📁 Projects (2)</span><span style={{ fontSize: "11px", color: sideMuted }}>◂</span></div>
          {menuProjectsOpen && (
            <div style={{ position: "absolute", right: "100%", top: "-6px", marginRight: "10px", width: "260px", background: isSun ? '#FFFFFF' : '#1A1A24', border: `1px solid ${sideCardBorder}`, borderRadius: "12px", padding: "8px", zIndex: 210, boxShadow: isSun ? "0 20px 40px rgba(0,0,0,0.15)" : "0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)" }}>
              <div style={{ padding: "6px 8px 8px", fontSize: "10px", letterSpacing: "0.08em", color: sideMuted, fontWeight: 600 }}>PROJECTS (2)</div>
              {[["Q3 Reports", "4 files"], ["Invoices 2024", "6 files"]].map(p => (
                <div key={p[0]} style={{ padding: "8px 10px", fontSize: "12px", color: sideMuted, cursor: "pointer", borderRadius: "6px", display: "flex", justifyContent: "space-between" }}><span>📁 {p[0]}</span><span style={{ fontSize: "10px", color: sideMuted }}>{p[1]}</span></div>
              ))}
            </div>
          )}
        </div>
        <div style={{ padding: "8px 10px 4px", fontSize: "10px", letterSpacing: "0.08em", color: sideMuted, fontWeight: 600 }}>CREDITS & PLAN</div>
        <div style={{ margin: "2px 6px 6px", background: sideCard, border: `1px solid ${sideCardBorder}`, borderRadius: "10px", padding: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: "12px", fontWeight: 600, color: sideText }}>⚡ Credits</span><span style={{ fontSize: "11px", color: sideMuted }}>12 / 20</span></div>
          <div style={{ marginTop: "8px", height: "6px", background: isSun ? "#E5E7EB" : "rgba(255,255,255,0.1)", borderRadius: "999px", overflow: "hidden" }}><div style={{ width: "60%", height: "100%", background: "#7C3AED", borderRadius: "999px" }} /></div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "10px", color: sideMuted }}><span>Used: 8</span><span>Remaining: 12</span><span>Resets: Monthly</span></div>
          <div style={{ fontSize: "10px", color: sideMuted, marginTop: "6px", lineHeight: 1.5 }}>AI tools only • Local tools are free, no credits needed • Demo data</div>
          <button onClick={() => navTo('plans')} style={{ marginTop: "8px", width: "100%", background: "#7C3AED", color: "white", border: "none", borderRadius: "999px", padding: "7px", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>Upgrade to Pro • $12 / month</button>
        </div>
        <div onClick={() => navTo('plans')} style={{ padding: "8px 10px", fontSize: "12px", color: sideText, cursor: "pointer", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}><span>💳 Billing & Plans</span><span style={{ fontSize: "10px", color: sideMuted }}>Free plan • Upgrade ▸</span></div>
        <div style={{ padding: "6px 10px 4px", fontSize: "10px", letterSpacing: "0.08em", color: sideMuted, fontWeight: 600 }}>SETTINGS</div>
        <div style={{ padding: "8px 10px", fontSize: "12px", color: sideText, cursor: "pointer", borderRadius: "6px", display: "flex", justifyContent: "space-between" }}>🔔 Notifications <span style={{ fontSize: "10px", background: "#7C3AED", color: "white", padding: "2px 6px", borderRadius: "999px" }}>3</span></div>
        <div onClick={() => navTo('privacy')} style={{ padding: "8px 10px", fontSize: "12px", color: sideText, cursor: "pointer", borderRadius: "6px" }}>🔒 Privacy & Terms</div>
        <div style={{ padding: "8px 10px", fontSize: "12px", color: "#F87171", cursor: "pointer", borderTop: `1px solid ${sideCardBorder}`, marginTop: "4px", borderRadius: "6px" }}>🚪 Log out</div>
      </div>
    </>
  ) : null;
}
