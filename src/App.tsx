import React, { useState, useRef, useEffect } from "react";

const pdfs = [
  { name: "Contract-Tangier-2024.pdf", size: "2.4 MB", pages: "12 pages", color: "#8B5CF6", edited: "edited 2h ago" },
  { name: "Invoice_Client-A.pdf", size: "1.1 MB", pages: "3 pages", color: "#06B6D4", edited: "edited Yesterday" },
  { name: "CV_Kamal_Design.pdf", size: "890 KB", pages: "2 pages", color: "#F59E0B", edited: "edited 2 days ago" },
  { name: "Portfolio_Final.pdf", size: "8.2 MB", pages: "24 pages", color: "#EC4899", edited: "edited 3 days ago" },
  { name: "Nda-Agreement.pdf", size: "540 KB", pages: "5 pages", color: "#10B981", edited: "edited 4 days ago" },
  { name: "Presentation_Pitch.pdf", size: "4.7 MB", pages: "18 pages", color: "#6366F1", edited: "edited 5 days ago" },
];
const quickPills = ["Merge Q3 invoices into one PDF", "Compress report under 2MB", "Split contract by pages", "Add signature to invoice", "Summarize 120-page spec"];
const chatPlaceholders = [
  "Ask Lexi to merge, split, compress or edit...",
  "Merge Q3 invoices into one PDF...",
  "Compress this report under 2MB...",
  "Split this contract by pages...",
  "Add my signature to this invoice...",
  "Summarize this 120-page contract in 3 lines...",
  "Translate this PDF to French, keep design...",
];
const testimonials = [
  { name: "Yasmine T.", role: "Architect, Casablanca", text: "Lexi split my 200-page PDF in 10 seconds. Super fast.", avatar: "YT", via: "via Instagram" },
  { name: "Mehdi L.", role: "Freelancer, Rabat", text: "Finally a PDF tool that understands plain chat. Merged contracts without opening Acrobat.", avatar: "ML", via: "via X" },
  { name: "Sofia B.", role: "Lawyer, Tangier", text: "Compress + Sign in one chat. Saved me 2 hours every week.", avatar: "SB", via: "via Threads" },
];
const faqs = [
  { q: "What is PDFlexi?", a: "PDFlexi is a PDF platform where you edit your PDFs by chatting with Lexi. Merge, split, compress, sign, summarize and translate - just by typing what you want in plain words." },
  { q: "How does Lexi work?", a: "Drop your PDF, then ask Lexi in English, French, Darija or 40+ languages. Example: 'Merge these invoices' or 'Compress under 2MB'. Lexi does it for you in your browser." },
  { q: "Is PDFlexi free?", a: "Yes. Free gives you 20 free tools without daily limits, plus +3 credits per day for advanced tools. Pro gives you +500 credits per month, 10 advanced AI tools, 100 MB upload and no ads for $12 / month (or $9 / month yearly). Free tools cost 0 credits, advanced tools cost credits." },
  { q: "Is it really 100% private?", a: "Yes. All tools run 100% in your browser (LOCAL). Your files never leave your device, never uploaded to our servers, never stored." },
  { q: "What languages does Lexi speak?", a: "English, French, Darija and 40+ languages. You can talk to Lexi in the language you are most comfortable with." },
  { q: "Do I need to install anything?", a: "No. PDFlexi works directly in your browser on computer and mobile. No install, no Acrobat, no account needed to try." },
];
const freeTools = [
  { id: 1, en: "Merge PDF", icon: "🔗" }, { id: 2, en: "Split PDF", icon: "✂" }, { id: 3, en: "Compress PDF", icon: "🗜" }, { id: 4, en: "PDF to Word", icon: "📄" }, { id: 5, en: "Word to PDF", icon: "📝" },
  { id: 6, en: "PDF to Excel", icon: "📊" }, { id: 7, en: "Excel to PDF", icon: "📈" }, { id: 8, en: "PDF to JPG", icon: "🖼" }, { id: 9, en: "JPG to PDF", icon: "🖌" }, { id: 10, en: "Delete Pages", icon: "🗑" },
  { id: 11, en: "Rotate Pages", icon: "🔄" }, { id: 12, en: "Reorder Pages", icon: "↕" }, { id: 13, en: "Watermark", icon: "💧" }, { id: 14, en: "Page Numbers", icon: "🔢" }, { id: 15, en: "Protect PDF", icon: "🛡" },
  { id: 16, en: "Unlock PDF", icon: "🔑" }, { id: 17, en: "Sign PDF", icon: "✍" }, { id: 18, en: "Edit PDF", icon: "✏" }, { id: 19, en: "Repair PDF", icon: "🛠" }, { id: 20, en: "OCR - Extract Text", icon: "👁" },
];
const proTools = [
  { id: 21, en: "Chat with PDF", icon: "💬" }, { id: 22, en: "Summarize Contract in 3 Lines", icon: "⚡" }, { id: 23, en: "Detect Risky Clauses", icon: "⚠" }, { id: 24, en: "Detect Forgery", icon: "🕵" }, { id: 25, en: "Compare Two Contracts", icon: "⚖" },
  { id: 26, en: "Extract Invoices to Excel", icon: "🧾" }, { id: 27, en: "Fill Form by Chat", icon: "📋" }, { id: 28, en: "Translate PDF - Keep Design", icon: "🌍" }, { id: 29, en: "Smart CV from Job Offer", icon: "🚀" }, { id: 30, en: "Bulk Stamp 100 Docs", icon: "📦" },
];
const recentFiles = [
  { name: "Contract-Tangier-2024.pdf", time: "2h ago", color: "#8B5CF6" },
  { name: "Invoice_Client-A.pdf", time: "Yesterday", color: "#06B6D4" },
  { name: "CV_Kamal_Design.pdf", time: "2 days ago", color: "#F59E0B" },
];

const getFileInfo = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.endsWith(".txt")) return { label: "TXT", color: "#6B7280", meta: "Text file" };
  if (lower.endsWith(".doc") || lower.endsWith(".docx")) return { label: "DOC", color: "#2563EB", meta: "Word document" };
  if (lower.endsWith(".xls") || lower.endsWith(".xlsx")) return { label: "XLS", color: "#059669", meta: "Excel sheet" };
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png") || lower.endsWith(".webp")) return { label: "IMG", color: "#7C3AED", meta: "Image file" };
  return { label: "PDF", color: "#EF4444", meta: "A4 • 12 pages" };
};

const GUTTER_CSS = `*{box-sizing:border-box} html{scrollbar-gutter:stable;overflow-y:scroll} body{margin:0} ::-webkit-scrollbar{width:2px;height:2px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:rgba(124,58,237,0.35);border-radius:999px} ::-webkit-scrollbar-thumb:hover{background:#7C3AED} .leftSidebarScroll{scrollbar-width:thin;scrollbar-color:rgba(124,58,237,0.35) transparent} .leftSidebarScroll::-webkit-scrollbar{width:2px} .leftSidebarScroll::-webkit-scrollbar-track{background:transparent;margin:40px 0} .leftSidebarScroll::-webkit-scrollbar-thumb{background:rgba(124,58,237,0.35);border-radius:999px} .leftSidebarScroll::-webkit-scrollbar-thumb:hover{background:#7C3AED} .hideMob{display:flex} .hamburgerBtn{display:none!important} .mobileOnlyBtn{display:none!important} .rightBar{display:flex} .headerFixed{left:280px!important;right:56px!important} @media(max-width:1100px){.hideMob{display:none!important} .hamburgerBtn{display:grid!important;place-items:center} .mobileOnlyBtn{display:block!important} .hideOnSmall{display:none!important} .rightBar{display:none!important} .headerFixed{left:0!important;right:0!important}} @media(max-width:700px){.heroGrid{grid-template-columns:1fr!important} .pdfGrid{grid-template-columns:1fr 1fr!important} .bottomGrid{grid-template-columns:1fr!important}} @media(max-width:1100px){.mainResponsive{margin-left:0!important;margin-right:0!important} .threeColGrid{grid-template-columns:1fr 1fr!important} .pagePad{padding:32px 20px!important}} @media(max-width:700px){.threeColGrid{grid-template-columns:1fr!important} .twoColGrid{grid-template-columns:1fr!important} .compareGrid{grid-template-columns:1fr!important;gap:6px!important} .splitGrid{grid-template-columns:1fr!important} .heroTitle{font-size:28px!important;line-height:1.2!important} .pageTitle{font-size:26px!important;line-height:1.25!important} .pagePad{padding:24px 16px!important} .heroGlow{width:320px!important;height:240px!important} .heroPad{padding:24px 16px 20px!important} .adBanner{flex-wrap:wrap!important} .headerFixed{padding:0 12px!important}} @media(max-width:480px){.pdfGrid{grid-template-columns:1fr!important} .heroTitle{font-size:24px!important} .pageTitle{font-size:24px!important} .heroGlow{width:260px!important;height:200px!important} .headerFixed{padding:0 10px!important;gap:8px!important}} .plansGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:28px;text-align:left} @media(max-width:1100px){.plansGrid{grid-template-columns:1fr 1fr!important}} @media(max-width:700px){.plansGrid{grid-template-columns:1fr!important}} .plansGrid2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:24px auto 0;max-width:840px;text-align:left} @media(max-width:700px){.plansGrid2{grid-template-columns:1fr!important}}`;

export default function App() {
  const [view, setView] = useState<'homepage' | 'workspace' | 'how' | 'plans' | 'privacy' | 'terms' | 'why-private'>('homepage');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [chat, setChat] = useState("");
  const [fileName, setFileName] = useState("No file selected yet");
  const [dragOver, setDragOver] = useState(false);
  const [activeTool, setActiveTool] = useState("AI Tools");
  const [faqOpen, setFaqOpen] = useState(0);
  const [leftWidth, setLeftWidth] = useState(40);
  const [isDragging, setIsDragging] = useState(false);
  const [wsMsgs, setWsMsgs] = useState<{ role: "user" | "lexi", text: string }[]>([]);
  const [wsInput, setWsInput] = useState("");
  const [wsTool, setWsTool] = useState("Sign");
  const [freeOpen, setFreeOpen] = useState(false);
  const [proOpen, setProOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false); // مغلوق عند فتح الموقع - يفتحه المستخدم بيده
  const [sidebarRecentOpen, setSidebarRecentOpen] = useState(false);
  const [menuProjectsOpen, setMenuProjectsOpen] = useState(false); // مغلوق عند فتح الموقع
  const [menuRecentOpen, setMenuRecentOpen] = useState(false); // مغلوق عند فتح الموقع
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [showAllPdfs, setShowAllPdfs] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // GUEST BY DEFAULT - Sign In + Get Started show. Auth system will set this to true after real login.
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [plansView, setPlansView] = useState<'personal' | 'business'>('personal');
  const [teamsTokens, setTeamsTokens] = useState<number>(2500);
  const [enterpriseTokens, setEnterpriseTokens] = useState<number>(20000);
  // PREPARATION ONLY — Account organization preview. No real backend yet. When real auth/DB is built, this state becomes the real account type.
  const [accountType, setAccountType] = useState<'personal' | 'professional' | 'company'>('personal');
  const [plansFaqOpen, setPlansFaqOpen] = useState<number | null>(0);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [settingsLang, setSettingsLang] = useState("English");
  const [settingsNotifications, setSettingsNotifications] = useState(true);
  const [chatAttached, setChatAttached] = useState<string | null>(null);
  const [wsAttached, setWsAttached] = useState<string | null>(null);
  const [rightActive, setRightActive] = useState<string | null>(null);
  const [rightHover, setRightHover] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const chatFileRef = useRef<HTMLInputElement>(null);
  const wsFileRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isLight = theme === 'light';
  const isSun = !isLight;
  const headerBg = isLight ? '#FFFFFF' : '#0F0F14';
  const outerBg = headerBg;
  const headerBorder = isLight ? '#E5E7EB' : 'rgba(255,255,255,0.06)';
  const sideBg = isSun ? '#FFFFFF' : '#0B0B12';
  const sideBorder = isSun ? '#E5E7EB' : 'rgba(255,255,255,0.06)';
  const sideText = isSun ? '#111111' : 'white';
  const sideMuted = isSun ? '#374151' : 'rgba(255,255,255,0.55)';
  const sideFaint = isSun ? '#4B5563' : 'rgba(255,255,255,0.25)';
  const sideCard = isSun ? '#F3F4F6' : '#1A1A24';
  const sideCardBorder = isSun ? '#E5E7EB' : 'rgba(255,255,255,0.06)';
  const middleBg = isSun ? '#FFFFFF' : '#0F0F14';
  const middleText = isSun ? '#111111' : 'white';
  const middleMuted = isSun ? '#374151' : 'rgba(255,255,255,0.6)';
  const middleCard = isSun ? '#E9EBEE' : '#18181E';
  const middleCardBorder = isSun ? '#E5E7EB' : 'rgba(255,255,255,0.06)';
  const middleFaint = isSun ? '#4B5563' : 'rgba(255,255,255,0.25)';
  const hasFiles = fileName !== "No file selected yet";
  const fileInfo = getFileInfo(fileName);

  const goWorkspace = (name: string, msg?: string) => {
    setFileName(name);
    setWsMsgs([
      { role: "lexi", text: `File ${name} loaded - Ready to edit.` },
      { role: "lexi", text: `Tool ${activeTool} activated for ${name}` },
      ...(msg ? [{ role: "user" as const, text: msg }] : []),
    ]);
    setView('workspace'); setMobileMenuOpen(false);
  };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) goWorkspace(f.name, chat); };
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) goWorkspace(f.name); };
  const handleSend = () => { if (!chat.trim()) return; goWorkspace(fileName === "No file selected yet" ? "My PDF.pdf" : fileName, chat); setChat(""); };
  const handleToolClick = (tool: any) => {
    setActiveTool(tool.en); setMobileMenuOpen(false);
    if (tool.id >= 21) { alert(`${tool.en}\n\nThis is a PRO feature. Upgrade to Pro to unlock it.`); return; }
    goWorkspace(fileName === "No file selected yet" ? "My PDF.pdf" : fileName, `I want to ${tool.en}`);
  };
  const handleUserClick = () => { setUserMenuOpen(!userMenuOpen); setShowSettingsPopup(false); setShowHelpPopup(false); };
  const navTo = (v: 'homepage' | 'how' | 'plans' | 'privacy' | 'terms' | 'why-private') => { setView(v); setMobileMenuOpen(false); setUserMenuOpen(false); setShowSettingsPopup(false); setShowHelpPopup(false); window.scrollTo(0,0); };

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

  useEffect(() => {
    const move = (e: MouseEvent) => { if (!isDragging || !containerRef.current) return; const r = containerRef.current.getBoundingClientRect(); setLeftWidth(Math.min(60, Math.max(25, ((e.clientX - r.left) / r.width) * 100))); };
    const up = () => setIsDragging(false);
    if (isDragging) { window.addEventListener('mousemove', move); window.addEventListener('mouseup', up); }
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
  }, [isDragging]);

  const userMenu = userMenuOpen ? (
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


  const sidebarContent = (
    <div style={{ padding: "16px 16px 0", display: "flex", flexDirection: "column", height: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: isSun ? '#111111' : 'white', display: "grid", placeItems: "center", color: isSun ? 'white' : 'black', fontWeight: 800 }}>P</div>
        <span style={{ fontWeight: 600, color: sideText }}>PDFlexi.</span>
        <button onClick={() => setMobileMenuOpen(false)} style={{ marginLeft: "auto", background: "transparent", border: "none", color: sideMuted, fontSize: "18px", cursor: "pointer" }} className="mobileOnlyBtn">✕</button>
      </div>
      {/* PREPARATION — Account type preview switcher. Mock only, no backend. Lets founder preview Personal / Professional / Company sidebar. */}
      <div style={{ background: sideCard, border: `1px solid ${sideCardBorder}`, borderRadius: "10px", padding: "10px", marginBottom: "12px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "0.08em", color: sideFaint, fontWeight: 700 }}>ACCOUNT PREVIEW • PREPARATION ONLY</div>
        <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
          <button onClick={() => setAccountType('personal')} style={{ flex: 1, padding: "6px 4px", borderRadius: "8px", border: "none", background: accountType === 'personal' ? "#111" : "transparent", color: accountType === 'personal' ? "white" : sideText, fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>Personal</button>
          <button onClick={() => setAccountType('professional')} style={{ flex: 1, padding: "6px 4px", borderRadius: "8px", border: "none", background: accountType === 'professional' ? "#2563EB" : "transparent", color: accountType === 'professional' ? "white" : sideText, fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>Professional</button>
          <button onClick={() => setAccountType('company')} style={{ flex: 1, padding: "6px 4px", borderRadius: "8px", border: "none", background: accountType === 'company' ? "#111" : "transparent", color: accountType === 'company' ? "white" : sideText, fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>Company</button>
        </div>
        <div style={{ fontSize: "10px", color: sideMuted, marginTop: "6px", lineHeight: 1.5 }}>{accountType === 'personal' ? "Free / Pro • 1 person • My files" : accountType === 'professional' ? "Teams • 1 professional • Client folders • 2,500 credits" : "Enterprise • Company • Shared pool • 20,000 credits"}</div>
        {accountType !== 'personal' && (<div style={{ marginTop: "8px", background: isSun ? "#EFF6FF" : "rgba(37,99,235,0.15)", borderRadius: "8px", padding: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: "11px", fontWeight: 700, color: sideText }}>{accountType === 'professional' ? "🪙 2,500 credits" : "🪙 20,000 credits — shared"}</span><span style={{ fontSize: "10px", color: sideMuted }}>{accountType === 'professional' ? "Teams" : "Enterprise"}</span></div>)}
      </div>
      <div onClick={() => { setChat("Hi Lexi, help me with my PDF"); navTo('homepage'); }} style={{ display: "flex", gap: "10px", alignItems: "center", padding: "10px 12px", borderRadius: "10px", background: "#7C3AED", border: "none", cursor: "pointer" }}>
        <span style={{ display: "grid", placeItems: "center", flexShrink: 0 }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round"><path d="M12 3l1.9 5.8 5.8 1.9-5.8 1.9L12 18.4l-1.9-5.8L4.3 10.7l5.8-1.9L12 3z" /></svg></span>
        <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: "13px", fontWeight: 600, color: "white" }}>Ask Lexi</div><div style={{ fontSize: "11px", color: "rgba(255,255,255,0.85)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Chat with your PDFs</div></div>
        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "white", flexShrink: 0 }}><span style={{ width: "6px", height: "6px", borderRadius: "999px", background: "#22C55E" }} />Online</span>
      </div>
      <button onClick={() => navTo('homepage')} style={{ width: "100%", marginTop: "10px", background: sideCard, border: `1px solid ${sideCardBorder}`, borderRadius: "10px", padding: "10px 12px", color: sideText, fontSize: "13px", cursor: "pointer" }}>New PDF Task +</button>
      <div style={{ marginTop: "20px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "0.1em", color: sideFaint, fontWeight: isSun ? 700 : 400, marginBottom: "10px", paddingLeft: "4px" }}>TOOLS</div>
        <div onClick={() => setFreeOpen(!freeOpen)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 4px", cursor: "pointer", color: sideText, fontSize: "13px", fontWeight: 500 }}><span>Free Tools (20)</span><span style={{ fontSize: "13px", color: sideText, fontWeight: 700, background: sideCard, padding: "2px 7px", borderRadius: "6px" }}>{freeOpen ? "▾" : "▸"}</span></div>
        {freeOpen && (<div style={{ display: "flex", flexDirection: "column", marginBottom: "14px" }}>{freeTools.map(t => (<div key={t.id} onClick={() => handleToolClick(t)} style={{ display: "flex", gap: "10px", alignItems: "center", padding: "7px 4px 7px 16px", cursor: "pointer", color: activeTool === t.en ? sideText : sideMuted, fontSize: "12px", background: activeTool === t.en ? sideCard : "transparent", borderRadius: "6px" }}><span>{t.icon}</span><span>{t.en}</span></div>))}</div>)}
        <div onClick={() => setProOpen(!proOpen)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 4px", cursor: "pointer", color: sideText, fontSize: "13px", fontWeight: 500 }}><span style={{ display: "flex", alignItems: "center", gap: "6px" }}>Advanced Tools (10) <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg></span><span style={{ fontSize: "13px", color: sideText, fontWeight: 700, background: sideCard, padding: "2px 7px", borderRadius: "6px" }}>{proOpen ? "▾" : "▸"}</span></div>
        {proOpen && (<div style={{ display: "flex", flexDirection: "column" }}>{proTools.map(t => (<div key={t.id} onClick={() => handleToolClick(t)} style={{ display: "flex", gap: "10px", alignItems: "center", padding: "7px 4px 7px 16px", cursor: "pointer", color: activeTool === t.en ? sideText : sideMuted, fontSize: "12px", background: activeTool === t.en ? sideCard : "transparent", borderRadius: "6px" }}><span>{t.icon}</span><span>{t.en}</span><span style={{ marginLeft: "auto", fontSize: "10px", color: "#A78BFA" }}>PRO</span></div>))}</div>)}
      </div>
      {accountType === 'professional' && (
        <div style={{ marginTop: "16px", background: sideCard, border: `1px solid ${sideCardBorder}`, borderRadius: "10px", padding: "10px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "0.1em", color: sideFaint, fontWeight: 700 }}>CLIENT PROJECTS • PREVIEW</div>
          <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px", background: isSun ? "#FFFFFF" : "#1E1E2A", borderRadius: "8px" }}><span style={{ fontSize: "12px", color: sideText }}>📁 Client A — Contract</span><span style={{ fontSize: "10px", color: sideMuted }}>Private</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px", background: isSun ? "#FFFFFF" : "#1E1E2A", borderRadius: "8px" }}><span style={{ fontSize: "12px", color: sideText }}>📁 Client B — Invoices</span><span style={{ fontSize: "10px", color: sideMuted }}>Private</span></div>
            <div style={{ fontSize: "10px", color: sideMuted, padding: "4px 4px 0" }}>Each client = separate folder. Files never mix.</div>
          </div>
        </div>
      )}
      {accountType === 'company' && (
        <div style={{ marginTop: "16px", background: sideCard, border: `1px solid ${sideCardBorder}`, borderRadius: "10px", padding: "10px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "0.1em", color: sideFaint, fontWeight: 700 }}>COMPANY WORKSPACE • PREVIEW</div>
          <div style={{ marginTop: "8px", fontSize: "12px", fontWeight: 700, color: sideText }}>🏢 Acme Law — Shared pool</div>
          <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", background: isSun ? "#FFFFFF" : "#1E1E2A", borderRadius: "8px" }}><span style={{ fontSize: "12px", color: sideText }}>👤 Ahmed — Admin</span><span style={{ fontSize: "10px", color: "#15803D" }}>● Online</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", background: isSun ? "#FFFFFF" : "#1E1E2A", borderRadius: "8px" }}><span style={{ fontSize: "12px", color: sideText }}>👤 Sara — Member</span><span style={{ fontSize: "10px", color: sideMuted }}>Used 120 credits</span></div>
            <div style={{ fontSize: "10px", color: sideMuted, padding: "4px 4px 0", lineHeight: 1.5 }}>Activity log (preview): Sara • Summarize • 10:00 • 1 credit</div>
          </div>
        </div>
      )}
      <div style={{ marginTop: "16px" }}>
        <div onClick={() => setSidebarRecentOpen(!sidebarRecentOpen)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 4px", cursor: "pointer", color: sideText, fontSize: "13px", fontWeight: 500 }}><span>{accountType === 'company' ? "COMPANY FILES (3)" : accountType === 'professional' ? "CLIENT FILES (3)" : "RECENT FILES (3)"}</span><span style={{ fontSize: "13px", color: sideText, fontWeight: 700, background: sideCard, padding: "2px 7px", borderRadius: "6px" }}>{sidebarRecentOpen ? "▾" : "▸"}</span></div>
        {sidebarRecentOpen && (
          <div style={{ display: "flex", flexDirection: "column", marginBottom: "4px" }}>
            {recentFiles.map(f => (
              <div key={f.name} onClick={() => goWorkspace(f.name)} style={{ display: "flex", gap: "10px", alignItems: "center", padding: "7px 4px 7px 16px", cursor: "pointer", borderRadius: "6px" }}>
                <div style={{ width: "28px", height: "32px", borderRadius: "5px", background: isSun ? '#FFFFFF' : '#1E1E2A', border: `1px solid ${sideCardBorder}`, borderTop: `3px solid ${f.color}`, display: "grid", placeItems: "center", flexShrink: 0 }}><span style={{ fontSize: "9px", fontWeight: 700, color: f.color }}>PDF</span></div>
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: "11px", color: sideText, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</div><div style={{ fontSize: "10px", color: sideMuted }}>{f.time}</div></div>
              </div>
            ))}
            <div style={{ padding: "4px 10px 2px 16px", fontSize: "10px", color: sideMuted }}>Free: 3 recent • Pro: All recent</div>
          </div>
        )}
      </div>
      <div style={{ marginTop: "14px", background: "white", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "9px", color: "#6B7280", border: "1px solid #E5E7EB", padding: "2px 5px", borderRadius: "4px" }}>Ad</span>
          <span style={{ fontSize: "12px", color: "#E5E7EB" }}>⋮</span>
        </div>
        <div style={{ padding: "0 12px 12px", textAlign: "left" }}>
          <div style={{ width: "100%", height: "110px", background: "linear-gradient(135deg,#EFF6FF,#DBEAFE)", borderRadius: "8px", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}><span style={{ position: "absolute", top: "6px", right: "6px", fontSize: "8px", fontWeight: 800, background: "#22C55E", color: "white", padding: "2px 6px", borderRadius: "999px" }}>FREE</span><div style={{ width: "46px", height: "58px", background: "white", borderRadius: "5px", border: "1px solid #E5E7EB", boxShadow: "0 4px 10px rgba(0,0,0,0.08)", overflow: "hidden", flexShrink: 0 }}><div style={{ background: "#DC2626", color: "white", fontSize: "8px", fontWeight: 800, textAlign: "center", padding: "3px 0" }}>PDF</div><div style={{ padding: "6px", display: "flex", flexDirection: "column", gap: "4px" }}><div style={{ height: "4px", background: "#E5E7EB", borderRadius: "999px" }} /><div style={{ height: "4px", background: "#E5E7EB", borderRadius: "999px", width: "80%" }} /><div style={{ height: "4px", background: "#E5E7EB", borderRadius: "999px", width: "60%" }} /></div></div><div style={{ width: "26px", height: "26px", borderRadius: "999px", background: "#2563EB", color: "white", display: "grid", placeItems: "center", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>→</div><div style={{ width: "46px", height: "58px", background: "white", borderRadius: "5px", border: "1px solid #E5E7EB", boxShadow: "0 4px 10px rgba(0,0,0,0.08)", overflow: "hidden", flexShrink: 0 }}><div style={{ background: "#2563EB", color: "white", fontSize: "8px", fontWeight: 800, textAlign: "center", padding: "3px 0" }}>DOC</div><div style={{ padding: "6px", display: "flex", flexDirection: "column", gap: "4px" }}><div style={{ height: "4px", background: "#DBEAFE", borderRadius: "999px" }} /><div style={{ height: "4px", background: "#DBEAFE", borderRadius: "999px", width: "85%" }} /><div style={{ height: "4px", background: "#DBEAFE", borderRadius: "999px", width: "70%" }} /></div></div><span style={{ position: "absolute", bottom: "6px", left: "8px", fontSize: "8px", fontWeight: 700, color: "#2563EB", background: "white", padding: "2px 6px", borderRadius: "999px", border: "1px solid #DBEAFE" }}>In 2 Seconds</span></div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#111", marginTop: "10px", lineHeight: 1.3 }}>PDF to Word in 2 Seconds - Free Online</div>
          <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "4px", lineHeight: 1.4 }}>Convert your PDFs without losing layout. No sign-up needed.</div>
          <div style={{ fontSize: "10px", color: "#2563EB", marginTop: "6px" }}>pdfconverter-pro.com</div>
          <button style={{ marginTop: "10px", width: "100%", background: "#2563EB", color: "white", border: "none", borderRadius: "999px", padding: "8px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>Try Free →</button>
        </div>
      </div>
      <div style={{ marginTop: "16px", background: isSun ? '#F0FDF4' : 'rgba(34,197,94,0.08)', border: isSun ? '1px solid #BBF7D0' : '1px solid rgba(34,197,94,0.2)', borderRadius: "12px", padding: "12px" }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}><span style={{ display: "grid", placeItems: "center" }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg></span><span style={{ fontSize: "12px", fontWeight: 600, color: sideText }}>100% Private</span><span style={{ marginLeft: "auto", fontSize: "9px", background: "#22C55E", color: "white", padding: "2px 6px", borderRadius: "999px", fontWeight: 600 }}>LOCAL</span></div>
        <div style={{ fontSize: "11px", color: sideMuted, lineHeight: 1.5, marginTop: "6px" }}>All tools run in your browser. Your files never leave your device, never uploaded to our servers.</div>
      </div>
      <div style={{ marginTop: "14px", borderRadius: "16px", background: "linear-gradient(135deg,#7C3AED,#EC4899)", padding: "14px", color: "white" }}>
        <div style={{ fontSize: "13px", fontWeight: 700 }}>Upgrade</div>
        <div style={{ fontSize: "11px", opacity: 0.85, marginTop: "5px", lineHeight: 1.5 }}>Choose the plan that fits you — more tasks, more AI tools, more power, no ads.</div>
        <button onClick={() => navTo('plans')} title="Choose the plan that fits you" style={{ marginTop: "10px", background: "white", color: "black", borderRadius: "999px", padding: "7px 14px", fontSize: "11px", fontWeight: 700, border: "none", cursor: "pointer" }}>See Plans</button>
      </div>
    </div>
  );


  const headerText = isSun ? '#FFFFFF' : '#2563EB';
  const headerSubText = isSun ? 'rgba(255,255,255,0.7)' : '#3B82F6';
  const header = (
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
          <div onClick={handleUserClick} style={{ display: "flex", alignItems: "center", gap: "9px", cursor: "pointer", whiteSpace: "nowrap" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "999px", background: "#2563EB", display: "grid", placeItems: "center", color: "white", fontWeight: 600, fontSize: "13px", flexShrink: 0 }}>K</div>
            <div style={{ lineHeight: 1.25 }} className="hideOnSmall">
              <div style={{ fontSize: "13px", fontWeight: 600, color: headerText }}>kamalhohoud2</div>
              <div style={{ fontSize: "11px", fontWeight: 500, color: headerSubText }}>Free plan</div>
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={headerText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hideOnSmall"><path d="m6 9 6 6 6-6" /></svg>
          </div>
        ) : (
          <>
            <span style={{ fontSize: "13.5px", fontWeight: 500, color: headerText, cursor: "pointer", whiteSpace: "nowrap" }}>Sign In</span>
            <button style={{ background: "#2563EB", color: "white", borderRadius: "999px", padding: "8px 16px", fontSize: "13.5px", fontWeight: 600, border: "none", cursor: "pointer", whiteSpace: "nowrap", letterSpacing: "-0.01em", boxShadow: "0 4px 12px rgba(37,99,235,0.35)" }}>Get Started</button>
          </>
        )}
      </div>
    </div>
  );

  const footer = (
    <div style={{ textAlign: "center", padding: "0 0 16px", fontSize: "11px", color: middleMuted }}>
      PDFlexi © 2026 • <span onClick={() => navTo('privacy')} style={{ cursor: "pointer", textDecoration: "underline" }}>Privacy</span> • <span onClick={() => navTo('terms')} style={{ cursor: "pointer", textDecoration: "underline" }}>Terms</span>
    </div>
  );

  const leftSidebarStyle: React.CSSProperties = { width: "280px", background: sideBg, borderRight: `1px solid ${sideBorder}`, flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, height: "100vh", overflowY: "auto", overflowX: "hidden", flexShrink: 0, display: "flex", zIndex: 90 };
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
        <div style={rightItemWrap} onMouseEnter={() => setRightHover('sun')} onMouseLeave={() => setRightHover(null)}>
          <button onClick={() => { setTheme('dark'); setRightActive('sun'); }} title="Sun mode" style={rightIconStyle('sun', "#F59E0B", isSun)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
          </button>
          <span style={rightLabelStyle('sun', "#F59E0B", isSun)}>Sun</span>
        </div>
        <div style={rightItemWrap} onMouseEnter={() => setRightHover('moon')} onMouseLeave={() => setRightHover(null)}>
          <button onClick={() => { setTheme('light'); setRightActive('moon'); }} title="Moon mode" style={rightIconStyle('moon', "#6366F1", isLight)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
          </button>
          <span style={rightLabelStyle('moon', "#6366F1", isLight)}>Moon</span>
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

  if (view === 'why-private') {
    return (
      <div style={{ minHeight: "100vh", width: "100%", background: outerBg, fontFamily: "'Inter',sans-serif", position: "relative" }}>
        <style>{GUTTER_CSS}</style>
        {header}
        <aside className="hideMob leftSidebarScroll" style={leftSidebarStyle}>{sidebarContent}</aside>
        {mobileMenuOpen && (<><div onClick={() => setMobileMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 120 }} /><div style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: "280px", background: sideBg, zIndex: 130, overflowY: "auto" }}>{sidebarContent}</div></>)}
        <main className="mainResponsive" style={{ marginLeft: "280px", marginRight: "56px", minWidth: 0, width: "auto", paddingTop: "57px", position: "relative", zIndex: 1 }}>
          <div className="pagePad" style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>
            <div style={{ display: "inline-flex", gap: "6px", background: isSun ? "#F0FDF4" : "rgba(34,197,94,0.08)", border: isSun ? "1px solid #BBF7D0" : "1px solid rgba(34,197,94,0.2)", borderRadius: "999px", padding: "6px 12px", fontSize: "11px", color: isSun ? "#15803D" : "#4ADE80", fontWeight: 600 }}>🔒 100% Private • LOCAL • No upload</div>
            <h1 className="pageTitle" style={{ fontSize: "32px", fontWeight: 700, color: isSun ? "#111" : "white", marginTop: "16px", lineHeight: 1.2 }}>Why 100% Private matters.<br />Your files stay on your device by default.</h1>
            <p style={{ fontSize: "15px", color: isSun ? "#6B7280" : "rgba(255,255,255,0.6)", marginTop: "12px", lineHeight: 1.7 }}>Most PDF tools ask you to upload your file to their server before they do anything. PDFlexi does the opposite. By default, everything happens in your browser, on your device. No upload. No storage. No one else can see your documents — not even us. The only exception: if Lexi needs advanced processing that your device cannot do, it will ask for your prior consent first. If you refuse, no upload happens.</p>
            <div className="twoColGrid" style={{ marginTop: "28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ background: middleBg, border: "1px solid rgba(34,197,94,0.25)", borderRadius: "16px", padding: "20px" }}>
                <div style={{ fontSize: "22px" }}>✅</div>
                <div style={{ fontWeight: 700, marginTop: "10px", color: middleText }}>PDFlexi • LOCAL</div>
                <div style={{ fontSize: "13px", color: middleMuted, marginTop: "8px", lineHeight: 1.6 }}>Your device → Your browser → Done.<br />By default, your file stays in your browser memory. When you close the tab, it is gone. No copy exists anywhere else.</div>
                <div style={{ marginTop: "12px", display: "flex", gap: "6px", flexWrap: "wrap" }}>{["No upload", "No storage", "Works offline"].map(t => <span key={t} style={{ fontSize: "11px", background: "rgba(34,197,94,0.12)", color: "#22C55E", padding: "4px 8px", borderRadius: "999px", fontWeight: 600 }}>{t}</span>)}</div>
              </div>
              <div style={{ background: middleBg, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", padding: "20px", opacity: 0.85 }}>
                <div style={{ fontSize: "22px" }}>☁</div>
                <div style={{ fontWeight: 700, marginTop: "10px", color: middleText }}>Other tools • CLOUD</div>
                <div style={{ fontSize: "13px", color: middleMuted, marginTop: "8px", lineHeight: 1.6 }}>Your device → Their server → Stored → Processed.<br />Your contract, invoice or CV is copied to a server you do not control. You must trust their “we delete after 1 hour” promise.</div>
                <div style={{ marginTop: "12px", display: "flex", gap: "6px", flexWrap: "wrap" }}>{["Upload required", "Stored on server", "Can be read"].map(t => <span key={t} style={{ fontSize: "11px", background: "rgba(239,68,68,0.1)", color: "#F87171", padding: "4px 8px", borderRadius: "999px", fontWeight: 600 }}>{t}</span>)}</div>
              </div>
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: isSun ? "#111" : "white", marginTop: "32px" }}>What does 100% Private really mean?</h2>
            <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "14px", fontSize: "14px", lineHeight: 1.7, color: isSun ? "#333" : "rgba(255,255,255,0.8)" }}>
              <p><b>1. No upload by default.</b> When you drop a PDF into PDFlexi, it is not sent to the internet by default. It is opened locally by your browser, exactly like opening a file in a desktop app. Our servers do not receive your file, except if Lexi needs advanced support and you give your prior consent first. If you refuse, no upload happens.</p>
              <p><b>2. No storage.</b> We do not keep a copy of your documents. There is nothing to leak, nothing to hack, nothing to subpoena. If you close the tab, your file is gone from memory. Your Recent Files list is stored only in your own browser, not on our servers.</p>
              <p><b>3. No reading.</b> By default, Lexi processes your file in your browser only. We cannot read your contracts, invoices, medical records or personal data, because they never reach us by default. Even our team cannot see them. Only if you approve an advanced cloud task will the necessary content be sent for that task only.</p>
              <p><b>4. No tracking of content.</b> We only see anonymous usage — for example, how many people used Merge today. We never see what was merged, what was written inside, or who it belongs to.</p>
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: isSun ? "#111" : "white", marginTop: "32px" }}>What if Lexi needs advanced processing?</h2>
            <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "14px", fontSize: "14px", lineHeight: 1.7, color: isSun ? "#333" : "rgba(255,255,255,0.8)" }}>
              <p>In most cases, Lexi works 100% locally. Your file never needs to leave your device.</p>
              <p><b>Only exception:</b> if a task needs advanced support that your device cannot provide, Lexi will stop and ask for your prior consent first. It will explain why cloud processing is needed, what will be sent, and for what purpose.</p>
              <p><b>You decide.</b> If you approve, only the necessary content for that task is sent. If you refuse, no upload happens — Lexi will try a local alternative if possible, otherwise the task will be cancelled. Silence is not consent.</p>
              <p style={{ fontSize: "13px", color: middleMuted }}>See our <span onClick={() => navTo('privacy')} style={{ color: "#2563EB", cursor: "pointer", fontWeight: 600 }}>Privacy Policy</span> and <span onClick={() => navTo('terms')} style={{ color: "#2563EB", cursor: "pointer", fontWeight: 600 }}>Terms of Service</span> for full details.</p>
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: isSun ? "#111" : "white", marginTop: "32px" }}>PDFlexi vs ChatPDF and other tools</h2>
            <div style={{ marginTop: "16px", background: middleBg, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", overflow: "hidden" }}>
              {[
                { f: "File uploaded to server?", p: "By default, never - only with your prior consent", o: "Always" },
                { f: "File stored on server?", p: "No - by default, never stored", o: "Yes, then “deleted”" },
                { f: "Can the company read your file?", p: "No, by default - impossible without your consent", o: "Yes, technically" },
                { f: "Edit PDF by chat (merge, split, sign)?", p: "Yes — Lexi edits", o: "No — only Q&A" },
                { f: "Works if server is down?", p: "Yes, local", o: "No" },
              ].map((row, i) => (
                <div key={row.f} className="compareGrid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", padding: "12px 16px", background: i % 2 === 0 ? (isSun ? "#FFFFFF" : "rgba(255,255,255,0.02)") : "transparent", borderBottom: `1px solid ${middleCardBorder}`, fontSize: "13px" }}>
                  <span style={{ color: middleText, fontWeight: 600 }}>{row.f}</span>
                  <span style={{ color: "#22C55E", fontWeight: 600 }}>✓ {row.p}</span>
                  <span style={{ color: middleMuted }}>{row.o}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "8px", fontSize: "11px", color: middleMuted }}><span>PDFlexi</span><span>•</span><span>Other tools / ChatPDF</span></div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: isSun ? "#111" : "white", marginTop: "32px" }}>Who needs this level of privacy?</h2>
            <div className="threeColGrid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginTop: "16px" }}>
              {[
                { t: "Lawyers & Notaries", d: "Contracts, NDAs and client files must never leave your office." },
                { t: "Freelancers & Agencies", d: "Invoices, quotes and client work stay confidential." },
                { t: "Everyone", d: "CVs, IDs, bank statements and personal docs deserve the same protection." },
              ].map(c => (
                <div key={c.t} style={{ background: middleBg, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", padding: "16px" }}>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: middleText }}>{c.t}</div>
                  <div style={{ fontSize: "13px", color: middleMuted, marginTop: "6px", lineHeight: 1.6 }}>{c.d}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "32px", background: "linear-gradient(135deg,#7C3AED,#EC4899)", borderRadius: "20px", padding: "24px", textAlign: "center", color: "white" }}>
              <div style={{ fontSize: "18px", fontWeight: 700 }}>Try it with a real file — nothing leaves your device.</div>
              <div style={{ fontSize: "13px", opacity: 0.85, marginTop: "6px" }}>Drop a PDF and ask Lexi to merge, split or compress it. Watch it happen locally.</div>
              <button onClick={() => navTo('homepage')} style={{ marginTop: "16px", background: "white", color: "black", borderRadius: "999px", padding: "10px 20px", fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer" }}>Try Lexi now →</button>
            </div>
            <div style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: middleMuted }}>Read our full <span onClick={() => navTo('privacy')} style={{ cursor: "pointer", textDecoration: "underline" }}>Privacy Policy</span> • <span onClick={() => navTo('terms')} style={{ cursor: "pointer", textDecoration: "underline" }}>Terms</span></div>
          </div>
        </main>
        {rightBar}
        {userMenu}
      </div>
    );
  }

  if (view === 'privacy' || view === 'terms') {
    const isPrivacy = view === 'privacy';
    return (
      <div style={{ minHeight: "100vh", width: "100%", background: middleBg, fontFamily: "'Inter',sans-serif", position: "relative" }}>
        <style>{GUTTER_CSS}</style>
        {header}
        <aside className="hideMob leftSidebarScroll" style={leftSidebarStyle}>{sidebarContent}</aside>
        {mobileMenuOpen && (<><div onClick={() => setMobileMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 120 }} /><div style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: "280px", background: sideBg, zIndex: 130, overflowY: "auto" }}>{sidebarContent}</div></>)}
        <main className="mainResponsive" style={{ marginLeft: "280px", marginRight: "56px", minWidth: 0, width: "auto", paddingTop: "57px", position: "relative", zIndex: 1 }}>
          <div className="pagePad" style={{ maxWidth: "820px", margin: "0 auto", padding: "40px 20px" }}>
            <h1 style={{ fontSize: "30px", fontWeight: 700, color: middleText }}>{isPrivacy ? "Privacy Policy" : "Terms of Service"}</h1>
            <p style={{ fontSize: "12px", color: middleMuted, marginTop: "6px" }}>Last updated: November 10, 2026 • Website: pdflexi • Product: Ask Lexi...</p>
            <p style={{ fontSize: "14px", color: middleMuted, marginTop: "14px", lineHeight: 1.7 }}>{isPrivacy ? "This Privacy Policy explains what PDFlexi collects, what it never collects, and how your files are handled. In short: your files stay on your device by default. We do not read your documents, we do not store them on our servers, and we do not share them — except after your explicit prior consent, if Lexi shows you that a task needs cloud processing." : "These Terms explain what you can expect from PDFlexi and what we expect from you. Please read them. By using PDFlexi, you agree to these Terms and to our Privacy Policy."}</p>
            {isPrivacy ? (
              <div style={{ marginTop: "28px", display: "flex", flexDirection: "column", gap: "26px" }}>
                <div><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7 }}>At pdflexi, your privacy is a fundamental part of how we build our platform.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>We believe that users should have control over their documents, personal information, and how their data is processed.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>This Privacy Policy explains what information we collect, how we use it, how your files are handled, and what choices and rights you have when using pdflexi.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>Our core principle is simple: <b style={{ color: middleText }}>Local Processing First. Cloud Processing Only With Your Prior Consent.</b></p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>We aim to minimize data collection, protect your documents, and provide transparency whenever information needs to be processed by external services.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>1. How We Handle Your Files</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>PDFlexi is designed to process documents directly on your device whenever technically possible.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>Our local PDF processing tools operate within your browser, using your device&apos;s resources. These operations do not require uploading your documents to pdflexi servers.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>We do not routinely receive or store documents processed entirely on your device.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>However, certain tasks may require a specialized external service to complete specific tasks that cannot run in your browser.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>In these situations:</p><ul style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px", paddingLeft: "18px" }}><li>Lexi will inform you before any document or its contents are uploaded.</li><li>Lexi will explain why cloud processing is necessary.</li><li>You will be informed about the information intended to be transmitted and the relevant processing service, where identifiable.</li><li>Your explicit prior approval will be required before the upload takes place.</li><li>No cloud upload will occur without your approval.</li></ul><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>If you decline:</p><ul style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px", paddingLeft: "18px" }}><li>Your document will not be uploaded.</li><li>The task will remain local if a suitable local alternative is available.</li><li>Otherwise, the task will be cancelled.</li></ul><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>We do not treat silence, inactivity, or continued use of the platform as consent to upload your documents.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>2. What We Do Not Collect or Use</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>We are committed to minimizing access to your personal documents.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>PDFlexi does not routinely collect the contents of documents processed locally in your browser.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>We do not intentionally access, collect, or store the contents of locally processed contracts, invoices, CVs, identity documents, financial statements, medical records, or other personal documents.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>We do not sell your personal information.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>We do not use your documents to train our artificial intelligence models without your explicit consent.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>For cloud-based AI tasks, document content must be processed by the relevant service to provide the requested result. This processing is limited by the applicable task, our agreements with service providers, and the retention practices disclosed to you.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>We do not authorize service providers to use your documents for their own independent purposes or model training unless you have been separately and explicitly informed and have agreed to that use.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>3. Information We Collect</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>We collect only the information reasonably necessary to operate, maintain, secure, and improve pdflexi.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}><b style={{ color: middleText }}>A. Account Information</b> — If you create an account, we may collect: Name or display name, Email address, Account credentials or authentication identifiers, Subscription and account status, Account preferences.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}><b style={{ color: middleText }}>B. Usage Information</b> — We may collect limited information about how the platform is used, including: Which tools and features are used, Number of completed tasks, AI credit consumption, Subscription activity, Basic service interaction records. We aim to keep usage information separate from document contents.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}><b style={{ color: middleText }}>C. Technical Information</b> — For security, troubleshooting, and platform functionality, we may collect: Browser type and version, Device and operating system information, IP address, where required for security or service operation, Diagnostic information and error reports, Session and technical identifiers. Where technically and legally possible, we minimize or anonymize this information.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}><b style={{ color: middleText }}>D. Payment Information</b> — When you purchase a subscription or credits, payment transactions are handled through third-party payment providers. We may receive transaction identifiers, payment status, subscription information, and limited billing details. We do not intend to store complete payment card details on pdflexi servers.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>4. Local Storage: Projects and Recent Files</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>PDFlexi may provide Projects, Recent Files, and other workspace features.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>When these features are implemented using local browser storage, their information is stored on your own device using technologies such as IndexedDB or the Origin Private File System (OPFS).</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>This means: Your locally stored projects are not automatically synchronized with our servers. Your projects are generally accessible only through the browser and device where they were created. Clearing browser data or uninstalling certain browser components may delete locally stored information. Local storage may be affected by browser limitations or available device storage.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>Where supported, you can export your projects or download backups. You can also use the available Settings options to clear locally stored workspace information.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}><b style={{ color: middleText }}>Important:</b> Local browser storage is not a permanent backup service. We recommend keeping independent copies of important documents.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>5. AI Credits and Subscription Information</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>PDFlexi may use a credit system for advanced AI-powered features. We may maintain records of: Credits purchased, Credits consumed, Remaining credit balances, Credit expiration or reset dates, where applicable, Subscription plans and billing status.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>Free local processing tools, such as Merge, Split, Rotate, and Compress, are intended to operate without requiring AI credits.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>Credit records are used for account management, billing, service delivery, and fraud prevention. Your credit balance does not require us to store the contents of your documents.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>6. Artificial Intelligence: Local and Cloud Processing</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}><b style={{ color: middleText }}>A. Local AI Processing</b> — Where supported, certain AI models may operate directly within your browser or on your device. In these cases, document content is processed locally without being uploaded to external AI servers.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}><b style={{ color: middleText }}>B. Cloud-Based AI Processing</b> — Some tasks may require a specialized external service that cannot run in your browser. Before sending document content to a cloud-based AI service, Lexi must: 1) Identify that cloud processing is required. 2) Inform you about the proposed processing. 3) Explain why the task cannot be completed using the available local functionality. 4) Identify the relevant external processing service where known. 5) Obtain your explicit approval before transmitting any document content. Your approval applies to the processing explained in that request. It does not constitute blanket permission for future uploads or unrelated processing. If you refuse, no upload will take place.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}><b style={{ color: middleText }}>C. Third-Party AI Providers</b> — When an external AI provider is used, the provider may technically process the information necessary to complete your requested task. We aim to work only with providers that offer appropriate security, confidentiality, and data protection commitments. We will not claim that an external provider never retains data unless its actual terms and technical arrangements support that statement.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}><b style={{ color: middleText }}>D. AI Model Training</b> — Your documents are not automatically used to train or improve AI models. Any optional use of document content for model training must be presented separately, with clear information and explicit consent.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>7. File Retention and Deletion</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}><b style={{ color: middleText }}>Local processing:</b> Documents processed locally remain under your device&apos;s storage and browser environment. We do not retain server copies of files that are never uploaded to our infrastructure.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}><b style={{ color: middleText }}>Cloud processing:</b> When you approve cloud processing, the document content is transmitted only for the requested task. We aim to ensure that temporary processing copies are deleted as soon as they are no longer necessary to complete the task and return the result. The actual deletion period may depend on technical processing requirements, backups, security logs, and the contractual retention practices of the relevant service provider. We will disclose applicable retention periods when our service providers and infrastructure have been finalized.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}><b style={{ color: middleText }}>Account information:</b> Account and billing records may be retained for as long as necessary to provide the service, maintain account security, meet legal obligations, resolve disputes, and enforce our agreements.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>8. Cookies, Analytics and Advertising</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}><b style={{ color: middleText }}>A. Essential Cookies</b> — These may be necessary for: Account authentication, Session management, Security, Essential platform functionality.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}><b style={{ color: middleText }}>B. Analytics</b> — If analytics services are enabled, they may collect information about platform usage, performance, and technical errors. We aim to avoid collecting document contents through analytics systems.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}><b style={{ color: middleText }}>C. Advertising</b> — PDFlexi may use Google AdSense or other advertising providers. These providers may use cookies, identifiers, or similar technologies to: Display advertisements, Measure advertising performance, Prevent invalid advertising activity, Personalize advertisements where permitted and consented to. Advertising providers operate under their own privacy policies. You may manage your advertising preferences through the available consent settings and relevant provider controls. Where required by applicable law, we will obtain consent before using non-essential cookies or advertising technologies. Advertising technologies are not authorized to access the contents of your documents.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>9. Third-Party Service Providers</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>PDFlexi may rely on carefully selected external service providers to operate certain parts of the platform. These may include: AI processing providers, Payment processors, Advertising providers, Hosting and infrastructure providers, Security and technical monitoring services, Authentication and account management providers.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>These providers receive only the information reasonably necessary to perform their assigned services. Where appropriate, we require contractual safeguards concerning confidentiality, security, permitted processing purposes, and data retention. We do not sell your documents or personal information to these providers. We will update this Policy when significant changes occur in the services or providers involved in processing personal information.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>10. International Data Transfers</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>PDFlexi is designed as a global platform and may use service providers or infrastructure located in different countries. Consequently, certain personal information or documents that you explicitly approve for cloud processing may be transferred outside your country.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>Where such transfers involve personal data, we will apply the safeguards and legal requirements applicable to the transfer, including, where applicable, the GDPR and applicable US privacy laws.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>We will provide relevant information about international processing and transfers where required by law. Your approval of a particular cloud-processing task does not automatically authorize unrelated international transfers or unrelated uses of your information.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>11. Data Security</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>We take reasonable technical and organizational measures to protect information handled by pdflexi. Our security approach may include: Encrypted connections (HTTPS/TLS), Access controls and restricted administrative access, Secure authentication practices, Appropriate safeguards for cloud processing, Monitoring for suspicious activity, Data minimization and limited retention, Security reviews and improvements.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>Local processing reduces the need to transmit documents to external servers, but it does not eliminate every possible security risk. Similarly, cloud processing involves risks associated with internet transmission and external infrastructure. No online service or storage system can guarantee absolute security. We encourage users to maintain their own backups and avoid accessing sensitive documents on untrusted or shared devices.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>12. Your Privacy Rights</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>Depending on your country and applicable privacy laws, you may have the right to: Request access to your personal information, Request correction of inaccurate information, Request deletion of personal information, Request information about how your data is processed, Object to certain processing activities, Request restriction of processing where applicable, Withdraw consent previously provided, Request a copy of certain information in a portable format, Lodge a complaint with the relevant data protection authority.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>Withdrawing consent does not affect the lawfulness of processing that occurred before withdrawal. Some information may need to be retained where required by law or necessary for legitimate legal purposes.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}><b style={{ color: middleText }}>Local Files and Projects:</b> Files stored exclusively in your browser can generally be managed directly through your device and pdflexi workspace settings. Deleting your pdflexi account does not necessarily delete local browser data. You may need to clear that information separately.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}><b style={{ color: middleText }}>European Economic Area and United Kingdom:</b> Where the GDPR or UK GDPR applies, users may exercise the rights provided by those regulations. To submit a privacy request, contact us using the details provided in Section 16.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>13. Children&apos;s Privacy</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>PDFlexi is not intended for children below the minimum age permitted to independently use online services under applicable law. We do not knowingly collect personal information from children in violation of applicable legal requirements. Where parental or guardian consent is legally required, we will apply the relevant requirements. If you believe that a child has provided personal information inappropriately, please contact us so that we can investigate and take appropriate action.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>14. Legal Compliance</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>PDFlexi aims to operate in accordance with applicable privacy and data protection requirements. Depending on the user&apos;s location and the nature of the processing, these may include: The General Data Protection Regulation (GDPR), The UK General Data Protection Regulation (UK GDPR), Applicable electronic communications, cookie, and advertising privacy requirements, Other relevant national and international data protection laws. The applicable requirements may differ depending on the user&apos;s location and the services being used.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>15. Changes to This Privacy Policy</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>We may update this Privacy Policy when: New tools or AI capabilities are introduced, New service providers are integrated, Our data processing practices change, New legal or regulatory requirements apply, Security or privacy improvements are implemented.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>The latest version will always display its updated date at the top. If a significant change affects how your documents or personal information are processed, we will provide appropriate notice before implementing the change where required. Where renewed consent is legally required, we will request it.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>16. Contact and Privacy Requests</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>We believe privacy questions deserve clear and direct answers. If you have questions about this Policy, wish to exercise your privacy rights, or need assistance with your personal information, please contact us.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}><b style={{ color: middleText }}>Platform:</b> pdflexi<br /><b style={{ color: middleText }}>Website:</b> https://pdflexi.com<br /><b style={{ color: middleText }}>Privacy Contact:</b> [Insert official privacy email address]<br /><b style={{ color: middleText }}>Legal Entity:</b> [Insert registered company or responsible legal entity]<br /><b style={{ color: middleText }}>Registered Address:</b> [Insert official business address, where applicable]</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>We will review and respond to privacy requests within the timeframes required by applicable law.</p></div>
                <div style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899)", borderRadius: "16px", padding: "20px", textAlign: "center" }}><div style={{ fontSize: "15px", fontWeight: 700, color: "white" }}>Your documents. Your control. Your privacy.</div><div style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", marginTop: "6px", lineHeight: 1.6 }}>At pdflexi, we believe that powerful document tools should never require users to give up control over their personal information.<br />Local Processing First. Cloud Processing Only With Your Prior Consent.<br />Ask Lexi. Stay in Control.</div></div>
              </div>
            ) : (
              <div style={{ marginTop: "28px", display: "flex", flexDirection: "column", gap: "26px" }}>
                <div><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7 }}>Welcome to pdflexi.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>These Terms of Service (&quot;Terms&quot;) govern your access to and use of the pdflexi website, platform, PDF processing tools, artificial intelligence features, and related services.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>PDFlexi provides document processing tools and AI-powered assistance through its platform, including its intelligent assistant, Lexi.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>By accessing or using pdflexi, you agree to these Terms. If you do not agree, you must not use the services. Please read these Terms carefully before using the platform.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>1. About PDFlexi</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>PDFlexi is a digital document platform designed to help individuals, professionals, businesses, and organizations process, manage, understand, and work with PDF documents.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>Our services may include: PDF processing and conversion tools, Document organization and editing features, File compression, merging, splitting, and other document operations, AI-powered document analysis and assistance, Document summarization and information extraction, Contract review assistance and document comparison, Invoice and table data extraction, Other current or future document-related services.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>PDFlexi also provides Lexi, an AI-powered assistant that helps users interact with documents and perform supported tasks through natural language instructions. The availability of specific features may depend on your account, subscription, credits, technical requirements, and the applicable service plan.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>2. Acceptance of These Terms</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>By using pdflexi, you confirm that: You have read and understood these Terms, You agree to comply with applicable laws and regulations, You have the legal capacity to enter into an agreement under the laws applicable to you, You will use the platform only for lawful and authorized purposes. If you use pdflexi on behalf of a company, organization, or another legal entity, you confirm that you are authorized to accept these Terms on its behalf. Your continued use of the platform following an update to these Terms constitutes acceptance where legally permitted. Where explicit renewed acceptance is required, we will request it.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>3. Eligibility and Age Requirements</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>PDFlexi is intended for individuals and organizations legally permitted to use online digital services. You must meet the minimum age required by applicable law to enter into a binding agreement and use the relevant services independently. If you are below the age of legal majority in your jurisdiction, you may use paid services only where permitted and with the required authorization of a parent or legal guardian. PDFlexi is not designed to encourage children to submit personal or sensitive information.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>4. Account Registration and Security</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>Certain features may require you to create an account. When registering, you agree to: Provide accurate and current information, Keep your login credentials confidential, Avoid sharing your account in ways that violate your subscription conditions, Notify us if you suspect unauthorized access, Take reasonable steps to protect your account. You are responsible for activities carried out through your account, except where applicable law provides otherwise or where unauthorized access results from our failure to meet our legal obligations. We reserve the right to restrict or suspend accounts involved in fraud, abuse, security violations, or serious breaches of these Terms.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>5. PDF Processing and Local Operations</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>PDFlexi is designed around a local-processing-first approach. Our local PDF processing tools operate directly within your browser and use your device&apos;s available resources. Depending on the feature, these may include: Merge, Split, Compress, Convert, Rotate, Reorder pages, Delete pages, Add watermarks, Add page numbers, Protect or unlock documents where technically and legally permitted, Other supported PDF operations.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>Files processed entirely through local tools are handled within your browser environment and are not uploaded to pdflexi servers as part of those local operations. You understand that local processing performance may depend on your device, browser, available memory, storage capacity, and the size and complexity of your documents. You are responsible for maintaining backup copies of important files before performing operations that modify or replace document content. PDFlexi does not guarantee that every file format, document structure, or unusually complex PDF will be processed successfully.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>6. AI Processing and Cloud Services</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>PDFlexi offers AI-powered features through Lexi and other supported tools. Some AI operations may run locally on your device, while certain advanced tasks may require cloud-based processing.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}><b style={{ color: middleText }}>A. Local AI Processing</b> — Where supported, AI models may process document content directly within your browser or on your device. Such processing does not require uploading the document to an external AI processing server.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}><b style={{ color: middleText }}>B. Cloud-Based AI Processing</b> — Certain advanced tasks may require external computational resources or third-party AI services. In these situations, Lexi must inform you before any document content is uploaded and explain: Why cloud processing is required, What document or information will be transmitted, The purpose of the processing, The relevant external service provider, where identifiable, Any applicable processing information presented in the approval request. Your explicit prior approval is required before the upload takes place. <b style={{ color: middleText }}>No document upload for cloud processing will occur without your prior approval.</b> If you decline: Your document will not be uploaded, A local alternative may be offered where technically supported, Otherwise, the requested task will be cancelled. Approval for one cloud-processing task does not constitute general approval for future uploads or unrelated tasks. Additional information about how your documents and personal information are handled is available in our Privacy Policy.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>7. Your Documents and Intellectual Property</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>You retain ownership of the documents and files you upload, import, process, or create using pdflexi. PDFlexi does not claim ownership of: Your original documents, Your contracts, invoices, reports, or personal files, Your uploaded images and other materials, Your original document content, Other materials that you lawfully own or have permission to use.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>You grant pdflexi only the limited, non-exclusive permission necessary to process your documents and provide the services you request. This permission is limited to the relevant technical operations, including processing, transmitting, temporarily handling, and returning documents where required to perform your requested task. It does not grant pdflexi ownership of your documents or a general right to commercialize their contents. Where third-party processing is required and you have approved it, the necessary limited processing permission may extend to the relevant service provider for the requested task. You remain responsible for ensuring that you have the necessary rights and permissions to use the documents you submit.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>8. Acceptable Use and Prohibited Activities</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>PDFlexi is intended for legitimate document processing, productivity, professional assistance, and lawful business activities. You agree not to use the platform to: Commit fraud or facilitate fraudulent activities, Forge, falsify, or unlawfully manipulate official documents, Create or alter documents with the intention of deceiving others, Impersonate individuals, companies, or government institutions, Create fraudulent invoices, contracts, certificates, or identity documents, Circumvent legal, regulatory, or security requirements, Violate intellectual property, privacy, or confidentiality rights, Distribute malicious software or harmful files, Attempt unauthorized access to pdflexi systems or infrastructure, Interfere with the operation, availability, or security of the platform, Reverse engineer, exploit, or abuse the service beyond what applicable law permits, Use automated methods to overload or disrupt the platform, Resell, redistribute, or commercially exploit platform features in violation of applicable licensing or subscription conditions.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>PDFlexi may investigate suspected misuse and take appropriate action, including restricting access or suspending accounts where justified. Nothing in these Terms prevents legitimate activities such as reviewing document authenticity, identifying suspicious alterations, correcting errors, or investigating suspected forgery for lawful purposes.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>9. AI Assistance and Accuracy Limitations</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>Lexi is an artificial intelligence assistant designed to help users work with documents more efficiently. AI-generated responses, summaries, extracted information, comparisons, and recommendations may contain errors, omissions, inaccuracies, or incomplete interpretations. You acknowledge that: AI-generated information is not guaranteed to be completely accurate, Extracted data may require manual verification, Document summaries may omit important details, Contract analysis may fail to identify certain legal risks, AI comparisons may overlook differences or misinterpret document content, Results may vary depending on document quality, formatting, language, and complexity.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}><b style={{ color: middleText }}>A. Legal and Professional Decisions</b> — Lexi is not a law firm, licensed lawyer, accountant, auditor, financial advisor, or other regulated professional. Contract summaries, clause analysis, legal-risk identification, and other document-review features are provided for informational and assistance purposes only. They do not constitute professional legal advice or replace independent professional judgment. Users should consult qualified professionals before making important legal, financial, commercial, or other regulated decisions.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}><b style={{ color: middleText }}>B. Suspected Forgery and Document Authenticity</b> — Certain PDFlexi features may assist users in identifying indicators of possible document alteration, manipulation, or falsification. These tools provide technical observations and indicators for further investigation. They do not establish with certainty that a document is genuine, authentic, forged, or fraudulent. A positive or negative AI assessment should never be treated as definitive proof of authenticity or forgery.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}><b style={{ color: middleText }}>C. AI-Generated Outputs</b> — You are responsible for reviewing AI-generated outputs before relying on them, distributing them, or using them in professional or legal settings.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>10. Electronic Signatures and Document Validity</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>PDFlexi may provide tools that allow users to add signatures or signature-related elements to PDF documents. Unless a specific service expressly states otherwise, these features should not be understood as providing certified electronic signatures, identity verification, digital certificates, or qualified trust services. The legal validity and enforceability of a signed document may depend on: The applicable jurisdiction, The type of signature used, The identity verification process, The relevant legal requirements, The nature of the document and transaction. You are responsible for ensuring that the signature method you choose is legally appropriate for your intended purpose.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>11. Free Services, Paid Plans, and AI Credits</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}><b style={{ color: middleText }}>A. Free Tools</b> — Certain standard PDF operations may be offered free of charge. Their availability, usage limits, and technical capabilities may change as the platform evolves.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}><b style={{ color: middleText }}>B. Paid Plans</b> — Certain advanced features may require an active paid subscription. Each subscription plan will display its applicable features, pricing, limitations, and billing conditions before purchase.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}><b style={{ color: middleText }}>C. AI Credits</b> — Some AI-powered tasks may consume credits. Before completing a paid or credit-consuming operation, the platform should display the applicable credit cost or relevant usage conditions. Credit balances may be subject to expiration, renewal, or reset conditions, provided these are clearly disclosed before purchase or use.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}><b style={{ color: middleText }}>D. Credit and Subscription Restrictions</b> — Unless expressly stated otherwise: Credits are associated with the relevant account, Credits are not transferable between accounts, Credits cannot be exchanged for cash, Credits may not be resold or commercially redistributed, Promotional credits may be subject to additional conditions. We will provide clear information about credit costs and applicable restrictions.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>12. Payments, Billing, and Renewals</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>Paid subscriptions and credit purchases are subject to the prices and conditions displayed at checkout. By completing a purchase, you authorize the relevant payment provider to process the transaction. Where subscriptions automatically renew, the renewal frequency, amount, and cancellation procedure will be disclosed before purchase. You are responsible for maintaining accurate billing information and ensuring that your chosen payment method is valid. Prices, currencies, applicable taxes, and payment methods may vary depending on your location and the available payment provider. If a payment fails, access to paid features may be restricted until the payment issue is resolved.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>13. Cancellation and Refunds</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>You may cancel your subscription through the available account settings or the applicable payment provider&apos;s cancellation process. Unless otherwise stated at purchase or required by law: Cancelling a subscription prevents future renewals, Cancellation does not automatically guarantee a refund for the current billing period, Previously purchased credits may remain subject to their disclosed expiration and refund conditions. Refund requests will be reviewed according to the applicable purchase conditions and consumer protection laws. <b style={{ color: middleText }}>Nothing in these Terms removes or restricts any mandatory cancellation, withdrawal, or refund rights that you may have under applicable law.</b> Where applicable, statutory rights concerning distance contracts and digital services will take precedence over conflicting contractual provisions.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>14. Third-Party Services and Integrations</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>PDFlexi may integrate with or rely on external services, including: Artificial intelligence providers, Payment processors, Advertising networks, Cloud infrastructure providers, Authentication services, Other technical service providers. These services may operate under their own terms, privacy policies, and technical limitations. PDFlexi is not responsible for independent third-party services beyond the responsibilities imposed on us by applicable law or our contractual obligations. Where a third-party service is necessary for a requested operation, relevant information will be provided where required. Your use of external services may also be subject to their applicable terms.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>15. Service Availability and Technical Limitations</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>We aim to maintain a reliable and accessible platform. However, we do not guarantee that pdflexi will: Be available without interruption, Be free from every technical error, Support every device or browser, Process every document successfully, Produce identical results for every AI request, Remain compatible with every third-party service indefinitely. Maintenance, software updates, infrastructure issues, security incidents, network failures, and external service interruptions may temporarily affect availability. We reserve the right to improve, modify, suspend, or discontinue individual features where reasonably necessary. Where changes materially affect paid services, we will provide appropriate notice and comply with applicable consumer protection requirements.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>16. Intellectual Property of PDFlexi</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>The pdflexi platform, including its branding, logo, website design, software, interface, original content, documentation, and proprietary features, is protected by applicable intellectual property laws. Except where expressly permitted, you may not: Copy or reproduce substantial parts of the platform, Redistribute proprietary software or components, Use the pdflexi name or logo without authorization, Misrepresent your relationship with pdflexi, Commercially exploit platform components without permission. You retain ownership of your own content, subject to the limited processing permission described in Section 7. Nothing in these Terms transfers ownership of either party&apos;s intellectual property to the other.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>17. Privacy and Data Protection</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>Your use of pdflexi is also governed by our Privacy Policy. The Privacy Policy explains: What personal information we collect, How local document processing works, When cloud-based processing may occur, How AI service providers may process information, How account and usage information is handled, Your applicable privacy rights. In case of any apparent inconsistency between these Terms and the Privacy Policy regarding personal data handling, the Privacy Policy describes our data processing practices, while mandatory applicable law remains controlling. You can access the Privacy Policy through the pdflexi website.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>18. Suspension and Termination</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>We may temporarily restrict or terminate access to all or part of pdflexi where reasonably necessary, including when: You seriously violate these Terms, Your account is involved in fraudulent or illegal activity, Your use threatens platform security or availability, You attempt to exploit or abuse our services, We are legally required to restrict access, Continued service would create a significant security or legal risk. Where reasonably possible and legally permitted, we will provide notice and an opportunity to resolve the issue. You may stop using pdflexi at any time. You may also request account deletion through the available account settings or by contacting support. Termination does not automatically remove locally stored files from your browser or device. You may need to delete those separately. Any outstanding legal, payment, confidentiality, or intellectual property obligations that are intended to survive termination will remain applicable.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>19. Disclaimer of Warranties</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>To the extent permitted by applicable law, pdflexi is provided on an &quot;as available&quot; basis. We make reasonable efforts to maintain service quality, accuracy, and security, but we do not guarantee that every operation or AI-generated result will meet every user&apos;s specific requirements. We do not warrant that: Every document will be processed without errors, Every AI response will be accurate or complete, Every file will retain all original formatting after conversion, Every suspected document alteration will be detected, Every third-party service will remain available, The platform will operate without interruption. Nothing in this section excludes warranties or consumer rights that cannot legally be excluded.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>20. Limitation of Liability</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>To the maximum extent permitted by applicable law, pdflexi will not be liable for indirect, incidental, special, or consequential losses arising from the use or inability to use the platform. This may include loss of profits, business interruption, or loss of data, subject to applicable law. PDFlexi does not assume responsibility for decisions made solely on the basis of AI-generated outputs without appropriate human verification. Nothing in these Terms excludes or limits liability for: Fraud or fraudulent misrepresentation, Intentional misconduct where liability cannot be excluded, Gross negligence where applicable law prohibits exclusion, Death or personal injury caused by negligence where liability cannot be excluded, Any other liability that cannot legally be limited or excluded. Where legally permitted, our liability will be assessed in accordance with the nature of the service, the circumstances of the claim, and applicable law.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>21. Indemnification</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>To the extent permitted by applicable law, you agree to be responsible for losses, claims, and reasonable expenses arising from your unlawful use of pdflexi, infringement of third-party rights, or material violation of these Terms. This obligation does not apply to the extent that a claim results from our own breach of law, negligence, misconduct, or other circumstances for which we are legally responsible. Nothing in this section removes any mandatory consumer protection rights.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>22. Changes to the Platform and These Terms</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>PDFlexi is continuously evolving. We may introduce new tools, AI capabilities, subscription plans, integrations, and technical improvements. We may also update these Terms to reflect changes in our services, business operations, or legal obligations. The latest version will display its updated date. For material changes, we will provide appropriate notice where required. Where a change requires renewed user consent under applicable law, we will obtain that consent before applying the change.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>23. Governing Law and Dispute Resolution</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>These Terms shall be interpreted in accordance with the laws of the State of Delaware, United States, subject to mandatory consumer protection rules and other applicable laws that may apply to users in their respective jurisdictions. We encourage users to contact our support team first to resolve disputes informally and efficiently. If a dispute cannot be resolved informally, it may be submitted to the competent courts or other dispute resolution mechanisms in accordance with applicable law. Nothing in this section deprives consumers of mandatory rights to bring proceedings before courts having jurisdiction under the laws applicable to them.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>24. Severability</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>If any provision of these Terms is found to be invalid, unlawful, or unenforceable, the remaining provisions will continue to apply to the extent legally permitted. The invalid provision will be interpreted or replaced, where legally possible, in a manner that most closely reflects its original purpose without violating applicable law.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>25. Entire Agreement</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>These Terms, together with the Privacy Policy and any additional terms expressly applicable to specific services or purchases, constitute the agreement governing your use of pdflexi. Additional service-specific conditions may apply to certain subscriptions, integrations, or specialized features. In case of conflict, mandatory applicable law will prevail.</p></div>
                <div><h2 style={{ fontSize: "17px", fontWeight: 700, color: middleText }}>26. Contact Information</h2><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>If you have questions about these Terms, your account, subscriptions, or the use of pdflexi, please contact us.</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}><b style={{ color: middleText }}>Platform:</b> pdflexi<br /><b style={{ color: middleText }}>Website:</b> https://pdflexi.com<br /><b style={{ color: middleText }}>Support:</b> Contact via PDFlexi support</p><p style={{ fontSize: "14px", color: middleMuted, lineHeight: 1.7, marginTop: "8px" }}>We aim to provide clear information and fair assistance to all users.</p></div>
                <div style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899)", borderRadius: "16px", padding: "20px", textAlign: "center" }}><div style={{ fontSize: "15px", fontWeight: 700, color: "white" }}>Your Documents. Your Tools. Your Control.</div><div style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", marginTop: "6px", lineHeight: 1.6 }}>PDFlexi is built to make document processing smarter, more accessible, and more secure.<br />We believe that powerful AI tools should empower users without taking away their ownership, control, or responsibility.<br />Local Processing First. Cloud Processing Only With Your Prior Consent.<br />Ask Lexi. Work Smarter.</div></div>
              </div>
            )}
            <button onClick={() => navTo('homepage')} style={{ marginTop: "32px", background: "#7C3AED", color: "white", border: "none", borderRadius: "999px", padding: "10px 20px", fontWeight: 600, cursor: "pointer" }}>← Back to Workspace</button>
          </div>
        </main>
        {rightBar}
        {userMenu}
      </div>
    );
  }

  if (view === 'workspace') {
    return (
      <div ref={containerRef} style={{ minHeight: "100vh", background: "#0A0A12", color: "white", display: "flex", flexDirection: "column" }}>
        <style>{GUTTER_CSS}</style>
        <div style={{ height: "56px", width: "100%", boxSizing: "border-box", background: "#0F0F14", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}><div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "white", display: "grid", placeItems: "center", color: "black", fontWeight: 800 }}>P</div><div style={{ fontSize: "13px", fontWeight: 600 }}>Workspace: {fileName} • {activeTool}</div><span style={{ fontSize: "10px", background: "rgba(34,197,94,0.15)", color: "#22C55E", padding: "3px 8px", borderRadius: "999px" }}>● live</span></div>
          <div style={{ display: "flex", gap: "8px" }}><button style={{ background: "white", color: "black", borderRadius: "999px", padding: "8px 16px", fontSize: "12px", fontWeight: 600, border: "none" }}>Export PDF</button><button onClick={() => setView("homepage")} style={{ width: "32px", height: "32px", borderRadius: "999px", background: "rgba(255,255,255,0.06)", color: "white", cursor: "pointer" }}>✕</button></div>
        </div>
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <div style={{ width: `${leftWidth}%`, background: "#0F0F14", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px 12px", display: "flex", gap: "6px", flexWrap: "wrap" }}>{["Edit", "Merge", "Split", "Compress", "Sign"].map(t => <button key={t} onClick={() => setWsTool(t)} style={{ fontSize: "11px", padding: "6px 10px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.06)", background: wsTool === t ? "#7C3AED" : "rgba(255,255,255,0.04)", color: "white", cursor: "pointer" }}>{t}</button>)}</div>
            <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>{wsMsgs.map((m, i) => <div key={i} style={{ background: m.role === "user" ? "#7C3AED" : "#18181E", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "10px 12px", fontSize: "12px", alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "90%" }}>{m.text}</div>)}</div>
            <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: "8px" }}>{wsAttached && (<div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(59,130,246,0.15)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "999px", padding: "6px 10px", fontSize: "12px", color: "white" }}><span>📎</span><span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{wsAttached}</span><button onClick={() => setWsAttached(null)} aria-label="Remove attachment" style={{ border: "none", background: "transparent", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "12px" }}>✕</button></div>)}<input type="file" ref={wsFileRef} style={{ display: "none" }} accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.mp4,.mov,.txt" onChange={e => { const f = e.target.files?.[0]; if (f) setWsAttached(f.name); }} /><div style={{ display: "flex", gap: "8px" }}><button onClick={() => { wsFileRef.current?.click(); }} title="Attach file" style={{ width: "36px", height: "36px", borderRadius: "999px", background: "transparent", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", display: "grid", placeItems: "center", fontSize: "20px", flexShrink: 0 }}>+</button><input value={wsInput} onChange={e => setWsInput(e.target.value)} placeholder={`Ask to ${wsTool.toLowerCase()}...`} style={{ flex: 1, background: "#18181E", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "999px", padding: "10px 14px", fontSize: "12px", color: "white", outline: "none" }} /><button onClick={() => { if (!wsInput.trim()) return; setWsMsgs(p => [...p, { role: "user", text: wsInput }]); setWsInput(""); }} style={{ width: "36px", height: "36px", borderRadius: "999px", background: wsInput.trim() ? "white" : "rgba(255,255,255,0.15)", color: wsInput.trim() ? "black" : "rgba(255,255,255,0.4)", border: "none", cursor: wsInput.trim() ? "pointer" : "default" }}>▶</button></div></div>
          </div>
          <div onMouseDown={() => setIsDragging(true)} style={{ width: "8px", background: isDragging ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.04)", cursor: "col-resize", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: "3px", height: "24px", background: isDragging ? "#7C3AED" : "rgba(255,255,255,0.2)", borderRadius: "999px" }} /></div>
          <div style={{ width: `${100 - leftWidth}%`, background: "#14141C", padding: "16px" }}><div style={{ background: "white", borderRadius: "12px", height: "100%", padding: "24px", color: "#111" }}><div style={{ fontSize: "11px", color: "#6B7280", textAlign: "center" }}>Document: {fileName}</div><div style={{ marginTop: "20px", border: "2px dashed #E5E7EB", borderRadius: "12px", padding: "40px", textAlign: "center", fontSize: "12px", color: "#E5E7EB" }}>Sign preview • {fileName}</div></div></div>
        </div>
      </div>
    );
  }

  if (view === 'how') {
    return (
      <div style={{ minHeight: "100vh", width: "100%", background: outerBg, fontFamily: "'Inter',sans-serif", position: "relative" }}>
        <style>{GUTTER_CSS}</style>
        {header}
        <aside className="hideMob leftSidebarScroll" style={leftSidebarStyle}>{sidebarContent}</aside>
        {mobileMenuOpen && (<><div onClick={() => setMobileMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 120 }} /><div style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: "280px", background: sideBg, zIndex: 130, overflowY: "auto" }}>{sidebarContent}</div></>)}
        <main className="mainResponsive" style={{ marginLeft: "280px", marginRight: "56px", minWidth: 0, width: "auto", paddingTop: "57px", position: "relative", zIndex: 1 }}>
          <div className="pagePad" style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>
            <h1 className="pageTitle" style={{ fontSize: "32px", fontWeight: 700, color: isSun ? "#111" : "white" }}>How PDFlexi works</h1>
            <p style={{ color: isSun ? "#6B7280" : "rgba(255,255,255,0.4)", marginTop: "8px" }}>No menus. No Acrobat. Just chat with Lexi.</p>
            <div className="threeColGrid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginTop: "28px" }}>
              {[{ n: "1", t: "Drop your PDF", d: "Drop a file or choose from your device. Up to 20MB, PDF / Word / Excel / Image." }, { n: "2", t: "Ask Lexi in plain words", d: "\"Merge these invoices\" or \"Compress under 2MB\" - in English, French or Darija." }, { n: "3", t: "Download - 100% Private", d: "Everything runs in your browser. Your file never leaves your device." }].map(s => (
                <div key={s.n} style={{ background: middleBg, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", padding: "20px" }}><div style={{ width: "36px", height: "36px", borderRadius: "999px", background: "#7C3AED", color: "white", display: "grid", placeItems: "center", fontWeight: 700 }}>{s.n}</div><div style={{ fontWeight: 600, marginTop: "12px", color: middleText }}>{s.t}</div><div style={{ fontSize: "13px", color: middleMuted, marginTop: "6px", lineHeight: 1.5 }}>{s.d}</div></div>
              ))}
            </div>
            <button onClick={() => navTo('homepage')} style={{ marginTop: "28px", background: "#7C3AED", color: "white", border: "none", borderRadius: "999px", padding: "12px 22px", fontWeight: 600, cursor: "pointer" }}>Try Lexi now →</button>
          </div>
        </main>
        {rightBar}
        {userMenu}
      </div>
    );
  }

  if (view === 'plans') {
    const teamsMonthly = teamsTokens === 1000 ? 20 : teamsTokens === 2500 ? 45 : teamsTokens === 5000 ? 80 : 150;
    const teamsYearlyMonthly = Math.round(teamsMonthly * 0.8);
    const teamsPrice = billingPeriod === 'monthly' ? teamsMonthly : teamsYearlyMonthly;
    const teamsYearlyTotal = teamsYearlyMonthly * 12;
    const teamsYearlySaving = teamsMonthly * 12 - teamsYearlyTotal;
    const enterpriseMonthly = enterpriseTokens === 20000 ? 280 : enterpriseTokens === 50000 ? 600 : enterpriseTokens === 100000 ? 1000 : 0;
    const enterpriseYearlyMonthly = Math.round(enterpriseMonthly * 0.8);
    const enterprisePrice = billingPeriod === 'monthly' ? enterpriseMonthly : enterpriseYearlyMonthly;
    const enterpriseYearlyTotal = enterpriseYearlyMonthly * 12;
    const enterpriseYearlySaving = enterpriseMonthly * 12 - enterpriseYearlyTotal;
    const plansFaqs = [
      { q: "How do credits work?", a: "Free tools (Merge, Split, Compress) cost 0 credits and have no daily limit. Advanced AI tools cost credits: most cost 1 credit per use, heavy tools like Detect Forgery and Compare Contracts cost 2. Free gives you +3 credits per day for advanced tools. Pro gives you +500 credits per month. Teams and Enterprise let you choose how many tokens to buy for the month in the dropdown. Your balance is always visible. When credits run out, you wait until the next cycle or upgrade — we never charge you silently." },
      { q: "What is the difference between Free and Pro?", a: "Free: 20 free tools without daily limits, +3 credits per day for advanced tools, 10 MB upload, 100% private — local. Pro: everything in Free, +500 credits per month, 10 advanced AI tools (Chat with PDF, Summarize, Translate, Detect Forgery, Compare Contracts), choose your work environment — Local (default) or Cloud with your explicit consent — 100 MB upload, no ads, priority support." },
      { q: "What is the difference between monthly and yearly billing for Pro?", a: "Pro: Monthly is $12 per month. Yearly is $9 per month, billed $108 once per year — you save $36 per year (25%). Teams and Enterprise: Yearly is 20% off the monthly price, billed once per year. Example: Teams 2,500 credits is $45 / month monthly, or $36 / month billed $432 / year — you save $108. Enterprise 20,000 credits is $280 / month monthly, or $224 / month billed $2,688 / year — you save $672. You get the same credits in both, and you can cancel at any time." },
      { q: "Can I change my plan later?", a: "Yes. You can upgrade from Free to Pro, change your token pack in Teams or Enterprise every month, switch between monthly and yearly for Pro, or downgrade back. Your files stay on your device, nothing is lost when you change plans." },
      { q: "Can I cancel?", a: "Yes, cancel anytime. You keep your paid plan until the end of your cycle, then you go back to Free (for Pro) or to Pro / Free (for Teams). No hidden fees, no lock-in. Pro has a 7-day money-back guarantee." },
      { q: "Do my files stay private on paid plans?", a: "Yes. Local is the default for all plans. Your files stay on your device. Cloud — a specialized external service — is only used if you give explicit prior consent for that task. Silence is not consent. If you refuse, no upload happens." },
      { q: "How does Teams work? Is it for a team?", a: "Teams is for ONE professional only — one lawyer, one accountant, one consultant. You choose how many tokens to buy for the month in the dropdown, you get client projects with private folders for each client, priority support, and 200 MB upload. It is not for a team of 2-5 sharing an account." },
      { q: "How does Enterprise work?", a: "Enterprise is for organizations. One company = one workspace = one shared credit pool. The admin can add/remove members, see the activity log (who used what, when, how many credits), and get a monthly usage report. It is sold via Contact Sales — we accept one client at a time. We do NOT build SSO, full audit logs, or a dedicated server per company in this phase. Those are replaced by simple, within-reach versions: member management, simple activity log, and a private workspace isolated by company." },
    ];
    return (
      <div style={{ minHeight: "100vh", width: "100%", background: outerBg, fontFamily: "'Inter',sans-serif", position: "relative" }}>
        <style>{GUTTER_CSS}</style>
        {header}
        <aside className="hideMob leftSidebarScroll" style={leftSidebarStyle}>{sidebarContent}</aside>
        {mobileMenuOpen && (<><div onClick={() => setMobileMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 120 }} /><div style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: "280px", background: sideBg, zIndex: 130, overflowY: "auto" }}>{sidebarContent}</div></>)}
        <main className="mainResponsive" style={{ marginLeft: "280px", marginRight: "56px", minWidth: 0, width: "auto", paddingTop: "57px", position: "relative", zIndex: 1 }}>
          <div className="pagePad" style={{ maxWidth: "1120px", margin: "0 auto", padding: "32px 20px 40px" }}>
            <div style={{ background: "white", borderRadius: "24px", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", padding: "36px 28px", color: "#111", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "-80px", left: "50%", transform: "translateX(-50%)", width: "560px", height: "220px", background: "radial-gradient(ellipse at center, rgba(124,58,237,0.18), rgba(37,99,235,0.08), transparent 70%)", pointerEvents: "none" }} />
              <div style={{ textAlign: "center", position: "relative" }}>
                <span style={{ display: "inline-flex", gap: "6px", alignItems: "center", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", color: "#6D28D9", background: "#F5F3FF", border: "1px solid #DDD6FE", padding: "6px 12px", borderRadius: "999px" }}>✦ CREDITS • NO UNLIMITED PROMISES • 100% PRIVATE</span>
                <h1 className="pageTitle" style={{ fontSize: "34px", fontWeight: 800, color: "#111", letterSpacing: "-0.02em", marginTop: "14px" }}>Pricing <span style={{ background: "linear-gradient(90deg,#7C3AED,#2563EB)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>that is honest</span></h1>
                <p style={{ color: "#6B7280", marginTop: "8px", fontSize: "14px", lineHeight: 1.6 }}>Start for free. Pay only for the credits you use.<br />Free tools cost 0. Advanced tools cost credits. Your balance is always visible.</p>
                <div style={{ display: "inline-flex", background: "#F3F4F6", border: "1px solid #E5E7EB", borderRadius: "999px", padding: "4px", marginTop: "20px" }}>
                  <button onClick={() => setBillingPeriod('monthly')} style={{ padding: "7px 18px", borderRadius: "999px", border: "none", background: billingPeriod === 'monthly' ? "#111" : "transparent", color: billingPeriod === 'monthly' ? "white" : "#374151", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Monthly</button>
                  <button onClick={() => setBillingPeriod('yearly')} style={{ padding: "7px 18px", borderRadius: "999px", border: "none", background: billingPeriod === 'yearly' ? "#111" : "transparent", color: billingPeriod === 'yearly' ? "white" : "#374151", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Yearly</button>
                </div>
                <div style={{ marginTop: "12px" }}><span style={{ display: "inline-block", fontSize: "12px", fontWeight: 600, color: "#15803D", background: "#F0FDF4", border: "1px solid #BBF7D0", padding: "5px 12px", borderRadius: "999px" }}>Save up to 25% with yearly — Pro saves 25%, Teams & Enterprise save 20%</span></div>
              </div>
              <div style={{ display: "flex", justifyContent: "center", marginTop: "22px", position: "relative" }}>
                <div style={{ display: "inline-flex", background: "#F3F4F6", border: "1px solid #E5E7EB", borderRadius: "999px", padding: "4px" }}>
                  <button onClick={() => setPlansView('personal')} style={{ padding: "8px 18px", borderRadius: "999px", border: "none", background: plansView === 'personal' ? "#111" : "transparent", color: plansView === 'personal' ? "white" : "#374151", fontSize: "13px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>Personal • Free & Pro</button>
                  <button onClick={() => setPlansView('business')} style={{ padding: "8px 18px", borderRadius: "999px", border: "none", background: plansView === 'business' ? "#111" : "transparent", color: plansView === 'business' ? "white" : "#374151", fontSize: "13px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>Professionals & Companies</button>
                </div>
              </div>
              <div style={{ textAlign: "center", fontSize: "12px", color: "#6B7280", marginTop: "10px" }}>{plansView === 'personal' ? "1 of 2 — For you, available now" : "2 of 2 — For one professional & for organizations"}</div>
              {plansView === 'personal' ? (
              <div className="plansGrid2">
                <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "#E5E7EB" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ display: "flex", alignItems: "center", gap: "10px" }}><span style={{ width: "36px", height: "36px", borderRadius: "999px", background: "#F3F4F6", display: "grid", placeItems: "center", fontSize: "18px" }}>📄</span><span style={{ fontWeight: 700, fontSize: "16px", color: "#111" }}>Free</span></div><span style={{ fontSize: "10px", fontWeight: 700, color: "#15803D", background: "#F0FDF4", border: "1px solid #BBF7D0", padding: "4px 10px", borderRadius: "999px" }}>AVAILABLE NOW</span></div>
                  <div style={{ marginTop: "14px" }}><span style={{ fontSize: "34px", fontWeight: 800, color: "#111" }}>$0</span><span style={{ fontSize: "12px", color: "#6B7280" }}> / month</span></div>
                  <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "4px" }}>Free forever, no card required</div>
                  <div style={{ fontSize: "12px", color: "#374151", marginTop: "12px", lineHeight: 1.6 }}>To try PDFlexi. Real tools from free tools, without daily limits. Files stay on your device.</div>
                  <div style={{ marginTop: "14px", display: "inline-flex", alignItems: "center", gap: "6px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "999px", padding: "6px 12px", fontSize: "11px", fontWeight: 700, color: "#15803D", alignSelf: "flex-start" }}>🪙 +3 credits / day for advanced tools</div>
                  <button onClick={() => navTo('homepage')} style={{ marginTop: "16px", width: "100%", padding: "11px", borderRadius: "999px", border: "1px solid #E5E7EB", background: "white", color: "#111", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}>Your Current Plan</button>
                  <div style={{ height: "1px", background: "#F3F4F6", margin: "20px 0 0" }} />
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#111", marginTop: "16px" }}>What is included — today</div>
                  <div style={{ fontSize: "12px", color: "#374151", marginTop: "10px", lineHeight: 2.1 }}>
                    <div style={{ display: "flex", gap: "8px" }}><span style={{ width: "18px", height: "18px", borderRadius: "999px", background: "#DCFCE7", color: "#15803D", display: "grid", placeItems: "center", fontSize: "10px", flexShrink: 0, marginTop: "5px" }}>✓</span><span>20 free tools — Merge, Split, Compress</span></div>
                    <div style={{ display: "flex", gap: "8px" }}><span style={{ width: "18px", height: "18px", borderRadius: "999px", background: "#DCFCE7", color: "#15803D", display: "grid", placeItems: "center", fontSize: "10px", flexShrink: 0, marginTop: "5px" }}>✓</span><span>Advanced tools +3 credits per day</span></div>
                    <div style={{ display: "flex", gap: "8px" }}><span style={{ width: "18px", height: "18px", borderRadius: "999px", background: "#DCFCE7", color: "#15803D", display: "grid", placeItems: "center", fontSize: "10px", flexShrink: 0, marginTop: "5px" }}>✓</span><span>100% Private — Local</span></div>
                    <div style={{ display: "flex", gap: "8px" }}><span style={{ width: "18px", height: "18px", borderRadius: "999px", background: "#DCFCE7", color: "#15803D", display: "grid", placeItems: "center", fontSize: "10px", flexShrink: 0, marginTop: "5px" }}>✓</span><span>10 MB file upload limit</span></div>
                    <div style={{ display: "flex", gap: "8px" }}><span style={{ width: "18px", height: "18px", borderRadius: "999px", background: "#DCFCE7", color: "#15803D", display: "grid", placeItems: "center", fontSize: "10px", flexShrink: 0, marginTop: "5px" }}>✓</span><span>English / French / +40 languages</span></div>
                  </div>
                  <div style={{ marginTop: "16px", background: "#F9FAFB", border: "1px solid #F3F4F6", borderRadius: "12px", padding: "12px", fontSize: "11px", color: "#6B7280", lineHeight: 1.6 }}><span style={{ fontWeight: 700, color: "#111" }}>Good to know: </span>You never pay. No card, no trial that turns into a charge. When you use your 3 credits for advanced tools, wait until tomorrow or upgrade.</div>
                </div>
                <div style={{ background: "white", border: "2px solid #7C3AED", borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", boxShadow: "0 18px 40px rgba(124,58,237,0.18)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg,#7C3AED,#2563EB,#EC4899)" }} />
                  <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "120px", height: "120px", background: "radial-gradient(circle, rgba(124,58,237,0.18), transparent 70%)", pointerEvents: "none" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}><div style={{ display: "flex", alignItems: "center", gap: "10px" }}><span style={{ width: "36px", height: "36px", borderRadius: "999px", background: "linear-gradient(135deg,#7C3AED,#2563EB)", display: "grid", placeItems: "center", fontSize: "18px", color: "white" }}>⚡</span><span style={{ fontWeight: 700, fontSize: "16px", color: "#111" }}>Pro</span></div><span style={{ fontSize: "10px", fontWeight: 800, color: "white", background: "#7C3AED", padding: "4px 10px", borderRadius: "999px" }}>★ MOST POPULAR</span></div>
                  <div style={{ marginTop: "14px", position: "relative" }}><span style={{ fontSize: "34px", fontWeight: 800, color: "#111" }}>{billingPeriod === 'monthly' ? "$12" : "$9"}</span><span style={{ fontSize: "12px", color: "#6B7280" }}> / month</span></div>
                  <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "4px", position: "relative" }}>{billingPeriod === 'monthly' ? "Billed monthly • Cancel anytime" : "Billed yearly • $108 / year • Save $36 / year • Cancel anytime"}</div>
                  <div style={{ fontSize: "12px", color: "#374151", marginTop: "12px", lineHeight: 1.6, position: "relative" }}>For daily work. Everything free, without limits, plus advanced AI.</div>
                  <div style={{ marginTop: "14px", display: "inline-flex", alignItems: "center", gap: "6px", background: "linear-gradient(90deg,#7C3AED,#2563EB)", borderRadius: "999px", padding: "7px 12px", fontSize: "11px", fontWeight: 800, color: "white", alignSelf: "flex-start" }}>🪙 +500 credits / month</div>
                  <button style={{ marginTop: "16px", width: "100%", padding: "11px", borderRadius: "999px", border: "none", background: "#2563EB", color: "white", fontWeight: 600, cursor: "pointer", fontSize: "13px", position: "relative" }}>Upgrade to Pro</button>
                  <div style={{ height: "1px", background: "#F3F4F6", margin: "20px 0 0" }} />
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#111", marginTop: "16px" }}>What is included — today</div>
                  <div style={{ fontSize: "12px", color: "#374151", marginTop: "10px", lineHeight: 2.1, position: "relative" }}>
                    <div style={{ display: "flex", gap: "8px" }}><span style={{ width: "18px", height: "18px", borderRadius: "999px", background: "#EDE9FE", color: "#7C3AED", display: "grid", placeItems: "center", fontSize: "10px", flexShrink: 0, marginTop: "5px" }}>✓</span><span>Everything free — 20 free tools, without daily limits</span></div>
                    <div style={{ display: "flex", gap: "8px" }}><span style={{ width: "18px", height: "18px", borderRadius: "999px", background: "#EDE9FE", color: "#7C3AED", display: "grid", placeItems: "center", fontSize: "10px", flexShrink: 0, marginTop: "5px" }}>✓</span><span>10 advanced AI tools</span></div>
                    <div style={{ display: "flex", gap: "8px" }}><span style={{ width: "18px", height: "18px", borderRadius: "999px", background: "#EDE9FE", color: "#7C3AED", display: "grid", placeItems: "center", fontSize: "10px", flexShrink: 0, marginTop: "5px" }}>✓</span><span>Detect Forgery • Compare Contracts</span></div>
                    <div style={{ display: "flex", gap: "8px" }}><span style={{ width: "18px", height: "18px", borderRadius: "999px", background: "#EDE9FE", color: "#7C3AED", display: "grid", placeItems: "center", fontSize: "10px", flexShrink: 0, marginTop: "5px" }}>✓</span><span>Chat with PDF • Summarize • Translate</span></div>
                    <div style={{ display: "flex", gap: "8px" }}><span style={{ width: "18px", height: "18px", borderRadius: "999px", background: "#EDE9FE", color: "#7C3AED", display: "grid", placeItems: "center", fontSize: "10px", flexShrink: 0, marginTop: "5px" }}>✓</span><span>Choose work environment: Local (default) or Cloud (with your explicit consent)</span></div>
                    <div style={{ display: "flex", gap: "8px" }}><span style={{ width: "18px", height: "18px", borderRadius: "999px", background: "#EDE9FE", color: "#7C3AED", display: "grid", placeItems: "center", fontSize: "10px", flexShrink: 0, marginTop: "5px" }}>✓</span><span>100 MB file upload limit</span></div>
                    <div style={{ display: "flex", gap: "8px" }}><span style={{ width: "18px", height: "18px", borderRadius: "999px", background: "#EDE9FE", color: "#7C3AED", display: "grid", placeItems: "center", fontSize: "10px", flexShrink: 0, marginTop: "5px" }}>✓</span><span>Priority support • No ads</span></div>
                  </div>
                  <div style={{ marginTop: "16px", background: "#EFF6FF", border: "1px solid #DBEAFE", borderRadius: "12px", padding: "12px", fontSize: "11px", color: "#1E40AF", lineHeight: 1.6 }}><span style={{ fontWeight: 700, color: "#111" }}>Good to know: </span>You pay only for Pro. Cancel anytime — you keep Pro until the end of your cycle, then you go back to Free. 7-day money-back.</div>
                </div>
              </div>
              ) : (
              <div className="plansGrid2">
                <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "#2563EB" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ display: "flex", alignItems: "center", gap: "10px" }}><span style={{ width: "36px", height: "36px", borderRadius: "999px", background: "#DBEAFE", display: "grid", placeItems: "center", fontSize: "18px" }}>👤</span><span style={{ fontWeight: 700, fontSize: "16px", color: "#111" }}>Teams</span></div><span style={{ fontSize: "10px", fontWeight: 800, color: "#1E40AF", background: "#EFF6FF", border: "1px solid #BFDBFE", padding: "4px 10px", borderRadius: "999px" }}>FOR ONE PROFESSIONAL</span></div>
                  <div style={{ marginTop: "14px" }}><span style={{ fontSize: "34px", fontWeight: 800, color: "#111" }}>${teamsPrice}</span><span style={{ fontSize: "12px", color: "#6B7280" }}> / month</span>{billingPeriod === 'yearly' && (<span style={{ marginLeft: "8px", fontSize: "11px", fontWeight: 700, color: "#15803D", background: "#F0FDF4", border: "1px solid #BBF7D0", padding: "3px 8px", borderRadius: "999px" }}>Save ${teamsYearlySaving} / year</span>)}</div>
                  <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "4px" }}>{billingPeriod === 'monthly' ? `${teamsTokens.toLocaleString()} credits / month • Billed monthly • Cancel anytime` : `${teamsTokens.toLocaleString()} credits / month • Billed yearly • $${teamsYearlyTotal} / year • Save $${teamsYearlySaving} / year`}</div>
                  <div style={{ marginTop: "12px" }}>
                    <label style={{ fontSize: "11px", fontWeight: 700, color: "#111" }}>Choose tokens for this month</label>
                    <select value={teamsTokens} onChange={(e) => setTeamsTokens(Number(e.target.value))} style={{ marginTop: "6px", width: "100%", padding: "11px 12px", borderRadius: "12px", border: "1px solid #E5E7EB", background: "#F9FAFB", fontSize: "13px", fontWeight: 600, color: "#111", cursor: "pointer" }}>
                      <option value={1000}>1,000 credits — $20 / month</option>
                      <option value={2500}>2,500 credits — $45 / month</option>
                      <option value={5000}>5,000 credits — $80 / month</option>
                      <option value={10000}>10,000 credits — $150 / month</option>
                    </select>
                    <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "6px" }}>Price changes with your choice. Yearly = 20% off the monthly price, billed once per year. You can change it every month.</div>
                  </div>
                  <div style={{ fontSize: "12px", color: "#374151", marginTop: "12px", lineHeight: 1.6 }}>For one professional: one lawyer, one accountant, one consultant. Everything in Pro, with tokens you choose, and professional privileges.</div>
                  <button style={{ marginTop: "16px", width: "100%", padding: "11px", borderRadius: "999px", border: "1px solid #111", background: "#111", color: "white", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}>Upgrade to Teams</button>
                  <div style={{ height: "1px", background: "#F3F4F6", margin: "20px 0 0" }} />
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#111", marginTop: "16px" }}>What is included — today</div>
                  <div style={{ fontSize: "12px", color: "#374151", marginTop: "10px", lineHeight: 2.1 }}>
                    <div style={{ display: "flex", gap: "8px" }}><span style={{ width: "18px", height: "18px", borderRadius: "999px", background: "#DBEAFE", color: "#1E40AF", display: "grid", placeItems: "center", fontSize: "10px", flexShrink: 0, marginTop: "5px" }}>✓</span><span>Everything in Pro</span></div>
                    <div style={{ display: "flex", gap: "8px" }}><span style={{ width: "18px", height: "18px", borderRadius: "999px", background: "#DBEAFE", color: "#1E40AF", display: "grid", placeItems: "center", fontSize: "10px", flexShrink: 0, marginTop: "5px" }}>✓</span><span>Client Projects / private folders — each client separate</span></div>
                    <div style={{ display: "flex", gap: "8px" }}><span style={{ width: "18px", height: "18px", borderRadius: "999px", background: "#DBEAFE", color: "#1E40AF", display: "grid", placeItems: "center", fontSize: "10px", flexShrink: 0, marginTop: "5px" }}>✓</span><span>Choose work environment: Local (default) or Cloud (with your explicit consent)</span></div>
                    <div style={{ display: "flex", gap: "8px" }}><span style={{ width: "18px", height: "18px", borderRadius: "999px", background: "#DBEAFE", color: "#1E40AF", display: "grid", placeItems: "center", fontSize: "10px", flexShrink: 0, marginTop: "5px" }}>✓</span><span>Priority support</span></div>
                    <div style={{ display: "flex", gap: "8px" }}><span style={{ width: "18px", height: "18px", borderRadius: "999px", background: "#DBEAFE", color: "#1E40AF", display: "grid", placeItems: "center", fontSize: "10px", flexShrink: 0, marginTop: "5px" }}>✓</span><span>200 MB file upload limit • No ads</span></div>
                  </div>
                  <div style={{ marginTop: "16px", background: "#EFF6FF", border: "1px solid #DBEAFE", borderRadius: "12px", padding: "12px", fontSize: "11px", color: "#1E40AF", lineHeight: 1.6 }}><span style={{ fontWeight: 700, color: "#111" }}>Good to know: </span>You pay only for the tokens you chose. You can change the number every month, and cancel anytime — you keep Teams until the end of your cycle, then you go back to Pro or Free.</div>
                </div>
                <div style={{ background: "white", border: "1px solid #111", borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "#111" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ display: "flex", alignItems: "center", gap: "10px" }}><span style={{ width: "36px", height: "36px", borderRadius: "999px", background: "#111", display: "grid", placeItems: "center", fontSize: "18px", color: "white" }}>🏢</span><span style={{ fontWeight: 700, fontSize: "16px", color: "#111" }}>Enterprise</span></div><span style={{ fontSize: "10px", fontWeight: 700, color: "#374151", background: "#F3F4F6", border: "1px solid #E5E7EB", padding: "4px 10px", borderRadius: "999px" }}>LET'S TALK</span></div>
                  <div style={{ marginTop: "14px" }}>{enterpriseTokens === 0 ? (<><span style={{ fontSize: "34px", fontWeight: 800, color: "#111" }}>Custom</span></>) : (<><span style={{ fontSize: "34px", fontWeight: 800, color: "#111" }}>${enterprisePrice}</span><span style={{ fontSize: "12px", color: "#6B7280" }}> / month</span>{billingPeriod === 'yearly' && (<span style={{ marginLeft: "8px", fontSize: "11px", fontWeight: 700, color: "#15803D", background: "#F0FDF4", border: "1px solid #BBF7D0", padding: "3px 8px", borderRadius: "999px" }}>Save ${enterpriseYearlySaving} / year</span>)}</>)} </div>
                  <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "4px" }}>{enterpriseTokens === 0 ? "Custom quote • For organizations — yearly quote on request" : billingPeriod === 'monthly' ? `${enterpriseTokens.toLocaleString()} credits / month • Billed monthly • For organizations` : `${enterpriseTokens.toLocaleString()} credits / month • Billed yearly • $${enterpriseYearlyTotal} / year • Save $${enterpriseYearlySaving} / year`}</div>
                  <div style={{ marginTop: "12px" }}>
                    <label style={{ fontSize: "11px", fontWeight: 700, color: "#111" }}>Choose tokens for this month</label>
                    <select value={enterpriseTokens} onChange={(e) => setEnterpriseTokens(Number(e.target.value))} style={{ marginTop: "6px", width: "100%", padding: "11px 12px", borderRadius: "12px", border: "1px solid #E5E7EB", background: "#F9FAFB", fontSize: "13px", fontWeight: 600, color: "#111", cursor: "pointer" }}>
                      <option value={20000}>20,000 credits — $280 / month</option>
                      <option value={50000}>50,000 credits — $600 / month</option>
                      <option value={100000}>100,000 credits — $1,000 / month</option>
                      <option value={0}>Custom — Contact Sales</option>
                    </select>
                    <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "6px" }}>Large packs for companies. Yearly = 20% off the monthly price, billed once per year. Custom = custom quote after a short call.</div>
                  </div>
                  <div style={{ fontSize: "12px", color: "#374151", marginTop: "12px", lineHeight: 1.6 }}>For organizations needing scale, security, support. We build the offer with you. One company = one workspace = one shared credit pool.</div>
                  <a href="mailto:founders@pdflexi.com" style={{ marginTop: "16px", width: "100%", padding: "11px", borderRadius: "999px", border: "1px solid #111", background: "white", color: "#111", fontWeight: 600, cursor: "pointer", fontSize: "13px", textAlign: "center", textDecoration: "none", boxSizing: "border-box", display: "block" }}>Contact Sales</a>
                  <div style={{ height: "1px", background: "#F3F4F6", margin: "20px 0 0" }} />
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#111", marginTop: "16px" }}>What is included — within reach</div>
                  <div style={{ fontSize: "12px", color: "#374151", marginTop: "10px", lineHeight: 2.1 }}>
                    <div style={{ display: "flex", gap: "8px" }}><span style={{ width: "18px", height: "18px", borderRadius: "999px", background: "#F3F4F6", color: "#111", display: "grid", placeItems: "center", fontSize: "10px", flexShrink: 0, marginTop: "5px" }}>✓</span><span>Everything in Teams</span></div>
                    <div style={{ display: "flex", gap: "8px" }}><span style={{ width: "18px", height: "18px", borderRadius: "999px", background: "#F3F4F6", color: "#111", display: "grid", placeItems: "center", fontSize: "10px", flexShrink: 0, marginTop: "5px" }}>✓</span><span>Team accounts management — add / remove members (not SSO)</span></div>
                    <div style={{ display: "flex", gap: "8px" }}><span style={{ width: "18px", height: "18px", borderRadius: "999px", background: "#F3F4F6", color: "#111", display: "grid", placeItems: "center", fontSize: "10px", flexShrink: 0, marginTop: "5px" }}>✓</span><span>Activity Log — who used what, when, how many credits (not full audit logs)</span></div>
                    <div style={{ display: "flex", gap: "8px" }}><span style={{ width: "18px", height: "18px", borderRadius: "999px", background: "#F3F4F6", color: "#111", display: "grid", placeItems: "center", fontSize: "10px", flexShrink: 0, marginTop: "5px" }}>✓</span><span>Private workspace per company — isolated, Local by default, Cloud only with your explicit consent (not a dedicated server)</span></div>
                    <div style={{ display: "flex", gap: "8px" }}><span style={{ width: "18px", height: "18px", borderRadius: "999px", background: "#F3F4F6", color: "#111", display: "grid", placeItems: "center", fontSize: "10px", flexShrink: 0, marginTop: "5px" }}>✓</span><span>Simple data controls — auto-delete after 30 days, Admin controls download / share</span></div>
                    <div style={{ display: "flex", gap: "8px" }}><span style={{ width: "18px", height: "18px", borderRadius: "999px", background: "#F3F4F6", color: "#111", display: "grid", placeItems: "center", fontSize: "10px", flexShrink: 0, marginTop: "5px" }}>✓</span><span>Dedicated account manager • Onboarding & Training (video call)</span></div>
                    <div style={{ display: "flex", gap: "8px" }}><span style={{ width: "18px", height: "18px", borderRadius: "999px", background: "#F3F4F6", color: "#111", display: "grid", placeItems: "center", fontSize: "10px", flexShrink: 0, marginTop: "5px" }}>✓</span><span>Monthly usage report • Central billing • 500 MB upload</span></div>
                    <div style={{ display: "flex", gap: "8px" }}><span style={{ width: "18px", height: "18px", borderRadius: "999px", background: "#F3F4F6", color: "#111", display: "grid", placeItems: "center", fontSize: "10px", flexShrink: 0, marginTop: "5px" }}>✓</span><span>24/7 support, every day</span></div>
                  </div>
                  <div style={{ marginTop: "16px", background: "#F9FAFB", border: "1px solid #F3F4F6", borderRadius: "12px", padding: "12px", fontSize: "11px", color: "#6B7280", lineHeight: 1.6 }}><span style={{ fontWeight: 700, color: "#111" }}>Good to know: </span>For dropdown packs, you pay only for the tokens you chose. For Custom, you get a custom quote after a short call. No commitment, we reply within 1 business day.</div>
                </div>
              </div>
              )}
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginTop: "20px" }}>
                <button onClick={() => setPlansView('personal')} aria-label="Previous plans" style={{ width: "36px", height: "36px", borderRadius: "999px", border: "1px solid #E5E7EB", background: plansView === 'personal' ? "#F3F4F6" : "white", color: "#111", cursor: "pointer", fontSize: "14px" }}>←</button>
                <span onClick={() => setPlansView('personal')} style={{ width: "8px", height: "8px", borderRadius: "999px", background: plansView === 'personal' ? "#111" : "#E5E7EB", cursor: "pointer", display: "inline-block" }} />
                <span onClick={() => setPlansView('business')} style={{ width: "8px", height: "8px", borderRadius: "999px", background: plansView === 'business' ? "#111" : "#E5E7EB", cursor: "pointer", display: "inline-block" }} />
                <button onClick={() => setPlansView('business')} aria-label="Next plans" style={{ width: "36px", height: "36px", borderRadius: "999px", border: "1px solid #E5E7EB", background: plansView === 'business' ? "#F3F4F6" : "white", color: "#111", cursor: "pointer", fontSize: "14px" }}>→</button>
              </div>
              <div style={{ marginTop: "28px", background: "linear-gradient(135deg,#F5F3FF,#EFF6FF)", border: "1px solid #EDE9FE", borderRadius: "16px", padding: "20px" }}>
                <div style={{ fontSize: "13px", fontWeight: 800, color: "#111", textAlign: "center" }}>How credits work — in 3 steps</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginTop: "14px" }} className="pdfGrid">
                  <div style={{ background: "white", borderRadius: "12px", padding: "14px", textAlign: "center" }}><div style={{ fontSize: "20px" }}>🪙</div><div style={{ fontSize: "12px", fontWeight: 700, color: "#111", marginTop: "6px" }}>1. Buy credits</div><div style={{ fontSize: "11px", color: "#6B7280", marginTop: "4px", lineHeight: 1.5 }}>Choose a plan or a token pack. Free tools cost 0.</div></div>
                  <div style={{ background: "white", borderRadius: "12px", padding: "14px", textAlign: "center" }}><div style={{ fontSize: "20px" }}>⚡</div><div style={{ fontSize: "12px", fontWeight: 700, color: "#111", marginTop: "6px" }}>2. Use credits</div><div style={{ fontSize: "11px", color: "#6B7280", marginTop: "4px", lineHeight: 1.5 }}>Most advanced tools = 1 credit. Heavy tools (Forgery, Contracts) = 2.</div></div>
                  <div style={{ background: "white", borderRadius: "12px", padding: "14px", textAlign: "center" }}><div style={{ fontSize: "20px" }}>👁</div><div style={{ fontSize: "12px", fontWeight: 700, color: "#111", marginTop: "6px" }}>3. See your balance</div><div style={{ fontSize: "11px", color: "#6B7280", marginTop: "4px", lineHeight: 1.5 }}>Balance is always visible. When it hits 0, wait or upgrade. No silent charge.</div></div>
                </div>
                <div style={{ fontSize: "11px", color: "#6B7280", textAlign: "center", marginTop: "10px" }}>Unused credits expire at the end of your cycle. Free: +3 credits reset every day.</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginTop: "16px" }} className="pdfGrid">
                <div style={{ background: "#F9FAFB", borderRadius: "12px", padding: "14px", textAlign: "center" }}><div style={{ fontSize: "18px" }}>🔒</div><div style={{ fontSize: "12px", fontWeight: 700, color: "#111", marginTop: "6px" }}>100% Private</div><div style={{ fontSize: "11px", color: "#6B7280", marginTop: "4px" }}>Local by default. Cloud only with your explicit consent.</div></div>
                <div style={{ background: "#F9FAFB", borderRadius: "12px", padding: "14px", textAlign: "center" }}><div style={{ fontSize: "18px" }}>↩</div><div style={{ fontSize: "12px", fontWeight: 700, color: "#111", marginTop: "6px" }}>Cancel anytime</div><div style={{ fontSize: "11px", color: "#6B7280", marginTop: "4px" }}>Keep your plan until the end of your cycle.</div></div>
                <div style={{ background: "#F9FAFB", borderRadius: "12px", padding: "14px", textAlign: "center" }}><div style={{ fontSize: "18px" }}>💳</div><div style={{ fontSize: "12px", fontWeight: 700, color: "#111", marginTop: "6px" }}>No hidden fees</div><div style={{ fontSize: "11px", color: "#6B7280", marginTop: "4px" }}>No auto-charge when credits run out.</div></div>
              </div>
<div style={{ fontSize: "12px", color: "#6B7280", textAlign: "center", marginTop: "20px" }}>100% Private • No credit card for Free • Cancel anytime • 7-day money-back on Pro. By upgrading, you agree to our <span onClick={() => navTo('terms')} style={{ cursor: "pointer", textDecoration: "underline", color: "#111" }}>Terms</span> & <span onClick={() => navTo('privacy')} style={{ cursor: "pointer", textDecoration: "underline", color: "#111" }}>Privacy Policy</span>.</div>
              <div style={{ marginTop: "36px", maxWidth: "760px", marginLeft: "auto", marginRight: "auto" }}>
                <div style={{ textAlign: "center" }}><h2 style={{ fontSize: "22px", fontWeight: 800, color: "#111" }}>Frequently asked questions</h2><p style={{ fontSize: "13px", color: "#6B7280", marginTop: "6px" }}>Everything you need to know about credits and billing.</p></div>
                <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>{plansFaqs.map((f, i) => (
                  <div key={f.q} style={{ background: plansFaqOpen === i ? "#F9FAFB" : "white", border: "1px solid #E5E7EB", borderRadius: "12px", overflow: "hidden" }}>
                    <button onClick={() => setPlansFaqOpen(plansFaqOpen === i ? null : i)} style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", padding: "14px 16px", fontSize: "13px", color: "#111", fontWeight: 600, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>{f.q}<span style={{ fontSize: "12px", color: "#6B7280" }}>{plansFaqOpen === i ? "▾" : "▸"}</span></button>
                    {plansFaqOpen === i && <div style={{ fontSize: "12px", color: "#6B7280", padding: "0 16px 14px", lineHeight: 1.6 }}>{f.a}</div>}
                  </div>
                ))}</div>
                <div style={{ marginTop: "16px", background: "#EFF6FF", border: "1px solid #DBEAFE", borderRadius: "12px", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}><span style={{ fontSize: "12px", color: "#1E40AF" }}>For additional information, please visit our Help Center.</span><span onClick={() => { setRightActive('help'); setShowHelpPopup(true); }} style={{ fontSize: "12px", fontWeight: 700, color: "#2563EB", cursor: "pointer", whiteSpace: "nowrap" }}>Help Center →</span></div>
              </div>
            </div>
          </div>
        </main>
        {rightBar}
        {userMenu}
      </div>
    );
  }

// ===== HOMEPAGE =====
  return (
    <div style={{ minHeight: "100vh", width: "100%", background: outerBg, fontFamily: "'Inter',sans-serif", position: "relative" }}>
      <style>{GUTTER_CSS}</style>
      {header}
      <aside className="hideMob leftSidebarScroll" style={leftSidebarStyle}>{sidebarContent}</aside>
      {mobileMenuOpen && (<><div onClick={() => setMobileMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 120 }} /><div style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: "280px", background: sideBg, zIndex: 130, overflowY: "auto" }}>{sidebarContent}</div></>)}
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
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "16px", justifyContent: "center" }}>{quickPills.map(p => <button key={p} onClick={() => setChat(p)} style={{ fontSize: "11px", background: isSun ? "#FFFFFF" : "rgba(255,255,255,0.04)", border: `1px solid ${middleCardBorder}`, borderRadius: "999px", padding: "7px 14px", color: isSun ? "#374151" : "rgba(255,255,255,0.5)", cursor: "pointer" }}>{p}</button>)}</div>
                </div>
                <div style={{ background: middleCard, border: `1px ${dragOver ? 'dashed' : 'solid'} ${dragOver ? '#7C3AED' : middleCardBorder}`, borderRadius: "16px", padding: "14px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer" }} onClick={() => fileRef.current?.click()} onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}>
                  <div style={{ width: "100%", maxWidth: "170px", aspectRatio: "3 / 4", background: "white", borderRadius: "10px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", padding: "12px", border: "1px solid #E5E7EB", boxShadow: isLight ? "0 8px 24px rgba(0,0,0,0.10)" : "0 12px 30px rgba(0,0,0,0.4)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: "8px", fontWeight: 800, background: fileInfo.color, color: "white", padding: "3px 6px", borderRadius: "4px" }}>{fileInfo.label}</span><span style={{ fontSize: "8px", color: "#E5E7EB", fontWeight: 600 }}>{fileInfo.meta}</span></div>
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
                        <div style={{ width: "52px", height: "52px", borderRadius: "999px", background: "#F3F4F6", display: "grid", placeItems: "center", fontSize: "22px" }}>📄</div>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#111", marginTop: "10px" }}>Drop a file or</div>
                        <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "4px", lineHeight: 1.4 }}>Click + to choose<br />PDF, Word, Excel</div>
                      </div>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }} title="Add another document" style={{ position: "absolute", bottom: "10px", right: "10px", width: "42px", height: "42px", borderRadius: "999px", background: "#7C3AED", color: "white", border: "2px solid white", fontSize: "22px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(124,58,237,0.5)", display: "grid", placeItems: "center" }}>+</button>
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ fontSize: "10px", letterSpacing: "0.1em", color: middleFaint }}>MY PDFS</div><div style={{ display: "flex", gap: "12px", alignItems: "center" }}><div style={{ fontSize: "10px", color: "#22C55E" }}>{hasFiles ? "● 3 ACTIVE • 12 TOTAL" : "● NO FILES YET"}</div><button onClick={() => setShowAllPdfs(!showAllPdfs)} style={{ fontSize: "11px", background: "transparent", border: "none", color: "#A78BFA", cursor: "pointer", fontWeight: 600 }}>{showAllPdfs ? "Show less ←" : "View all →"}</button></div></div>
              {!hasFiles ? (
                <div style={{ marginTop: "16px", background: middleCard, border: isSun ? "1px dashed #E5E7EB" : "1px dashed rgba(255,255,255,0.12)", borderRadius: "16px", padding: "24px", textAlign: "center" }}>
                  <div style={{ fontSize: "28px" }}>📄</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: middleText, marginTop: "10px" }}>No PDFs yet</div>
                  <div style={{ fontSize: "11px", color: middleMuted, marginTop: "4px" }}>Drop a file above to start, or try an example file.</div>
                  <button onClick={() => goWorkspace("Contract-Tangier-2024.pdf")} style={{ marginTop: "14px", background: isSun ? "#111" : "white", color: isSun ? "white" : "black", borderRadius: "999px", padding: "8px 16px", fontSize: "12px", fontWeight: 600, border: "none", cursor: "pointer" }}>Try an example file →</button>
                </div>
              ) : (
                <>
                  <div className="pdfGrid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginTop: "16px" }}>{pdfs.slice(0, 3).map(pdf => (
                    <div key={pdf.name} style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", padding: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}><div style={{ width: "32px", height: "36px", borderRadius: "6px", background: isSun ? "#FFFFFF" : "rgba(255,255,255,0.04)", borderTop: `3px solid ${pdf.color}`, display: "grid", placeItems: "center" }}><span style={{ fontSize: "9px", fontWeight: 700, color: pdf.color }}>PDF</span></div><span style={{ fontSize: "10px", background: isSun ? "#FFFFFF" : "rgba(255,255,255,0.04)", padding: "3px 8px", borderRadius: "999px", color: middleMuted }}>{pdf.pages}</span></div>
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
                        <div style={{ display: "flex", justifyContent: "space-between" }}><div style={{ width: "32px", height: "36px", borderRadius: "6px", background: isSun ? "#FFFFFF" : "rgba(255,255,255,0.04)", borderTop: `3px solid ${pdf.color}`, display: "grid", placeItems: "center" }}><span style={{ fontSize: "9px", fontWeight: 700, color: pdf.color }}>PDF</span></div><span style={{ fontSize: "10px", background: isSun ? "#FFFFFF" : "rgba(255,255,255,0.04)", padding: "3px 8px", borderRadius: "999px", color: middleMuted }}>{pdf.pages}</span></div>
                        <div style={{ marginTop: "14px", fontSize: "12px", fontWeight: 600, color: middleText }}>{pdf.name}</div><div style={{ fontSize: "11px", color: middleMuted }}>{pdf.size} • {pdf.edited}</div>
                        <button onClick={() => goWorkspace(pdf.name)} style={{ marginTop: "12px", width: "100%", background: isSun ? "#111" : "white", color: isSun ? "white" : "black", borderRadius: "999px", padding: "8px", fontSize: "12px", fontWeight: 600, border: "none", cursor: "pointer" }}>Open</button>
                      </div>))}
                    </div>
                  )}
                </>
              )}
            </div>

            <div style={{ marginTop: "48px", padding: "64px 24px 0", borderTop: `1px solid ${middleCardBorder}` }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.12em", color: "#A78BFA" }}>SECTION 2 • TRY IN ONE CLICK</div>
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: middleText, marginTop: "8px" }}>What can Lexi do for you?</h2>
              <div style={{ fontSize: "13px", color: middleMuted, marginTop: "6px" }}>Click a tool, Lexi opens it for you. No menus, no Acrobat.</div>
              <div className="pdfGrid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginTop: "20px" }}>
                {[
                  { id: 1, en: "Merge PDF", icon: "🔗", desc: "Combine many PDFs into one clean file.", tag: "FREE" },
                  { id: 2, en: "Split PDF", icon: "✂", desc: "Split by pages or extract what you need.", tag: "FREE" },
                  { id: 3, en: "Compress PDF", icon: "🗜", desc: "Shrink under 2MB without losing quality.", tag: "FREE" },
                  { id: 17, en: "Sign PDF", icon: "✍", desc: "Add your signature in one chat.", tag: "FREE" },
                  { id: 22, en: "Summarize Contract in 3 Lines", icon: "⚡", desc: "Understand a 120-page contract in seconds.", tag: "PRO" },
                  { id: 28, en: "Translate PDF - Keep Design", icon: "🌍", desc: "Translate and keep the original layout.", tag: "PRO" },
                ].map(t => (
                  <div key={t.id} onClick={() => handleToolClick(t)} style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", padding: "16px", cursor: "pointer" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: "22px" }}>{t.icon}</span><span style={{ fontSize: "9px", background: t.tag === "PRO" ? "#7C3AED" : "rgba(34,197,94,0.15)", color: t.tag === "PRO" ? "white" : "#22C55E", padding: "3px 8px", borderRadius: "999px", fontWeight: 700 }}>{t.tag}</span></div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: middleText, marginTop: "12px" }}>{t.en}</div>
                    <div style={{ fontSize: "11px", color: middleMuted, marginTop: "4px", lineHeight: 1.5 }}>{t.desc}</div>
                    <div style={{ fontSize: "11px", color: "#A78BFA", marginTop: "10px", fontWeight: 600 }}>Try with Lexi →</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "16px", background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div><div style={{ fontSize: "13px", fontWeight: 600, color: middleText }}>Multi-file mode</div><div style={{ fontSize: "11px", color: middleMuted, marginTop: "4px" }}>Drop 2+ PDFs, Lexi will auto-detect: merge, compare, or extract.</div></div>
                <div style={{ display: "flex", gap: "8px" }}><div style={{ background: isSun ? "#FFFFFF" : "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "10px 18px", fontSize: "11px", color: middleMuted }}>PDF A</div><div style={{ background: isSun ? "#FFFFFF" : "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "10px 18px", fontSize: "11px", color: middleMuted }}>PDF B</div></div>
              </div>
            </div>
            <div className="adBanner" style={{ margin: "48px 24px 0", background: "white", borderRadius: "12px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px", border: "1px solid #E5E7EB" }}>
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
              <div style={{ fontSize: "10px", letterSpacing: "0.12em", color: "#60A5FA" }}>SECTION 3 • HOW IT WORKS</div>
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: middleText, marginTop: "8px" }}>Your PDF workflow, simplified</h2>
              <div style={{ fontSize: "13px", color: middleMuted, marginTop: "6px" }}>Three simple steps. No complicated software or menus.</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginTop: "20px" }} className="pdfGrid">
                <div style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: "22px" }}>📁</span><span style={{ fontSize: "11px", fontWeight: 700, color: "#A78BFA" }}>01</span></div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: middleText, marginTop: "12px" }}>Add your files</div>
                  <div style={{ fontSize: "12px", color: middleMuted, marginTop: "6px", lineHeight: 1.6 }}>Choose a PDF from your device or drop it into the workspace.</div>
                </div>
                <div style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: "22px" }}>💬</span><span style={{ fontSize: "11px", fontWeight: 700, color: "#A78BFA" }}>02</span></div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: middleText, marginTop: "12px" }}>Tell Lexi what you need</div>
                  <div style={{ fontSize: "12px", color: middleMuted, marginTop: "6px", lineHeight: 1.6 }}>Describe the task in everyday language, or choose one of the available tools.</div>
                </div>
                <div style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: "22px" }}>✨</span><span style={{ fontSize: "11px", fontWeight: 700, color: "#A78BFA" }}>03</span></div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: middleText, marginTop: "12px" }}>Review your result</div>
                  <div style={{ fontSize: "12px", color: middleMuted, marginTop: "6px", lineHeight: 1.6 }}>Check the result and download your processed document.</div>
                </div>
              </div>
              <button onClick={() => navTo('how')} style={{ marginTop: "16px", background: "transparent", border: `1px solid ${middleCardBorder}`, borderRadius: "999px", padding: "8px 16px", fontSize: "12px", color: middleText, cursor: "pointer" }}>See the full guide →</button>
            </div>

            <div style={{ marginTop: "48px", padding: "64px 24px 0", borderTop: `1px solid ${middleCardBorder}` }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.12em", color: "#F59E0B" }}>SECTION 4 • USE CASES</div>
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: middleText, marginTop: "8px" }}>Made for the documents you work with every day</h2>
              <div style={{ fontSize: "13px", color: middleMuted, marginTop: "6px" }}>From everyday PDF tasks to more demanding document workflows.</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginTop: "20px" }} className="pdfGrid">
                <div style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", padding: "20px" }}><div style={{ fontSize: "22px" }}>⚖</div><div style={{ fontSize: "13px", fontWeight: 700, color: middleText, marginTop: "10px" }}>Legal professionals</div><div style={{ fontSize: "12px", color: middleMuted, marginTop: "6px", lineHeight: 1.6 }}>Summarize contracts, compare agreements, and review clauses that may need closer attention.</div></div>
                <div style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", padding: "20px" }}><div style={{ fontSize: "22px" }}>🏢</div><div style={{ fontSize: "13px", fontWeight: 700, color: middleText, marginTop: "10px" }}>Businesses & teams</div><div style={{ fontSize: "12px", color: middleMuted, marginTop: "6px", lineHeight: 1.6 }}>Organize invoices, extract document data, and handle batches of PDF files.</div></div>
                <div style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", padding: "20px" }}><div style={{ fontSize: "22px" }}>🎓</div><div style={{ fontSize: "13px", fontWeight: 700, color: middleText, marginTop: "10px" }}>Students & researchers</div><div style={{ fontSize: "12px", color: middleMuted, marginTop: "6px", lineHeight: 1.6 }}>Combine study materials, extract text, compress documents, and ask questions about PDFs.</div></div>
                <div style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", padding: "20px" }}><div style={{ fontSize: "22px" }}>💼</div><div style={{ fontSize: "13px", fontWeight: 700, color: middleText, marginTop: "10px" }}>Freelancers</div><div style={{ fontSize: "12px", color: middleMuted, marginTop: "6px", lineHeight: 1.6 }}>Prepare proposals, manage client documents, and keep files ready to share.</div></div>
                <div style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", padding: "20px" }}><div style={{ fontSize: "22px" }}>👤</div><div style={{ fontSize: "13px", fontWeight: 700, color: middleText, marginTop: "10px" }}>Job seekers</div><div style={{ fontSize: "12px", color: middleMuted, marginTop: "6px", lineHeight: 1.6 }}>Work on CVs and supporting documents, and tailor a CV to a job offer.</div></div>
                <div style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "16px", padding: "20px" }}><div style={{ fontSize: "22px" }}>🏠</div><div style={{ fontSize: "13px", fontWeight: 700, color: middleText, marginTop: "10px" }}>Everyday users</div><div style={{ fontSize: "12px", color: middleMuted, marginTop: "6px", lineHeight: 1.6 }}>Sign, convert, rotate, split, and organize personal documents with less effort.</div></div>
              </div>
            </div>

            <div style={{ marginTop: "48px", padding: "64px 24px 0", borderTop: `1px solid ${middleCardBorder}` }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.12em", color: "#F59E0B" }}>SECTION 5 • WATCH LEXI IN ACTION</div>
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
                  <div style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "12px", padding: "14px", display: "flex", gap: "10px" }}><span style={{ fontSize: "16px" }}>👁</span><div><div style={{ fontSize: "12px", fontWeight: 700, color: middleText }}>Clear & transparent</div><div style={{ fontSize: "11px", color: middleMuted, marginTop: "3px", lineHeight: 1.5 }}>You always know what Lexi is doing with your PDF before you download it.</div></div></div>
                  <div style={{ background: middleCard, border: `1px solid ${middleCardBorder}`, boxShadow: isSun ? "0 1px 3px rgba(0,0,0,0.06)" : "none", borderRadius: "12px", padding: "14px", display: "flex", gap: "10px" }}><span style={{ fontSize: "16px" }}>🛡</span><div><div style={{ fontSize: "12px", fontWeight: 700, color: middleText }}>Your control</div><div style={{ fontSize: "11px", color: middleMuted, marginTop: "3px", lineHeight: 1.5 }}>Review what Lexi will do before proceeding. You decide, Lexi executes.</div></div></div>
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