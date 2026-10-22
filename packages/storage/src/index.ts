export type StoredDocument = {
  id: string;
  name: string;
  blob: Blob;
  createdAt: number;
};
export type DocumentMetadata = Omit<StoredDocument, "blob"> & {
  size: number;
  mime: string;
};
/** Adapters are async from day one. Remote adapters must add auth/consent, not just a URL. */
export interface DocumentStorage {
  put(document: StoredDocument): Promise<void>;
  get(id: string): Promise<StoredDocument | undefined>;
  list(): Promise<DocumentMetadata[]>;
  remove(id: string): Promise<void>;
  clear(): Promise<void>;
}
function validate(doc: StoredDocument) {
  if (
    !doc.id ||
    doc.id.length > 150 ||
    !doc.name ||
    !Number.isFinite(doc.createdAt) ||
    !(doc.blob instanceof Blob) ||
    !doc.blob.size ||
    doc.blob.size > 100 * 1024 * 1024
  )
    throw new Error("Invalid document or local storage size limit exceeded.");
}
function metadata({ blob, ...doc }: StoredDocument): DocumentMetadata {
  return { ...doc, size: blob.size, mime: blob.type };
}
export function createMemoryStorage(): DocumentStorage {
  const documents = new Map<string, StoredDocument>();
  return {
    async put(doc) {
      validate(doc);
      documents.set(doc.id, { ...doc });
    },
    async get(id) {
      const doc = documents.get(id);
      return doc ? { ...doc } : undefined;
    },
    async list() {
      return [...documents.values()]
        .map(metadata)
        .sort((a, b) => b.createdAt - a.createdAt);
    },
    async remove(id) {
      documents.delete(id);
    },
    async clear() {
      documents.clear();
    },
  };
}
export function createIndexedDbStorage(
  name = "pdflexi-documents-v1",
): DocumentStorage {
  async function database(): Promise<IDBDatabase> {
    if (typeof indexedDB === "undefined")
      throw new Error("IndexedDB is unavailable in this browser.");
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(name, 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore("documents", { keyPath: "id" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        reject(request.error || new Error("Cannot open local storage."));
      request.onblocked = () =>
        reject(new Error("Local storage upgrade is blocked by another tab."));
    });
  }
  async function request<T>(
    mode: IDBTransactionMode,
    action: (store: IDBObjectStore) => IDBRequest<T>,
  ): Promise<T> {
    const db = await database();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("documents", mode);
      let value: T;
      const operation = action(transaction.objectStore("documents"));
      operation.onsuccess = () => {
        value = operation.result;
      };
      transaction.oncomplete = () => {
        db.close();
        resolve(value);
      };
      transaction.onerror = transaction.onabort = () => {
        db.close();
        reject(
          transaction.error ||
            operation.error ||
            new Error("Local storage operation failed."),
        );
      };
    });
  }
  return {
    async put(doc) {
      validate(doc);
      await request("readwrite", (store) => store.put(doc));
    },
    get: (id) =>
      request<StoredDocument | undefined>("readonly", (store) => store.get(id)),
    async list() {
      // Cursor metadata avoids retaining all saved document blobs at once.
      const db = await database();
      return new Promise((resolve, reject) => {
        const tx = db.transaction("documents", "readonly"),
          values: DocumentMetadata[] = [];
        const cursor = tx.objectStore("documents").openCursor();
        cursor.onsuccess = () => {
          const item = cursor.result;
          if (item) {
            values.push(metadata(item.value as StoredDocument));
            item.continue();
          }
        };
        tx.oncomplete = () => {
          db.close();
          resolve(values.sort((a, b) => b.createdAt - a.createdAt));
        };
        tx.onerror = tx.onabort = () => {
          db.close();
          reject(tx.error || new Error("Cannot read local documents."));
        };
      });
    },
    async remove(id) {
      await request("readwrite", (store) => store.delete(id));
    },
    async clear() {
      await request("readwrite", (store) => store.clear());
    },
  };
}
