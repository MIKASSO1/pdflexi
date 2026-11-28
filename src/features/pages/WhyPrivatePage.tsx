import type { StaticPageProps } from "./shared";
import { GUTTER_CSS } from "../../data/tools";

export function WhyPrivatePage(props: StaticPageProps) {
  const { isSun, middleBg, middleText, middleMuted, middleCardBorder, sideBg, header, sidebarContent, rightBar, userMenu, leftSidebarStyle, mobileMenuOpen, setMobileMenuOpen, navTo } = props;
    return (
      <div style={{ minHeight: "100vh", width: "100%", background: middleBg, fontFamily: "'Inter',sans-serif", position: "relative" }}>
        <style>{GUTTER_CSS}</style>
        {header}
        <aside className="hideMob leftSidebarScroll" style={leftSidebarStyle}>{sidebarContent}</aside>
        {mobileMenuOpen && (<><div onClick={() => setMobileMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 120 }} /><div className="leftSidebarScroll" style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: "280px", background: sideBg, zIndex: 130, overflowY: "auto", overflowX: "hidden", overscrollBehaviorY: "contain", WebkitOverflowScrolling: "touch" }}>{sidebarContent}</div></>)}
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
