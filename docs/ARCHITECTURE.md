# Architecture and integration boundaries

> Current execution architecture: [Version 2 Arabic handoff](ARCHITECTURE-V2.ar.md). This document retains the editor-specific details; the former planned engine boundary is superseded by the packages described below.

## Entry and studio

React + TypeScript + Vite, with escaped user text and no document-upload endpoint or client secret. `StartCard` places upload and first request in one central card. Capabilities are opened in a dialog; hidden sidebars do not compete with the main task. Selecting a capability drafts a request only. Upload validation errors appear inside the entry card.

A valid first request with attachments sets `hasStarted` and opens chat physically left and document physically right, irrespective of locale. Each panel has its own bounded scroll region. Phones stack the panels. Reset clears conversation but preserves files and manual edits. Removing the last attachment returns to entry. Selected-file state is shared by entry, studio and expanded modal.

`demoMode` remains separate from real files/edits. It presents a labeled, fictional scripted walkthrough. Its highlights are not annotations on an uploaded file. Reduced motion skips staged animation; exiting restores the real session.

## Local document rendering

`pdfRuntime.ts` configures a locally bundled PDF.js worker, CMaps, standard fonts and image decoders. No CDN is involved. `PdfViewport` reads a native File, obtains page dimensions and lazily rasterizes visible/nearby pages. Offscreen canvases release their bitmap memory. Page count comes from the PDF; the current-page indicator follows the most-visible page.

New files always open in Fit page, capped at actual 100%, so a complete page fits the available viewport. Fit width, actual percentage and explicit zoom-out/in controls are distinct. Resizing or showing tool properties recomputes fitting. Page navigation changes the document scroller, not the outer page.

## Manual edits and export

`features/editor/useDocumentEdits` owns immutable annotation histories keyed by attachment ID in App; transitions are pure functions in `features/editor/history.ts`. Exact signatures are cached per immutable snapshot so ordinary dirty checks do not re-serialize document histories. Equivalent snapshots reached through undo remain clean. Each annotation stores its page, normalized coordinates, natural page dimensions and style. All pages and the expanded modal use the same controller. Undo/Redo are per attachment and bounded to 100 history snapshots. File changes do not mix histories. Unexported changes trigger before-unload and removal warnings. No draft is saved to localStorage or a server.

`AnnotationLayer` handles pointer drawing, text placement, selection/movement and erasure of additions only. It commits an entire gesture as one undo action; cancellation discards the preview. Text can be formatted and updated explicitly with Apply. Original PDF text is not rewritten or securely redacted.

`annotations.ts` shares drawing/geometry code between the visible overlay and the `services/pdfExport.ts` adapter. `usePdfExport` owns download/busy state and export URL cleanup. PDF-lib reads the immutable original, adds transparent raster overlays only on annotated pages, and creates a separately named edited copy. Crop boxes and page rotation are accounted for. Existing PDF content is preserved; added text/drawings are flattened into an image and are not selectable/editable annotations after reopening that exported copy. Signatures may be invalidated. Original downloads use the untouched File/object URL.

The UI marks an exported snapshot separately from an in-tab draft. Export failure keeps the draft. Editing during an export does not mark later changes as exported. No cloud auto-save is claimed.

## Local execution and replaceable planning boundary

The 30-capability catalog is paired with 30 independent tool definitions under `packages/tools`. Eight have real executors; the other 22 are planned and cannot execute. `packages/core` is the source of truth for typed contracts, strict runtime plan validation, intermediate references, limits and sequential execution. Tool code is dynamically loaded in a fresh Worker per step. Termination handles cancellation and timeouts.

`packages/agents` exposes an injected provider contract and a deterministic offline command grammar, not a language model. Chat can propose a supported plan; no tool runs before explicit confirmation. Structured parameters are checked again in the worker. `packages/storage` implements an asynchronous contract with memory and IndexedDB adapters. Saving results is explicit; editor/chat recovery is not implemented. For limits, exclusions and extension instructions, see the version 2 handoff.

## Security, accessibility and deployment

Original attachments, messages and manual edits remain in the current tab. Tool results may be explicitly saved in IndexedDB. Object URLs are revoked on removal/unmount; temporary export URLs expire. Locale preferences may be stored locally. No ads, analytics, AI requests, account credentials or payments exist in this frontend. The self-contained review artifact embeds its worker/assets; production uses the stricter header baseline.

Labels, keyboard focus, native dialogs and reduced motion are included. Undo/Redo shortcuts operate on the focused editing surface, not while typing in a text field. The eraser is not a redaction tool. PDF text is rendered as canvas in this implementation; screen-reader/text-selection improvements, complex form/signature fidelity, very large documents and broader real-device testing remain release work.

## Feature boundaries after incremental refactoring

- `App` composes the UI and owns presentation choices (locale, dialogs, demo); attachment, conversation and editor lifecycles live outside its render function.
- `features/attachments/attachmentStore.ts` is independent of React. It serializes additions, reads the latest collection after asynchronous checks, revokes object URLs, and invalidates queued work on disposal. Removing a file during another header read cannot restore a stale collection. Its React adapter exposes stable snapshots with `useSyncExternalStore`.
- `features/conversation/useConversation.ts` owns messages/draft and the explicit preview acknowledgement. It does not call an AI service or fabricate tool execution results.
- `features/editor/history.ts` is tested without React or a browser. Snapshots are immutable and histories remain capped at 100 steps. Late exports cannot mark newer edits saved or recreate removed document state.
- `services/pdfExport.ts` is the browser-local export boundary. Export still uses the main thread and Canvas; this refactor does not claim Worker isolation, persistence or PDF text rewriting.
- `.github/workflows/frontend.yml` runs unit/build checks and browser regression against a production preview when pushed and allowed by repository settings. Local checks do not verify GitHub-hosted execution.

The local execution foundation is implemented, but completion of all tool engines, an actual LLM provider, page virtualization, editor-draft recovery and secure server-side commercial controls remain future work. No global traffic capacity is claimed.
