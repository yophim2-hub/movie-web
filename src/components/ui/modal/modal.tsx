"use client";

import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

/** Số modal đang mở — chỉ bật lại scroll khi = 0 (tránh lỗi khi có modal lồng nhau). */
let openModalCount = 0;

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
  /** z-index cho wrapper (modal lồng nhau dùng cao hơn, VD: 60) */
  zIndex?: number;
}

const overlayTransition = {
  duration: 0.25,
  ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
};

/** Chỉ fade — tránh scale/translate trên panel (Safari/iOS scroll trong modal bị giật khi tổ tiên có transform). */
const panelTransition = {
  duration: 0.2,
  ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
};

export function Modal({
  open,
  onClose,
  children,
  title,
  closeOnOverlayClick = true,
  panelClassName = "",
  zIndex = 50,
}: Readonly<ModalProps>) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    openModalCount += 1;
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      openModalCount = Math.max(0, openModalCount - 1);
      if (openModalCount === 0) {
        html.style.overflow = prevHtmlOverflow;
        body.style.overflow = prevBodyOverflow;
      }
    };
  }, [open, onClose]);

  const modalNode = (
    <AnimatePresence>
      {open && (
        <div
          className="flex min-h-0 items-center justify-center overflow-y-auto p-4"
          style={{ position: "fixed", inset: 0, zIndex }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
        >
          <motion.div
            className="fixed inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={overlayTransition}
            onClick={closeOnOverlayClick ? onClose : undefined}
          />
          <motion.div
            className={`relative z-10 mx-auto flex min-h-0 w-full max-w-md flex-col overflow-hidden rounded-[var(--radius-sheet)] border border-[var(--border)] bg-[var(--glass-bg-solid)] shadow-[var(--shadow-lg)] ${panelClassName}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
            <div className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-y-contain p-6 [-webkit-overflow-scrolling:touch]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted || typeof document === "undefined") {
    return null;
  }
  return createPortal(modalNode, document.body);
}
