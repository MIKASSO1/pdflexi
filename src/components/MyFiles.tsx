import { recentFiles } from "../data/showcase";

interface MyFilesProps {
  sidebarRecentOpen: boolean;
  setSidebarRecentOpen: (v: boolean) => void;
  goWorkspace: (name: string, msg?: string) => void;
  isSun: boolean;
  sideText: string;
  sideMuted: string;
  accountType: 'personal' | 'professional' | 'company';
  sideCard: string;
  sideCardBorder: string;
}

export default function MyFiles({ sidebarRecentOpen, setSidebarRecentOpen, goWorkspace, isSun, sideText, sideMuted, accountType, sideCard, sideCardBorder }: MyFilesProps) {
  return (
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
  );
}
