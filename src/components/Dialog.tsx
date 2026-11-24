import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";
export function Dialog({
  title,
  subtitle,
  closeLabel,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  subtitle?: string;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const last = document.activeElement as HTMLElement | null;
    const dialog = ref.current;
    dialog?.showModal();
    return () => {
      dialog?.close();
      last?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`dialog ${wide ? "dialog-wide" : ""}`}
      aria-labelledby="dialog-title"
      aria-describedby={subtitle ? "dialog-description" : undefined}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        const box = ref.current?.getBoundingClientRect();
        if (
          box &&
          (e.clientX < box.left ||
            e.clientX > box.right ||
            e.clientY < box.top ||
            e.clientY > box.bottom)
        )
          onClose();
      }}
    >
      <div className="dialog-heading">
        <div>
          <h2 id="dialog-title">{title}</h2>
          {subtitle && <p id="dialog-description">{subtitle}</p>}
        </div>
        <button
          className="icon-button dialog-close"
          onClick={onClose}
          aria-label={closeLabel}
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
