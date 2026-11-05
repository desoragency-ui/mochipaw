import { X } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  label: string;
  closeLabel: string;
  side?: 'start' | 'end' | 'top';
  children: ReactNode;
}

/** Slide-in panel built on <dialog>: focus trap, Escape key and page lock come for free. */
export function Drawer({ open, onClose, label, closeLabel, side = 'end', children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = 'hidden';
      // A short timer, not a frame callback: frame callbacks stop in background tabs.
      const timer = window.setTimeout(() => setShown(true), 20);
      return () => window.clearTimeout(timer);
    }
    if (!open && dialog.open) {
      setShown(false);
      document.documentElement.style.overflow = '';
      const timer = window.setTimeout(() => dialog.close(), 280);
      return () => window.clearTimeout(timer);
    }
  }, [open]);

  const place =
    side === 'top'
      ? 'inset-x-0 top-0 max-h-[85dvh] w-full max-w-none'
      : side === 'start'
        ? 'inset-y-0 start-0 me-auto h-dvh max-h-none w-[min(24rem,88vw)]'
        : 'inset-y-0 end-0 ms-auto h-dvh max-h-none w-[min(27rem,92vw)]';

  const hidden =
    side === 'top'
      ? '-translate-y-full'
      : side === 'start'
        ? '-translate-x-full rtl:translate-x-full'
        : 'translate-x-full rtl:-translate-x-full';

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className={`fixed m-0 overflow-hidden bg-cream p-0 text-brown shadow-lift transition-transform duration-300 ease-out backdrop:bg-brown/50 ${place} ${
        shown ? 'translate-x-0 translate-y-0' : hidden
      }`}
    >
      <div className="relative flex h-full flex-col">
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="absolute end-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white shadow-soft transition hover:bg-cream-deep"
        >
          <X size={20} aria-hidden="true" />
        </button>
        {children}
      </div>
    </dialog>
  );
}
