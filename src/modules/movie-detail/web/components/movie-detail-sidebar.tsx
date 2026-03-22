"use client";

import { MovieStatusBlock } from "@/components/ui/movie-status-block";
import { formatMovieType } from "@/lib/movie-labels";
import Link from "next/link";
import type { CategoryRef, CountryRef } from "@/types/movie-list";
import { MovieDetailPoster } from "./movie-detail-poster";

export interface MovieDetailSidebarProps {
  readonly posterUrl: string;
  readonly category: CategoryRef[];
  readonly country: CountryRef[];
  readonly actor: string[];
  readonly director: string[];
  readonly imdbId?: string | null;
  readonly tmdbVoteAverage?: number | null;
  readonly quality?: string;
  readonly year?: number;
  readonly episodeCurrent?: string;
  readonly episodeTotal?: string;
  readonly timeDisplay?: string;
  readonly lang?: string;
  readonly status?: string;
  readonly type?: string;
  readonly variant?: "full" | "compact";
}

const tagBase =
  "rounded-[var(--radius-button)] px-2 py-1 text-[11px] font-medium";

export function MovieDetailSidebar({
  posterUrl,
  category,
  country,
  actor,
  director,
  imdbId,
  tmdbVoteAverage,
  quality,
  year,
  episodeCurrent,
  episodeTotal,
  timeDisplay,
  lang,
  status,
  type,
  variant = "full",
}: MovieDetailSidebarProps) {
  const isCompact = variant === "compact";
  const hasTags =
    imdbId ||
    (tmdbVoteAverage != null && tmdbVoteAverage > 0) ||
    quality ||
    year ||
    episodeCurrent ||
    timeDisplay ||
    lang;

  return (
    <aside
      className={`flex flex-col gap-6 ${isCompact ? "items-center text-center" : ""}`}
    >
      <MovieDetailPoster
        posterUrl={posterUrl}
        className={isCompact ? "mx-auto max-w-[140px]" : undefined}
      />
      {hasTags && (
        <ul
          className={`mb-3 flex flex-wrap list-none gap-[0.6rem] p-0 m-0 ${isCompact ? "justify-center" : "justify-start"}`}
        >
          {imdbId && (
            <li className={`${tagBase} bg-amber-500/20 text-amber-700 dark:text-amber-400`}>
              <span>IMDB</span>
            </li>
          )}
          {tmdbVoteAverage != null && tmdbVoteAverage > 0 && (
            <li className={`${tagBase} bg-[var(--secondary-bg-solid)] text-[var(--foreground)]`}>
              <span>{tmdbVoteAverage.toFixed(1)}</span>
            </li>
          )}
          {quality && (
            <li className={`${tagBase} border border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]`}>
              <span>{quality}</span>
            </li>
          )}
          {year != null && year > 0 && (
            <li className={`${tagBase} bg-[var(--secondary-bg-solid)] text-[var(--foreground-muted)]`}>
              <span>{year}</span>
            </li>
          )}
          {episodeCurrent && (
            <li className={`${tagBase} bg-[var(--secondary-bg-solid)] text-[var(--foreground-muted)]`}>
              <span>{episodeCurrent}</span>
            </li>
          )}
          {timeDisplay && (
            <li className={`${tagBase} bg-[var(--secondary-bg-solid)] text-[var(--foreground-muted)]`}>
              <span>{timeDisplay}</span>
            </li>
          )}
          {lang && (
            <li className={`${tagBase} bg-[var(--secondary-bg-solid)] text-[var(--foreground-muted)]`}>
              <span>{lang}</span>
            </li>
          )}
        </ul>
      )}
      {(status != null || episodeCurrent != null || episodeTotal != null) && (
        <MovieStatusBlock
          status={status ?? "ongoing"}
          episodeCurrent={episodeCurrent}
          episodeTotal={episodeTotal}
        />
      )}
      {type != null && type !== "" && (
        <div
          className={`flex flex-nowrap items-baseline gap-2 ${isCompact ? "justify-center" : ""}`}
        >
          <span className="shrink-0 text-[12px] font-medium text-[var(--foreground-muted)]">Loại phim:</span>
          <span className="min-w-0 truncate text-[12px] text-[var(--foreground)]">{formatMovieType(type)}</span>
        </div>
      )}
      {!isCompact && category.length > 0 && (
        <div>
          <span className="text-[12px] font-medium text-[var(--foreground-muted)]">Thể loại: </span>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {category
              .filter((c, i, arr) => arr.findIndex((x) => x.slug === c.slug) === i)
              .map((c) => (
              <Link
                key={c.slug}
                href={`/the-loai/${c.slug}`}
                className="rounded-[var(--radius-button)] bg-[var(--secondary-bg-solid)] px-2 py-1 text-[12px] text-[var(--foreground)] hover:bg-[var(--secondary-hover)]"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
      {!isCompact && country.length > 0 && (
        <div>
          <span className="text-[12px] font-medium text-[var(--foreground-muted)]">Quốc gia: </span>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {country
              .filter((c, i, arr) => arr.findIndex((x) => x.slug === c.slug) === i)
              .map((c) => (
              <Link
                key={c.slug}
                href={`/quoc-gia/${c.slug}`}
                className="rounded-[var(--radius-button)] bg-[var(--secondary-bg-solid)] px-2 py-1 text-[12px] text-[var(--foreground)] hover:bg-[var(--secondary-hover)]"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
      {!isCompact && director.length > 0 && (
        <div>
          <span className="text-[12px] font-medium text-[var(--foreground-muted)]">Đạo diễn: </span>
          <span className="text-[12px] text-[var(--foreground)]">{director.join(", ")}</span>
        </div>
      )}
      {!isCompact && actor.length > 0 && (
        <div>
          <span className="text-[12px] font-medium text-[var(--foreground-muted)]">Diễn viên: </span>
          <p className="mt-0.5 text-[12px] text-[var(--foreground)] line-clamp-4">
            {actor.join(", ")}
          </p>
        </div>
      )}
    </aside>
  );
}
