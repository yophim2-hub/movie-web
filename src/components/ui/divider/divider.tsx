"use client";

import { motion } from "framer-motion";

interface DividerProps {
  className?: string;
  /** Hiển thị theo chiều dọc (vertical) */
  vertical?: boolean;
  /** Có animate khi vào viewport không */
  animateIn?: boolean;
}

export function Divider({
  className = "",
  vertical = false,
  animateIn = false,
}: Readonly<DividerProps>) {
  const base = "shrink-0 bg-[var(--border)]";
  const orientation = vertical ? "w-px h-full" : "h-px w-full";

  const motionProps = animateIn
    ? {
        initial: { scaleX: vertical ? 1 : 0, scaleY: vertical ? 0 : 1 },
        whileInView: { scaleX: 1, scaleY: 1 },
        viewport: { once: true },
        transition: {
          duration: 0.4,
          ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
        },
      }
    : {};

  return (
    <motion.hr
      role="separator"
      className={`${base} ${orientation} border-0 ${className}`}
      style={
        vertical
          ? { transformOrigin: "center top" }
          : { transformOrigin: "left center" }
      }
      {...motionProps}
    />
  );
}
