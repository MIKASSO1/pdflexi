# PDFlexi

**Your documents. Just say the word.**

Phase 1 of a conversation-first PDF workspace: a responsive, multilingual frontend for the 30 agreed capabilities. Users describe changes to Lexi; there is no manual document editor.

## Status — read this first

This is a **frontend implementation**, not a finished PDF or AI service. The interface deliberately identifies requests as **received, not executed**.

### Working now

- Responsive desktop workspace: 240 px free-tools sidebar, center up to 760 px, 320 px intelligent-services sidebar at wide desktop sizes.
- A single document scrollbar, independently scrollable sticky sidebars, and a 620 px chat with a fixed-in-container composer and a message-only scroll region.
- All 30 capabilities: 20 traditional PDF operations and 10 Pro services; search and selection draft conversational requests, never open a manual editor.
- English, Arabic (RTL), and French interfaces. Registry for 29 languages; remaining 26 are visibly planned and disabled, not presented as translated.
- Drag-and-drop and file picker, local file listing/removal, PDF/image previews, original-file downloads, enlarged canvas, and file validation feedback.
- Capability browser, language chooser, planned pricing, privacy, how-it-works, files and new-conversation dialogs.
- In-memory conversation and attachment state. No chat or file persistence after reload. Only locale is stored in localStorage, if available.
- No AI calls, document upload, ads, analytics, checkout or external fonts.

### Not implemented in this phase

PDF transformations, OCR, conversions, execution history/version recovery, an AI model, automated planning, legal certification, authenticity verification, accounts, payment, quota enforcement and rewarded ads. The canvas displays **original files**, not transformed results. The default document is explicitly labeled as an illustrative example.

Phase 1 accepts at most **10 attachments of 20 MiB each**, including PDF, DOCX, XLSX, JPG/JPEG and PNG. These are preview safeguards, not permanent product limits. The eventual 100-document stamping service is planned, not operational here. Basic PDF header checks do not certify safety or validity; metadata acceptance is not document processing.

## Development

Requires Node.js **22 or newer**, npm and a modern browser. No environment variables, API keys or paid services are required.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

```bash
npm run typecheck
npm test
npm run build
npm run preview
```

### End-to-end tests

With the dev server running in another terminal:

```bash
npx playwright install chromium
npm run test:e2e
```

For a system Chromium instead of a Playwright download:

```bash
CHROMIUM_PATH=/path/to/chromium npm run test:e2e
```

The tests cover the 30-capability distribution, desktop geometry, search/drafting, non-execution disclosure, long chat scrolling, reset confirmation, file errors, local preview, 29-language registry/3 enabled languages, RTL, mobile dialogs and overflow. Screenshots/results are written to ignored `artifacts/qa/`.

### Portable interactive preview

```bash
npm run package:preview
```

Produces `artifacts/pdflexi-preview.html`, a self-contained, offline frontend preview. This is a review artifact, not the deployment build. Some file-preview behavior depends on browser capabilities.

## Deploy

Build with `npm ci && npm run build`; publish **`dist/`** to a compatible static host, for example Cloudflare Pages. Keep the code in GitHub; do not assume GitHub Pages is suitable for a commercial SaaS. No deployment or custom domain is configured by this commit.

`public/_headers` supplies a deployment security-header baseline for hosts supporting that format. Other hosts must configure equivalent headers separately. Never deploy the Vite development server as production. The self-contained review HTML embeds scripts and is intentionally separate from the stricter production CSP.

A static host serves the frontend only. It does **not** provide PDF processing, AI inference, identity, payment processing, model hosting or unlimited capacity. Any future model-distribution scheme requires separate licensing, bandwidth, device-compatibility and cost evaluation.

## Structure

```text
src/
  App.tsx                      Workspace state and interactions
  components/
    Chat.tsx                   620px chat / independently scrolling messages
    Capabilities.tsx           Searchable free list and Pro cards
    DocumentCanvas.tsx         Original-file / illustrative preview
    Dialog.tsx                 Native modal / keyboard behavior
    Icon.tsx                   Capability icon mapping
  data/
    capabilities.json          Canonical registry: 20 free + 10 Pro
    languages.ts               29-language foundation, explicit availability
    copy.ts                    English / Arabic / French interface copy
  lib/
    types.ts                   Typed future execution-engine boundary
    files.mjs                  Preview limits and metadata validation
  styles.css                   Responsive and RTL styles
```

See [architecture](docs/ARCHITECTURE.md), [roadmap](docs/ROADMAP.md), and [security](SECURITY.md).

An optional GitHub Actions configuration is provided in `docs/ci-template.yml`. It is not active. The repository owner can place it in `.github/workflows/ci.yml` later; publishing workflow files requires the appropriate GitHub authorization.

## Product/legal boundaries

“Free” and “Pro” describe the planned product grouping, not a currently available paid service. Pricing is illustrative. Risk analysis is not legal advice. Tampering detection cannot establish authenticity. Visible stamps/signatures are not necessarily legally valid digital signatures or certification. A repair engine cannot recover data that is absent. Translation and editing need fidelity checks. CV tailoring must not fabricate qualifications.

No third-party model weights or PDF engines have been bundled. Dependencies retain their respective licenses; the owner must choose the licensing policy for the project's own source before public redistribution.
