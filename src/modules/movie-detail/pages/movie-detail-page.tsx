"use client";

import { PageLayout } from "@/components/layout";
import { MovieDetailMobileLayout } from "../mobile/components/movie-detail-mobile-layout";
import { useMovieDetailScreen } from "../services";
import { MovieDetailWebLayout } from "../web/components/movie-detail-web-layout";
import { MovieDetailHero } from "./movie-detail-hero";
import { MovieDetailNotFound } from "./movie-detail-not-found";
import { MovieDetailSkeleton } from "./movie-detail-skeleton";

export default function MovieDetailPage() {
  const screen = useMovieDetailScreen();

  if (screen.status === "loading") {
    return <MovieDetailSkeleton />;
  }

  if (screen.status === "not-found") {
    return <MovieDetailNotFound />;
  }

  const { model } = screen;
  const imageUrl = model.movie.thumb_url || model.movie.poster_url;

  return (
    <div className="content-fade-in min-w-0 overflow-x-hidden pb-24">
      <MovieDetailHero imageUrl={imageUrl} />
      <PageLayout className="relative z-[2] min-w-0 -mt-[14.3%] rounded-t-2xl pt-6 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
        <MovieDetailMobileLayout model={model} />
        <MovieDetailWebLayout model={model} />
      </PageLayout>
    </div>
  );
}
