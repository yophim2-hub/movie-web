"use client";

import { EpisodeList } from "@/components/ui/episode-list";
import { PageLayout } from "@/components/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoPlayer } from "@/components/ui/video-player";
import { MovieDetailRelated } from "@/modules/movie-detail";
import { useWatchHistory } from "@/store/watch-history";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useMemo } from "react";
import type { EpisodeItem, EpisodeServer } from "@/types/movie-detail";
import type { CategoryRef, CountryRef } from "@/types/movie-list";
import { MovieStatusBlock } from "@/components/ui/movie-status-block";
import { formatMovieType } from "@/lib/movie-labels";
import { WatchSidebar } from "./watch-sidebar";

/** "104 phút" -> "1 giờ 44 phút" (giống movie-detail) */
function formatTimeToHoursMinutes(timeStr: string): string {
  const match = /(\d+)\s*phút/.exec(String(timeStr));
  const totalMins = match ? Number.parseInt(match[1], 10) : 0;
  if (totalMins < 60) return totalMins ? `${totalMins} phút` : timeStr;
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`;
}

export type WatchLayout = "split" | "stack";

export interface WatchContentMovie {
  name: string;
  slug: string;
  poster_url?: string;
  origin_name?: string;
  year?: number;
  time?: string;
  quality?: string;
  lang?: string;
  episode_current?: string;
  episode_total?: string;
  type?: string;
  status?: string;
  view?: number;
  showtimes?: string;
  notify?: string;
  content?: string;
  category?: CategoryRef[];
  country?: CountryRef[];
  actor?: string[];
  director?: string[];
}

export interface WatchContentProps {
  readonly movie: WatchContentMovie;
  readonly episode: EpisodeItem | null;
  readonly episodes: EpisodeServer[];
  readonly slug: string;
  readonly streamUrl: string;
  readonly isEmbed: boolean;
  /** "split" = 7-3 (trái video, phải thông tin + tập); "stack" = video full rồi danh sách bên dưới */
  readonly layout?: WatchLayout;
  /** Nội dung thông tin phim hiển thị dưới video (dùng cho layout="stack") */
  readonly movieInfo?: React.ReactNode;
}

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
  const fullOnly = episodes.length === 1 && (episodes[0].server_data?.length ?? 0) === 1;
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
    <div className="overflow-hidden rounded-[var(--radius-panel)] bg-black">
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
      className="mb-4"
    />
  );

  const timeDisplay = formatTimeToHoursMinutes(movie.time ?? "");
  const metaLine = [movie.year, movie.episode_current, timeDisplay, movie.quality, movie.lang]
    .filter(Boolean)
    .join(" · ");

  /** Block thông tin phim giống movie-detail: header, meta, nội dung, thể loại, quốc gia, đạo diễn, diễn viên */
  const movieInfoBlock = (
    <section className="mt-6 flex flex-col gap-6 border-b border-[var(--border)] pb-6" data-watch-movie-info>
      <header>
        <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
          <Link href={`/phim/${slug}`} className="hover:text-[var(--accent)] hover:underline">
            {movie.name || "Phim"}
          </Link>
        </h1>
        {movie.origin_name ? (
          <p className="mt-1 text-[13px] text-[var(--foreground-muted)]">{movie.origin_name}</p>
        ) : null}
        {metaLine ? (
          <p className="mt-2 text-[12px] text-[var(--foreground-muted)]">{metaLine}</p>
        ) : null}
        
      </header>
      {movie.content ? (
        <section>
          <h2 className="mb-2 text-[14px] font-semibold text-[var(--foreground)]">Nội dung phim</h2>
          <div
            className="prose prose-sm max-w-none text-[13px] text-[var(--foreground-muted)] prose-p:my-1.5 prose-a:text-[var(--accent)]"
            dangerouslySetInnerHTML={{ __html: movie.content }}
          />
        </section>
      ) : null}
      <div className="flex flex-col gap-3">
        {(movie.category?.length ?? 0) > 0 && (
          <div className="flex flex-nowrap items-baseline gap-2">
            <span className="shrink-0 text-[12px] font-medium text-[var(--foreground-muted)]">Thể loại:</span>
            <div className="flex min-w-0 flex-wrap gap-1.5">
              {movie.category!.filter((c, i, arr) => arr.findIndex((x) => x.slug === c.slug) === i).map((c) => (
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
        {(movie.country?.length ?? 0) > 0 && (
          <div className="flex flex-nowrap items-baseline gap-2">
            <span className="shrink-0 text-[12px] font-medium text-[var(--foreground-muted)]">Quốc gia:</span>
            <div className="flex min-w-0 flex-wrap gap-1.5">
              {movie.country!.filter((c, i, arr) => arr.findIndex((x) => x.slug === c.slug) === i).map((c) => (
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
        {(movie.director?.length ?? 0) > 0 && (
          <div className="flex flex-nowrap items-baseline gap-2">
            <span className="shrink-0 text-[12px] font-medium text-[var(--foreground-muted)]">Đạo diễn:</span>
            <span className="min-w-0 truncate text-[12px] text-[var(--foreground)]">{movie.director!.join(", ")}</span>
          </div>
        )}
        {(movie.actor?.length ?? 0) > 0 && (
          <div className="flex flex-nowrap items-baseline gap-2">
            <span className="shrink-0 text-[12px] font-medium text-[var(--foreground-muted)]">Diễn viên:</span>
            <span className="min-w-0 line-clamp-1 text-[12px] text-[var(--foreground)]">{movie.actor!.join(", ")}</span>
          </div>
        )}
        {(movie.status || movie.episode_current != null || movie.episode_total != null) && (
          <MovieStatusBlock
            status={movie.status || "ongoing"}
            episodeCurrent={movie.episode_current}
            episodeTotal={movie.episode_total}
          />
        )}
        {movie.type && (
          <div className="flex flex-nowrap items-baseline gap-2">
            <span className="shrink-0 text-[12px] font-medium text-[var(--foreground-muted)]">Loại phim:</span>
            <span className="min-w-0 truncate text-[12px] text-[var(--foreground)]">{formatMovieType(movie.type)}</span>
          </div>
        )}
        {movie.view != null && movie.view > 0 && (
          <div className="flex flex-nowrap items-baseline gap-2">
            <span className="shrink-0 text-[12px] font-medium text-[var(--foreground-muted)]">Lượt xem:</span>
            <span className="min-w-0 text-[12px] text-[var(--foreground)]">
              {movie.view.toLocaleString("vi-VN")}
            </span>
          </div>
        )}
        {movie.showtimes && (
          <div className="flex flex-nowrap items-baseline gap-2">
            <span className="shrink-0 text-[12px] font-medium text-[var(--foreground-muted)]">Lịch chiếu:</span>
            <span className="min-w-0 truncate text-[12px] text-[var(--foreground)]">{movie.showtimes}</span>
          </div>
        )}
        {movie.notify && (
          <div className="flex flex-nowrap items-baseline gap-2">
            <span className="shrink-0 text-[12px] font-medium text-[var(--foreground-muted)]">Thông báo:</span>
            <span className="min-w-0 truncate text-[12px] text-[var(--foreground)]">{movie.notify}</span>
          </div>
        )}
      </div>
    </section>
  );

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
      />
    </div>
  );

  if (layout === "split") {
    return (
      <div className="flex flex-col pb-24">
        <PageLayout className="py-4">
          {breadcrumb}
          {/* Row 1: Video + Sidebar — sidebar height = video height on desktop */}
          <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
            {/* Video */}
            <div className="min-w-0">
              <div className="sticky top-0 z-30 bg-[var(--background)] lg:static">{playerBlock}</div>
            </div>
            {/* Right column: mobile = tabs, desktop = sidebar pinned to video height */}
            <div className="min-w-0 lg:relative">
              {/* Mobile: tab Thông tin | Tập | Đề xuất */}
              <div className="lg:hidden">
                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="mb-3 grid w-full grid-cols-3">
                    <TabsTrigger value="info">Thông tin</TabsTrigger>
                    <TabsTrigger value="episodes">Tập</TabsTrigger>
                    <TabsTrigger value="suggested">Đề xuất</TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="info"
                    className="mt-0"
                    forceMount
                  >
                    {movieInfoBlock}
                  </TabsContent>
                  <TabsContent
                    value="episodes"
                    className="mt-0"
                    forceMount
                  >
                    {episodes.length > 0 ? (
                      <EpisodeList
                        episodes={episodes}
                        variant="watch"
                        title="Tập"
                        posterUrl={movie.poster_url}
                        movieName={movie.name}
                        movieSlug={slug}
                        fullOnly={fullOnly}
                        activeEpisodeSlug={episode?.slug}
                      />
                    ) : (
                      <p className="py-4 text-[13px] text-[var(--foreground-muted)]">Chưa có danh sách tập.</p>
                    )}
                  </TabsContent>
                  <TabsContent
                    value="suggested"
                    className="mt-0"
                    forceMount
                  >
                    {movie.category?.[0]?.slug ? (
                      <MovieDetailRelated
                        currentSlug={slug}
                        categorySlug={movie.category[0].slug}
                        limit={12}
                        variant="list"
                      />
                    ) : (
                      <p className="py-4 text-[13px] text-[var(--foreground-muted)]">Chưa có đề xuất.</p>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
              {/* Desktop: sidebar — absolute so it doesn't expand the grid row beyond video height */}
              <div className="hidden lg:absolute lg:inset-0 lg:flex">
                <WatchSidebar
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
          </div>
          {/* Row 2: Movie info — desktop only, below the grid */}
          <div className="mt-6 hidden lg:block lg:max-w-[70%]">{movieInfoBlock}</div>
        </PageLayout>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <PageLayout className="py-4">
        {breadcrumb}
        {playerBlock}
        {movieInfo || movieInfoBlock}
        {episodeListBlock}
      </PageLayout>
    </div>
  );
}
