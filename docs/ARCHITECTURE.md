# Architecture and integration boundaries

## Phase 1

Static React + TypeScript frontend, built by Vite. React renders escaped text; there is no HTML injection, arbitrary code execution, document upload endpoint or secret. Attachments are native File objects and object URLs held in memory; object URLs are revoked when removed or the application unmounts. The locale preference is the only browser-storage entry.

The desktop layout uses a warm neutral background with fixed side columns and a central reading area. The main document drives vertical scrolling. Sidebars are sticky with their own hidden scrollbars. Only messages scroll within the 620px chat. At narrower widths, capability dialogs keep all functionality available; the canvas remains below the chat. Physical left/right sidebar locations remain stable in RTL while internal text and controls follow language direction.

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
