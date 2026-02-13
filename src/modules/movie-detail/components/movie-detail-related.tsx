"use client";

import { useCategoryDetail } from "@/hooks";
import { MovieThumbCard } from "@/components/ui/movie-thumb-card";
import Link from "next/link";
import type { MovieListItem } from "@/types/movie-list";

const POSTER_BASE = "https://phimimg.com";

export type MovieDetailRelatedVariant = "grid" | "list";

export interface MovieDetailRelatedProps {
  /** Current movie slug to exclude from list */
  readonly currentSlug: string;
  /** Category slug to fetch related movies (e.g. first category of current movie) */
  readonly categorySlug: string;
  readonly limit?: number;
  /** "grid" = thẻ thumb grid, "list" = list dọc thumb + tên + thông số */
  readonly variant?: MovieDetailRelatedVariant;
}

function RelatedListRow({
  item,
  basePath = "/phim",
}: {
  readonly item: MovieListItem;
  readonly basePath?: string;
}) {
  const href = `${basePath}/${item.slug}`;
  const rawUrl = item.poster_url || item.thumb_url || "";
  let imgSrc = "";
  if (rawUrl) {
    imgSrc = rawUrl.startsWith("http") ? rawUrl : `${POSTER_BASE}/${rawUrl}`;
  }
  const meta = [item.year, item.episode_current, item.time, item.quality, item.lang].filter(Boolean).join(" · ");

  return (
    <Link
      href={href}
      className="flex gap-3 rounded-[var(--radius-button)] p-1.5 transition-colors hover:bg-[var(--secondary-bg-solid)]"
    >
      <div className="aspect-[2/3] w-14 shrink-0 overflow-hidden rounded-md bg-[var(--secondary-bg-solid)]">
        {imgSrc ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imgSrc}
            alt={item.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-[var(--foreground)]">{item.name}</p>
        {item.origin_name ? (
          <p className="mt-0.5 truncate text-[12px] text-[var(--foreground-muted)]">{item.origin_name}</p>
        ) : null}
        {meta ? (
          <p className="mt-1 text-[11px] text-[var(--foreground-muted)]">{meta}</p>
        ) : null}
      </div>
    </Link>
  );
}

export function MovieDetailRelated({
  currentSlug,
  categorySlug,
  limit = 12,
  variant = "grid",
}: MovieDetailRelatedProps) {
  const { data, isLoading } = useCategoryDetail(
    { categorySlug, page: 1, limit },
    { enabled: categorySlug.length > 0 }
  );

  const items = (data?.data?.items ?? []).filter((item) => item.slug !== currentSlug).slice(0, limit);

  if (!categorySlug) return null;
  if (isLoading) {
    return (
      <section aria-label="Phim liên quan">
        <h3 className="mb-3 text-[14px] font-semibold text-[var(--foreground)]">
          Phim liên quan
        </h3>
        {variant === "grid" ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={`skeleton-grid-${i}`}
                className="aspect-[290/163] animate-pulse rounded-[var(--radius-panel)] bg-[var(--secondary-bg-solid)]"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={`skeleton-list-${i}`} className="flex gap-3 p-1.5">
                <div className="aspect-[2/3] w-14 shrink-0 animate-pulse rounded-md bg-[var(--secondary-bg-solid)]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 animate-pulse rounded bg-[var(--secondary-bg-solid)]" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-[var(--secondary-bg-solid)]" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  }
  if (items.length === 0) return null;

  return (
    <section aria-label="Phim liên quan" className="min-w-0">
      <h3 className="mb-3 text-[14px] font-semibold text-[var(--foreground)]">
        Phim liên quan
      </h3>
      {variant === "grid" ? (
        <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <MovieThumbCard key={item._id} item={item} basePath="/phim" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-0.5">
          {items.map((item) => (
            <RelatedListRow key={item._id} item={item} basePath="/phim" />
          ))}
        </div>
      )}
    </section>
  );
}
