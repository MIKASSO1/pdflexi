import type { WorkspaceState } from "./useWorkspace";
import { freeTools } from "../../data/showcase";
import { proTools } from "../../data/showcase";
import { wsIconColor } from "../../data/showcase";

export function WorkspaceChatPanel({ ws }: { ws: WorkspaceState }) {
  const {
    leftWidth,
    queueFileRef,
    setQueueFileObjs,
    setQueueFiles,
    setQueuePickerLoading,
    setRedoMsgs,
    setWsAttached,
    setWsInput,
    setWsMsgs,
    setWsTool,
    setWsToolsAnchor,
    setWsToolsMenu,
    wsAttached,
    wsChatScrollRef,
    wsFileRef,
    wsFreeIsActive,
    wsFreeLabel,
    wsFreeMatch,
    wsFullToShort,
    wsInput,
    wsMobileTab,
    wsMsgs,
    wsNarrow,
    wsTool,
    wsToolsAnchor,
    wsToolsMenu,
  } = ws;

  return (
          <div className="ws-left" style={{ width: wsNarrow ? "100%" : `${leftWidth}%`, height: (wsNarrow && wsMobileTab === "lexi") ? "calc(100dvh - 118px)" as any : (wsNarrow ? "100%" as any : "100%"), flex: (wsNarrow && wsMobileTab === "lexi") ? "none" as any : (wsNarrow ? "1" as any : "none" as any), maxHeight: wsNarrow ? "none" as any : "none" as any, display: wsNarrow && wsMobileTab !== "lexi" ? "none" as any : "flex" as any, minHeight: 0, background: "#0F0F14", borderRight: "1px solid rgba(255,255,255,0.06)", flexDirection: "column", overflow: "hidden", flexShrink: 0 }}>
            <div style={{ padding: "12px", display: "flex", gap: "6px", flexWrap: "wrap", flexShrink: 0 }}>
              <div style={{ position: "relative" }}>
                <button onClick={(e) => { const r = (e.currentTarget as any).getBoundingClientRect(); const w = window.innerWidth >= 900 ? 600 : 360; setWsToolsAnchor({ left: Math.max(8, Math.min(r.left, window.innerWidth - w - 8)), top: r.bottom + 6 }); setWsToolsMenu(wsToolsMenu === 'free' ? null : 'free'); }} style={{ fontSize: "11px", padding: "7px 12px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.08)", background: wsFreeIsActive ? "#7C3AED" : "rgba(255,255,255,0.04)", color: "white", cursor: "pointer", fontWeight: wsFreeIsActive ? 700 : 400 }}>{wsFreeLabel}</button>
                {wsToolsMenu === 'free' && (<><div onClick={() => setWsToolsMenu(null)} style={{ position: "fixed", inset: 0, background: "transparent", zIndex: 9998 }} /><div className="wsToolsDropdown" style={{ position: "fixed", left: wsToolsAnchor ? wsToolsAnchor.left : 8, top: wsToolsAnchor ? wsToolsAnchor.top : 100, zIndex: 9999, maxHeight: wsToolsAnchor ? `calc(100vh - ${wsToolsAnchor.top + 16}px)` : "none", overflowY: "auto" }}><div className="wsToolsDropdownHead">Free Tools • 20 • 0 credits</div><div className="wsToolsGrid">{freeTools.map((tool: any) => (<button key={tool.id} onClick={() => { setWsTool(wsFullToShort[tool.en] || tool.en); setWsMsgs(prev => [...prev, { role: "user", text: `I want to ${tool.en}` }]); setWsToolsMenu(null); }} className="wsToolsItem" style={{ background: wsFreeMatch && wsFreeMatch.id === tool.id ? "#F5F3FF" : "white", fontWeight: wsFreeMatch && wsFreeMatch.id === tool.id ? 700 : 400 }}><span className="wsToolsIcon" style={{ color: wsIconColor[tool.id] || "#7C3AED" }}>{tool.icon}</span><span>{tool.en}</span>{wsFreeMatch && wsFreeMatch.id === tool.id && (<span style={{ marginLeft: "auto", color: "#7C3AED" }}>✓</span>)}</button>))}</div></div></>)}
              </div>
              <div style={{ position: "relative" }}>
                <button onClick={(e) => { const r = (e.currentTarget as any).getBoundingClientRect(); const w = window.innerWidth >= 900 ? 600 : 360; setWsToolsAnchor({ left: Math.max(8, Math.min(r.left, window.innerWidth - w - 8)), top: r.bottom + 6 }); setWsToolsMenu(wsToolsMenu === 'pro' ? null : 'pro'); }} style={{ fontSize: "11px", padding: "7px 12px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "white", cursor: "pointer", fontWeight: 400 }}>Advanced Tools 🔒 ▾</button>
                {wsToolsMenu === 'pro' && (<><div onClick={() => setWsToolsMenu(null)} style={{ position: "fixed", inset: 0, background: "transparent", zIndex: 9998 }} /><div className="wsToolsDropdown" style={{ position: "fixed", left: wsToolsAnchor ? wsToolsAnchor.left : 8, top: wsToolsAnchor ? wsToolsAnchor.top : 100, zIndex: 9999, maxHeight: wsToolsAnchor ? `calc(100vh - ${wsToolsAnchor.top + 16}px)` : "none", overflowY: "auto" }}><div className="wsToolsDropdownHead">Advanced Tools • 10 • PRO</div><div className="wsToolsGrid">{proTools.map((tool: any) => (<button key={tool.id} onClick={() => { alert(`${tool.en}\n\nThis is a PRO feature. Upgrade to Pro to unlock it.`); setWsToolsMenu(null); }} className="wsToolsItem" style={{ background: "white", fontWeight: 400 }}><span className="wsToolsIcon" style={{ color: wsIconColor[tool.id] || "#7C3AED" }}>{tool.icon}</span><span>{tool.en}</span><span style={{ marginLeft: "auto", color: "#6B7280", fontSize: "11px" }}>🔒 PRO</span></button>))}</div></div></>)}
              </div>
            </div>
            <div ref={wsChatScrollRef} style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "4px 14px 14px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {wsMsgs.length === 0 ? (
                <div style={{ marginTop: "16px", textAlign: "center" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "999px", background: "rgba(124,58,237,0.15)", display: "grid", placeItems: "center", fontSize: "20px", margin: "0 auto" }}>✦</div>
                  <div style={{ fontSize: "13px", fontWeight: 700, marginTop: "12px" }}>Ask Lexi to edit this file</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", marginTop: "6px", lineHeight: 1.5 }}>Write what you want in plain words.<br />Lexi edits it here, you see it live on the right.</div>
                  <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap", marginTop: "14px" }}>
                    <button onClick={() => setWsInput("Add my signature at the bottom")} style={{ background: "rgba(255,255,255,0.06)", color: "white", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "999px", padding: "6px 10px", fontSize: "11px", cursor: "pointer" }}>✍️ Add signature</button>
                    <button onClick={() => setWsInput("Compress this file under 2MB")} style={{ background: "rgba(255,255,255,0.06)", color: "white", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "999px", padding: "6px 10px", fontSize: "11px", cursor: "pointer" }}>Compress file</button>
                  </div>
                </div>
              ) : wsMsgs.map((m, i) => <div key={i} style={{ background: m.role === "user" ? "#334155" : "#18181E", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "10px 12px", fontSize: "12px", lineHeight: 1.5, alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "90%" }}>{m.text}</div>)}
              {/* REMOVED: Your-file card — removed per user request, never shown again */}
            </div>
            <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0 }}>{wsAttached && (<div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(59,130,246,0.15)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "999px", padding: "6px 10px", fontSize: "12px", color: "white" }}><span>📎</span><span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{wsAttached}</span><button onClick={() => setWsAttached(null)} aria-label="Remove attachment" style={{ border: "none", background: "transparent", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "12px" }}>✕</button></div>)}<input type="file" ref={queueFileRef} style={{ display: "none" }} accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.mp4,.mov,.txt,.rtf,.json,.csv" onChange={e => { setQueuePickerLoading(false); const f = e.target.files?.[0]; if (f) { setQueueFileObjs(prev => ({ ...prev, [f.name]: f })); setQueueFiles(prev => [...prev, f.name]); setWsMsgs(prevM => [...prevM, { role: "lexi", text: `✓ ${f.name} added to the queue — it waits its turn. Click it in the queue to move it to the editing area.` }]); } e.target.value = ""; }} />
            <input type="file" ref={wsFileRef} style={{ display: "none" }} accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.mp4,.mov,.txt,.rtf" onChange={e => { const f = e.target.files?.[0]; if (f) { setWsAttached(f.name); setQueueFileObjs(prev => ({ ...prev, [f.name]: f })); setQueueFiles(prev => [...prev, f.name]); setWsMsgs(prevM => [...prevM, { role: "lexi", text: `✓ ${f.name} added to the queue — it waits its turn. Click it in the queue to move it to the editing area.` }]); } e.target.value = ""; }} /><div style={{ display: "flex", gap: "8px" }}><button onClick={() => { wsFileRef.current?.click(); }} title="Attach file" style={{ width: "36px", height: "36px", borderRadius: "999px", background: "transparent", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", display: "grid", placeItems: "center", fontSize: "20px", flexShrink: 0 }}>+</button><textarea value={wsInput} rows={1} onChange={e => { setWsInput(e.target.value); const t = e.target as any; t.style.height = "auto"; t.style.height = Math.min(t.scrollHeight, 120) + "px"; }} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && wsInput.trim()) { e.preventDefault(); setWsMsgs(p => [...p, { role: "user", text: wsInput }]); setRedoMsgs([]); setWsInput(""); (e.currentTarget as any).style.height = "40px"; } }} placeholder={`Ask Lexi to ${wsTool.toLowerCase()}...`} style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", padding: "10px 4px", fontSize: "13px", color: "white", outline: "none", resize: "none" as any, overflowY: "auto" as any, maxHeight: "120px", minHeight: "40px", lineHeight: 1.5, whiteSpace: "pre-wrap" as any, wordBreak: "break-word" as any, fontFamily: "inherit", boxSizing: "border-box" as any, alignSelf: "flex-end" }} /><button onClick={(e) => { if (!wsInput.trim()) return; setWsMsgs(p => [...p, { role: "user", text: wsInput }]); setRedoMsgs([]); setWsInput(""); const ta = (e.currentTarget as any).parentElement?.querySelector("textarea"); if (ta) ta.style.height = "40px"; }} style={{ width: "36px", height: "36px", borderRadius: "999px", background: wsInput.trim() ? "white" : "rgba(255,255,255,0.15)", color: wsInput.trim() ? "black" : "rgba(255,255,255,0.4)", border: "none", cursor: wsInput.trim() ? "pointer" : "default", flexShrink: 0 }}>▶</button></div></div>
          </div>
  );
}
