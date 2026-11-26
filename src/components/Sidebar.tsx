import MyFiles from "./MyFiles";
import { freeTools, proTools } from "../data/showcase";

interface SidebarProps {
  isSun: boolean;
  sideText: string;
  sideMuted: string;
  sideFaint: string;
  sideCard: string;
  sideCardBorder: string;
  setMobileMenuOpen: (v: boolean) => void;
  accountType: 'personal' | 'professional' | 'company';
  setAccountType: (v: 'personal' | 'professional' | 'company') => void;
  setChat: (v: string) => void;
  freeOpen: boolean;
  setFreeOpen: (v: boolean) => void;
  proOpen: boolean;
  setProOpen: (v: boolean) => void;
  handleToolClick: (tool: any) => void;
  goWorkspace: (name: string, msg?: string) => void;
  navTo: (v: 'homepage' | 'how' | 'plans' | 'privacy' | 'terms' | 'why-private') => void;
  sidebarRecentOpen: boolean;
  setSidebarRecentOpen: (v: boolean) => void;
  activeTool: string;
}

export default function Sidebar({ isSun, sideText, sideMuted, sideFaint, sideCard, sideCardBorder, setMobileMenuOpen, accountType, setAccountType, setChat, freeOpen, setFreeOpen, proOpen, setProOpen, handleToolClick, goWorkspace, navTo, sidebarRecentOpen, setSidebarRecentOpen, activeTool }: SidebarProps) {
  return (
    <div className="leftSidebarContent" style={{ padding: "16px 16px 0", display: "flex", flexDirection: "column", height: "auto", minHeight: "max-content" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: isSun ? '#111111' : 'white', display: "grid", placeItems: "center", color: isSun ? 'white' : 'black', fontWeight: 800 }}>P</div>
        <span style={{ fontWeight: 600, color: sideText }}>PDFlexi.</span>
        <button onClick={() => setMobileMenuOpen(false)} style={{ marginLeft: "auto", background: "transparent", border: "none", color: sideMuted, fontSize: "18px", cursor: "pointer" }} className="mobileOnlyBtn">✕</button>
      </div>
      {/* HIDDEN — Account type preview switcher. Kept in code for future, never shown in sidebar. */}
      <div style={{ display: "none", background: sideCard, border: `1px solid ${sideCardBorder}`, borderRadius: "10px", padding: "10px", marginBottom: "12px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "0.08em", color: sideFaint, fontWeight: 700 }}>ACCOUNT PREVIEW • PREPARATION ONLY</div>
        <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
          <button onClick={() => setAccountType('personal')} style={{ flex: 1, padding: "6px 4px", borderRadius: "8px", border: "none", background: accountType === 'personal' ? "#111" : "transparent", color: accountType === 'personal' ? "white" : sideText, fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>Personal</button>
          <button onClick={() => setAccountType('professional')} style={{ flex: 1, padding: "6px 4px", borderRadius: "8px", border: "none", background: accountType === 'professional' ? "#2563EB" : "transparent", color: accountType === 'professional' ? "white" : sideText, fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>Professional</button>
          <button onClick={() => setAccountType('company')} style={{ flex: 1, padding: "6px 4px", borderRadius: "8px", border: "none", background: accountType === 'company' ? "#111" : "transparent", color: accountType === 'company' ? "white" : sideText, fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>Company</button>
        </div>
        <div style={{ fontSize: "10px", color: sideMuted, marginTop: "6px", lineHeight: 1.5 }}>{accountType === 'personal' ? "Free / Pro • 1 person • My files" : accountType === 'professional' ? "Teams • 1 professional • Client folders • 2,500 credits" : "Enterprise • Company • Shared pool • 20,000 credits"}</div>
        {accountType !== 'personal' && (<div style={{ marginTop: "8px", background: isSun ? "#EFF6FF" : "rgba(37,99,235,0.15)", borderRadius: "8px", padding: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: "11px", fontWeight: 700, color: sideText }}>{accountType === 'professional' ? "🪙 2,500 credits" : "🪙 20,000 credits — shared"}</span><span style={{ fontSize: "10px", color: sideMuted }}>{accountType === 'professional' ? "Teams" : "Enterprise"}</span></div>)}
      </div>
      <div onClick={() => { setChat("Hi Lexi, help me with my PDF"); navTo('homepage'); }} style={{ display: "flex", gap: "10px", alignItems: "center", padding: "10px 12px", borderRadius: "10px", background: "#334155", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer" }}>
        <span style={{ display: "grid", placeItems: "center", flexShrink: 0 }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4B5FD" strokeWidth="1.5" strokeLinejoin="round"><path d="M12 3l1.9 5.8 5.8 1.9-5.8 1.9L12 18.4l-1.9-5.8L4.3 10.7l5.8-1.9L12 3z" /></svg></span>
        <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: "13px", fontWeight: 600, color: "white" }}>Ask <span style={{ color: "#C4B5FD" }}>Lexi</span></div><div style={{ fontSize: "11px", color: "rgba(255,255,255,0.85)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Chat with your PDFs</div></div>
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
      <MyFiles sidebarRecentOpen={sidebarRecentOpen} setSidebarRecentOpen={setSidebarRecentOpen} goWorkspace={goWorkspace} isSun={isSun} sideText={sideText} sideMuted={sideMuted} accountType={accountType} sideCard={sideCard} sideCardBorder={sideCardBorder} />
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
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}><span style={{ display: "grid", placeItems: "center" }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg></span><span style={{ fontSize: "12px", fontWeight: 600, color: sideText }}>100% Private</span><span style={{ marginLeft: "auto", fontSize: "9px", background: "#22C55E", color: "white", padding: "2px 6px", borderRadius: "999px", fontWeight: 600 }}>LOCAL</span><span onClick={() => navTo('why-private')} title="Learn more about privacy" style={{ fontSize: "14px", fontWeight: 700, color: sideText, cursor: "pointer", marginLeft: "6px", flexShrink: 0 }}>→</span></div>
        <div style={{ fontSize: "11px", color: sideMuted, lineHeight: 1.5, marginTop: "6px" }}>All tools run in your browser. Your files never leave your device, never uploaded to our servers.</div>
      </div>
      <div style={{ marginTop: "14px", borderRadius: "16px", background: "linear-gradient(135deg,#7C3AED,#EC4899)", padding: "14px", color: "white" }}>
        <div style={{ fontSize: "13px", fontWeight: 700 }}>Upgrade</div>
        <div style={{ fontSize: "11px", opacity: 0.85, marginTop: "5px", lineHeight: 1.5 }}>Choose the plan that fits you — more tasks, more AI tools, more power, no ads.</div>
        <button onClick={() => navTo('plans')} title="Choose the plan that fits you" style={{ marginTop: "10px", background: "white", color: "black", borderRadius: "999px", padding: "7px 14px", fontSize: "11px", fontWeight: 700, border: "none", cursor: "pointer" }}>See Plans</button>
      </div>
    </div>
  );
}
