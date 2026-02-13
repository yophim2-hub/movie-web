"use client";

import { EpisodeList } from "@/components/ui/episode-list";
import type { EpisodeItem, EpisodeServer } from "@/types/movie-detail";
import Link from "next/link";

const watchButtonClass =
  "inline-flex w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] px-4 py-3 text-[14px] font-semibold text-[var(--primary-button-text,var(--foreground))] no-underline transition hover:opacity-90 sm:w-auto";

export interface MovieDetailWatchButtonProps {
  readonly episodes: EpisodeServer[];
  readonly movieSlug?: string;
}

/** Nút Xem phim: dùng trên mobile (trên tab) và trong MovieDetailActions */
export function MovieDetailWatchButton({
  episodes,
  movieSlug,
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

  if (watchHref) {
    return (
      <Link href={watchHref} className={watchButtonClass}>
        Xem phim
      </Link>
    );
  }
  return (
    <a
      href={externalWatchUrl ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={watchButtonClass}
    >
      Xem phim
    </a>
  );
}

export interface MovieDetailActionsProps {
  readonly episodes: EpisodeServer[];
  readonly posterUrl?: string;
  readonly movieName?: string;
  /** Slug phim: dùng cho nút Xem phim và EpisodeList (điều hướng /xem-phim/slug/id-tap) */
  readonly movieSlug?: string;
}

export function MovieDetailActions({ episodes, posterUrl, movieName, movieSlug }: MovieDetailActionsProps) {
  const fullOnly = episodes.length === 1 && (episodes[0].server_data?.length ?? 0) === 1;

  return (
    <section className="flex min-w-0 flex-col gap-6" aria-label="Xem phim và danh sách tập">
      {/* Ẩn trên mobile: trang chi tiết đã có nút Xem phim phía trên tab */}
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
      />
    </section>
  );
}
