"use client";

import type { MovieDetailViewModel } from "../../interfaces/movie-detail-view.model";
import {
  MovieDetailWatchButton,
  movieDetailHasWatchAction,
} from "../../web/components/movie-detail-actions";
import { MovieDetailMetaTags } from "./movie-detail-meta-tags";
import { MovieDetailPoster } from "./movie-detail-poster";
import { MovieDetailTabs } from "./movie-detail-tabs";
import { MovieDetailTitleBlock } from "./movie-detail-title-block";

export interface MovieDetailMobileLayoutProps {
  readonly model: MovieDetailViewModel;
}

export function MovieDetailMobileLayout({
  model,
}: Readonly<MovieDetailMobileLayoutProps>) {
  const { movie, episodes, firstCategorySlug, timeDisplay, originNameDisplay, hasMetaTags } =
    model;

  const showWatchDock = movieDetailHasWatchAction(episodes, movie.slug);

  return (
    <>
      <div
        className={`flex min-w-0 flex-col gap-6 lg:hidden ${showWatchDock ? "pb-[calc(5.25rem+env(safe-area-inset-bottom,0px))]" : ""}`}
      >
        <div className="flex min-w-0 flex-col items-center gap-4">
          <MovieDetailPoster
            posterUrl={movie.poster_url}
            movieName={movie.name}
            className="w-full max-w-[140px]"
          />
          <div className="w-full min-w-0 text-center">
            <MovieDetailTitleBlock
              movie={movie}
              originNameDisplay={originNameDisplay}
              align="center"
            />
          </div>
          <MovieDetailMetaTags
            movie={movie}
            timeDisplay={timeDisplay}
            hasMetaTags={hasMetaTags}
          />
        </div>
        <div className="min-w-0">
          <MovieDetailTabs
            posterUrl={movie.poster_url}
            category={movie.category ?? []}
            country={movie.country ?? []}
            actor={movie.actor ?? []}
            director={movie.director ?? []}
            episodeCurrent={movie.episode_current}
            episodeTotal={movie.episode_total}
            status={movie.status}
            type={movie.type}
            content={movie.content}
            episodes={episodes}
            movieName={movie.name}
            movieSlug={movie.slug}
            currentSlug={movie.slug}
            categorySlug={firstCategorySlug}
            relatedLimit={12}
            originName={movie.origin_name}
            year={movie.year}
            quality={movie.quality}
            lang={movie.lang}
            timeDisplay={timeDisplay}
            imdbId={movie.imdb?.id}
            tmdbVoteAverage={movie.tmdb?.vote_average}
            view={movie.view}
            trailerUrl={movie.trailer_url}
          />
        </div>
      </div>

      {showWatchDock ? (
        <div
          className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-[var(--background)]/95 px-4 pt-3 shadow-[0_-8px_32px_rgba(0,0,0,0.14)] backdrop-blur-md supports-[backdrop-filter]:bg-[var(--glass-bg-solid)]/90 lg:hidden"
          style={{
            paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))",
          }}
        >
          <MovieDetailWatchButton
            episodes={episodes}
            movieSlug={movie.slug}
            className="shadow-[var(--shadow-md)]"
          />
        </div>
      ) : null}
    </>
  );
}
