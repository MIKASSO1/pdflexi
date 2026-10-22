import type { Annotation } from "../../lib/annotations";

export const HISTORY_LIMIT = 100;
export type History = {
  past: Annotation[][];
  present: Annotation[];
  future: Annotation[][];
  exported: Annotation[];
};
// Snapshots must remain immutable after commit. Cache exact signatures once per
// snapshot (not a lossy hash) so dirty checks never serialize on ordinary renders.
const signatures = new WeakMap<Annotation[], string>();
function signature(marks: Annotation[]): string {
  let value = signatures.get(marks);
  if (value === undefined) {
    value = JSON.stringify(marks);
    signatures.set(marks, value);
  }
  return value;
}
export function emptyHistory(): History {
  const present: Annotation[] = [];
  return { past: [], present, future: [], exported: present };
}
export function commitHistory(old: History, marks: Annotation[]): History {
  if (old.present === marks || signature(old.present) === signature(marks))
    return old;
  const present =
    signature(old.exported) === signature(marks) ? old.exported : marks;
  return {
    ...old,
    past: [...old.past, old.present].slice(-HISTORY_LIMIT),
    present,
    future: [],
  };
}
export function undoHistory(old: History): History {
  if (!old.past.length) return old;
  return {
    ...old,
    past: old.past.slice(0, -1),
    present: old.past[old.past.length - 1],
    future: [old.present, ...old.future],
  };
}
export function redoHistory(old: History): History {
  if (!old.future.length) return old;
  return {
    ...old,
    past: [...old.past, old.present].slice(-HISTORY_LIMIT),
    present: old.future[0],
    future: old.future.slice(1),
  };
}
export function markHistoryExported(
  old: History,
  marks: Annotation[],
): History {
  // An export may finish after the user edited. Never mark those later edits saved.
  const exported =
    signature(old.present) === signature(marks) ? old.present : marks;
  return { ...old, exported };
}
export const isHistoryDirty = (history: History) =>
  history.present !== history.exported &&
  signature(history.present) !== signature(history.exported);
