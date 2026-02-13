"use client";

import Link from "next/link";
import type { CategoryRef, CountryRef } from "@/types/movie-list";

interface MovieDetailMetaProps {
  content?: string;
  category?: CategoryRef[];
  country?: CountryRef[];
}

export function MovieDetailMeta({
  content,
  category = [],
  country = [],
}: MovieDetailMetaProps) {
  return (
    <div className="min-w-0 flex-1">
      {content && (
        <div
          className="prose prose-sm max-w-none text-[var(--foreground-muted)]"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
      {category.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {category.map((c) => (
            <Link
              key={c.id}
              href={`/the-loai/${c.slug}`}
              className="rounded-[var(--radius-button)] bg-[var(--secondary-bg-solid)] px-2.5 py-1 text-[12px] text-[var(--foreground)] hover:bg-[var(--secondary-hover)]"
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}
      {country.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {country.map((c) => (
            <Link
              key={c.id}
              href={`/quoc-gia/${c.slug}`}
              className="rounded-[var(--radius-button)] bg-[var(--secondary-bg-solid)] px-2.5 py-1 text-[12px] text-[var(--foreground)] hover:bg-[var(--secondary-hover)]"
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
