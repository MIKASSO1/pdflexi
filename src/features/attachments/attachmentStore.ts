import type { Attachment } from "../../lib/types";
import {
  extension,
  fileKey,
  MAX_FILES,
  validateMetadata,
} from "../../lib/files.mjs";

export type AttachmentError = {
  code:
    "badFormat" | "tooLarge" | "readError" | "limit" | "duplicate" | "badPdf";
  name?: string;
};
type AddResult = { errors: AttachmentError[]; firstAddedId?: string };

/** Owns file lifetimes, independent of React. Mutations publish immutable snapshots.
 * Header checks are not malware scanning. Removal always uses the latest snapshot,
 * including when it occurs while another file's header is being read.
 */
export function createAttachmentStore() {
  let files: Attachment[] = [];
  let queue: Promise<unknown> = Promise.resolve();
  let generation = 0;
  const listeners = new Set<() => void>();
  function publish(next: Attachment[]) {
    files = next;
    listeners.forEach((listener) => listener());
  }
  return {
    getSnapshot: () => files,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    add(incoming: File[]): Promise<AddResult> {
      const token = generation;
      const run = async (): Promise<AddResult> => {
        const result: AddResult = { errors: [] };
        for (const file of incoming) {
          if (token !== generation) break;
          const fail = (code: AttachmentError["code"]) =>
            result.errors.push({ code, name: file.name });
          if (files.length >= MAX_FILES) {
            result.errors.push({ code: "limit" });
            break;
          }
          const invalid = validateMetadata(file);
          if (invalid) {
            fail(invalid);
            continue;
          }
          if (files.some((item) => fileKey(item.file) === fileKey(file))) {
            fail("duplicate");
            continue;
          }
          const kind = extension(file.name);
          try {
            if (kind === "pdf") {
              const header = new TextDecoder().decode(
                await file.slice(0, 1024).arrayBuffer(),
              );
              if (token !== generation) break;
              if (!header.includes("%PDF-")) {
                fail("badPdf");
                continue;
              }
            }
            if (token !== generation) break;
            // No captured copy of files survives an await.
            const attachment = {
              id: crypto.randomUUID(),
              file,
              url: URL.createObjectURL(file),
              kind,
            };
            publish([...files, attachment]);
            result.firstAddedId ??= attachment.id;
          } catch {
            if (token === generation) fail("readError");
          }
        }
        return result;
      };
      const task = queue.then(run, run);
      queue = task;
      return task;
    },
    remove(id: string) {
      const old = files.find((item) => item.id === id);
      if (!old) return;
      publish(files.filter((item) => item.id !== id));
      URL.revokeObjectURL(old.url);
    },
    dispose() {
      generation++;
      files.forEach((item) => URL.revokeObjectURL(item.url));
      publish([]);
    },
  };
}
