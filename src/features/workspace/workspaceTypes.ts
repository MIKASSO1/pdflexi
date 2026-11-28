export type WorkspaceHandle = {
  goWorkspace: (name: string, msg?: string) => void;
  loadFileForEdit: (f: any) => void;
};

export type WorkspaceProps = {
  activeTool: string;
  fileName: string;
  setFileName: (n: string) => void;
  setView: (v: string) => void;
  initialFile?: any;
  initialMsg?: string;
  onConsumed?: () => void;
};
