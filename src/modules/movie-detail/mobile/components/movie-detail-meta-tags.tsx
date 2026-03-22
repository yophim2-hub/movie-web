"use client";

import type { MovieDetail } from "@/types/movie-detail";

const tagBase =
  "rounded-[var(--radius-button)] px-2 py-1 text-[11px] font-medium";

export interface MovieDetailMetaTagsProps {
  readonly movie: Pick<
    MovieDetail,
    "imdb" | "tmdb" | "quality" | "year" | "episode_current" | "lang"
  >;
  readonly timeDisplay: string;
  readonly hasMetaTags: boolean;
}

export function MovieDetailMetaTags({
  movie,
  timeDisplay,
  hasMetaTags,
}: Readonly<MovieDetailMetaTagsProps>) {
  if (!hasMetaTags) return null;
  return (
    <ul className="m-0 flex list-none flex-wrap justify-center gap-[0.6rem] border-t border-[var(--border)] p-0 pt-4">
      {movie.imdb?.id ? (
        <li
          className={`${tagBase} bg-amber-500/20 text-amber-700 dark:text-amber-400`}
        >
          IMDB
        </li>
      ) : null}
      {movie.tmdb?.vote_average != null && movie.tmdb.vote_average > 0 ? (
        <li
          className={`${tagBase} bg-[var(--secondary-bg-solid)] text-[var(--foreground)]`}
        >
          {movie.tmdb.vote_average.toFixed(1)}
        </li>
      ) : null}
      {movie.quality ? (
        <li
          className={`${tagBase} border border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]`}
        >
          {movie.quality}
        </li>
      ) : null}
      {movie.year != null && movie.year > 0 ? (
        <li
          className={`${tagBase} bg-[var(--secondary-bg-solid)] text-[var(--foreground-muted)]`}
        >
          {movie.year}
        </li>
      ) : null}
      {movie.episode_current ? (
        <li
          className={`${tagBase} bg-[var(--secondary-bg-solid)] text-[var(--foreground-muted)]`}
        >
          {movie.episode_current}
        </li>
      ) : null}
      {timeDisplay ? (
        <li
          className={`${tagBase} bg-[var(--secondary-bg-solid)] text-[var(--foreground-muted)]`}
        >
          {timeDisplay}
        </li>
      ) : null}
      {movie.lang ? (
        <li
          className={`${tagBase} bg-[var(--secondary-bg-solid)] text-[var(--foreground-muted)]`}
        >
          {movie.lang}
        </li>
      ) : null}
    </ul>
  );
}
