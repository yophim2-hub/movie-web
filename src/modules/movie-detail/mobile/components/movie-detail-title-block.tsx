"use client";

import type { MovieDetail } from "@/types/movie-detail";

export interface MovieDetailTitleBlockProps {
  readonly movie: Pick<MovieDetail, "name" | "view" | "showtimes" | "notify">;
  readonly originNameDisplay: string;
  readonly align: "center" | "start";
}

export function MovieDetailTitleBlock({
  movie,
  originNameDisplay,
  align,
}: Readonly<MovieDetailTitleBlockProps>) {
  const isCenter = align === "center";
  return (
    <header
      className={`min-w-0 ${isCenter ? "text-center" : "text-left"}`}
    >
      <h1 className="break-words text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
        {movie.name}
      </h1>
      {originNameDisplay ? (
        <p className="mt-1 text-[13px] text-[var(--foreground-muted)]">
          {originNameDisplay}
        </p>
      ) : null}
      <div
        className={`mt-2 flex flex-col gap-2 ${isCenter ? "items-center" : "items-start"}`}
      >
        {movie.view != null && movie.view > 0 && (
          <div
            className={`flex flex-nowrap items-baseline gap-2 ${isCenter ? "justify-center" : "justify-start"}`}
          >
            <span className="shrink-0 text-[12px] font-medium text-[var(--foreground-muted)]">
              Lượt xem:
            </span>
            <span className="min-w-0 text-[12px] text-[var(--foreground)]">
              {movie.view.toLocaleString("vi-VN")}
            </span>
          </div>
        )}
        {movie.showtimes ? (
          <div
            className={`flex flex-nowrap items-baseline gap-2 ${isCenter ? "justify-center" : "justify-start"}`}
          >
            <span className="shrink-0 text-[12px] font-medium text-[var(--foreground-muted)]">
              Lịch chiếu:
            </span>
            <span className="min-w-0 truncate text-[12px] text-[var(--foreground)]">
              {movie.showtimes}
            </span>
          </div>
        ) : null}
        {movie.notify ? (
          <div
            className={`flex flex-nowrap items-baseline gap-2 ${isCenter ? "justify-center" : "justify-start"}`}
          >
            <span className="shrink-0 text-[12px] font-medium text-[var(--foreground-muted)]">
              Thông báo:
            </span>
            <span className="min-w-0 truncate text-[12px] text-[var(--foreground)]">
              {movie.notify}
            </span>
          </div>
        ) : null}
      </div>
    </header>
  );
}
