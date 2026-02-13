"use client";

const POSTER_BASE = "https://phimimg.com";

interface MovieDetailPosterProps {
  posterUrl: string;
  /** Dùng cho variant compact (vd: max-w-[140px]) */
  className?: string;
}

export function MovieDetailPoster({
  posterUrl,
  className = "",
}: Readonly<MovieDetailPosterProps>) {
  const src =
    posterUrl.startsWith("http") ? posterUrl : `${POSTER_BASE}/${posterUrl}`;

  return (
    <div className={`shrink-0 ${className}`.trim()}>
      <div className="aspect-[2/3] w-full max-w-[280px] overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--secondary-bg-solid)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
