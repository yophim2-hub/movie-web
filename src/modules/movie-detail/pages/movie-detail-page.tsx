"use client";

import { PageLayout } from "@/components/layout";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { formatOriginName } from "@/components/ui/movie-poster-card";
import { useMovieDetail } from "@/hooks";
import { useParams } from "next/navigation";
import type { EpisodeServer } from "@/types/movie-detail";
import {
  MovieDetailActions,
  MovieDetailHero,
  MovieDetailNotFound,
  MovieDetailPoster,
  MovieDetailRelated,
  MovieDetailSidebar,
  MovieDetailSkeleton,
  MovieDetailTabs,
  MovieDetailWatchButton,
} from "../components";

const tagBase =
  "rounded-[var(--radius-button)] px-2 py-1 text-[11px] font-medium";

/** "104 phút" -> "1 giờ 44 phút"; "45 phút" -> "45 phút" */
function formatTimeToHoursMinutes(timeStr: string): string {
  const match = /(\d+)\s*phút/.exec(String(timeStr));
  const totalMins = match ? Number.parseInt(match[1], 10) : 0;
  if (totalMins < 60) return totalMins ? `${totalMins} phút` : timeStr;
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`;
}

export default function MovieDetailPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const { data, isLoading, isError } = useMovieDetail(slug, {
    enabled: slug.length > 0,
  });

  const movie = data?.data?.item;

  if (isLoading || !slug) {
    return <MovieDetailSkeleton />;
  }

  if (isError || !movie) {
    return <MovieDetailNotFound />;
  }

  const episodes: EpisodeServer[] = (movie as { episodes?: EpisodeServer[] }).episodes ?? [];
  const firstCategorySlug = movie.category?.[0]?.slug ?? "";

  const timeDisplay = formatTimeToHoursMinutes(movie.time);
  const originNameDisplay = formatOriginName(movie.origin_name);

  const hasMetaTags =
    movie.imdb?.id ||
    (movie.tmdb?.vote_average != null && movie.tmdb.vote_average > 0) ||
    movie.quality ||
    (movie.year != null && movie.year > 0) ||
    movie.episode_current ||
    timeDisplay ||
    movie.lang;

  const headerBlock = (
    <header className="min-w-0 text-center lg:text-left">
      <h1 className="break-words text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
        {movie.name}
      </h1>
      {originNameDisplay ? (
        <p className="mt-1 text-[13px] text-[var(--foreground-muted)]">
          {originNameDisplay}
        </p>
      ) : null}
      <div className="mt-2 flex flex-col items-center gap-2 lg:items-start">
        {movie.view != null && movie.view > 0 && (
          <div className="flex flex-nowrap items-baseline justify-center gap-2 lg:justify-start">
            <span className="shrink-0 text-[12px] font-medium text-[var(--foreground-muted)]">Lượt xem:</span>
            <span className="min-w-0 text-[12px] text-[var(--foreground)]">
              {movie.view.toLocaleString("vi-VN")}
            </span>
          </div>
        )}
        {movie.showtimes && (
          <div className="flex flex-nowrap items-baseline justify-center gap-2 lg:justify-start">
            <span className="shrink-0 text-[12px] font-medium text-[var(--foreground-muted)]">Lịch chiếu:</span>
            <span className="min-w-0 truncate text-[12px] text-[var(--foreground)]">{movie.showtimes}</span>
          </div>
        )}
        {movie.notify && (
          <div className="flex flex-nowrap items-baseline justify-center gap-2 lg:justify-start">
            <span className="shrink-0 text-[12px] font-medium text-[var(--foreground-muted)]">Thông báo:</span>
            <span className="min-w-0 truncate text-[12px] text-[var(--foreground)]">{movie.notify}</span>
          </div>
        )}
      </div>
    </header>
  );

  return (
    <div className="content-fade-in min-w-0 overflow-x-hidden pb-24">
      <MovieDetailHero imageUrl={movie.thumb_url || movie.poster_url} />
      <PageLayout className="relative z-[2] min-w-0 -mt-[14.3%] rounded-t-2xl pt-6 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            ...(movie.category?.[0]
              ? [{ label: movie.category[0].name, href: `/the-loai/${movie.category[0].slug}` }]
              : []),
            { label: movie.name },
          ]}
          className="mb-6"
        />
        {/* Màn hình nhỏ: poster + title căn giữa, rồi Xem phim → tab (full width) */}
        <div className="flex min-w-0 flex-col gap-6 lg:hidden">
          <div className="flex min-w-0 flex-col items-center gap-4">
            <MovieDetailPoster
              posterUrl={movie.poster_url}
              movieName={movie.name}
              className="w-full max-w-[140px]"
            />
            <div className="w-full min-w-0 text-center">{headerBlock}</div>
            {/* Chỉ tags: IMDB, TMDB, chất lượng, năm, tập, thời lượng, ngôn ngữ */}
            {hasMetaTags && (
              <ul className="flex flex-wrap justify-center gap-[0.6rem] list-none border-t border-[var(--border)] pt-4 p-0 m-0">
                {movie.imdb?.id && (
                  <li
                    className={`${tagBase} bg-amber-500/20 text-amber-700 dark:text-amber-400`}
                  >
                    IMDB
                  </li>
                )}
                {movie.tmdb?.vote_average != null &&
                  movie.tmdb.vote_average > 0 && (
                    <li
                      className={`${tagBase} bg-[var(--secondary-bg-solid)] text-[var(--foreground)]`}
                    >
                      {movie.tmdb.vote_average.toFixed(1)}
                    </li>
                  )}
                {movie.quality && (
                  <li
                    className={`${tagBase} border border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]`}
                  >
                    {movie.quality}
                  </li>
                )}
                {movie.year != null && movie.year > 0 && (
                  <li
                    className={`${tagBase} bg-[var(--secondary-bg-solid)] text-[var(--foreground-muted)]`}
                  >
                    {movie.year}
                  </li>
                )}
                {movie.episode_current && (
                  <li
                    className={`${tagBase} bg-[var(--secondary-bg-solid)] text-[var(--foreground-muted)]`}
                  >
                    {movie.episode_current}
                  </li>
                )}
                {timeDisplay && (
                  <li
                    className={`${tagBase} bg-[var(--secondary-bg-solid)] text-[var(--foreground-muted)]`}
                  >
                    {timeDisplay}
                  </li>
                )}
                {movie.lang && (
                  <li
                    className={`${tagBase} bg-[var(--secondary-bg-solid)] text-[var(--foreground-muted)]`}
                  >
                    {movie.lang}
                  </li>
                )}
              </ul>
            )}
          </div>
          <div className="w-full">
            <MovieDetailWatchButton episodes={episodes} movieSlug={movie.slug} />
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
            />
          </div>
        </div>

        {/* Màn hình lớn: layout sidebar + nội dung */}
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
            {headerBlock}
            {movie.content ? (
              <section>
                <h2 className="mb-2 text-[14px] font-semibold text-[var(--foreground)]">Nội dung phim</h2>
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
      </PageLayout>
    </div>
  );
}
