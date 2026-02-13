"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";

type CardVariant = "glass" | "elevated" | "outline";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
  /** Framer Motion: animate khi vào viewport */
  animateIn?: boolean;
  /** Custom delay (s) khi animateIn */
  delay?: number;
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "glass",
      padding = "md",
      className = "",
      children,
      animateIn = false,
      delay = 0,
      ...props
    },
    ref
  ) => {
    const {
      onAnimationStart: _a1,
      onAnimationEnd: _a2,
      onDrag: _d1,
      onDragStart: _d2,
      onDragEnd: _d3,
      onDragOver: _d4,
      ...restProps
    } = props;
    const base =
      "rounded-[var(--radius-panel)] transition-macos-slow transition-[box-shadow,border-color]";
    const variantClasses = {
      glass: "glass card-shadow",
      elevated: "card-surface",
      outline:
        "bg-transparent border border-[var(--card-border)] hover:border-[var(--border-strong)] shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
    };
    const classes = [
      base,
      variantClasses[variant],
      paddingMap[padding],
      className,
    ].filter(Boolean).join(" ");

    const motionProps = animateIn
      ? {
          initial: { opacity: 0, y: 12 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-24px" },
          transition: {
            duration: 0.35,
            delay,
            ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
          },
        }
      : {
          whileHover: { y: -2 },
          transition: {
            duration: 0.25,
            ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
          },
        };

    return (
      <motion.div
        ref={ref}
        className={classes}
        {...motionProps}
        {...(restProps as React.ComponentProps<typeof motion.div>)}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";
