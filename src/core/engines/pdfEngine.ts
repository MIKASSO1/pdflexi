import { PDFDocument } from "pdf-lib";
import type { Engine, EngineResult, Order } from "../capabilities/contract.mjs";

type PdfInput = { name?: string; bytes: Uint8Array };

const inputsOf = (order: Order): PdfInput[] => {
  const raw = order.params?.files;
  return Array.isArray(raw) ? (raw as PdfInput[]) : [];
};

const merge = async (order: Order): Promise<EngineResult> => {
  const files = inputsOf(order);
  if (files.length < 2) {
    return {
      ok: false,
      verified: false,
      outputs: [],
      error: { code: "invalid_files", message: "merge needs at least two PDFs" },
    };
  }

  const merged = await PDFDocument.create();
  let expectedPages = 0;
  try {
    for (const file of files) {
      const source = await PDFDocument.load(file.bytes);
      const pages = await merged.copyPages(source, source.getPageIndices());
      for (const page of pages) merged.addPage(page);
      expectedPages += source.getPageCount();
    }
  } catch (cause) {
    return {
      ok: false,
      verified: false,
      outputs: [],
      error: {
        code: "unreadable_pdf",
        message: cause instanceof Error ? cause.message : "a file could not be read as a PDF",
      },
    };
  }

  const bytes = await merged.save();
  const check = await PDFDocument.load(bytes);
  if (check.getPageCount() !== expectedPages) {
    return {
      ok: false,
      verified: false,
      outputs: [],
      error: {
        code: "page_count_mismatch",
        message: `merged file has ${check.getPageCount()} pages, expected ${expectedPages}`,
      },
    };
  }

  return { ok: true, verified: true, outputs: [bytes], warnings: [] };
};

export const pdfEngine: Engine = {
  id: "pdf",
  supports: (capability) => capability.engine === "pdf" && capability.op === "merge",
  execute: async ({ capability, order }) => {
    if (capability.op === "merge") return merge(order);
    return {
      ok: false,
      verified: false,
      outputs: [],
      error: {
        code: "unsupported_op",
        message: `the pdf engine does not implement ${capability.op ?? "this op"} yet`,
      },
    };
  },
};
