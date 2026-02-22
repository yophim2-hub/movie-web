"use client";

import Image from "next/image";
import Link from "next/link";
import type { MovieListItem } from "@/types/movie-list";

const POSTER_BASE = "https://phimimg.com";

/** Bỏ phần trong ngoặc ở cuối (vd. " (Season 1)", " (Part 2)") để tên gốc gọn hơn. */
export function formatOriginName(originName: string | undefined): string {
  if (!originName?.trim()) return "";
  return originName
    .replaceAll(/\s*(?:\([^)]*\)\s*)+$/g, "")
    .trim();
}

function buildImageUrl(url: string): string {
  return url.startsWith("http") ? url : `${POSTER_BASE}/${url}`;
}

export interface MoviePosterCardProps {
  item: MovieListItem;
  /** Base path for movie link, default "/phim" */
  basePath?: string;
  className?: string;
}

/**
 * Item poster phim: ảnh poster (dọc 2:3) + pin + info (item-title + alias-title lim-1).
 */
export function MoviePosterCard({
  item,
  basePath = "/phim",
  className = "",
}: Readonly<MoviePosterCardProps>) {
  const href = `${basePath}/${item.slug}`;
  const posterSrc = item.poster_url
    ? buildImageUrl(item.poster_url)
    : buildImageUrl(item.thumb_url);
  const title = item.name;
  const alias = formatOriginName(item.origin_name);
  const episode = item.episode_current || "";

  return (
    <div
      className={`sw-item relative flex w-full flex-col gap-3 ${className}`}
    >
      <Link href={href} className="v-thumbnail relative block">
        {/* Pin badge: "Full" / số tập — vàng, góc trái trên */}
        {episode ? (
          <div className="pin-new m-pin-new absolute left-0 top-0 z-[1] flex items-center rounded-br-[var(--radius-button)] bg-[var(--accent)] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white shadow-[var(--shadow-sm)] sm:px-2 sm:py-1 sm:text-[11px]">
            <strong>{episode}</strong>
          </div>
        ) : null}
        <div className="aspect-[2/3] relative w-full overflow-hidden rounded-[var(--radius-button)] border border-[var(--border)]">
          <Image
            src={posterSrc}
            alt={title}
            width={200}
            height={300}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
            className="h-full w-full object-cover"
          />
        </div>
      </Link>
      <div className="info min-w-0 space-y-0.5">
        <h4 className="item-title lim-1 min-w-0 text-[12px] font-medium leading-tight sm:text-[13px]">
          <Link
            href={href}
            title={title}
            className="block truncate text-[var(--foreground)] hover:text-[var(--accent)]"
          >
            {title}
          </Link>
        </h4>
        <h4 className="alias-title lim-1 min-w-0 text-[11px] leading-tight text-[var(--accent)] sm:text-[12px]">
          <Link
            href={href}
            title={alias}
            className="block truncate hover:text-[var(--accent-hover)]"
          >
            {alias || "\u00A0"}
          </Link>
        </h4>
      </div>
    </div>
  );
}
