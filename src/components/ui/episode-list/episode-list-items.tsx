"use client";

import Link from "next/link";
import type { EpisodeItem, EpisodeServer } from "@/types/movie-detail";

const POSTER_BASE = "https://phimimg.com";

const PlayIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" className={className}>
    <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
  </svg>
);

export const TvMonitorIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.3333 4.6665C15.3333 4.13584 15.1227 3.62717 14.7473 3.2525C14.3727 2.87717 13.864 2.6665 13.3333 2.6665C10.7787 2.6665 5.22132 2.6665 2.66666 2.6665C2.13599 2.6665 1.62732 2.87717 1.25266 3.2525C0.877322 3.62717 0.666656 4.13584 0.666656 4.6665V11.3332C0.666656 11.8638 0.877322 12.3725 1.25266 12.7472C1.62732 13.1225 2.13599 13.3332 2.66666 13.3332H13.3333C13.864 13.3332 14.3727 13.1225 14.7473 12.7472C15.1227 12.3725 15.3333 11.8638 15.3333 11.3332V4.6665ZM14 4.6665V11.3332C14 11.5098 13.93 11.6798 13.8047 11.8045C13.68 11.9298 13.51 11.9998 13.3333 11.9998H2.66666C2.48999 11.9998 2.31999 11.9298 2.19532 11.8045C2.06999 11.6798 1.99999 11.5098 1.99999 11.3332V4.6665C1.99999 4.48984 2.06999 4.31984 2.19532 4.19517C2.31999 4.06984 2.48999 3.99984 2.66666 3.99984H13.3333C13.51 3.99984 13.68 4.06984 13.8047 4.19517C13.93 4.31984 14 4.48984 14 4.6665ZM3.99999 10.6665H5.33332C5.70132 10.6665 5.99999 10.3678 5.99999 9.99984C5.99999 9.63184 5.70132 9.33317 5.33332 9.33317H3.99999C3.63199 9.33317 3.33332 9.63184 3.33332 9.99984C3.33332 10.3678 3.63199 10.6665 3.99999 10.6665ZM7.99999 10.6665H12C12.368 10.6665 12.6667 10.3678 12.6667 9.99984C12.6667 9.63184 12.368 9.33317 12 9.33317H7.99999C7.63199 9.33317 7.33332 9.63184 7.33332 9.99984C7.33332 10.3678 7.63199 10.6665 7.99999 10.6665ZM11.3333 7.99984H12C12.368 7.99984 12.6667 7.70117 12.6667 7.33317C12.6667 6.96517 12.368 6.6665 12 6.6665H11.3333C10.9653 6.6665 10.6667 6.96517 10.6667 7.33317C10.6667 7.70117 10.9653 7.99984 11.3333 7.99984ZM3.99999 7.99984H8.66666C9.03466 7.99984 9.33332 7.70117 9.33332 7.33317C9.33332 6.96517 9.03466 6.6665 8.66666 6.6665H3.99999C3.63199 6.6665 3.33332 6.96517 3.33332 7.33317C3.33332 7.70117 3.63199 7.99984 3.99999 7.99984Z"
      fill="currentColor"
    />
  </svg>
);

function buildThumbUrl(url: string | undefined): string | null {
  if (!url) return null;
  return url.startsWith("http") ? url : `${POSTER_BASE}/${url}`;
}

export interface EpisodeCardProps {
  readonly ep: EpisodeItem;
  /** Khi có: điều hướng /xem-phim/slug hoặc /xem-phim/slug/id-tap; khi không: mở link ngoài */
  readonly movieSlug?: string;
  /** true = phim full: chỉ /xem-phim/slug, không truyền tập */
  readonly fullOnly?: boolean;
  /** true = tập đang xem (highlight) */
  readonly isActive?: boolean;
}

export function EpisodeCard({ ep, movieSlug, fullOnly, isActive }: EpisodeCardProps) {
  const externalHref = ep.link_embed || ep.link_m3u8;
  let watchHref: string | null = null;
  if (movieSlug) {
    watchHref = fullOnly
      ? `/xem-phim/${encodeURIComponent(movieSlug)}`
      : `/xem-phim/${encodeURIComponent(movieSlug)}/${encodeURIComponent(ep.slug)}`;
  }

  const baseClass =
    "flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-[0.4rem] border px-1.5 no-underline transition";
  const className = isActive
    ? `${baseClass} border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]`
    : `${baseClass} border-[var(--border)] bg-[var(--secondary-bg-solid)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]`;

  if (watchHref) {
    return (
      <Link href={watchHref} className={className}>
        <span className="flex shrink-0 text-inherit">
          <PlayIcon className="h-2.5 w-2.5" />
        </span>
        <span className="truncate text-[11px] font-medium">{ep.name}</span>
      </Link>
    );
  }

  return (
    <a href={externalHref} target="_blank" rel="noopener noreferrer" className={className}>
      <span className="flex shrink-0 text-inherit">
        <PlayIcon className="h-2.5 w-2.5" />
      </span>
      <span className="truncate text-[11px] font-medium">{ep.name}</span>
    </a>
  );
}

export interface SingleMovieCardProps {
  readonly server: EpisodeServer;
  readonly posterUrl?: string;
  readonly movieName?: string;
  /** Khi có: Link nội bộ /xem-phim/slug hoặc /xem-phim/slug/id-tap */
  readonly movieSlug?: string;
  /** true = phim full (1 server 1 tập): chỉ /xem-phim/slug */
  readonly fullOnly?: boolean;
}

export function SingleMovieCard({ server, posterUrl, movieName, movieSlug, fullOnly }: SingleMovieCardProps) {
  const first = server.server_data?.[0];
  if (!first) return null;
  const externalHref = first.link_embed || first.link_m3u8;
  let watchHref: string | null = null;
  if (movieSlug) {
    watchHref = fullOnly
      ? `/xem-phim/${encodeURIComponent(movieSlug)}`
      : `/xem-phim/${encodeURIComponent(movieSlug)}/${encodeURIComponent(first.slug)}`;
  }
  const thumbSrc = buildThumbUrl(posterUrl);
  const title = movieName ?? first.name;

  const className =
    "flex overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--secondary-bg-solid)] text-[var(--foreground)] no-underline transition hover:border-[var(--accent)] hover:shadow-[var(--shadow-md)]";

  const content = (
    <>
      <div className="m-thumbnail aspect-[2/3] w-20 shrink-0 overflow-hidden bg-[var(--secondary-hover)] sm:w-24">
        {thumbSrc ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={thumbSrc}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <TvMonitorIcon className="h-8 w-8 text-[var(--foreground-muted)]" />
          </div>
        )}
      </div>
      <div className="info flex min-w-0 flex-1 flex-col justify-center gap-1.5 p-3">
        <div className="ver flex items-center gap-2">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center text-[var(--foreground-muted)]">
            <TvMonitorIcon className="h-5 w-5" />
          </span>
          <span className="truncate text-xs text-[var(--foreground-muted)]">
            {server.server_name}
          </span>
        </div>
        <div className="media-title line-clamp-2 text-[13px] font-medium text-[var(--foreground)]">
          {title}
        </div>
        <span className="inline-flex w-fit rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[11px] font-medium text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]">
          Xem bản này
        </span>
      </div>
    </>
  );

  if (watchHref) {
    return <Link href={watchHref} className={className}>{content}</Link>;
  }
  return (
    <a href={externalHref} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  );
}
