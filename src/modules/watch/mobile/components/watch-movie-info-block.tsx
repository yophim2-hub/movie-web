"use client";

import { getMovieStatusProgressText } from "@/components/ui/movie-status-block";
import { formatMovieType } from "@/lib/movie-labels";
import Link from "next/link";
import type { WatchContentMovie } from "../../interfaces/watch-content.model";
import { formatMovieTimeToHoursMinutes } from "../../services";

export interface WatchMovieInfoBlockProps {
  readonly movie: WatchContentMovie;
  readonly slug: string;
}

export function WatchMovieInfoBlock({ movie, slug }: Readonly<WatchMovieInfoBlockProps>) {
  const timeDisplay = formatMovieTimeToHoursMinutes(movie.time ?? "");
  const metaLine = [movie.year, movie.episode_current, timeDisplay, movie.quality, movie.lang]
    .filter(Boolean)
    .join(" · ");

  return (
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
        {(Boolean(movie.status) ||
          movie.episode_current != null ||
          movie.episode_total != null) && (
          <div className="flex flex-nowrap items-baseline gap-2">
            <span className="shrink-0 text-[12px] font-medium text-[var(--foreground-muted)]">
              Trạng thái:
            </span>
            <span className="min-w-0 text-[12px] text-[var(--foreground)]">
              {getMovieStatusProgressText({
                status: movie.status || "ongoing",
                episodeCurrent: movie.episode_current,
                episodeTotal: movie.episode_total,
              })}
            </span>
          </div>
        )}
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
}
