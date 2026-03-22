"use client";

import { EpisodeList } from "@/components/ui/episode-list";
import type { EpisodeItem, EpisodeServer } from "@/types/movie-detail";
import Link from "next/link";

const watchButtonClass =
  "inline-flex w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] px-4 py-3 text-[14px] font-semibold text-[var(--primary-button-text,var(--foreground))] no-underline transition hover:opacity-90 sm:w-auto";

/** Cùng điều kiện hiển thị với `MovieDetailWatchButton` (dock mobile, v.v.). */
export function movieDetailHasWatchAction(
  episodes: EpisodeServer[],
  movieSlug?: string,
): boolean {
  const firstEpisode: EpisodeItem | undefined = episodes[0]?.server_data?.[0];
  if (!firstEpisode) return false;
  if (movieSlug) return true;
  return Boolean(firstEpisode.link_embed || firstEpisode.link_m3u8);
}

export interface MovieDetailWatchButtonProps {
  readonly episodes: EpisodeServer[];
  readonly movieSlug?: string;
  readonly className?: string;
}

export function MovieDetailWatchButton({
  episodes,
  movieSlug,
  className = "",
}: Readonly<MovieDetailWatchButtonProps>) {
  const firstEpisode: EpisodeItem | undefined = episodes[0]?.server_data?.[0];
  const fullOnly = episodes.length === 1 && (episodes[0].server_data?.length ?? 0) === 1;
  let watchHref: string | null = null;
  if (movieSlug && firstEpisode) {
    watchHref = fullOnly
      ? `/xem-phim/${encodeURIComponent(movieSlug)}`
      : `/xem-phim/${encodeURIComponent(movieSlug)}/${encodeURIComponent(firstEpisode.slug)}`;
  }
  const externalWatchUrl = firstEpisode?.link_embed ?? firstEpisode?.link_m3u8 ?? null;

  if (!watchHref && !externalWatchUrl) return null;

  const cls = [watchButtonClass, className].filter(Boolean).join(" ");

  if (watchHref) {
    return (
      <Link href={watchHref} className={cls}>
        Xem phim
      </Link>
    );
  }
  return (
    <a
      href={externalWatchUrl ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={cls}
    >
      Xem phim
    </a>
  );
}

export interface MovieDetailActionsProps {
  readonly episodes: EpisodeServer[];
  readonly posterUrl?: string;
  readonly movieName?: string;
  readonly movieSlug?: string;
  /** Tab Tập mobile: danh sách không panel nền, không tiêu đề. */
  readonly plainEpisodeList?: boolean;
}

export function MovieDetailActions({
  episodes,
  posterUrl,
  movieName,
  movieSlug,
  plainEpisodeList = false,
}: MovieDetailActionsProps) {
  const fullOnly = episodes.length === 1 && (episodes[0].server_data?.length ?? 0) === 1;

  return (
    <section className="flex min-w-0 flex-col gap-6" aria-label="Xem phim và danh sách tập">
      <div className="hidden lg:block">
        <MovieDetailWatchButton episodes={episodes} movieSlug={movieSlug} />
      </div>
      <EpisodeList
        episodes={episodes}
        variant="grid"
        defaultVisibleCount={12}
        posterUrl={posterUrl}
        movieName={movieName}
        movieSlug={movieSlug}
        fullOnly={fullOnly}
        plain={plainEpisodeList}
      />
    </section>
  );
}
