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

## Core contracts: order, ticket, execution

Added as the first structural step, before any engine is wired to the UI.

- `src/core/capabilities/contract.mjs` is the single place that knows what a capability is allowed to do: `buildMenu(registry)` binds every registry entry to exactly one engine operation, a parameter contract, an output kind, a tier and whether it needs AI. A capability without a binding is reported, never silently executable.
- An `Order` is `capabilityId` + validated `params` + `provenance` (the user sentence that asked for it). Parameters are strict: unknown keys are rejected, so the planner cannot smuggle in operations the user did not request.
- A `Ticket` is `{ schemaVersion, goal, steps }`; each step is an order with an `id` and `dependsOn`. Dependencies must reference earlier steps, so a plan is only accepted when it can actually run in order.
- `runTicket` executes steps sequentially through injected engines: it stops at the first failure, treats a result without `verified: true` as a failure, reports `unavailable` when no engine is installed, and never reaches an engine with an invalid ticket. It also honours an `AbortSignal`.
- Engines are registered in `src/core/engines/registry.ts` and receive only `{ capability, order, signal }`; they return `{ ok, verified, outputs, warnings }`. The `verified` flag is the honest-completion rule from the product brief.
- Secrets (`protect`, `unlock` passwords) are marked `secret` in the contract and `redactOrder` masks them before an order is ever displayed or logged.
- `src/core/providers/types.ts` defines `AuthProvider`, `StorageProvider`, `AiProvider` and `BillingProvider`/`BillingPartner`. No provider is implemented or called yet; subscriptions are expected through partner agreements, so billing is a partner reference plus a normalised event, not a hard-coded vendor.
- The contract lives in `.mjs` with a `.d.mts` declaration, matching `src/lib/files.mjs`, so the same code is exercised by Node tests and bundled for the browser without a second source of truth.

UI, engines and agents are still unconnected: the menu reports every capability as executable in contract terms, but no engine is registered yet, so any execution attempt ends as `unavailable` rather than pretending to succeed.

## Folder boundaries

The app is split so that growth happens inside one folder instead of across the tree:

```
src/
  app/        routing and, later, route guards
  core/       capabilities contract, engine registry, provider interfaces (no React)
  features/   one folder per product area (pages, workspace, and later auth, agents)
  components/ shared UI that several features use (header, sidebar, dialogs)
  lib/        shared helpers and document math
  ui/         palette and design primitives
  data/       static content: capabilities, copy, showcase
```

Moved so far: `features/pages/StaticPages.tsx`, `features/workspace/Workspace.tsx` and its canvas, and the colour palette now lives in `ui/theme.ts` so light/dark is not recomputed inside `App.tsx`. Each remaining component moves when its feature is touched, so the build stays green after every step.
