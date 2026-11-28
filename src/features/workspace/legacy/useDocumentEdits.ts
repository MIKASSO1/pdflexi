import { useEffect, useState } from "react";
import type { Annotation, EditController } from "./annotations";
type History = {
  past: Annotation[][];
  present: Annotation[];
  future: Annotation[][];
  exported: string;
};
const empty = (): History => ({
  past: [],
  present: [],
  future: [],
  exported: "[]",
});
export function useDocumentEdits() {
  const [documents, setDocuments] = useState<Record<string, History>>({});
  const anyDirty = Object.values(documents).some(
    (h) => JSON.stringify(h.present) !== h.exported,
  );
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
    const h = documents[id] || empty();
    const change = (fn: (old: History) => History) =>
      setDocuments((current) => ({
        ...current,
        [id]: fn(current[id] || empty()),
      }));
    return {
      annotations: h.present,
      canUndo: !!h.past.length,
      canRedo: !!h.future.length,
      dirty: JSON.stringify(h.present) !== h.exported,
      commit: (marks) =>
        change((old) =>
          JSON.stringify(old.present) === JSON.stringify(marks)
            ? old
            : {
                ...old,
                past: [...old.past, old.present].slice(-100),
                present: marks,
                future: [],
              },
        ),
      undo: () =>
        change((old) =>
          !old.past.length
            ? old
            : {
                ...old,
                past: old.past.slice(0, -1),
                present: old.past[old.past.length - 1],
                future: [old.present, ...old.future],
              },
        ),
      redo: () =>
        change((old) =>
          !old.future.length
            ? old
            : {
                ...old,
                past: [...old.past, old.present],
                present: old.future[0],
                future: old.future.slice(1),
              },
        ),
      markExported: (marks) =>
        change((old) => ({ ...old, exported: JSON.stringify(marks) })),
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
