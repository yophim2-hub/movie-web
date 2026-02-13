"use client";

import { useTheme } from "@/providers/theme-provider";

interface ThemeToggleProps {
  className?: string;
  /** Hiển thị dạng: "icon" | "text" | "both" */
  variant?: "icon" | "text" | "both";
}

export function ThemeToggle({
  className = "",
  variant = "both",
}: Readonly<ThemeToggleProps>) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-2 rounded-[var(--radius-button)] px-2.5 py-1.5 text-[13px] text-foreground-muted transition-macos hover:bg-[var(--secondary-bg-solid)] hover:text-foreground focus-ring ${className}`}
      aria-label={theme === "dark" ? "Chuyển sang theme sáng" : "Chuyển sang theme tối"}
    >
      {(variant === "icon" || variant === "both") && (
        <span className="inline-block size-4 shrink-0" aria-hidden>
          {theme === "dark" ? (
            <SunIcon />
          ) : (
            <MoonIcon />
          )}
        </span>
      )}
      {(variant === "text" || variant === "both") && (
        <span>{theme === "dark" ? "Sáng" : "Tối"}</span>
      )}
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
