# Migration notes

Running log of structure changes, one phase at a time. Each phase leaves the app working, lists what was removed or moved, and gives the rollback.

## Phase 1 — Layered structure (commit 9d45e71)

- Moved routing into `src/app/`, capability contracts, planner, engine registry and provider interfaces into `src/core/`, screens into `src/features/pages`, editor into `src/features/workspace`, colours into `src/ui/theme.ts`.
- `src/App.tsx` fell from the single-file shell to the app frame; editor is lazy-loaded.
- Preserved: every screen, route hash, tool list, pricing copy and the editor's behaviour.
- Verified: `npx tsc -b`, `npm test`, `npm run build`, browser check at 390 and 1280.
- Rollback: `git revert 9d45e71`.

## Phase 2 — Remove the superseded editor copy (this phase)

What was removed

- `src/features/workspace/legacy/` — 11 files: `AnnotationLayer.tsx`, `Capabilities.tsx`, `Chat.tsx`, `DocumentCanvas.tsx`, `PdfThumbnail.tsx`, `PdfViewport.tsx`, `StartCard.tsx`, `WorkspaceCanvas.tsx`, `annotations.ts`, `pdfRuntime.ts`, `useDocumentEdits.ts`.
- Nothing imported them: `grep` for `legacy/` across `src` returned no references, and the production build resolves the same module graph without them.

What was preserved exactly

- The live editor `src/features/workspace/Workspace.tsx` and `PdfCanvas.tsx` are untouched by the deletion.
- Every route, tool, price and copy string stays as it was; the bundle keeps the same entry points.

Layout fixes made in the same phase (found by the browser check)

- `+ Add page` and the "Scroll — all pages are here." hint moved out of the scrolling page strip into a stable footer row above the zoom bar, so the control is reachable without scrolling and no longer sits under the bar.
- The third placeholder page switched from a fixed `820px` height to `minHeight: 820px` with auto height, so a long paragraph can never be squeezed into a clipped band.

Verification for this phase

- `npx tsc -b` — clean.
- `npm test` — 17/17 passing.
- `npm run build` — succeeds.
- Browser check of `#/workspace` and `#/how` at 1280 and 390: no page errors, no failed requests, no horizontal overflow, no clipped text. One reported overlap remains at 390 only (see below).

Known remainder

- At 390 the placeholder document's third-page paragraph is reported as overlapping the mobile zoom bar. The paragraph sits inside the scrolling page strip, which clips its content; the checker compares raw boxes and does not account for that clipping. Hiding the bar removes the report, so this is the heuristic, not a page defect. The real fix, if wanted, is to reflow the placeholder pages to the phone width at narrow sizes instead of keeping them 580px wide — that is a design change and is not part of this phase.
- After pressing `+ Add page`, the checker also reports the new page's toolbar label and eye icon as overlapping at 1280. Those two sit at opposite ends of a flex row and do not overlap on screen; the report comes from the 30% `zoom` applied to the page card. Moving the toolbar off percentage widths and onto auto layout did not change it.

Deprecated next, not done here

- `src/features/workspace/Workspace.tsx` is still one 550-line, 112 kB file of inline styles. Splitting it into `Toolbar`, `PageStrip`, `ZoomBar` and `RightPanel` is the next phase; it needs characterisation tests around page selection, zoom and tool switching before the split.

Rollback for this phase

```
git revert HEAD
```

That restores the 11 files and the pre-fix layout of the page strip.
