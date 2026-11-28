import "./styles/mobile-homepage.css";
import React, { useState, useRef, useEffect, Suspense, lazy } from "react";
import Header, { UserMenu } from "./components/Header";
import Sidebar from "./components/Sidebar";
import CarouselArrows from "./components/CarouselArrows";
import { WhyPrivatePage, LegalPage, HowPage, PlansPage } from "./features/pages/StaticPages";
import { GUTTER_CSS } from "./data/tools";
import { pdfs, quickPills, chatPlaceholders, faqs, getFileInfo } from "./data/showcase";
import { createRouter } from "./app/router";
import { getPalette } from "./ui/theme";

// CODE-SPLIT: pdf.js (~1 MB worker) is only needed inside the workspace, so it
// is fetched on first navigation there instead of at first paint.
const Workspace = lazy(() => import("./features/workspace/Workspace"));


// FIX-V12-SHARP: mobile-only VECTOR page. The blur was NEVER about pixels:
// a bitmap (PNG/canvas) always blurs when CSS zoom shrinks it.
// This renders the REAL PDF page as SVG vector text (SVGGraphics) — the browser draws
// the letters fresh at the exact display size, so at 50% with the WHOLE page visible,
// the lines stay sharp and comfortable for the eye, never blurry.
export default function App() {
  // ROUTER: the view lives in the URL (#/how, #/workspace, ...), so back/forward
  // and deep links work. `setView` below is now a thin alias over the router.
  const routerRef = useRef<ReturnType<typeof createRouter> | null>(null);
  if (routerRef.current === null) routerRef.current = createRouter();
  const router = routerRef.current;
  const [view, setView] = useState<'homepage' | 'workspace' | 'how' | 'plans' | 'privacy' | 'terms' | 'why-private'>(() => (router.allowed(router.current()) ? router.current() : 'homepage'));
  useEffect(() => router.subscribe((next) => setView(next)), [router]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [chat, setChat] = useState("");
  const wsRef = useRef<import("./features/workspace/Workspace").WorkspaceHandle>(null);
  const [pendingFile, setPendingFile] = useState<any | null>(null);
  const [pendingMsg, setPendingMsg] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState("No file selected yet");
  const [dragOver, setDragOver] = useState(false);
  const [homePickerLoading, setHomePickerLoading] = useState(false); // HOMEPAGE ONLY — upload card: instant feedback while the native file picker opens.
  const [activeTool, setActiveTool] = useState("AI Tools");
  const [faqOpen, setFaqOpen] = useState(0);
  const [freeOpen, setFreeOpen] = useState(false);
  const [proOpen, setProOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false); // مغلوق عند فتح الموقع - يفتحه المستخدم بيده
  const [circleOpen, setCircleOpen] = useState(false);
  const [sidebarRecentOpen, setSidebarRecentOpen] = useState(false);
  const [menuProjectsOpen, setMenuProjectsOpen] = useState(false); // مغلوق عند فتح الموقع
  const [menuRecentOpen, setMenuRecentOpen] = useState(false); // مغلوق عند فتح الموقع
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [showAllPdfs, setShowAllPdfs] = useState(false);
  const [isLoggedIn] = useState(false); // GUEST BY DEFAULT - Sign In + Get Started show. Auth system will set this to true after real login.
  // PREPARATION ONLY — Account organization preview. No real backend yet. When real auth/DB is built, this state becomes the real account type.
  const [accountType, setAccountType] = useState<'personal' | 'professional' | 'company'>('personal');
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [settingsLang, setSettingsLang] = useState("English");
  const [settingsNotifications, setSettingsNotifications] = useState(true);
  const [chatAttached, setChatAttached] = useState<string | null>(null);
  const [rightActive, setRightActive] = useState<string | null>(null);
  const [rightHover, setRightHover] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const chatFileRef = useRef<HTMLInputElement>(null);

  const isLight = theme === 'light';
  const {
    isSun, headerBg, outerBg, headerBorder, sideBg, sideBorder, sideText, sideMuted, sideFaint,
    sideCard, sideCardBorder, middleBg, middleText, middleMuted, middleCard, middleCardBorder, middleFaint,
  } = getPalette(theme === 'light' ? 'light' : 'dark');
  const hasFiles = fileName !== "No file selected yet";
  const fileInfo = getFileInfo(fileName);

  // FIX-SPLIT-UPLOAD: Workspace mounts only when view === 'workspace', so the ref is
  // null while the homepage is visible. Hand the file to Workspace via props it
  // consumes on mount, instead of the (previously dropped) imperative ref call.
  // ORIGINAL BEHAVIOR: picking a file on the homepage only stages it (name + viewer
  // state) and does NOT navigate; the first chat message or tool click routes.
  const loadFileForEdit = (f: any) => {
    setFileName(f.name || "");
    setPendingFile(f);
    setPendingMsg(undefined);
  };
  const goWorkspace = (name: string, msg?: string) => {
    setFileName(name);
    setPendingMsg(msg);
    router.navigate('workspace'); setMobileMenuOpen(false);
  };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) { if (f.name.toLowerCase().match(/\.(pdf|txt|rtf|md|json|csv)$/)) { loadFileForEdit(f); } else { alert("Unsupported file type. Try PDF, TXT, RTF, MD, JSON or CSV."); } } };
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => { setHomePickerLoading(false); const f = e.target.files?.[0]; if (f) { if (f.name.toLowerCase().match(/\.(pdf|txt|rtf|md|json|csv)$/)) { loadFileForEdit(f); } else { alert("Unsupported file type. Try PDF, TXT, RTF, MD, JSON or CSV."); } } };
  const openHomePicker = () => { setHomePickerLoading(true); const onFocus = () => { window.removeEventListener("focus", onFocus); window.setTimeout(() => setHomePickerLoading(false), 400); }; window.addEventListener("focus", onFocus); fileRef.current?.click(); window.setTimeout(() => { window.removeEventListener("focus", onFocus); setHomePickerLoading(false); }, 60000); }; // HOMEPAGE ONLY
  const handleSend = () => { if (!chat.trim()) return; goWorkspace(fileName === "No file selected yet" ? "My PDF.pdf" : fileName, chat); setChat(""); };
  const mobileAdCard = (
    <div className="mobileOnlyAd" key="ad-in-tools" style={{ background: "white", borderRadius: "16px", padding: "16px", flexDirection: "column", gap: "10px", border: "1px solid #E5E7EB" }}>
      <span style={{ fontSize: "9px", color: "#6B7280", border: "1px solid #E5E7EB", padding: "2px 5px", borderRadius: "4px", width: "fit-content" }}>Ad</span>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <div style={{ width: "48px", height: "48px", background: "linear-gradient(135deg,#7C3AED,#EC4899)", borderRadius: "10px", display: "grid", placeItems: "center", fontSize: "22px", flexShrink: 0 }}>📦</div>
        <div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#111" }}>Merge, Split & Compress PDFs in 1 Click</div>
          <div style={{ fontSize: "11px", color: "#6B7280" }}>Trusted by 2M+ users • 100% Free to try</div>
        </div>
      </div>
      <button style={{ background: "#2563EB", color: "white", border: "none", borderRadius: "999px", padding: "8px 16px", fontSize: "12px", fontWeight: 700, cursor: "pointer", width: "fit-content" }}>Try Free →</button>
    </div>
  );
  const handleToolClick = (tool: any) => {
    setActiveTool(tool.en); setMobileMenuOpen(false);
    if (tool.id >= 21) { alert(`${tool.en}\n\nThis is a PRO feature. Upgrade to Pro to unlock it.`); return; }
    goWorkspace(fileName === "No file selected yet" ? "My PDF.pdf" : fileName, `I want to ${tool.en}`);
  };
  const handleUserClick = () => { setUserMenuOpen(!userMenuOpen); setShowSettingsPopup(false); setShowHelpPopup(false); };
  const navTo = (v: 'homepage' | 'how' | 'plans' | 'privacy' | 'terms' | 'why-private') => { router.navigate(v); setMobileMenuOpen(false); setUserMenuOpen(false); setShowSettingsPopup(false); setShowHelpPopup(false); window.scrollTo(0,0); };

  useEffect(() => {
    const current = chatPlaceholders[loopNum % chatPlaceholders.length];
    let timeout: any;
    if (!isDeleting && typedText.length < current.length) {
      timeout = setTimeout(() => setTypedText(current.slice(0, typedText.length + 1)), 70);
    } else if (!isDeleting && typedText.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2800);
    } else if (isDeleting && typedText.length > 0) {
      timeout = setTimeout(() => setTypedText(current.slice(0, typedText.length - 1)), 28);
    } else if (isDeleting && typedText.length === 0) {
      timeout = setTimeout(() => { setIsDeleting(false); setLoopNum(l => l + 1); }, 600);
    }
    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, loopNum]);


  const userMenu = <UserMenu userMenuOpen={userMenuOpen} setUserMenuOpen={setUserMenuOpen} menuRecentOpen={menuRecentOpen} setMenuRecentOpen={setMenuRecentOpen} menuProjectsOpen={menuProjectsOpen} setMenuProjectsOpen={setMenuProjectsOpen} accountType={accountType} isSun={isSun} sideText={sideText} sideMuted={sideMuted} sideCard={sideCard} sideCardBorder={sideCardBorder} navTo={navTo} />;

  const sidebarContent = <Sidebar isSun={isSun} sideText={sideText} sideMuted={sideMuted} sideFaint={sideFaint} sideCard={sideCard} sideCardBorder={sideCardBorder} setMobileMenuOpen={setMobileMenuOpen} accountType={accountType} setAccountType={setAccountType} setChat={setChat} freeOpen={freeOpen} setFreeOpen={setFreeOpen} proOpen={proOpen} setProOpen={setProOpen} handleToolClick={handleToolClick} goWorkspace={goWorkspace} navTo={navTo} sidebarRecentOpen={sidebarRecentOpen} setSidebarRecentOpen={setSidebarRecentOpen} activeTool={activeTool} />;

  const header = <Header isSun={isSun} setTheme={setTheme} headerBg={headerBg} headerBorder={headerBorder} sideBg={sideBg} sideBorder={sideBorder} sideText={sideText} sideMuted={sideMuted} isLoggedIn={isLoggedIn} view={view} handleUserClick={handleUserClick} navTo={navTo} setUserMenuOpen={setUserMenuOpen} setMobileMenuOpen={setMobileMenuOpen} circleOpen={circleOpen} setCircleOpen={setCircleOpen} rightActive={rightActive} setRightActive={setRightActive} rightHover={rightHover} setRightHover={setRightHover} setShowHelpPopup={setShowHelpPopup} setShowSettingsPopup={setShowSettingsPopup} />;

  const footer = (
    <div style={{ textAlign: "center", padding: "0 0 16px", fontSize: "11px", color: middleMuted }}>
      PDFlexi © 2026 • <span onClick={() => navTo('privacy')} style={{ cursor: "pointer", textDecoration: "underline" }}>Privacy</span> • <span onClick={() => navTo('terms')} style={{ cursor: "pointer", textDecoration: "underline" }}>Terms</span>
    </div>
  );

  const leftSidebarStyle: React.CSSProperties = { width: "280px", background: sideBg, borderRight: `1px solid ${sideBorder}`, flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, height: "100vh", minHeight: 0, overflowY: "auto", overflowX: "hidden", overscrollBehaviorY: "contain", WebkitOverflowScrolling: "touch", flexShrink: 0, display: "flex", zIndex: 90 };
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

  if (view === 'workspace') {
    return (
      <Suspense fallback={null}>
        <Workspace ref={wsRef} activeTool={activeTool} fileName={fileName} setFileName={setFileName} setView={setView as (v: string) => void} initialFile={pendingFile} initialMsg={pendingMsg} onConsumed={() => setPendingMsg(undefined)} />
      </Suspense>
    );
  }

  const pageProps = { view, isSun, isLight, outerBg, middleBg, middleText, middleMuted, middleCard, middleCardBorder, sideBg, header, sidebarContent, rightBar, userMenu, leftSidebarStyle, mobileMenuOpen, setMobileMenuOpen, navTo, setRightActive, setShowHelpPopup };
  if (view === 'why-private') return <WhyPrivatePage {...pageProps} />;
  if (view === 'privacy' || view === 'terms') return <LegalPage {...pageProps} />;
  if (view === 'how') return <HowPage {...pageProps} />;
  if (view === 'plans') return <PlansPage {...pageProps} />;


// ===== HOMEPAGE =====
  return (
    <div style={{ minHeight: "100vh", width: "100%", background: outerBg, fontFamily: "'Inter',sans-serif", position: "relative" }}>
      <style>{GUTTER_CSS}</style>
      {header}
      <aside className="hideMob leftSidebarScroll" style={leftSidebarStyle}>{sidebarContent}</aside>
      {mobileMenuOpen && (<><div onClick={() => setMobileMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 120 }} /><div className="leftSidebarScroll" style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: "280px", background: sideBg, zIndex: 130, overflowY: "auto", overflowX: "hidden", overscrollBehaviorY: "contain", WebkitOverflowScrolling: "touch" }}>{sidebarContent}</div></>)}
      <main className="mainResponsive" style={{ marginLeft: "280px", marginRight: "56px", minWidth: 0, width: "auto", paddingTop: "57px", position: "relative", zIndex: 1 }}>
        <div style={{ padding: "16px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", background: middleBg, borderRadius: "24px", border: `1px solid ${middleCardBorder}`, overflow: "hidden", position: "relative" }}>
            <div className="heroGlow" style={{ position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)", width: "600px", height: "400px", background: isLight ? "radial-gradient(ellipse at center, rgba(124,58,237,0.20), transparent 70%)" : "radial-gradient(ellipse at center, rgba(124,58,237,0.25), transparent 70%)", pointerEvents: "none" }} />
            <div className="heroPad" style={{ minHeight: "calc(100vh - 57px - 32px)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "32px 32px 24px" }}>
              <div style={{ textAlign: "center" }}>
                <div onClick={() => navTo('why-private')} style={{ display: "inline-flex", gap: "6px", background: isSun ? "#F0FDF4" : "rgba(34,197,94,0.08)", border: isSun ? "1px solid #BBF7D0" : "1px solid rgba(34,197,94,0.2)", borderRadius: "999px", padding: "6px 12px", fontSize: "11px", color: isSun ? "#15803D" : "rgba(255,255,255,0.7)", cursor: "pointer" }}>🔒 100% Private • Your files never leave your device ↗</div>
                <h1 className="heroTitle" style={{ fontSize: "38px", fontWeight: 700, marginTop: "20px", color: middleText }}>Your PDFs, edited by Lexi</h1>
                <div style={{ fontSize: "14px", color: middleMuted, marginTop: "12px" }}>Merge, split, compress, sign & chat with your docs - English • French • Chinese • +40 languages</div>
              </div>
              <div className="heroGrid" style={{ display: "grid", gridTemplateColumns: "2.2fr 0.8fr", gap: "16px", marginTop: "32px", alignItems: "stretch" }}>
                <div style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", padding: "22px", display: "flex", flexDirection: "column" }}>
                  <div style={{ position: "relative", width: "100%" }}>
                    {chatAttached && (<div style={{ display: "flex", alignItems: "center", gap: "8px", background: isSun ? "#EFF6FF" : "rgba(59,130,246,0.15)", border: `1px solid ${middleCardBorder}`, borderRadius: "999px", padding: "6px 10px", fontSize: "12px", color: middleText, marginBottom: "8px" }}><span>📎</span><span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{chatAttached}</span><button onClick={() => setChatAttached(null)} aria-label="Remove attachment" style={{ border: "none", background: "transparent", color: middleMuted, cursor: "pointer", fontSize: "12px" }}>✕</button></div>)}<input type="file" ref={chatFileRef} style={{ display: "none" }} accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.mp4,.mov,.txt" onChange={e => { const f = e.target.files?.[0]; if (f) setChatAttached(f.name); }} /><textarea value={chat} onChange={e => setChat(e.target.value)} placeholder={typedText + "|"} style={{ width: "100%", height: "175px", background: isSun ? "#FFFFFF" : "#12121A", border: isSun ? "1px solid #E5E7EB" : "1px solid rgba(255,255,255,0.14)", borderRadius: "12px", padding: "16px 52px 16px 52px", fontSize: "16px", color: middleText, resize: "none", outline: "none", boxSizing: "border-box" }} />
                    <button onClick={() => { chatFileRef.current?.click(); }} title="Attach file" style={{ position: "absolute", left: "12px", bottom: "12px", width: "36px", height: "36px", borderRadius: "999px", background: "transparent", color: middleMuted, border: `1px solid ${middleCardBorder}`, cursor: "pointer", display: "grid", placeItems: "center", fontSize: "20px", fontWeight: 400 }}>+</button><button onClick={handleSend} title="Send" style={{ position: "absolute", right: "12px", bottom: "12px", width: "36px", height: "36px", borderRadius: "999px", background: chat.trim() ? "#2563EB" : (isSun ? "#E5E7EB" : "rgba(255,255,255,0.15)"), color: chat.trim() ? "white" : (isSun ? "#9CA3AF" : "rgba(255,255,255,0.4)"), border: "none", cursor: chat.trim() ? "pointer" : "default", display: "grid", placeItems: "center", boxShadow: chat.trim() ? "0 4px 12px rgba(37,99,235,0.35)" : "none" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5" /><path d="m5 12 7-7 7 7" /></svg>
                    </button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "20px", fontSize: "11px", color: middleMuted }}><span style={{ width: "6px", height: "6px", borderRadius: "999px", background: "#22C55E" }} />Lexi is online - Try an example below</div>
                  <div style={{ position: "relative", marginTop: "16px" }}>
                    <div className="pillRowWrap" style={{ display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "center" }}>{quickPills.map(p => <button key={p} onClick={() => setChat(p)} style={{ fontSize: "11px", background: isSun ? "#FFFFFF" : "rgba(255,255,255,0.04)", border: `1px solid ${middleCardBorder}`, borderRadius: "999px", padding: "7px 14px", color: isSun ? "#374151" : "rgba(255,255,255,0.75)", cursor: "pointer", whiteSpace: "normal", textAlign: "left" }}>{p}</button>)}</div>
                    <div className="pillFade" style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "28px", pointerEvents: "none", background: `linear-gradient(to left, ${middleBg}, transparent)` }} />
                  </div>
                </div>
                <div style={{ background: middleCard, border: `1px ${dragOver ? 'dashed' : 'solid'} ${dragOver ? '#7C3AED' : middleCardBorder}`, borderRadius: "16px", padding: "14px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer" }} onClick={openHomePicker} onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}>
                  <div style={{ width: "100%", maxWidth: "170px", aspectRatio: "3 / 4", background: "white", borderRadius: "10px 0 10px 10px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", padding: "12px", border: "1.5px solid #CBD5E1", boxShadow: isLight ? "0 8px 24px rgba(0,0,0,0.10)" : "0 12px 30px rgba(0,0,0,0.4)" }}>
                    <div style={{ position: "absolute", top: 0, right: 0, width: "32px", height: "32px", background: `linear-gradient(225deg, ${middleCard} 0%, ${middleCard} 50%, #FFFFFF 50%, #FFFFFF 100%)`, borderBottomLeftRadius: "6px", boxShadow: "-1px 1px 2px rgba(0,0,0,0.08)", zIndex: 2, pointerEvents: "none" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: "34px" }}><span style={{ fontSize: "8px", fontWeight: 800, background: fileInfo.color, color: "white", padding: "3px 6px", borderRadius: "4px" }}>{fileInfo.label}</span><span style={{ fontSize: "9px", color: "#4B5563", fontWeight: 700 }}>{fileInfo.meta}</span></div>
                    {hasFiles ? (
                      <div style={{ marginTop: "10px", flex: 1 }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: "#111", lineHeight: 1.3, wordBreak: "break-word" }}>{fileName}</div>
                        <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
                          <div style={{ height: "6px", background: "#E5E7EB", borderRadius: "999px", width: "100%" }} />
                          <div style={{ height: "6px", background: "#E5E7EB", borderRadius: "999px", width: "85%" }} />
                          <div style={{ height: "6px", background: "#E5E7EB", borderRadius: "999px", width: "92%" }} />
                          <div style={{ height: "6px", background: "#E5E7EB", borderRadius: "999px", width: "70%" }} />
                          <div style={{ height: "6px", background: "#E5E7EB", borderRadius: "999px", width: "88%" }} />
                          <div style={{ height: "6px", background: "#E5E7EB", borderRadius: "999px", width: "60%" }} />
                        </div>
                        <div style={{ marginTop: "12px", fontSize: "9px", color: "#22C55E", fontWeight: 600 }}>● Ready to edit with Lexi</div>
                      </div>
                    ) : (
                      <div style={{ marginTop: "10px", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                        {homePickerLoading ? (<div style={{ width: "52px", height: "52px", borderRadius: "999px", background: "#F5F3FF", display: "grid", placeItems: "center" }}><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#E5E7EB" strokeWidth="3" /><path d="M12 2a10 10 0 0 1 10 10" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" /></path></svg></div>) : (<div style={{ width: "52px", height: "52px", borderRadius: "999px", background: "#F3F4F6", display: "grid", placeItems: "center", fontSize: "22px", color: "#4B5563" }}>📄</div>)}
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#111", marginTop: "10px" }}>{homePickerLoading ? "Opening..." : "Drop a file or"}</div>
                        <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "4px", lineHeight: 1.4 }}>{homePickerLoading ? "File picker is opening..." : (<>Click + to choose<br />PDF, Word, Excel</>)}</div>
                        <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px", alignItems: "center", width: "100%" }}><div style={{ height: "6px", background: "#CBD5E1", borderRadius: "999px", width: "70%" }} /><div style={{ height: "6px", background: "#CBD5E1", borderRadius: "999px", width: "70%" }} /><div style={{ height: "6px", background: "#CBD5E1", borderRadius: "999px", width: "50%" }} /></div>
                      </div>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); openHomePicker(); }} title="Add another document" style={{ position: "absolute", bottom: "14px", right: "14px", width: "36px", height: "36px", borderRadius: "999px", background: "#7C3AED", color: "white", border: "2px solid white", fontSize: "20px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(124,58,237,0.5)", display: "grid", placeItems: "center" }}>+</button>
                    <input ref={fileRef} type="file" style={{ display: "none" }} onChange={handleFile} />
                  </div>
                  <div style={{ marginTop: "12px", fontSize: "10px", color: isSun ? "#1D4ED8" : "#93C5FD", background: isSun ? "#EFF6FF" : "rgba(59,130,246,0.15)", border: isSun ? "1px solid #DBEAFE" : "1px solid rgba(59,130,246,0.2)", borderRadius: "999px", padding: "6px 10px", textAlign: "center", width: "100%" }}>PDF, Word, Excel • 20 MB</div>
                  <div style={{ marginTop: "8px", fontSize: "10px", color: middleMuted, textAlign: "center", wordBreak: "break-word", maxWidth: "100%" }}>{fileName}</div>
                  <div style={{ marginTop: "6px", fontSize: "10px", color: middleMuted }}>🔒 Never leaves your device</div>
                </div>
              </div>
              <div style={{ textAlign: "center", marginTop: "28px", fontSize: "11px", color: middleFaint }}>↓ Scroll to discover more ↓</div>
            </div>

            <div style={{ marginTop: "48px", padding: "64px 24px 0", borderTop: `1px solid ${middleCardBorder}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ fontSize: "10px", letterSpacing: "0.1em", color: middleFaint }}>MY FILES</div><div style={{ display: "flex", gap: "12px", alignItems: "center" }}><div style={{ fontSize: "10px", color: isSun ? "#15803D" : "#4ADE80" }}>{hasFiles ? "● 3 ACTIVE • 12 TOTAL" : "● NO FILES YET"}</div><button onClick={() => setShowAllPdfs(!showAllPdfs)} style={{ fontSize: "11px", background: "transparent", border: "none", color: "#7C3AED", cursor: "pointer", fontWeight: 600 }}>{showAllPdfs ? "Show less ←" : "View all →"}</button></div></div>
              {!hasFiles ? (
                <div style={{ marginTop: "16px", background: middleCard, border: isSun ? "1px dashed #E5E7EB" : "1px dashed rgba(255,255,255,0.12)", borderRadius: "16px", padding: "24px", textAlign: "center" }}>
                  <div style={{ fontSize: "28px", color: middleMuted }}>📄</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: middleText, marginTop: "10px" }}>No files yet</div>
                  <div style={{ fontSize: "11px", color: middleMuted, marginTop: "4px" }}>Drop a file above to start, or try an example file.</div>
                  <button onClick={() => goWorkspace("Contract-Tangier-2024.pdf")} style={{ marginTop: "14px", background: isSun ? "#111" : "white", color: isSun ? "white" : "black", borderRadius: "999px", padding: "8px 16px", fontSize: "12px", fontWeight: 600, border: "none", cursor: "pointer" }}>Try an example file →</button>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}><CarouselArrows id="filesCarousel" middleCardBorder={middleCardBorder} middleCard={middleCard} middleText={middleText} /></div>
                  <div className="pdfGrid hscroll" id="filesCarousel" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginTop: "8px" }}>{pdfs.slice(0, 3).map(pdf => (
                    <div key={pdf.name} style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", padding: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}><div style={{ width: "32px", height: "36px", borderRadius: "6px", background: isSun ? "#FFFFFF" : "rgba(255,255,255,0.04)", borderTop: `3px solid ${pdf.color}`, display: "grid", placeItems: "center" }}><span style={{ fontSize: "9px", fontWeight: 700, color: pdf.color }}>{pdf.type}</span></div><span style={{ fontSize: "10px", background: isSun ? "#FFFFFF" : "rgba(255,255,255,0.04)", padding: "3px 8px", borderRadius: "999px", color: middleMuted }}>{pdf.pages}</span></div>
                      <div style={{ marginTop: "14px", fontSize: "12px", fontWeight: 600, color: middleText }}>{pdf.name}</div><div style={{ fontSize: "11px", color: middleMuted }}>{pdf.size} • {pdf.edited}</div>
                      <button onClick={() => goWorkspace(pdf.name)} style={{ marginTop: "12px", width: "100%", background: isSun ? "#111" : "white", color: isSun ? "white" : "black", borderRadius: "999px", padding: "8px", fontSize: "12px", fontWeight: 600, border: "none", cursor: "pointer" }}>Open</button>
                    </div>))}
                  </div>
                  <div className="adBanner" style={{ marginTop: "16px", background: "white", borderRadius: "16px", padding: "16px", display: "flex", gap: "14px", alignItems: "center", border: "1px solid #E5E7EB" }}>
                    <div style={{ width: "56px", height: "56px", background: "linear-gradient(135deg,#F59E0B,#EC4899)", borderRadius: "12px", display: "grid", placeItems: "center", fontSize: "24px", flexShrink: 0 }}>✨</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}><span style={{ fontSize: "9px", color: "#6B7280", border: "1px solid #E5E7EB", padding: "2px 5px", borderRadius: "4px" }}>Ad</span><span style={{ fontSize: "10px", color: "#E5E7EB" }}>Sponsored</span></div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#111", marginTop: "4px" }}>AI PDF Summarizer - Read 100 Pages in 1 Minute</div>
                      <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "2px" }}>Upload your PDF, get a 3-line summary instantly. Free trial.</div>
                    </div>
                    <button style={{ background: "#111827", color: "white", border: "none", borderRadius: "999px", padding: "8px 16px", fontSize: "12px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>Try Now</button>
                  </div>
                  {showAllPdfs && (
                    <div className="pdfGrid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginTop: "16px" }}>{pdfs.slice(3, 6).map(pdf => (
                      <div key={pdf.name} style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", padding: "16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><div style={{ width: "32px", height: "36px", borderRadius: "6px", background: isSun ? "#FFFFFF" : "rgba(255,255,255,0.04)", borderTop: `3px solid ${pdf.color}`, display: "grid", placeItems: "center" }}><span style={{ fontSize: "9px", fontWeight: 700, color: pdf.color }}>{pdf.type}</span></div><span style={{ fontSize: "10px", background: isSun ? "#FFFFFF" : "rgba(255,255,255,0.04)", padding: "3px 8px", borderRadius: "999px", color: middleMuted }}>{pdf.pages}</span></div>
                        <div style={{ marginTop: "14px", fontSize: "12px", fontWeight: 600, color: middleText }}>{pdf.name}</div><div style={{ fontSize: "11px", color: middleMuted }}>{pdf.size} • {pdf.edited}</div>
                        <button onClick={() => goWorkspace(pdf.name)} style={{ marginTop: "12px", width: "100%", background: isSun ? "#111" : "white", color: isSun ? "white" : "black", borderRadius: "999px", padding: "8px", fontSize: "12px", fontWeight: 600, border: "none", cursor: "pointer" }}>Open</button>
                      </div>))}
                    </div>
                  )}
                </>
              )}
            </div>

            <div style={{ marginTop: "48px", padding: "64px 24px 0", borderTop: `1px solid ${middleCardBorder}` }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.12em", color: "#7C3AED" }}>SECTION 2 • TRY IN ONE CLICK</div>
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: middleText, marginTop: "8px" }}>What can Lexi do for you?</h2>
              <div style={{ fontSize: "13px", color: middleMuted, marginTop: "6px" }}>Click a tool, Lexi opens it for you. No menus, no Acrobat.</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
                <div style={{ flex: 1 }} />
                <CarouselArrows id="toolsCarousel" middleCardBorder={middleCardBorder} middleCard={middleCard} middleText={middleText} />
              </div>
              <div className="pdfGrid hscroll" id="toolsCarousel" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginTop: "8px" }}>
                {[
                  { id: 1, en: "Merge PDF", icon: "🔗", desc: "Combine many PDFs into one clean file.", tag: "FREE" },
                  { id: 2, en: "Split PDF", icon: "✂", desc: "Split by pages or extract what you need.", tag: "FREE" },
                  { id: 3, en: "Compress PDF", icon: "🗜", desc: "Shrink under 2MB without losing quality.", tag: "FREE" },
                  { id: 17, en: "Sign PDF", icon: "✍", desc: "Add your signature in one chat.", tag: "FREE" },
                  { id: 22, en: "Summarize Contract in 3 Lines", icon: "⚡", desc: "Understand a 120-page contract in seconds.", tag: "PRO" },
                  { id: 28, en: "Translate PDF - Keep Design", icon: "🌍", desc: "Translate and keep the original layout.", tag: "PRO" },
                ].map(t => (
                  <div key={t.id} onClick={() => handleToolClick(t)} style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", padding: "16px", cursor: "pointer" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: "22px" }}>{t.icon}</span><span style={{ fontSize: "9px", color: t.tag === "PRO" ? "white" : isSun ? "#15803D" : "#4ADE80", padding: "3px 8px", borderRadius: "999px", fontWeight: 700, background: t.tag === "PRO" ? "#7C3AED" : isSun ? "#DCFCE7" : "rgba(34,197,94,0.15)" }}>{t.tag}</span></div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: middleText, marginTop: "12px", overflowWrap: "anywhere" }}>{t.en}</div>
                    <div style={{ fontSize: "11px", color: middleMuted, marginTop: "4px", lineHeight: 1.5, overflowWrap: "anywhere" }}>{t.desc}</div>
                    <div style={{ fontSize: "11px", color: "#7C3AED", marginTop: "10px", fontWeight: 600 }}>Try with Lexi →</div>
                  </div>
                ))}
                {mobileAdCard}
              </div>
                  <div style={{ marginTop: "16px", background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", minWidth: 0 }}>
                <div style={{ minWidth: 0 }}><div style={{ fontSize: "13px", fontWeight: 600, color: middleText }}>Multi-file mode</div><div style={{ fontSize: "11px", color: middleMuted, marginTop: "4px", overflowWrap: "anywhere" }}>Drop 2+ PDFs, Lexi will auto-detect: merge, compare, or extract.</div></div>
                <div style={{ display: "flex", gap: "8px" }}><div style={{ background: isSun ? "#FFFFFF" : "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "10px 18px", fontSize: "11px", color: middleMuted }}>PDF A</div><div style={{ background: isSun ? "#FFFFFF" : "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "10px 18px", fontSize: "11px", color: middleMuted }}>PDF B</div></div>
              </div>
            </div>
            <div className="adBanner" style={{ margin: "48px 24px 0", background: "white", borderRadius: "12px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px", border: "1px solid #E5E7EB" }} data-dup-ad>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "9px", color: "#6B7280", border: "1px solid #E5E7EB", padding: "2px 5px", borderRadius: "4px", width: "fit-content" }}>Ad</span>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#111" }}>Merge, Split & Compress PDFs in 1 Click</div>
                <div style={{ fontSize: "12px", color: "#6B7280" }}>Trusted by 2M+ users • No install • 100% Free to try</div>
                <div style={{ fontSize: "10px", color: "#2563EB" }}>pdftools-pro.com</div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "90px", height: "60px", background: "linear-gradient(135deg,#7C3AED,#EC4899)", borderRadius: "8px", display: "grid", placeItems: "center", fontSize: "24px" }}>📦</div>
                <button style={{ background: "#2563EB", color: "white", border: "none", borderRadius: "999px", padding: "10px 20px", fontSize: "12px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>Try Free →</button>
              </div>
            </div>
            
            <div style={{ marginTop: "48px", padding: "64px 24px 0", borderTop: `1px solid ${middleCardBorder}` }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.12em", color: "#2563EB" }}>SECTION 3 • HOW IT WORKS</div>
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: middleText, marginTop: "8px" }}>Your PDF workflow, simplified</h2>
              <div style={{ fontSize: "13px", color: middleMuted, marginTop: "6px" }}>Three simple steps. No complicated software or menus.</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginTop: "20px" }} className="pdfGrid">
                <div style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: "22px" }}>📁</span><span style={{ fontSize: "11px", fontWeight: 700, color: "#7C3AED" }}>01</span></div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: middleText, marginTop: "12px" }}>Add your files</div>
                  <div style={{ fontSize: "12px", color: middleMuted, marginTop: "6px", lineHeight: 1.6 }}>Choose a PDF from your device or drop it into the workspace.</div>
                </div>
                <div style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: "22px" }}>💬</span><span style={{ fontSize: "11px", fontWeight: 700, color: "#7C3AED" }}>02</span></div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: middleText, marginTop: "12px" }}>Tell Lexi what you need</div>
                  <div style={{ fontSize: "12px", color: middleMuted, marginTop: "6px", lineHeight: 1.6 }}>Describe the task in everyday language, or choose one of the available tools.</div>
                </div>
                <div style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: "22px" }}>✨</span><span style={{ fontSize: "11px", fontWeight: 700, color: "#7C3AED" }}>03</span></div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: middleText, marginTop: "12px" }}>Review your result</div>
                  <div style={{ fontSize: "12px", color: middleMuted, marginTop: "6px", lineHeight: 1.6 }}>Check the result and download your processed document.</div>
                </div>
              </div>
              <button onClick={() => navTo('how')} style={{ marginTop: "16px", background: "transparent", border: `1px solid ${middleCardBorder}`, borderRadius: "999px", padding: "8px 16px", fontSize: "12px", color: middleText, cursor: "pointer" }}>See the full guide →</button>
            </div>

            <div style={{ marginTop: "48px", padding: "64px 24px 0", borderTop: `1px solid ${middleCardBorder}` }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.12em", color: "#B45309" }}>SECTION 4 • USE CASES</div>
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: middleText, marginTop: "8px" }}>Made for the documents you work with every day</h2>
              <div style={{ fontSize: "13px", color: middleMuted, marginTop: "6px" }}>From everyday PDF tasks to more demanding document workflows.</div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}><CarouselArrows id="useCasesCarousel" middleCardBorder={middleCardBorder} middleCard={middleCard} middleText={middleText} /></div>
              <div className="pdfGrid hscroll" id="useCasesCarousel" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginTop: "8px" }}>
                <div style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", padding: "20px" }}><div style={{ fontSize: "22px", color: "#334155", filter: isSun ? "brightness(0.25) saturate(1.4)" : "none" }}>⚖</div><div style={{ fontSize: "13px", fontWeight: 700, color: middleText, marginTop: "10px" }}>Legal professionals</div><div style={{ fontSize: "12px", color: middleMuted, marginTop: "6px", lineHeight: 1.6 }}>Summarize contracts, compare agreements, and review clauses that may need closer attention.</div></div>
                <div style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", padding: "20px" }}><div style={{ fontSize: "22px" }}>🏢</div><div style={{ fontSize: "13px", fontWeight: 700, color: middleText, marginTop: "10px" }}>Businesses & teams</div><div style={{ fontSize: "12px", color: middleMuted, marginTop: "6px", lineHeight: 1.6 }}>Organize invoices, extract document data, and handle batches of PDF files.</div></div>
                <div style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", padding: "20px" }}><div style={{ fontSize: "22px" }}>🎓</div><div style={{ fontSize: "13px", fontWeight: 700, color: middleText, marginTop: "10px" }}>Students & researchers</div><div style={{ fontSize: "12px", color: middleMuted, marginTop: "6px", lineHeight: 1.6 }}>Combine study materials, extract text, compress documents, and ask questions about PDFs.</div></div>
                <div style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", padding: "20px" }}><div style={{ fontSize: "22px" }}>💼</div><div style={{ fontSize: "13px", fontWeight: 700, color: middleText, marginTop: "10px" }}>Freelancers</div><div style={{ fontSize: "12px", color: middleMuted, marginTop: "6px", lineHeight: 1.6 }}>Prepare proposals, manage client documents, and keep files ready to share.</div></div>
                <div style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", padding: "20px" }}><div style={{ fontSize: "22px" }}>👤</div><div style={{ fontSize: "13px", fontWeight: 700, color: middleText, marginTop: "10px" }}>Job seekers</div><div style={{ fontSize: "12px", color: middleMuted, marginTop: "6px", lineHeight: 1.6 }}>Work on CVs and supporting documents, and tailor a CV to a job offer.</div></div>
                <div style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", padding: "20px" }}><div style={{ fontSize: "22px" }}>🏠</div><div style={{ fontSize: "13px", fontWeight: 700, color: middleText, marginTop: "10px" }}>Everyday users</div><div style={{ fontSize: "12px", color: middleMuted, marginTop: "6px", lineHeight: 1.6 }}>Sign, convert, rotate, split, and organize personal documents with less effort.</div></div>
              </div>
            </div>

            <div style={{ marginTop: "48px", padding: "64px 24px 0", borderTop: `1px solid ${middleCardBorder}` }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.12em", color: "#B45309" }}>SECTION 5 • WATCH LEXI IN ACTION</div>
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: middleText, marginTop: "8px" }}>See how Lexi changes the way you work with PDFs</h2>
              <div style={{ fontSize: "13px", color: middleMuted, marginTop: "6px" }}>First, hear a real experience. Then, see how simple it is to use.</div>
              <div style={{ marginTop: "20px", borderRadius: "20px", overflow: "hidden", border: `1px solid ${middleCardBorder}`, background: "linear-gradient(135deg,#1E1B4B,#7C3AED,#EC4899)", position: "relative", cursor: "pointer" }}>
                <div style={{ aspectRatio: "16 / 9", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center" }}>
                  <div style={{ width: "72px", height: "72px", borderRadius: "999px", background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.5)", display: "grid", placeItems: "center", fontSize: "28px", color: "white" }}>▶</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "white", marginTop: "16px" }}>Watch: A user shares her experience, then see how Lexi works</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)", marginTop: "6px" }}>Her story • Then 3 simple steps: Drop your PDF → Tell Lexi → Download • 100% Private</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", marginTop: "8px", background: "rgba(0,0,0,0.3)", padding: "4px 10px", borderRadius: "999px" }}>▶ Click to play • Video loads only when you play it</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "11px", background: middleCard, border: `1px solid ${middleCardBorder}`, borderRadius: "999px", padding: "6px 12px", color: middleText }}>Part 1 — Her experience with Lexi</span>
                <span style={{ fontSize: "11px", background: middleCard, border: `1px solid ${middleCardBorder}`, borderRadius: "999px", padding: "6px 12px", color: middleText }}>Part 2 — How Lexi works in 3 steps</span>
                <span style={{ fontSize: "11px", background: middleCard, border: `1px solid ${middleCardBorder}`, borderRadius: "999px", padding: "6px 12px", color: middleText }}>100% Private • No upload</span>
              </div>
            </div>
<div style={{ marginTop: "48px", padding: "64px 24px 0", borderTop: `1px solid ${middleCardBorder}` }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.12em", color: "#22C55E" }}>SECTION 6 • SECURITY & PRIVACY</div>
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "20px", marginTop: "12px", alignItems: "start" }} className="pdfGrid splitGrid">
                <div>
                  <h2 style={{ fontSize: "22px", fontWeight: 700, color: middleText, marginTop: "0" }}>Your documents deserve careful handling</h2>
                  <div style={{ fontSize: "13px", color: middleMuted, marginTop: "10px", lineHeight: 1.7 }}>PDFlexi is 100% Private. Your files never leave your device. Everything happens in your browser, on your device. No upload. No storage. No one else can see your documents — not even us.</div>
                  <button onClick={() => navTo('why-private')} style={{ marginTop: "16px", background: "transparent", border: `1px solid ${middleCardBorder}`, borderRadius: "999px", padding: "8px 16px", fontSize: "12px", color: middleText, cursor: "pointer" }}>Explore privacy & security →</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "12px", padding: "14px", display: "flex", gap: "10px" }}><span style={{ fontSize: "16px" }}>🔒</span><div><div style={{ fontSize: "12px", fontWeight: 700, color: middleText }}>100% Private • LOCAL</div><div style={{ fontSize: "11px", color: middleMuted, marginTop: "3px", lineHeight: 1.5 }}>Your files never leave your device. No upload, no cloud, no storage.</div></div></div>
                  <div style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "12px", padding: "14px", display: "flex", gap: "10px" }}><span style={{ fontSize: "16px", color: "#334155", filter: isSun ? "brightness(0.25) saturate(1.4)" : "none", flexShrink: 0 }}>👁</span><div><div style={{ fontSize: "12px", fontWeight: 700, color: middleText }}>Clear & transparent</div><div style={{ fontSize: "11px", color: middleMuted, marginTop: "3px", lineHeight: 1.5 }}>You always know what Lexi is doing with your PDF before you download it.</div></div></div>
                  <div style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "12px", padding: "14px", display: "flex", gap: "10px" }}><span style={{ fontSize: "16px", color: "#334155", filter: isSun ? "brightness(0.25) saturate(1.4)" : "none", flexShrink: 0 }}>🛡</span><div><div style={{ fontSize: "12px", fontWeight: 700, color: middleText }}>Your control</div><div style={{ fontSize: "11px", color: middleMuted, marginTop: "3px", lineHeight: 1.5 }}>Review what Lexi will do before proceeding. You decide, Lexi executes.</div></div></div>
                </div>
              </div>
            </div>
<div style={{ marginTop: "48px", padding: "64px 24px 0", borderTop: `1px solid ${middleCardBorder}` }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.12em", color: "#22C55E" }}>SECTION 7 • ABOUT PDFLEXI</div>
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: middleText, marginTop: "8px" }}>Everything you need to know about PDFlexi</h2>
              <div style={{ fontSize: "13px", color: middleMuted, marginTop: "6px" }}>Click a question to see the answer.</div>
              <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {faqs.map((f, i) => (
                  <div key={f.q} style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "12px", overflow: "hidden" }}>
                    <button onClick={() => setFaqOpen(i)} style={{ width: "100%", textAlign: "left", background: faqOpen === i ? "rgba(124,58,237,0.12)" : "transparent", border: "none", padding: "14px 16px", fontSize: "13px", color: middleText, fontWeight: 600, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>{f.q}<span style={{ fontSize: "12px", color: middleMuted }}>{faqOpen === i ? "▾" : "▸"}</span></button>
                    {faqOpen === i && <div style={{ fontSize: "12px", color: middleMuted, padding: "0 16px 14px", lineHeight: 1.6 }}>{f.a}</div>}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: "48px", padding: "64px 24px 0", borderTop: `1px solid ${middleCardBorder}` }}>
              <div style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899)", borderRadius: "20px", padding: "36px 24px", textAlign: "center" }}>
                <div style={{ fontSize: "26px", fontWeight: 700, color: "white" }}>Ready to try Lexi?</div>
                <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)", marginTop: "8px" }}>Drop your first PDF and see what Lexi can do in 10 seconds. No install, no account needed to try.</div>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "20px", flexWrap: "wrap" }}>
                  <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ background: "white", color: "black", borderRadius: "999px", padding: "12px 24px", fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer" }}>Start now - It\'s free →</button>
                  <button onClick={() => navTo('how')} style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "999px", padding: "12px 24px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>See How it works</button>
                </div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", marginTop: "12px" }}>No install • 100% Private • Free forever</div>
              </div>
            </div>
            <div className="adBanner" style={{ margin: "48px 24px 0", background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "12px", padding: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ display: "flex", gap: "12px", alignItems: "center" }}><div style={{ width: "32px", height: "32px", borderRadius: "8px", background: isSun ? "#FFFFFF" : "rgba(255,255,255,0.06)", display: "grid", placeItems: "center" }}>📊</div><div><div style={{ fontSize: "11px", color: middleFaint }}>SPONSORED • Featured</div><div style={{ fontSize: "13px", fontWeight: 600, color: middleText }}>Convert Invoice PDF to Excel</div></div></div><button style={{ fontSize: "11px", background: isSun ? "#FFFFFF" : "rgba(255,255,255,0.06)", border: `1px solid ${middleCardBorder}`, borderRadius: "999px", padding: "6px 12px", color: middleText }}>Try now</button></div>
            <div style={{ padding: "48px 0 0" }}>{footer}</div>
          </div>
        </div>
      </main>
      {rightBar}
      {userMenu}
    </div>
  );
}