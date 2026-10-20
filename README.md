# PDFlexi

**Your document. A clearer next step.**

A local-first React/TypeScript PDF workspace: a simple upload-and-request card opens into chat alongside a real manual annotation editor. The 30 conversational capabilities remain a planned AI workflow, not an automatic execution engine.

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
- Exactly 30 conversational capabilities: 20 free + 10 Pro. Selection drafts a request, not an automatic transformation. OCR remains one of the 20 planned free capabilities.
- English, Arabic/RTL and French interfaces. A 29-language registry explicitly disables the other planned translations.
- Scripted sample walkthrough, capability browser, language chooser, pricing/how/privacy dialogs and confirmation before resetting chat.
- No document upload, AI request, advertising, analytics, payment or remote font service.

## Important boundaries

AI inference, automatic PDF conversions/merge/split/OCR, true original-text rewriting, secure redaction, execution-version recovery, accounts, billing and quotas are not implemented. Chat acknowledges requests without pretending they executed. Manual annotations are real local operations, independent of AI.

Files, conversations and edits live in memory in the current tab. **Download to keep edits.** There is no document/cloud auto-save or draft persistence after reload. Only preferences such as language may use localStorage. New documents always start in Fit page.

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
npm test
npm run build
npm run preview
npm run format:check
```

## Browser tests

With the development server running:

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

Produces `artifacts/pdflexi-preview.html`, a self-contained frontend review artifact with embedded PDF worker/assets. It is separate from the production build and its stricter CSP.

## Deployment and security

Build with `npm ci && npm run build`; publish **`dist/`** to a compatible static host. GitHub code updates are not automatic public deployments. No domain/production deployment is configured here. Do not deploy the Vite development server as production.

`public/_headers` supplies a security baseline for compatible hosts, including local workers and narrowly scoped WebAssembly support. Configure equivalent headers on other hosts. A static host does not add AI inference, cloud storage, authentication, payments or unlimited PDF capacity. Review [SECURITY.md](SECURITY.md) before commercial release.

## Structure

- `StartCard.tsx`, `PdfThumbnail.tsx`: upload and first-request entry.
- `Chat.tsx`, `LiveDemo.tsx`: real conversation state and isolated scripted sample.
- `DocumentCanvas.tsx`, `WorkspaceCanvas.tsx`: canvas shell, toolbar/properties and export UI.
- `PdfViewport.tsx`, `AnnotationLayer.tsx`: lazy page raster rendering and interactive overlay.
- `lib/annotations.ts`: shared drawing, geometry, hit testing, movement and PDF export.
- `lib/useDocumentEdits.ts`: per-file undo/redo and exported-snapshot state.
- `lib/pdfRuntime.ts`: same-origin PDF worker and assets.
- `data/capabilities.json`: canonical 20 free + 10 Pro conversational capabilities.
- `data/copy.ts`, `data/editor.ts`, `data/languages.ts`: localized copy and availability.

See [architecture](docs/ARCHITECTURE.md), [roadmap](docs/ROADMAP.md) and [Arabic handoff](docs/HANDOFF.ar.md). An optional CI template is supplied in `docs/ci-template.yml`; enabling it is a separate repository-owner action.
