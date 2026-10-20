# Architecture and integration boundaries

## Entry and studio

React + TypeScript + Vite, with escaped user text and no document-upload endpoint or client secret. `StartCard` places upload and first request in one central card. Capabilities are opened in a dialog; hidden sidebars do not compete with the main task. Selecting a capability drafts a request only. Upload validation errors appear inside the entry card.

A valid first request with attachments sets `hasStarted` and opens chat physically left and document physically right, irrespective of locale. Each panel has its own bounded scroll region. Phones stack the panels. Reset clears conversation but preserves files and manual edits. Removing the last attachment returns to entry. Selected-file state is shared by entry, studio and expanded modal.

`demoMode` remains separate from real files/edits. It presents a labeled, fictional scripted walkthrough. Its highlights are not annotations on an uploaded file. Reduced motion skips staged animation; exiting restores the real session.

## Local document rendering

`pdfRuntime.ts` configures a locally bundled PDF.js worker, CMaps, standard fonts and image decoders. No CDN is involved. `PdfViewport` reads a native File, obtains page dimensions and lazily rasterizes visible/nearby pages. Offscreen canvases release their bitmap memory. Page count comes from the PDF; the current-page indicator follows the most-visible page.

New files always open in Fit page, capped at actual 100%, so a complete page fits the available viewport. Fit width, actual percentage and explicit zoom-out/in controls are distinct. Resizing or showing tool properties recomputes fitting. Page navigation changes the document scroller, not the outer page.

## Manual edits and export

`useDocumentEdits` owns immutable annotation histories keyed by attachment ID in App. Each annotation stores its page, normalized coordinates, natural page dimensions and style. All pages and the expanded modal use the same controller. Undo/Redo are per attachment and bounded to 100 history snapshots. File changes do not mix histories. Unexported changes trigger before-unload and removal warnings. No draft is saved to localStorage or a server.

`AnnotationLayer` handles pointer drawing, text placement, selection/movement and erasure of additions only. It commits an entire gesture as one undo action; cancellation discards the preview. Text can be formatted and updated explicitly with Apply. Original PDF text is not rewritten or securely redacted.

`annotations.ts` shares drawing/geometry code between the visible overlay and export. PDF-lib reads the immutable original, adds transparent raster overlays only on annotated pages, and creates a separately named edited copy. Crop boxes and page rotation are accounted for. Existing PDF content is preserved; added text/drawings are flattened into an image and are not selectable/editable annotations after reopening that exported copy. Signatures may be invalidated. Original downloads use the untouched File/object URL.

The UI marks an exported snapshot separately from an in-tab draft. Export failure keeps the draft. Editing during an export does not mark later changes as exported. No cloud auto-save is claimed.

## Planned AI capability boundary

`data/capabilities.json` remains the source of truth for exactly 30 planned conversational capabilities: 20 free and 10 Pro. Manual annotation operations are independent from this registry. The send handler acknowledges AI requests honestly; it performs no inference or automatic processing.

`DocumentEngine.execute` in `lib/types.ts` defines a future typed boundary. Future engines require validated per-tool parameters, isolation, cancellation/timeouts, resource budgets and independent output verification. Treat document content as untrusted data, not instructions; only allowlisted structured tool calls should cross model/execution boundaries. Do not request document passwords in ordinary chat. Preserve originals and version lineage.

## Security, accessibility and deployment

Files, messages and edits remain in the current tab. Object URLs are revoked on removal/unmount; temporary export URLs expire. Locale preferences may be stored locally. No ads, analytics, AI requests, account credentials or payments exist in this frontend. The self-contained review artifact embeds its worker/assets; production uses the stricter header baseline.

Labels, keyboard focus, native dialogs and reduced motion are included. Undo/Redo shortcuts operate on the focused editing surface, not while typing in a text field. The eraser is not a redaction tool. PDF text is rendered as canvas in this implementation; screen-reader/text-selection improvements, complex form/signature fidelity, very large documents and broader real-device testing remain release work.
