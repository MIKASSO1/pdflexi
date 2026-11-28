import { runCapability } from "../../core/engines/setup";

const MERGE_TOOL_ID = 1;

export const isMergeTool = (tool: { id?: number } | null | undefined): boolean => tool?.id === MERGE_TOOL_ID;

const pickPdfFiles = (): Promise<File[]> =>
  new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf,.pdf";
    input.multiple = true;
    input.style.display = "none";
    let settled = false;
    const finish = (files: File[]) => {
      if (settled) return;
      settled = true;
      input.remove();
      resolve(files);
    };
    input.addEventListener("change", () => finish([...(input.files ?? [])]));
    input.addEventListener("cancel", () => finish([]));
    document.body.appendChild(input);
    input.click();
    window.addEventListener("focus", () => setTimeout(() => finish([...(input.files ?? [])]), 500), { once: true });
  });

const downloadPdf = (bytes: Uint8Array, filename: string) => {
  const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
};

export async function runMergeFromPicker(): Promise<void> {
  const files = await pickPdfFiles();
  if (files.length === 0) return;
  if (files.length < 2) {
    alert("Merge needs at least two PDF files.");
    return;
  }

  const inputs = await Promise.all(
    files.map(async (file) => ({ name: file.name, bytes: new Uint8Array(await file.arrayBuffer()) })),
  );

  const outcome = await runCapability("merge", { files: inputs }, "Merge PDF from the tools list");
  if (!outcome.ok || outcome.outputs.length === 0) {
    alert(`Merge failed: ${outcome.message ?? outcome.status}`);
    return;
  }

  downloadPdf(outcome.outputs[0], "merged.pdf");
}
