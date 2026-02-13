"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  /** Disable Framer Motion (e.g. khi cần ref pass-through) */
  disableMotion?: boolean;
}

const variants = {
  primary:
    "gradient-accent shadow-[var(--shadow-sm)] border border-white/20",
  secondary:
    "bg-[var(--secondary-bg-solid)] text-[var(--foreground)] hover:bg-[var(--secondary-hover)] border border-[var(--border)]",
  ghost:
    "text-[var(--foreground)] bg-transparent hover:bg-[var(--secondary-bg-solid)]",
};

const sizes = {
  sm: "h-7 px-3 text-[13px] rounded-[var(--radius-button)]",
  md: "h-8 px-4 text-[13px] rounded-[var(--radius-button)]",
  lg: "h-9 px-5 text-[13px] rounded-[var(--radius-button)]",
};

const motionProps = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { type: "spring" as const, stiffness: 400, damping: 25 },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      className = "",
      children,
      disabled,
      disableMotion = false,
      ...props
    },
    ref
  ) => {
    const classes = [
      "inline-flex items-center justify-center font-medium transition-macos focus-ring cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
      variants[variant],
      sizes[size],
      className,
    ].filter(Boolean).join(" ");

    if (disableMotion) {
      return (
        <button ref={ref} className={classes} disabled={disabled} {...props}>
          {children}
        </button>
      );
    }

    const {
      onAnimationStart: _a1,
      onAnimationEnd: _a2,
      onDrag: _d1,
      onDragStart: _d2,
      onDragEnd: _d3,
      onDragOver: _d4,
      ...restProps
    } = props;
    return (
      <motion.button
        ref={ref}
        className={classes}
        disabled={disabled}
        {...motionProps}
        {...(restProps as React.ComponentProps<typeof motion.button>)}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
