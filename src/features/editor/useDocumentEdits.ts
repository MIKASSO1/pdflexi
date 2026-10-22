import { useEffect, useState } from "react";
import type { EditController } from "../../lib/annotations";
import {
  emptyHistory,
  commitHistory,
  undoHistory,
  redoHistory,
  markHistoryExported,
  isHistoryDirty,
} from "./history";
import type { History } from "./history";
export function useDocumentEdits() {
  const [documents, setDocuments] = useState<Record<string, History>>({});
  const anyDirty = Object.values(documents).some(isHistoryDirty);
  useEffect(() => {
    if (!anyDirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [anyDirty]);
  function controller(id: string): EditController {
    const h = documents[id] || emptyHistory();
    const change = (fn: (old: History) => History) =>
      setDocuments((current) => {
        const old = current[id] || emptyHistory();
        const next = fn(old);
        return next === old ? current : { ...current, [id]: next };
      });
    return {
      annotations: h.present,
      canUndo: !!h.past.length,
      canRedo: !!h.future.length,
      dirty: isHistoryDirty(h),
      commit: (marks) => change((old) => commitHistory(old, marks)),
      undo: () => change(undoHistory),
      redo: () => change(redoHistory),
      markExported: (marks) =>
        setDocuments((current) => {
          // A removed document must not be recreated by a late export completion.
          if (!current[id]) return current;
          return { ...current, [id]: markHistoryExported(current[id], marks) };
        }),
    };
  }
  return {
    controller,
    remove: (id: string) =>
      setDocuments((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      }),
    anyDirty,
  };
}
