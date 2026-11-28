import { useState } from "react";
import type { StaticPageProps } from "./shared";
import { PRICING, usd, tierExamples } from "./shared";
import { GUTTER_CSS } from "../../data/tools";

export function PlansPage(props: StaticPageProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [plansView, setPlansView] = useState<'personal' | 'business'>('personal');
  const [teamsTokens, setTeamsTokens] = useState<number>(2500);
  const [enterpriseTokens, setEnterpriseTokens] = useState<number>(20000);
  const [plansFaqOpen, setPlansFaqOpen] = useState<number | null>(0);
  const { outerBg, sideBg, header, sidebarContent, rightBar, userMenu, leftSidebarStyle, mobileMenuOpen, setMobileMenuOpen, navTo, setRightActive, setShowHelpPopup } = props;
    const teamsMonthly = PRICING.teams.tiers[teamsTokens] ?? 0;
    const teamsYearlyMonthly = Math.round(teamsMonthly * 0.8);
    const teamsPrice = billingPeriod === 'monthly' ? teamsMonthly : teamsYearlyMonthly;
    const teamsYearlyTotal = teamsYearlyMonthly * 12;
    const teamsYearlySaving = teamsMonthly * 12 - teamsYearlyTotal;
    const enterpriseMonthly = PRICING.enterprise.tiers[enterpriseTokens] ?? 0;
    const enterpriseYearlyMonthly = Math.round(enterpriseMonthly * (1 - PRICING.yearlyDiscount));
    const enterprisePrice = billingPeriod === 'monthly' ? enterpriseMonthly : enterpriseYearlyMonthly;
    const enterpriseYearlyTotal = enterpriseYearlyMonthly * 12;
    const enterpriseYearlySaving = enterpriseMonthly * 12 - enterpriseYearlyTotal;
    const plansFaqs = [
      { q: "How do credits work?", a: "Free tools (Merge, Split, Compress) cost 0 credits and have no daily limit. Advanced AI tools cost credits: most cost 1 credit per use, heavy tools like Detect Forgery and Compare Contracts cost 2. Free gives you +3 credits per day for advanced tools. Pro gives you +500 credits per month. Teams and Enterprise let you choose how many tokens to buy for the month in the dropdown. Your balance is always visible. When credits run out, you wait until the next cycle or upgrade — we never charge you silently." },
      { q: "What is the difference between Free and Pro?", a: "Free: 20 free tools without daily limits, +3 credits per day for advanced tools, 10 MB upload, 100% private — local. Pro: everything in Free, +500 credits per month, 10 advanced AI tools (Chat with PDF, Summarize, Translate, Detect Forgery, Compare Contracts), choose your work environment — Local (default) or Cloud with your explicit consent — 100 MB upload, no ads, priority support." },
      { q: "What is the difference between monthly and yearly billing for Pro?", a: `Pro: Monthly is ${usd(PRICING.pro.monthly)} per month. Yearly is ${usd(PRICING.pro.yearlyMonthly)} per month, billed ${usd(PRICING.pro.yearlyMonthly * 12)} once per year — you save ${usd(PRICING.pro.monthly * 12 - PRICING.pro.yearlyMonthly * 12)} per year. Teams and Enterprise: yearly billing is ${Math.round(PRICING.yearlyDiscount * 100)}% off the monthly price. Examples: Teams — ${tierExamples(PRICING.teams.tiers)}. Enterprise — ${tierExamples(PRICING.enterprise.tiers)}. You get the same credits in both, and you can cancel at any time.` },
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
        {mobileMenuOpen && (<><div onClick={() => setMobileMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 120 }} /><div className="leftSidebarScroll" style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: "280px", background: sideBg, zIndex: 130, overflowY: "auto", overflowX: "hidden", overscrollBehaviorY: "contain", WebkitOverflowScrolling: "touch" }}>{sidebarContent}</div></>)}
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
                  <div style={{ marginTop: "14px", position: "relative" }}><span style={{ fontSize: "34px", fontWeight: 800, color: "#111" }}>{billingPeriod === 'monthly' ? usd(PRICING.pro.monthly) : usd(PRICING.pro.yearlyMonthly)}</span><span style={{ fontSize: "12px", color: "#6B7280" }}> / month</span></div>
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
