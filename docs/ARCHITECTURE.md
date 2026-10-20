# Architecture and integration boundaries

## Phase 1

Static React + TypeScript frontend, built by Vite. React renders escaped text; there is no HTML injection, arbitrary code execution, document upload endpoint or secret. Attachments are native File objects and object URLs held in memory; object URLs are revoked when removed or the application unmounts. The locale preference is the only browser-storage entry.

The outer entry layout retains the 240/760/320 desktop columns. Inside the middle column, conversation and upload are adjacent peers in a 1.4fr / 0.9fr grid, with a minimum 240px upload column. The former body headline moves into the left header beside the logo. Entry chat uses a bounded viewport-relative height (360–660px on desktop) so the composer is visible at laptop heights; only messages scroll within the card. The main document remains the page scroller. Sidebars retain their sticky, hidden-scrollbar behavior. The fixed Aurora layer is decorative and pointer-inert.

Below 768px, `mobilePane` switches between Lexi and Files via visible controls; Lexi opens first and uses a 340–620px viewport-relative height. Both components remain mounted, preserving drafts and file state. A successful attachment or capability selection switches back to chat. Reset also restores the chat pane. This avoids squeezing two unreadable columns onto a phone or hiding the composer below an oversized upload panel. Capability dialogs remain reachable even when sidebars collapse.

`hasStarted` is set only by sending a request with attachments. With at least one file, this activates a full-width split: chat physically left and the original Live Canvas physically right, regardless of locale. At 900px and below the panels stack. Live chat also uses a bounded viewport-relative height (up to 720px on desktop, 620px on phones) with an attached composer. Its compact toolbar replaces the earlier tall workspace heading. Capability toolbar buttons keep the original 20/10 registry accessible when sidebars collapse. File addition alone does not activate the split. Removing the final file or resetting conversation clears `hasStarted`; reset preserves files.

`demoMode` is independent of real messages and attachments. It renders derived sample messages and `LiveDemo` instead of `DocumentCanvas`; no sample annotation is written to an uploaded document. Three cleaned-up timers reveal two fictional clause highlights, a scripted summary and an example review card. Reduced motion reveals all stages immediately. Leaving the demonstration restores the original session state. The real-file canvas instead states that processing is not connected and shows unchanged originals; no processing event or success is fabricated.

## Canonical capability registry

`src/data/capabilities.json` is the source of truth for exactly 30 capabilities. IDs, grouping, translated names, descriptions and draft prompts are centralized. No UI label is evidence of a working engine. Tool selection drafts a request only. The current send handler uses an explicitly disclosed acknowledgement; it is **not** intent understanding or AI inference.

## Planned phase 2 boundary

`DocumentEngine.execute` in `src/lib/types.ts` defines an initial integration boundary. A production implementation will need typed per-tool parameter schemas, file-type validation, worker isolation, cancellation/timeouts, memory budgeting and independently verified output files. File IDs, never executable model text, should cross execution boundaries. Implement and benchmark these rather than assuming any chosen library supports all devices.

## Planned phase 3 boundary

A separately selected and benchmarked local language model proposes allowlisted tool calls. Treat document content as untrusted data, not instructions. Validate calls deterministically. Preserve immutable originals and version lineage. Never report completion from a model response alone. Verify engine output before updating state to success. Do not request document passwords in the chat; introduce a private, short-lived parameter path at the appropriate phase.

AI model selection, hardware/locale support and weight distribution remain open. No promise is made that a 1.5B model can reliably execute every language or advanced capability. Browser-managed Gemini availability is optional and must be feature-detected; it cannot be the universal execution foundation.

## Planned commercial services

Accounts, quotas, billing, advertisements and optional server-side processing are separate infrastructure concerns. Frontend-only quotas are bypassable. Never put a paid API key or secret in the browser. No documents should be sent off-device without explicit disclosure and consent. Keep third-party ad scripts out of sensitive document-workspace origins where feasible.

## Accessibility and compatibility

Semantic landmarks, labels, keyboard focus rings, native modal dialogs, reduced-motion support and responsive layouts are included. PDF rendering uses the browser's own viewer, with original-file open/download alternatives. No claim is made of identical embedded-preview support on every device. Screen-reader, real-device, large-document and production security testing remain release requirements.
