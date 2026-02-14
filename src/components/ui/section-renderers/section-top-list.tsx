"use client";

import Link from "next/link";
import { MoviePosterCard } from "../movie-poster-card";
import type { MovieListItem } from "@/types/movie-list";

export interface SectionTopListProps {
  title: string;
  items: MovieListItem[];
  basePath?: string;
  className?: string;
  /** URL khi bấm "Xem thêm" */
  seeMoreHref?: string;
  seeMoreLabel?: string;
}

/** Section dạng top/bảng xếp hạng: poster có số thứ tự 1, 2, 3... */
export function SectionTopList({
  title,
  items,
  basePath = "/phim",
  className = "",
  seeMoreHref,
  seeMoreLabel = "Xem thêm",
}: Readonly<SectionTopListProps>) {
  if (items.length === 0) return null;
  return (
    <section className={`min-w-0 ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="min-w-0 shrink text-lg font-semibold text-[var(--foreground)]">
          {title}
        </h2>
        {seeMoreHref ? (
          <Link
            href={seeMoreHref}
            className="shrink-0 text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            {seeMoreLabel}
          </Link>
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((item, index) => (
          <div key={item._id} className="relative">
            <div className="absolute left-0 top-0 z-[1] flex h-10 w-10 items-center justify-center rounded-br-[var(--radius-button)] bg-[var(--accent)] text-lg font-bold text-white shadow-[var(--shadow-sm)]">
              {index + 1}
            </div>
            <MoviePosterCard item={item} basePath={basePath} />
          </div>
        ))}
      </div>
    </section>
  );
}
