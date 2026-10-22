import { useEffect, useRef, useState } from "react";
import type { Attachment } from "../../lib/types";
import type { EditController } from "../../lib/annotations";
import { exportAnnotatedPdf } from "../../services/pdfExport";

export function usePdfExport() {
  const [exporting, setExporting] = useState(false);
  const busy = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  async function downloadEdits(attachment: Attachment, editor: EditController) {
    if (!editor.annotations.length || busy.current) return;
    busy.current = true;
    setExporting(true);
    const marks = editor.annotations;
    try {
      const bytes = await exportAnnotatedPdf(attachment.file, marks);
      if (!mounted.current) return;
      const url = URL.createObjectURL(
        new Blob([new Uint8Array(bytes)], { type: "application/pdf" }),
      );
      try {
        const link = document.createElement("a");
        link.href = url;
        link.download =
          attachment.file.name.replace(/\.pdf$/i, "") + "-edited.pdf";
        link.click();
        editor.markExported(marks);
      } finally {
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      }
    } finally {
      busy.current = false;
      if (mounted.current) setExporting(false);
    }
  }
  return { exporting, downloadEdits };
}
