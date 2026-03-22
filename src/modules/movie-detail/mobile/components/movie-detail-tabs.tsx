"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { EpisodeServer } from "@/types/movie-detail";
import type { CategoryRef, CountryRef } from "@/types/movie-list";
import { MovieDetailTabEpisodes } from "./movie-detail-tab-episodes";
import { MovieDetailTabInfo } from "./movie-detail-tab-info";
import { MovieDetailTabRelated } from "./movie-detail-tab-related";

export interface MovieDetailTabsProps {
  readonly category: CategoryRef[];
  readonly country: CountryRef[];
  readonly actor: string[];
  readonly director: string[];
  readonly episodeCurrent?: string;
  readonly episodeTotal?: string;
  readonly status?: string;
  readonly type?: string;
  readonly content?: string | null;
  readonly posterUrl: string;
  readonly episodes: EpisodeServer[];
  readonly movieName?: string;
  readonly movieSlug?: string;
  readonly currentSlug: string;
  readonly categorySlug: string;
  readonly relatedLimit?: number;
  /** Các trường bổ sung (đồng bộ với sidebar web / API). */
  readonly originName?: string;
  readonly year?: number;
  readonly quality?: string;
  readonly lang?: string;
  readonly timeDisplay?: string;
  readonly imdbId?: string | null;
  readonly tmdbVoteAverage?: number | null;
  readonly view?: number;
  readonly trailerUrl?: string;
}

export function MovieDetailTabs({
  category,
  country,
  actor,
  director,
  episodeCurrent,
  episodeTotal,
  status,
  type,
  content,
  posterUrl,
  episodes,
  movieName,
  movieSlug,
  currentSlug,
  categorySlug,
  relatedLimit = 12,
  originName,
  year,
  quality,
  lang,
  timeDisplay,
  imdbId,
  tmdbVoteAverage,
  view,
  trailerUrl,
}: MovieDetailTabsProps) {
  return (
    <Tabs defaultValue="info" className="w-full min-w-0">
      <TabsList className="grid w-full min-w-0 grid-cols-3">
        <TabsTrigger value="info">Thông tin</TabsTrigger>
        <TabsTrigger value="episodes">Tập</TabsTrigger>
        <TabsTrigger value="related">Đề xuất</TabsTrigger>
      </TabsList>
      <MovieDetailTabInfo
        category={category}
        country={country}
        actor={actor}
        director={director}
        episodeCurrent={episodeCurrent}
        episodeTotal={episodeTotal}
        status={status}
        type={type}
        content={content}
        originName={originName}
        year={year}
        quality={quality}
        lang={lang}
        timeDisplay={timeDisplay}
        imdbId={imdbId}
        tmdbVoteAverage={tmdbVoteAverage}
        view={view}
        trailerUrl={trailerUrl}
      />
      <MovieDetailTabEpisodes
        posterUrl={posterUrl}
        episodes={episodes}
        movieName={movieName}
        movieSlug={movieSlug}
      />
      <MovieDetailTabRelated
        currentSlug={currentSlug}
        categorySlug={categorySlug}
        relatedLimit={relatedLimit}
      />
    </Tabs>
  );
}
