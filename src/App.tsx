import "./styles/mobile-homepage.css";
import React, { useState, useRef, useEffect, Suspense, lazy } from "react";
import Header, { UserMenu } from "./components/Header";
import Sidebar from "./components/Sidebar";
import { WhyPrivatePage, LegalPage, HowPage, PlansPage } from "./features/pages/StaticPages";
import { HomePage } from "./features/home/HomePage";
import { RightBar } from "./features/shell/RightBar";
import { chatPlaceholders, getFileInfo } from "./data/showcase";
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
  const rightBar = (
    <RightBar
      sideBg={sideBg}
      sideBorder={sideBorder}
      isSun={isSun}
      isLight={isLight}
      rightActive={rightActive}
      setRightActive={setRightActive}
      rightHover={rightHover}
      setRightHover={setRightHover}
      setTheme={setTheme}
      setShowSettingsPopup={setShowSettingsPopup}
      setShowHelpPopup={setShowHelpPopup}
      setUserMenuOpen={setUserMenuOpen}
      copiedEmail={copiedEmail}
      setCopiedEmail={setCopiedEmail}
      settingsLang={settingsLang}
      setSettingsLang={setSettingsLang}
      settingsNotifications={settingsNotifications}
      setSettingsNotifications={setSettingsNotifications}
      middleCard={middleCard}
      middleCardBorder={middleCardBorder}
      middleBg={middleBg}
      middleText={middleText}
      middleMuted={middleMuted}
      showSettingsPopup={showSettingsPopup}
      showHelpPopup={showHelpPopup}
      navTo={navTo}
    />
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
    <HomePage
      isSun={isSun}
      isLight={isLight}
      outerBg={outerBg}
      middleBg={middleBg}
      middleText={middleText}
      middleMuted={middleMuted}
      middleFaint={middleFaint}
      middleCard={middleCard}
      middleCardBorder={middleCardBorder}
      sideBg={sideBg}
      header={header}
      sidebarContent={sidebarContent}
      rightBar={rightBar}
      userMenu={userMenu}
      footer={footer}
      leftSidebarStyle={leftSidebarStyle}
      mobileMenuOpen={mobileMenuOpen}
      setMobileMenuOpen={setMobileMenuOpen}
      navTo={navTo}
      fileName={fileName}
      hasFiles={hasFiles}
      fileInfo={fileInfo}
      fileRef={fileRef}
      chatFileRef={chatFileRef}
      dragOver={dragOver}
      setDragOver={setDragOver}
      homePickerLoading={homePickerLoading}
      openHomePicker={openHomePicker}
      handleDrop={handleDrop}
      handleFile={handleFile}
      chat={chat}
      setChat={setChat}
      chatAttached={chatAttached}
      setChatAttached={setChatAttached}
      typedText={typedText}
      handleSend={handleSend}
      handleToolClick={handleToolClick}
      goWorkspace={goWorkspace}
      mobileAdCard={mobileAdCard}
      faqOpen={faqOpen}
      setFaqOpen={setFaqOpen}
      showAllPdfs={showAllPdfs}
      setShowAllPdfs={setShowAllPdfs}
    />
  );
}
