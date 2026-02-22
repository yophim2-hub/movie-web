"use client";

import Image from "next/image";
import Link from "next/link";
import type { MovieListItem } from "@/types/movie-list";

const POSTER_BASE = "https://phimimg.com";

function buildImageUrl(url: string): string {
  return url.startsWith("http") ? url : `${POSTER_BASE}/${url}`;
}

export interface MovieCoverCardProps {
  item: MovieListItem;
  /** Base path for movie link, default "/phim" */
  basePath?: string;
  /** Pin badge trên ảnh ngang, e.g. "P.Đề" */
  pinLabel?: string;
  className?: string;
}

/**
 * Card sw-cover: ảnh ngang lớn (v-thumbnail-hoz) + h-item (thumb dọc nhỏ + info + info-line tags).
 * Hiển thị cả 2 phần: banner ngang và row thumb + title + alias + quality/year/time.
 */
export function MovieCoverCard({
  item,
  basePath = "/phim",
  pinLabel,
  className = "",
}: Readonly<MovieCoverCardProps>) {
  const href = `${basePath}/${item.slug}`;
  const posterSrc = buildImageUrl(item.poster_url || item.thumb_url);
  const thumbSrc = buildImageUrl(item.thumb_url || item.poster_url);
  const title = item.name;
  const alias = item.origin_name || "";
  const pin = pinLabel ?? item.episode_current ?? "";
  const quality = item.quality || "";
  const year = item.year;
  const time = item.time || "";

  return (
    <div
      className={`sw-cover flex shrink-0 flex-col overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--secondary-bg-solid)] ${className}`}
    >
      {/* Ảnh ngang lớn + pin */}
      <Link
        href={href}
        className="v-thumbnail v-thumbnail-hoz group relative block bg-[var(--secondary-bg-solid)]"
      >
        {pin ? (
          <div className="pin-new m-pin-new absolute left-0 top-0 z-[1] flex items-center rounded-br-[var(--radius-button)] bg-[var(--accent)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--foreground)] shadow-[var(--shadow-sm)] sm:px-2 sm:py-1 sm:text-[11px]">
            {pin}
          </div>
        ) : null}
        <div className="aspect-[365/164] relative w-full overflow-hidden">
          <Image
            src={posterSrc}
            alt={title}
            width={365}
            height={164}
            sizes="(max-width: 640px) 90vw, 365px"
            className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.03]"
          />
        </div>
      </Link>

      {/* h-item: thumb dọc nhỏ + info */}
      <div className="h-item flex gap-3 p-2">
        <div className="v-thumb-m shrink-0">
          <Link href={href} className="v-thumbnail block overflow-hidden rounded-[var(--radius-button)] bg-[var(--secondary-bg-solid)]">
            <div className="aspect-[80/120] relative w-[80px] overflow-hidden">
              <Image
                src={thumbSrc}
                alt={title}
                width={80}
                height={120}
                sizes="80px"
                className="h-full w-full object-cover transition duration-200 hover:scale-[1.03]"
              />
            </div>
          </Link>
        </div>
        <div className="info min-w-0 flex-1">
          <h4 className="item-title lim-1">
            <Link
              href={href}
              title={title}
              className="block truncate text-[12px] font-medium text-[var(--foreground)] hover:text-[var(--accent)] sm:text-[13px]"
            >
              {title}
            </Link>
          </h4>
          {alias ? (
            <h4 className="alias-title lim-1 mb-1 mt-0.5">
              <Link
                href={href}
                title={alias}
                className="block truncate text-[11px] text-[var(--foreground-muted)] hover:text-[var(--accent)] sm:text-[12px]"
              >
                {alias}
              </Link>
            </h4>
          ) : null}
          <div className="info-line flex flex-wrap gap-2">
            {quality ? (
              <span className="tag-small text-[11px] font-semibold text-[var(--foreground-subtle)]">
                {quality}
              </span>
            ) : null}
            {year ? (
              <span className="tag-small text-[11px] text-[var(--foreground-subtle)]">
                {year}
              </span>
            ) : null}
            {time ? (
              <span className="tag-small text-[11px] text-[var(--foreground-subtle)]">
                {time}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
