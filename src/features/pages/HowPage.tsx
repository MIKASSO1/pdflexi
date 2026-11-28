import type { StaticPageProps } from "./shared";
import { GUTTER_CSS } from "../../data/tools";

export function HowPage(props: StaticPageProps) {
  const { isSun, outerBg, middleBg, middleText, middleMuted, middleCardBorder, sideBg, header, sidebarContent, rightBar, userMenu, leftSidebarStyle, mobileMenuOpen, setMobileMenuOpen, navTo } = props;
    return (
      <div style={{ minHeight: "100vh", width: "100%", background: outerBg, fontFamily: "'Inter',sans-serif", position: "relative" }}>
        <style>{GUTTER_CSS}</style>
        {header}
        <aside className="hideMob leftSidebarScroll" style={leftSidebarStyle}>{sidebarContent}</aside>
        {mobileMenuOpen && (<><div onClick={() => setMobileMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 120 }} /><div className="leftSidebarScroll" style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: "280px", background: sideBg, zIndex: 130, overflowY: "auto", overflowX: "hidden", overscrollBehaviorY: "contain", WebkitOverflowScrolling: "touch" }}>{sidebarContent}</div></>)}
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
