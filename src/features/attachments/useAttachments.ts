import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Copy } from "../../data/copy";
import { createAttachmentStore } from "./attachmentStore";

export function useAttachments(copy: Copy) {
  const [store] = useState(createAttachmentStore);
  const files = useSyncExternalStore(store.subscribe, store.getSnapshot);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      store.dispose();
    };
  }, [store]);
  async function addFiles(incoming: File[]) {
    try {
      const result = await store.add(incoming);
      if (!mounted.current) return;
      setFileErrors(
        result.errors.map(({ code, name }) =>
          name ? `${name}: ${copy[code]}` : copy[code],
        ),
      );
      if (
        result.firstAddedId &&
        store.getSnapshot().some((item) => item.id === result.firstAddedId)
      ) {
        setSelectedId(result.firstAddedId);
      }
    } catch {
      if (mounted.current) setFileErrors([copy.readError]);
    }
  }
  function removeAttachment(id: string) {
    store.remove(id);
    setSelectedId((selected) => (selected === id ? null : selected));
  }
  return {
    files,
    selectedId,
    setSelectedId,
    fileErrors,
    clearErrors: () => setFileErrors([]),
    addFiles,
    removeAttachment,
  };
}
