export type ToolTranslation = {
  name: string;
  description: string;
  prompt: string;
};
const loaders: Record<string, (() => Promise<ToolTranslation>) | undefined> = {
  "batch-stamp/ar": () =>
    import("./modules/batch-stamp/i18n/ar.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "batch-stamp/en": () =>
    import("./modules/batch-stamp/i18n/en.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "batch-stamp/fr": () =>
    import("./modules/batch-stamp/i18n/fr.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "chat-pdf/ar": () =>
    import("./modules/chat-pdf/i18n/ar.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "chat-pdf/en": () =>
    import("./modules/chat-pdf/i18n/en.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "chat-pdf/fr": () =>
    import("./modules/chat-pdf/i18n/fr.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "compare-contracts/ar": () =>
    import("./modules/compare-contracts/i18n/ar.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "compare-contracts/en": () =>
    import("./modules/compare-contracts/i18n/en.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "compare-contracts/fr": () =>
    import("./modules/compare-contracts/i18n/fr.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "compress/ar": () =>
    import("./modules/compress/i18n/ar.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "compress/en": () =>
    import("./modules/compress/i18n/en.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "compress/fr": () =>
    import("./modules/compress/i18n/fr.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "contract-risks/ar": () =>
    import("./modules/contract-risks/i18n/ar.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "contract-risks/en": () =>
    import("./modules/contract-risks/i18n/en.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "contract-risks/fr": () =>
    import("./modules/contract-risks/i18n/fr.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "delete-pages/ar": () =>
    import("./modules/delete-pages/i18n/ar.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "delete-pages/en": () =>
    import("./modules/delete-pages/i18n/en.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "delete-pages/fr": () =>
    import("./modules/delete-pages/i18n/fr.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "edit-text/ar": () =>
    import("./modules/edit-text/i18n/ar.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "edit-text/en": () =>
    import("./modules/edit-text/i18n/en.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "edit-text/fr": () =>
    import("./modules/edit-text/i18n/fr.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "excel-to-pdf/ar": () =>
    import("./modules/excel-to-pdf/i18n/ar.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "excel-to-pdf/en": () =>
    import("./modules/excel-to-pdf/i18n/en.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "excel-to-pdf/fr": () =>
    import("./modules/excel-to-pdf/i18n/fr.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "fill-form/ar": () =>
    import("./modules/fill-form/i18n/ar.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "fill-form/en": () =>
    import("./modules/fill-form/i18n/en.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "fill-form/fr": () =>
    import("./modules/fill-form/i18n/fr.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "forgery-signals/ar": () =>
    import("./modules/forgery-signals/i18n/ar.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "forgery-signals/en": () =>
    import("./modules/forgery-signals/i18n/en.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "forgery-signals/fr": () =>
    import("./modules/forgery-signals/i18n/fr.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "invoice-excel/ar": () =>
    import("./modules/invoice-excel/i18n/ar.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "invoice-excel/en": () =>
    import("./modules/invoice-excel/i18n/en.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "invoice-excel/fr": () =>
    import("./modules/invoice-excel/i18n/fr.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "jpg-to-pdf/ar": () =>
    import("./modules/jpg-to-pdf/i18n/ar.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "jpg-to-pdf/en": () =>
    import("./modules/jpg-to-pdf/i18n/en.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "jpg-to-pdf/fr": () =>
    import("./modules/jpg-to-pdf/i18n/fr.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "merge/ar": () =>
    import("./modules/merge/i18n/ar.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "merge/en": () =>
    import("./modules/merge/i18n/en.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "merge/fr": () =>
    import("./modules/merge/i18n/fr.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "ocr/ar": () =>
    import("./modules/ocr/i18n/ar.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "ocr/en": () =>
    import("./modules/ocr/i18n/en.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "ocr/fr": () =>
    import("./modules/ocr/i18n/fr.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "page-numbers/ar": () =>
    import("./modules/page-numbers/i18n/ar.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "page-numbers/en": () =>
    import("./modules/page-numbers/i18n/en.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "page-numbers/fr": () =>
    import("./modules/page-numbers/i18n/fr.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "pdf-to-excel/ar": () =>
    import("./modules/pdf-to-excel/i18n/ar.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "pdf-to-excel/en": () =>
    import("./modules/pdf-to-excel/i18n/en.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "pdf-to-excel/fr": () =>
    import("./modules/pdf-to-excel/i18n/fr.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "pdf-to-jpg/ar": () =>
    import("./modules/pdf-to-jpg/i18n/ar.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "pdf-to-jpg/en": () =>
    import("./modules/pdf-to-jpg/i18n/en.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "pdf-to-jpg/fr": () =>
    import("./modules/pdf-to-jpg/i18n/fr.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "pdf-to-word/ar": () =>
    import("./modules/pdf-to-word/i18n/ar.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "pdf-to-word/en": () =>
    import("./modules/pdf-to-word/i18n/en.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "pdf-to-word/fr": () =>
    import("./modules/pdf-to-word/i18n/fr.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "protect/ar": () =>
    import("./modules/protect/i18n/ar.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "protect/en": () =>
    import("./modules/protect/i18n/en.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "protect/fr": () =>
    import("./modules/protect/i18n/fr.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "reorder/ar": () =>
    import("./modules/reorder/i18n/ar.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "reorder/en": () =>
    import("./modules/reorder/i18n/en.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "reorder/fr": () =>
    import("./modules/reorder/i18n/fr.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "repair/ar": () =>
    import("./modules/repair/i18n/ar.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "repair/en": () =>
    import("./modules/repair/i18n/en.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "repair/fr": () =>
    import("./modules/repair/i18n/fr.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "rotate/ar": () =>
    import("./modules/rotate/i18n/ar.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "rotate/en": () =>
    import("./modules/rotate/i18n/en.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "rotate/fr": () =>
    import("./modules/rotate/i18n/fr.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "sign/ar": () =>
    import("./modules/sign/i18n/ar.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "sign/en": () =>
    import("./modules/sign/i18n/en.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "sign/fr": () =>
    import("./modules/sign/i18n/fr.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "split/ar": () =>
    import("./modules/split/i18n/ar.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "split/en": () =>
    import("./modules/split/i18n/en.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "split/fr": () =>
    import("./modules/split/i18n/fr.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "summarize-contract/ar": () =>
    import("./modules/summarize-contract/i18n/ar.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "summarize-contract/en": () =>
    import("./modules/summarize-contract/i18n/en.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "summarize-contract/fr": () =>
    import("./modules/summarize-contract/i18n/fr.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "tailor-cv/ar": () =>
    import("./modules/tailor-cv/i18n/ar.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "tailor-cv/en": () =>
    import("./modules/tailor-cv/i18n/en.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "tailor-cv/fr": () =>
    import("./modules/tailor-cv/i18n/fr.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "translate-layout/ar": () =>
    import("./modules/translate-layout/i18n/ar.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "translate-layout/en": () =>
    import("./modules/translate-layout/i18n/en.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "translate-layout/fr": () =>
    import("./modules/translate-layout/i18n/fr.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "unlock/ar": () =>
    import("./modules/unlock/i18n/ar.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "unlock/en": () =>
    import("./modules/unlock/i18n/en.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "unlock/fr": () =>
    import("./modules/unlock/i18n/fr.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "watermark/ar": () =>
    import("./modules/watermark/i18n/ar.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "watermark/en": () =>
    import("./modules/watermark/i18n/en.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "watermark/fr": () =>
    import("./modules/watermark/i18n/fr.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  "word-to-pdf/ar": () =>
    import("./modules/word-to-pdf/i18n/ar.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "word-to-pdf/en": () =>
    import("./modules/word-to-pdf/i18n/en.json", {
      with: { type: "json" },
    }).then((module) => module.default),
  "word-to-pdf/fr": () =>
    import("./modules/word-to-pdf/i18n/fr.json", {
      with: { type: "json" },
    }).then((module) => module.default),
};
export async function loadToolTranslation(id: string, locale: string) {
  const key = id + "/" + locale,
    fallback = id + "/en";
  const loader = loaders[key] || loaders[fallback];
  if (!loader) throw new Error("Unknown tool translation.");
  return {
    copy: await loader(),
    locale: loaders[key] ? locale : "en",
    fallback: !loaders[key],
  };
}
