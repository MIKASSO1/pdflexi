import React from "react";
import { GUTTER_CSS } from "../../data/tools";
import CarouselArrows from "../../components/CarouselArrows";
import { pdfs, quickPills, faqs } from "../../data/showcase";

type FileInfo = { label: string; color: string; meta: string };
type NavTarget = "homepage" | "how" | "plans" | "privacy" | "terms" | "why-private";

export type HomePageProps = {
  // palette
  isSun: boolean;
  isLight: boolean;
  outerBg: string;
  middleBg: string;
  middleText: string;
  middleMuted: string;
  middleFaint: string;
  middleCard: string;
  middleCardBorder: string;
  sideBg: string;
  // shell
  header: React.ReactNode;
  sidebarContent: React.ReactNode;
  rightBar: React.ReactNode;
  userMenu: React.ReactNode;
  footer: React.ReactNode;
  leftSidebarStyle: React.CSSProperties;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  navTo: (view: NavTarget) => void;
  // file state
  fileName: string;
  hasFiles: boolean;
  fileInfo: FileInfo;
  fileRef: React.RefObject<HTMLInputElement | null>;
  chatFileRef: React.RefObject<HTMLInputElement | null>;
  dragOver: boolean;
  setDragOver: (over: boolean) => void;
  homePickerLoading: boolean;
  openHomePicker: () => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // chat + tools
  chat: string;
  setChat: (value: string) => void;
  chatAttached: string | null;
  setChatAttached: (value: string | null) => void;
  typedText: string;
  handleSend: () => void;
  handleToolClick: (tool: any) => void;
  goWorkspace: (name: string, msg?: string) => void;
  mobileAdCard: React.ReactNode;
  // faq + gallery
  faqOpen: number;
  setFaqOpen: (index: number) => void;
  showAllPdfs: boolean;
  setShowAllPdfs: (show: boolean) => void;
};

export function HomePage(props: HomePageProps) {
  const {
    isSun, isLight, outerBg, middleBg, middleText, middleMuted, middleFaint, middleCard, middleCardBorder, sideBg,
    header, sidebarContent, rightBar, userMenu, footer, leftSidebarStyle, mobileMenuOpen, setMobileMenuOpen,
    navTo,
    fileName, hasFiles, fileInfo, fileRef, chatFileRef, dragOver, setDragOver, homePickerLoading,
    openHomePicker, handleDrop, handleFile,
    chat, setChat, chatAttached, setChatAttached, typedText, handleSend, handleToolClick, goWorkspace, mobileAdCard,
    faqOpen, setFaqOpen, showAllPdfs, setShowAllPdfs,
  } = props;

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
