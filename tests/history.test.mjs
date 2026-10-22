import test from "node:test";
import assert from "node:assert/strict";
import {
  emptyHistory,
  commitHistory,
  undoHistory,
  redoHistory,
  markHistoryExported,
  isHistoryDirty,
  HISTORY_LIMIT,
} from "../src/features/editor/history.ts";
const mark = (id) => ({ id, points: [{ x: 0.1, y: 0.1 }] });
test("an empty history is clean and empty undo/redo are no-ops", () => {
  const h = emptyHistory();
  assert.equal(isHistoryDirty(h), false);
  assert.equal(undoHistory(h), h);
  assert.equal(redoHistory(h), h);
});
test("commit, undo and redo preserve immutable snapshots", () => {
  const empty = emptyHistory();
  const marks = [mark("a")];
  const edited = commitHistory(empty, marks);
  assert.equal(isHistoryDirty(edited), true);
  assert.deepEqual(empty.present, []);
  const undone = undoHistory(edited);
  assert.equal(isHistoryDirty(undone), false);
  assert.equal(redoHistory(undone).present, marks);
});
test("equivalent commits are no-ops and new edits clear redo", () => {
  const edited = commitHistory(emptyHistory(), [mark("a")]);
  assert.equal(commitHistory(edited, structuredClone(edited.present)), edited);
  assert.equal(
    commitHistory(undoHistory(edited), [mark("b")]).future.length,
    0,
  );
});
test("undo to exported snapshot is clean; redo of later edits is dirty", () => {
  const saved = markHistoryExported(
    commitHistory(emptyHistory(), [mark("a")]),
    [mark("a")],
  );
  assert.equal(isHistoryDirty(saved), false);
  const later = commitHistory(saved, [mark("a"), mark("b")]);
  assert.equal(isHistoryDirty(undoHistory(later)), false);
  assert.equal(isHistoryDirty(redoHistory(undoHistory(later))), true);
});
test("export completing after an edit does not mark later edits saved", () => {
  const first = commitHistory(emptyHistory(), [mark("a")]);
  const later = commitHistory(first, [...first.present, mark("b")]);
  const completed = markHistoryExported(later, first.present);
  assert.equal(isHistoryDirty(completed), true);
  assert.equal(isHistoryDirty(undoHistory(completed)), false);
});
test("removing all additions returns to the original clean state", () => {
  const edited = commitHistory(emptyHistory(), [mark("a")]);
  assert.equal(isHistoryDirty(commitHistory(edited, [])), false);
});
test("history is bounded and separate documents do not share snapshots", () => {
  let h = emptyHistory();
  const other = emptyHistory();
  for (let i = 0; i < HISTORY_LIMIT + 10; i++)
    h = commitHistory(h, [mark(String(i))]);
  assert.equal(h.past.length, HISTORY_LIMIT);
  assert.deepEqual(other.present, []);
  assert.equal(isHistoryDirty(other), false);
});

test("undo to a non-identical but equivalent exported snapshot is clean", () => {
  const first = commitHistory(emptyHistory(), [mark("a")]);
  const second = commitHistory(first, [mark("b")]);
  const third = commitHistory(second, [mark("a")]);
  const saved = markHistoryExported(third, third.present);
  const olderEquivalent = undoHistory(undoHistory(saved));
  assert.notEqual(olderEquivalent.present, saved.exported);
  assert.equal(isHistoryDirty(olderEquivalent), false);
});
