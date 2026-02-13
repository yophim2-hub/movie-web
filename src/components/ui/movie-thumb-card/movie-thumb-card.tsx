"use client";

import { isPhimimgUrl, webpLoader } from "@/lib/image-loader";
import Image from "next/image";
import Link from "next/link";
import type { MovieListItem } from "@/types/movie-list";

const POSTER_BASE = "https://phimimg.com";

function buildImageUrl(url: string): string {
  return url.startsWith("http") ? url : `${POSTER_BASE}/${url}`;
}

export interface MovieThumbCardProps {
  item: MovieListItem;
  /** Base path for movie link, default "/phim" */
  basePath?: string;
  /** Pin badge: "Sắp chiếu" hoặc số tập. Nếu không truyền thì dùng episode_current */
  pinLabel?: string;
  className?: string;
}

/**
 * Item thumb phim (sw-cover single): v-thumbnail-hoz + h-item info.
 * Pin hiển thị pinLabel hoặc episode_current. Ảnh tỉ lệ 290x163.
 */
export function MovieThumbCard({
  item,
  basePath = "/phim",
  pinLabel,
  className = "",
}: Readonly<MovieThumbCardProps>) {
  const href = `${basePath}/${item.slug}`;
  const imgSrc = buildImageUrl(item.poster_url || item.thumb_url);
  const title = item.name;
  const alias = item.origin_name || "";
  const pin = pinLabel ?? item.episode_current ?? "";

  return (
    <div
      className={`sw-cover single flex shrink-0 flex-col overflow-hidden rounded-[var(--radius-panel)] ${className}`}
    >
      <Link
        href={href}
        className="v-thumbnail v-thumbnail-hoz group relative block bg-[var(--secondary-bg-solid)]"
      >
        {pin ? (
          <div className="pin-new absolute left-0 top-0 z-[1] flex items-center rounded-br-[var(--radius-button)] bg-[var(--accent)] px-2 py-1 text-[11px] font-semibold text-[var(--foreground)] shadow-[var(--shadow-sm)]">
            {pin}
          </div>
        ) : null}
        <div className="aspect-[290/163] relative w-full overflow-hidden">
          <Image
            src={imgSrc}
            alt={title}
            width={290}
            height={163}
            sizes="(max-width: 640px) 80vw, 290px"
            className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.03]"
            loader={isPhimimgUrl(imgSrc) ? webpLoader : undefined}
            unoptimized={!isPhimimgUrl(imgSrc)}
          />
        </div>
      </Link>
      <div className="h-item">
        <div className="info p-2">
          <h4 className="item-title lim-1">
            <Link
              href={href}
              title={title}
              className="block truncate text-[13px] font-medium text-[var(--foreground)] hover:text-[var(--accent)]"
            >
              {title}
            </Link>
          </h4>
          {alias ? (
            <h4 className="alias-title lim-1 mt-0.5">
              <Link
                href={href}
                title={alias}
                className="block truncate text-[12px] text-[var(--foreground-muted)] hover:text-[var(--accent)]"
              >
                {alias}
              </Link>
            </h4>
          ) : null}
        </div>
      </div>
    </div>
  );
}
