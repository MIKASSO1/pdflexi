# PDFlexi

**Your document. A clearer next step.**

A local-first React/TypeScript PDF workspace: a simple upload-and-request card opens into chat alongside a real manual annotation editor. The workspace now includes validated, confirmed local execution for 8 tools; the other 22 capabilities remain explicitly planned. See [the architecture handoff](docs/ARCHITECTURE-V2.ar.md).

## Working now

- One entry card contains document upload/thumbnail and the first request. All tools are available on demand, instead of filling both sides of the page.
- Uploading alone does not open the studio. A first request with a file opens full-height chat and document panels; they stack on phones.
- PDF.js renders all PDF pages locally. Documents open in **Fit page**, showing the entire page. Explicit minus/plus, fit-width and percentage/actual-100% controls are available.
- Seven manual modes: select/move, add text, freehand pen, translucent rectangle highlighting, rectangle, arrow and eraser.
- Added text supports font family, point size, bold, italic, underline, alignment, color and multiple lines. Select existing added text, click the text tool, change properties and Apply.
- Eraser/Delete remove **additions only**. They do not erase, redact or rewrite original PDF content.
- Undo/Redo and selection movement. Histories are kept per attachment and shared with the expanded canvas. Removing unsaved edits asks for confirmation; leaving the tab with unsaved edits triggers the browser warning.
- **Download edited PDF** exports a separate copy with additions. The original download remains byte-for-byte unchanged. Exported additions are flattened transparent images; added text is not selectable PDF text. Existing document signatures may become invalid.
- File/image previews, duplicate/extension/size checks, PDF-header validation, explicit errors and original-file downloads.
- Exactly 30 product capabilities: 20 free + 10 Pro. Selection drafts a request, not an automatic transformation. OCR remains one of the 20 planned free capabilities.
- English, Arabic/RTL and French interfaces. A 29-language registry explicitly disables the other planned translations.
- Scripted sample walkthrough, capability browser, language chooser, pricing/how/privacy dialogs and confirmation before resetting chat.
- No document upload, AI request, advertising, analytics, payment or remote font service.

## Important boundaries

Local worker executors now implement merge, split, delete pages, rotate, reorder, watermark, page numbers and JPEG/PNG-to-PDF. The offline command planner is not an LLM; supported requests produce a validated plan and require confirmation. A structured tool form is available from the header. OCR, the other 22 executors, LLM inference, original-text rewriting, secure redaction, accounts, billing and secure quotas are not implemented.

Files, conversations and edits live in memory in the current tab. **Download to keep edits.** There is no document/cloud auto-save or manual-editor draft persistence after reload. Tool results can be explicitly saved in IndexedDB, recovered and deleted on this device. Only preferences such as language may use localStorage. New documents always start in Fit page.

Up to 10 attachments of 20 MiB each: PDF, DOCX, XLSX, JPG/JPEG and PNG. Office files can be attached, not converted or edited by the PDF annotation tools. Metadata checks are not malware detection or proof that an Office/PDF file is valid. Password-protected or damaged PDFs can be downloaded as originals; private password handling is not implemented.

## Development

Node.js 22+ and npm are required; no API key is needed.

```bash
npm ci
npm run dev
```

The local URL is normally `http://localhost:5173`. Installation/build copies the PDF renderer’s fonts, CMaps and image-decoder assets to ignored `public/pdfjs/`, which Vite includes in production output.

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
npm run format:check
```

## Browser tests

With the development server running (for Offline coverage, use a production preview and set `TEST_URL=http://localhost:4173`):

```bash
npx playwright install chromium
npm run test:e2e
# Or use installed system Chromium:
CHROMIUM_PATH=/path/to/chromium npm run test:e2e
```

The suite creates its own PDF fixtures. It exercises entry layout, capability selection, validation, full-page fitting, zoom, real page counts/navigation, drawing/highlighting/shapes, formatted text, movement/eraser/undo/redo, download and re-render of edited PDFs, byte-identical originals, shared per-file state, removal confirmation, rotated/cropped export alignment, corrupt-file errors, RTL and phone widths. Results and screenshots are in ignored `artifacts/qa/`. The older `qa-studio.mjs` and `qa-experience.mjs` commands are aliases to the current suite.

## Portable preview

```bash
npm run package:preview
```

Produces `artifacts/pdflexi-preview.html`, a self-contained frontend review artifact with embedded PDF worker/assets. It is separate from the production build and its stricter CSP. It is a review-only artifact: new worker tool execution and PWA caching require the hosted production build.

## Deployment and security

Build with `npm ci && npm run build`; publish **`dist/`** to a compatible static host. GitHub code updates are not automatic public deployments. No domain/production deployment is configured here. Do not deploy the Vite development server as production.

`public/_headers` supplies a security baseline for compatible hosts, including local workers and narrowly scoped WebAssembly support. Configure equivalent headers on other hosts. A static host does not add AI inference, cloud storage, authentication, payments or unlimited PDF capacity. Review [SECURITY.md](SECURITY.md) before commercial release.

## Modular execution packages

- `packages/core`: shared contracts, strict plan validation, sequential pipeline and resource limits.
- `packages/tools`: independent definitions for all 30 tools, 8 dynamically imported executors, a disposable Worker host and lazy per-tool translations.
- `packages/agents`: replaceable planning provider contract and conservative offline command fallback (not an LLM).
- `packages/storage`: asynchronous storage contract with memory and IndexedDB adapters; no automatic document persistence.
- `src/features/execution`: user confirmation, progress, cancellation, downloadable output and optional local saving.
- `scripts/build-offline.mjs`: bounded, static-resource-only PWA cache. Previously cached tools work offline; no promise that all resources download on first visit.

The project uses npm Workspaces. Add a module and run `npm run tools:sync`; the shared host loads its executor without editing existing tool logic. Adding a product capability also requires its catalog entry and tests. See [the detailed architecture](docs/ARCHITECTURE-V2.ar.md).

## Structure

- `StartCard.tsx`, `PdfThumbnail.tsx`: upload and first-request entry.
- `Chat.tsx`, `LiveDemo.tsx`: real conversation state and isolated scripted sample.
- `DocumentCanvas.tsx`, `WorkspaceCanvas.tsx`: canvas shell, toolbar/properties and export UI.
- `PdfViewport.tsx`, `AnnotationLayer.tsx`: lazy page raster rendering and interactive overlay.
- `lib/annotations.ts`: shared drawing, geometry, hit testing and movement.
- `features/attachments/`: React-independent attachment store and React adapter; owns validation, queueing and object-URL lifetimes.
- `features/conversation/`: conversation and draft state; preview replies are not execution results.
- `features/editor/`: pure, tested per-file history transitions, React state adapter and export lifecycle hook.
- `services/pdfExport.ts`: local PDF export adapter, separate from rendering geometry.
- `.github/workflows/frontend.yml`: build, formatting, unit tests and browser regression workflow.
- `lib/pdfRuntime.ts`: same-origin PDF worker and assets.
- `data/capabilities.json`: canonical 20 free + 10 Pro conversational capabilities.
- `data/copy.ts`, `data/editor.ts`, `data/languages.ts`: localized copy and availability.

See [architecture](docs/ARCHITECTURE.md), [roadmap](docs/ROADMAP.md) and [Arabic handoff](docs/HANDOFF.ar.md). A GitHub Actions workflow is supplied in `.github/workflows/frontend.yml`. It runs after these changes are pushed, subject to the repository’s Actions settings; a local test run is not evidence of a hosted workflow run.
