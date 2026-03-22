"use client";

import { PageLayout } from "@/components/layout";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { VideoPlayer } from "@/components/ui/video-player";
import { useWatchHistory } from "@/store/watch-history";
import { useMemo } from "react";
import type { WatchContentProps } from "../interfaces/watch-content.model";
import {
  WatchMobileSplitColumn,
  WatchMobileStackLayout,
  WatchMovieInfoBlock,
} from "../mobile/components";
import { watchEpisodesFullOnly } from "../services";
import { WatchWebSidebarColumn } from "../web/components";

export function WatchContent({
  movie,
  episode,
  episodes,
  slug,
  streamUrl,
  isEmbed,
  layout = "split",
  movieInfo,
}: WatchContentProps) {
  const fullOnly = watchEpisodesFullOnly(episodes);
  const { getProgress, addOrUpdateWatchProgress } = useWatchHistory();

  let posterUrl: string | undefined;
  if (movie.poster_url?.startsWith("http")) {
    posterUrl = movie.poster_url;
  } else if (movie.poster_url) {
    posterUrl = `https://phimimg.com/${movie.poster_url}`;
  } else {
    posterUrl = undefined;
  }

  const savedProgress = useMemo(
    () => getProgress(slug, episode?.slug),
    [getProgress, slug, episode?.slug]
  );
  const initialTime = savedProgress?.progressSeconds ?? 0;

  const handleTimeUpdate = useMemo(
    () =>
      isEmbed
        ? undefined
        : (currentTime: number, duration: number) => {
            addOrUpdateWatchProgress({
              movieSlug: slug,
              movieName: movie.name,
              posterUrl: posterUrl ?? undefined,
              episodeSlug: episode?.slug,
              episodeName: episode?.name,
              progressSeconds: Math.floor(currentTime),
              durationSeconds: Number.isFinite(duration) ? Math.floor(duration) : undefined,
              updatedAt: new Date().toISOString(),
            });
          },
    [
      isEmbed,
      addOrUpdateWatchProgress,
      slug,
      movie.name,
      posterUrl,
      episode?.slug,
      episode?.name,
    ]
  );

  const playerBlock = (
    <div className="overflow-hidden rounded-none bg-black lg:rounded-[var(--radius-panel)]">
      {isEmbed ? (
        <iframe
          src={streamUrl}
          title="Xem phim"
          className="aspect-video w-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      ) : (
        <VideoPlayer
          m3u8Url={streamUrl}
          poster={posterUrl}
          className="aspect-video"
          initialTime={initialTime}
          onTimeUpdate={handleTimeUpdate}
        />
      )}
    </div>
  );

  const firstCategory = movie.category?.[0];
  const breadcrumb = (
    <Breadcrumb
      items={[
        { label: "Trang chủ", href: "/" },
        ...(firstCategory
          ? [{ label: firstCategory.name, href: `/the-loai/${firstCategory.slug}` }]
          : []),
        { label: movie.name, href: `/phim/${slug}` },
        ...(episode ? [{ label: episode.name }] : []),
      ]}
      className="mb-4 hidden lg:flex"
    />
  );

  if (layout === "split") {
    return (
      <div className="flex flex-col pb-24">
        <PageLayout className="py-4">
          {breadcrumb}
          <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
            <div className="min-w-0">
              <div className="sticky top-0 z-30 bg-[var(--background)] lg:static">{playerBlock}</div>
            </div>
            <div className="min-w-0 lg:relative">
              <WatchMobileSplitColumn
                movie={movie}
                slug={slug}
                episode={episode}
                episodes={episodes}
              />
              <WatchWebSidebarColumn
                name={movie.name}
                episodes={episodes}
                movieSlug={slug}
                fullOnly={fullOnly}
                posterUrl={movie.poster_url}
                categorySlug={movie.category?.[0]?.slug ?? ""}
                activeEpisodeSlug={episode?.slug}
              />
            </div>
          </div>
          <div className="mt-6 hidden lg:block lg:max-w-[70%]">
            <WatchMovieInfoBlock movie={movie} slug={slug} />
          </div>
        </PageLayout>
      </div>
    );
  }

  return (
    <WatchMobileStackLayout
      breadcrumb={breadcrumb}
      playerBlock={playerBlock}
      movie={movie}
      slug={slug}
      episode={episode}
      episodes={episodes}
      movieInfoSlot={movieInfo}
    />
  );
}
