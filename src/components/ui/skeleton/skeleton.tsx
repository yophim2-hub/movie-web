"use client";

import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  /** Chiều cao (Tailwind hoặc custom) */
  height?: string;
  /** Bo góc: none | button | panel | full */
  rounded?: "none" | "button" | "panel" | "full";
}

const roundedMap = {
  none: "rounded-none",
  button: "rounded-[var(--radius-button)]",
  panel: "rounded-[var(--radius-panel)]",
  full: "rounded-full",
};

export function Skeleton({
  className = "",
  height,
  rounded = "panel",
}: Readonly<SkeletonProps>) {
  return (
    <motion.div
      className={`bg-[var(--secondary-bg-solid)] ${roundedMap[rounded]} ${className}`}
      style={height ? { height } : undefined}
      initial={{ opacity: 0.6 }}
      animate={{
        opacity: [0.6, 1, 0.6],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

/** Skeleton cho avatar tròn */
export function SkeletonAvatar({
  className = "",
}: Readonly<{ className?: string }>) {
  return (
    <Skeleton
      className={`aspect-square w-10 ${className}`}
      rounded="full"
    />
  );
}

/** Skeleton cho dòng chữ (1 line) */
export function SkeletonText({
  className = "",
  lines = 1,
}: Readonly<{ className?: string; lines?: number }>) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={`line-${i}`}
          height={i === lines - 1 && lines > 1 ? "0.5rem" : "0.875rem"}
          className="w-full"
          rounded="button"
        />
      ))}
    </div>
  );
}
