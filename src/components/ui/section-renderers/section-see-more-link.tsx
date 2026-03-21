"use client";

import Link from "next/link";

/** Link "Xem thêm": mobile chỉ icon, từ sm hiển thị chữ. */
export function SectionSeeMoreLink({
  href,
  label,
  className = "",
}: Readonly<{ href: string; label: string; className?: string }>) {
  return (
    <Link
      href={href}
      className={`focus-ring inline-flex shrink-0 items-center justify-center rounded-[var(--radius-button)] text-[var(--accent)] hover:text-[var(--accent-hover)] sm:justify-start ${className}`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--secondary-bg-solid)] transition hover:bg-[var(--secondary-hover)] hover:border-[var(--accent)] sm:hidden">
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </span>
      <span className="sr-only sm:hidden">{label}</span>
      <span className="hidden text-xs font-medium sm:inline sm:text-sm">{label}</span>
    </Link>
  );
}
