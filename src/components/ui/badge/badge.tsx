"use client";

import { motion } from "framer-motion";

type BadgeVariant = "default" | "accent" | "outline" | "soft";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  /** Framer: hiệu ứng khi mount */
  animate?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--secondary-bg-solid)] text-[var(--foreground)] border border-[var(--border)]",
  accent: "gradient-accent border border-white/20",
  outline:
    "bg-transparent text-[var(--foreground-muted)] border border-[var(--border)]",
  soft: "bg-[var(--accent-soft)] text-[var(--accent)] border-transparent",
};

export function Badge({
  children,
  variant = "default",
  className = "",
  animate = true,
}: Readonly<BadgeProps>) {
  const classes = [
    "inline-flex items-center rounded-md px-2 py-0.5 text-[12px] font-medium transition-colors",
    variantClasses[variant],
    className,
  ].filter(Boolean).join(" ");

  const motionProps = animate
    ? {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: {
          duration: 0.2,
          ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
        },
      }
    : {};

  return (
    <motion.span className={classes} {...motionProps}>
      {children}
    </motion.span>
  );
}
