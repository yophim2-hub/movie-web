"use client";

import type { ReactNode } from "react";
import { PageLayout } from "@/components/layout";
import { EpisodeList } from "@/components/ui/episode-list";
import type { EpisodeItem, EpisodeServer } from "@/types/movie-detail";
import type { WatchContentMovie } from "../../interfaces/watch-content.model";
import { watchEpisodesFullOnly } from "../../services";
import { WatchMovieInfoBlock } from "./watch-movie-info-block";

export interface WatchMobileStackLayoutProps {
  readonly breadcrumb: ReactNode;
  readonly playerBlock: ReactNode;
  readonly movie: WatchContentMovie;
  readonly slug: string;
  readonly episode: EpisodeItem | null;
  readonly episodes: EpisodeServer[];
  /** Tuỳ chọn (vd. WatchFullPage): thẻ tóm tắt thay cho block thông tin đầy đủ */
  readonly movieInfoSlot?: ReactNode;
}

/**
 * Layout stack: video → thông tin → danh sách tập (dùng chung mọi breakpoint khi `layout="stack"`).
 */
export function WatchMobileStackLayout({
  breadcrumb,
  playerBlock,
  movie,
  slug,
  episode,
  episodes,
  movieInfoSlot,
}: Readonly<WatchMobileStackLayoutProps>) {
  const fullOnly = watchEpisodesFullOnly(episodes);
  const defaultInfo = <WatchMovieInfoBlock movie={movie} slug={slug} />;

  const episodeListBlock = episodes.length > 0 && (
    <div className="mt-8">
      <EpisodeList
        episodes={episodes}
        variant="watch"
        title="Danh sách tập"
        posterUrl={movie.poster_url}
        movieName={movie.name}
        movieSlug={slug}
        fullOnly={fullOnly}
        activeEpisodeSlug={episode?.slug}
        plain
      />
    </div>
  );

  return (
    <div className="pb-24">
      <PageLayout className="py-4">
        {breadcrumb}
        {playerBlock}
        {movieInfoSlot ?? defaultInfo}
        {episodeListBlock}
      </PageLayout>
    </div>
  );
}
