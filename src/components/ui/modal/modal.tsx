"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Title (optional), hiển thị trong header */
  title?: string;
  /** Không đóng khi bấm overlay */
  closeOnOverlayClick?: boolean;
  /** Class cho panel (nội dung modal) */
  panelClassName?: string;
}

const overlayTransition = {
  duration: 0.25,
  ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
};

const panelTransition = {
  duration: 0.3,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

export function Modal({
  open,
  onClose,
  children,
  title,
  closeOnOverlayClick = true,
  panelClassName = "",
}: Readonly<ModalProps>) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
        >
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={overlayTransition}
            onClick={closeOnOverlayClick ? onClose : undefined}
          />
          <motion.div
            className={`relative z-10 mx-auto flex w-full max-w-md flex-col overflow-hidden rounded-[var(--radius-sheet)] border border-[var(--border)] bg-[var(--glass-bg)] shadow-[var(--shadow-lg)] backdrop-blur-xl ${panelClassName}`}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={panelTransition}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="shrink-0 border-b border-[var(--border)] px-6 py-4">
                <h2
                  id="modal-title"
                  className="text-[15px] font-semibold text-[var(--foreground)]"
                >
                  {title}
                </h2>
              </div>
            )}
            <div className="min-h-0 flex-1 overflow-auto p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
