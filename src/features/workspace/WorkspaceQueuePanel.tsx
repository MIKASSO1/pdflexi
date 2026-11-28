import type { WorkspaceState } from "./useWorkspace";

export function WorkspaceQueuePanel({ ws }: { ws: WorkspaceState }) {
  const {
    docText,
    fileName,
    loadFileForEdit,
    openQueuePicker,
    pdfFile,
    queueFileObjs,
    queueFiles,
    queueMenuOpen,
    queuePickerLoading,
    setDocText,
    setFileName,
    setPdfFile,
    setQueueFileObjs,
    setQueueFiles,
    setQueueMenuOpen,
    setWsMsgs,
    wsMobileTab,
    wsNarrow,
  } = ws;

  return (
            <div className="ws-queue" style={{ width: wsNarrow ? "100%" : "210px", flex: wsNarrow ? "1" as any : "none" as any, display: wsNarrow && wsMobileTab !== "queue" ? "none" as any : "flex" as any, height: wsNarrow ? "auto" as any : "auto" as any, borderRadius: wsNarrow ? "0px" as any : "14px", background: "#0F0F14", border: "1px solid rgba(255,255,255,0.08)", flexDirection: "column", overflow: "hidden", color: "white" }}>
              <div style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize: "12px", fontWeight: 700 }}>📂 Add files • Queue</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", marginTop: "4px", lineHeight: 1.5 }}>Files wait here for their turn. Click one to move it to the editing area.</div>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ background: "#18181E", border: "1px solid #7C3AED", borderRadius: "10px", padding: "10px", position: "relative" }} >
                  <div style={{ display: "flex", gap: "6px", alignItems: "flex-start" }} >
                    <div style={{ flex: 1, minWidth: 0 }} >
                      <div style={{ fontSize: "11px", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fileName}</div>
                      <div style={{ fontSize: "10px", color: "#A78BFA", marginTop: "4px" }}>Editing now - in the middle</div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setQueueMenuOpen(queueMenuOpen === "current" ? null : "current"); }} style={{ background: "transparent", color: "rgba(255,255,255,0.7)", border: "none", cursor: "pointer", fontSize: "16px", lineHeight: 1, padding: "0 2px" }}>...</button>
                  </div>
                  {queueMenuOpen === "current" && (<div style={{ position: "absolute", right: "8px", top: "34px", width: "160px", background: "white", borderRadius: "10px", boxShadow: "0 10px 24px rgba(0,0,0,0.3)", border: "1px solid #E5E7EB", overflow: "hidden", zIndex: 20 }}><button onClick={(e) => { e.stopPropagation(); setQueueMenuOpen(null); setFileName("No file selected yet"); setDocText(""); setPdfFile(null); }} style={{ width: "100%", textAlign: "left", background: "white", border: "none", padding: "10px 12px", fontSize: "12px", cursor: "pointer", color: "#DC2626" }}>Remove file</button></div>)}
                </div>
                {queueFiles.map((qf, qi) => (
                  <div key={qf + qi} onClick={() => { setQueueMenuOpen(null); const real = queueFileObjs[qf]; if (!real) { setWsMsgs(prevM => [...prevM, { role: "lexi", text: `⚠️ ${qf} is a demo name — no real file behind it. Please re-upload the real ${qf} with "+ Add file to queue" so it opens with ALL its pages.` }]); return; } const prev = fileName; const prevFile = (pdfFile as any) || (docText ? new File([docText], prev, { type: "text/plain" }) as any : null); setQueueFiles(prevQ => { const next = prevQ.filter((_, i) => i !== qi); return prev && prev !== "No file selected yet" ? [...next, prev] : next; }); if (prevFile) setQueueFileObjs(prevO => ({ ...prevO, [prev]: prevFile })); loadFileForEdit(real); setWsMsgs(prevM => [...prevM, { role: "lexi", text: `✓ Moved ${qf} to the editing area — ALL its pages are loading. ${prev} is now waiting in the queue.` }]); }} style={{ background: "#18181E", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "10px", cursor: "pointer", position: "relative" }}>
                    <div style={{ display: "flex", gap: "6px", alignItems: "flex-start" }} >
                      <div style={{ flex: 1, minWidth: 0 }} >
                        <div style={{ fontSize: "11px", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{qf}</div>
                        <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.55)", marginTop: "4px" }}>Waiting #{qi + 1} - Click to edit</div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); setQueueMenuOpen(queueMenuOpen === qi ? null : qi); }} style={{ background: "transparent", color: "rgba(255,255,255,0.7)", border: "none", cursor: "pointer", fontSize: "16px", lineHeight: 1, padding: "0 2px" }}>...</button>
                    </div>
                    {queueMenuOpen === qi && (<div style={{ position: "absolute", right: "8px", top: "34px", width: "160px", background: "white", borderRadius: "10px", boxShadow: "0 10px 24px rgba(0,0,0,0.3)", border: "1px solid #E5E7EB", overflow: "hidden", zIndex: 20 }}><button onClick={(e) => { e.stopPropagation(); setQueueFiles(prevQ => prevQ.filter((_, i) => i !== qi)); setQueueFileObjs(prevO => { const n = { ...prevO }; delete n[qf]; return n; }); setQueueMenuOpen(null); }} style={{ width: "100%", textAlign: "left", background: "white", border: "none", padding: "10px 12px", fontSize: "12px", cursor: "pointer", color: "#DC2626" }}>Remove from queue</button></div>)}
                  </div>
                ))}
                {queueFiles.length === 0 && (<div style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", textAlign: "center", padding: "12px" }}>Queue is empty.<br />Add a file to queue it here.</div>)}
              </div>
              <div style={{ padding: "10px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <button onClick={openQueuePicker} style={{ width: "100%", background: "#7C3AED", color: "white", border: "none", borderRadius: "999px", padding: "9px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>{queuePickerLoading ? (<span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.35)" strokeWidth="3" /><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" /></path></svg>Opening...</span>) : "+ Add file to queue"}</button>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", textAlign: "center", marginTop: "8px" }}>Click a waiting file → it moves to the middle</div>
              </div>
            </div>
  );
}
