"use client";

import { motion } from "framer-motion";
import { forwardRef, useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  /** Wrapper className */
  wrapperClassName?: string;
}

const inputBase =
  "w-full rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] transition-macos focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)]";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      wrapperClassName = "",
      className = "",
      id: idProp,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    // Use raw useId() to avoid hydration mismatch (no string transform)
    const id = idProp ?? generatedId;

    return (
      <motion.div
        className={`flex flex-col gap-1.5 ${wrapperClassName}`}
        initial={false}
        animate={{ opacity: 1 }}
      >
        {label && (
          <label
            htmlFor={id}
            className="text-[13px] font-medium text-[var(--foreground-muted)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={[inputBase, error && "border-red-500 focus:ring-red-200", className]
            .filter(Boolean)
            .join(" ")}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {error && (
          <motion.span
            id={`${id}-error`}
            role="alert"
            className="text-[12px] text-red-500"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.span>
        )}
      </motion.div>
    );
  }
);

Input.displayName = "Input";
