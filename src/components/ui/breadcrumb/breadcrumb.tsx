"use client";

import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: Readonly<BreadcrumbProps>) {
  return (
    <nav
      className={`flex flex-wrap items-center gap-x-2 text-sm text-[var(--foreground-muted)] ${className}`.trim()}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-x-2">
          {index > 0 && <span aria-hidden>/</span>}
          {item.href && index < items.length - 1 ? (
            <Link href={item.href} className="text-[var(--accent)] hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--foreground)]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
