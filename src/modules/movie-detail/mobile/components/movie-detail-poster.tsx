"use client";

const POSTER_BASE = "https://phimimg.com";

interface MovieDetailPosterProps {
  posterUrl: string;
  movieName?: string;
  className?: string;
}

export function MovieDetailPoster({
  posterUrl,
  movieName,
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
          alt={movieName ? `Poster phim ${movieName}` : "Poster phim"}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
