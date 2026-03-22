"use client";

import type { MovieDetailViewModel } from "../../interfaces/movie-detail-view.model";
import { MovieDetailActions } from "./movie-detail-actions";
import { MovieDetailRelated } from "./movie-detail-related";
import { MovieDetailSidebar } from "./movie-detail-sidebar";
import { MovieDetailTitleBlock } from "./movie-detail-title-block";

export interface MovieDetailWebLayoutProps {
  readonly model: MovieDetailViewModel;
}

export function MovieDetailWebLayout({
  model,
}: Readonly<MovieDetailWebLayoutProps>) {
  const { movie, episodes, firstCategorySlug, timeDisplay, originNameDisplay } =
    model;

  return (
    <div className="hidden grid-cols-1 gap-8 lg:grid lg:grid-cols-[minmax(0,280px)_1fr]">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <MovieDetailSidebar
          posterUrl={movie.poster_url}
          category={movie.category ?? []}
          country={movie.country ?? []}
          actor={movie.actor ?? []}
          director={movie.director ?? []}
          imdbId={movie.imdb?.id}
          tmdbVoteAverage={movie.tmdb?.vote_average}
          quality={movie.quality}
          year={movie.year}
          episodeCurrent={movie.episode_current}
          episodeTotal={movie.episode_total}
          timeDisplay={timeDisplay}
          lang={movie.lang}
          status={movie.status}
          type={movie.type}
        />
      </div>
      <div className="flex min-w-0 flex-col gap-8">
        <MovieDetailTitleBlock
          movie={movie}
          originNameDisplay={originNameDisplay}
          align="start"
        />
        {movie.content ? (
          <section>
            <h2 className="mb-2 text-[14px] font-semibold text-[var(--foreground)]">
              Nội dung phim
            </h2>
            <div
              className="prose prose-sm max-w-none text-[13px] text-[var(--foreground-muted)] prose-p:my-1.5 prose-a:text-[var(--accent)]"
              dangerouslySetInnerHTML={{ __html: movie.content }}
            />
          </section>
        ) : null}
        <MovieDetailActions
          episodes={episodes}
          posterUrl={movie.poster_url}
          movieName={movie.name}
          movieSlug={movie.slug}
        />
        <MovieDetailRelated
          currentSlug={movie.slug}
          categorySlug={firstCategorySlug}
          limit={12}
        />
      </div>
    </div>
  );
}
