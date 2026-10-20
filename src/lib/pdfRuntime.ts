import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
GlobalWorkerOptions.workerSrc = workerUrl;
export function openPdf(bytes: ArrayBuffer) {
  const base = (folder: string) =>
    new URL(`${import.meta.env.BASE_URL}pdfjs/${folder}/`, document.baseURI)
      .href;
  return getDocument({
    data: new Uint8Array(bytes),
    isEvalSupported: false,
    cMapUrl: base("cmaps"),
    cMapPacked: true,
    standardFontDataUrl: base("standard_fonts"),
    wasmUrl: base("wasm"),
    useWorkerFetch: !import.meta.env.PDFLEXI_STANDALONE,
  });
}
