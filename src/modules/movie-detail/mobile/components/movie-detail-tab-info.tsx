"use client";

import { TabsContent } from "@/components/ui/tabs";
import { getMovieStatusProgressText } from "@/components/ui/movie-status-block";
import { formatMovieType } from "@/lib/movie-labels";
import Link from "next/link";
import type { CategoryRef, CountryRef } from "@/types/movie-list";
import {
  MOVIE_DETAIL_TAB_EMPTY,
  MovieDetailTabDetailInline,
  MovieDetailTabDetailRow,
} from "./movie-detail-tab-rows";

export interface MovieDetailTabInfoProps {
  readonly category: CategoryRef[];
  readonly country: CountryRef[];
  readonly actor: string[];
  readonly director: string[];
  readonly episodeCurrent?: string;
  readonly episodeTotal?: string;
  readonly status?: string;
  readonly type?: string;
  readonly content?: string | null;
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

export function MovieDetailTabInfo({
  category,
  country,
  actor,
  director,
  episodeCurrent,
  episodeTotal,
  status,
  type,
  content,
  originName,
  year,
  quality,
  lang,
  timeDisplay,
  imdbId,
  tmdbVoteAverage,
  view,
  trailerUrl,
}: Readonly<MovieDetailTabInfoProps>) {
  const empty = MOVIE_DETAIL_TAB_EMPTY;
  const originTrimmed = originName?.trim() ?? "";
  const viewFormatted =
    view != null && view > 0 ? new Intl.NumberFormat("vi-VN").format(view) : null;

  return (
    <TabsContent value="info" className="mt-4 min-w-0">
      <div className="flex min-w-0 flex-col divide-y divide-[var(--border)]">
        <MovieDetailTabDetailInline label="Trạng thái">
          {getMovieStatusProgressText({
            status: status ?? "ongoing",
            episodeCurrent,
            episodeTotal,
          })}
        </MovieDetailTabDetailInline>
        {year != null && year > 0 ? (
          <MovieDetailTabDetailInline label="Năm">{year}</MovieDetailTabDetailInline>
        ) : (
          <MovieDetailTabDetailInline label="Năm">
            <span className="text-[var(--foreground-muted)]">{empty}</span>
          </MovieDetailTabDetailInline>
        )}
        <MovieDetailTabDetailInline label="Thời lượng">
          {timeDisplay?.trim() ? timeDisplay : <span className="text-[var(--foreground-muted)]">{empty}</span>}
        </MovieDetailTabDetailInline>
        <MovieDetailTabDetailInline label="Chất lượng">
          {quality?.trim() ? quality : <span className="text-[var(--foreground-muted)]">{empty}</span>}
        </MovieDetailTabDetailInline>
        <MovieDetailTabDetailInline label="Ngôn ngữ">
          {lang?.trim() ? lang : <span className="text-[var(--foreground-muted)]">{empty}</span>}
        </MovieDetailTabDetailInline>
        {tmdbVoteAverage != null && tmdbVoteAverage > 0 ? (
          <MovieDetailTabDetailInline label="Điểm TMDB">{tmdbVoteAverage.toFixed(1)}</MovieDetailTabDetailInline>
        ) : (
          <MovieDetailTabDetailInline label="Điểm TMDB">
            <span className="text-[var(--foreground-muted)]">{empty}</span>
          </MovieDetailTabDetailInline>
        )}
        <MovieDetailTabDetailInline label="IMDB">
          {imdbId?.trim() ? (
            <a
              href={`https://www.imdb.com/title/${encodeURIComponent(imdbId.trim())}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-[var(--accent)] underline-offset-2 hover:underline"
            >
              {imdbId.trim()}
            </a>
          ) : (
            <span className="text-[var(--foreground-muted)]">{empty}</span>
          )}
        </MovieDetailTabDetailInline>
        <MovieDetailTabDetailInline label="Loại phim">
          {type != null && type !== "" ? (
            formatMovieType(type)
          ) : (
            <span className="text-[var(--foreground-muted)]">{empty}</span>
          )}
        </MovieDetailTabDetailInline>
        <MovieDetailTabDetailInline label="Thể loại">
          {category.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {category.filter((c, i, arr) => arr.findIndex((x) => x.slug === c.slug) === i).map((c) => (
                <Link
                  key={c.slug}
                  href={`/the-loai/${c.slug}`}
                  className="rounded-[var(--radius-button)] bg-[var(--secondary-bg-solid)] px-2 py-1 text-[12px] text-[var(--foreground)] hover:bg-[var(--secondary-hover)]"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          ) : (
            <span className="text-[var(--foreground-muted)]">{empty}</span>
          )}
        </MovieDetailTabDetailInline>
        <MovieDetailTabDetailInline label="Quốc gia">
          {country.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {country.filter((c, i, arr) => arr.findIndex((x) => x.slug === c.slug) === i).map((c) => (
                <Link
                  key={c.slug}
                  href={`/quoc-gia/${c.slug}`}
                  className="rounded-[var(--radius-button)] bg-[var(--secondary-bg-solid)] px-2 py-1 text-[12px] text-[var(--foreground)] hover:bg-[var(--secondary-hover)]"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          ) : (
            <span className="text-[var(--foreground-muted)]">{empty}</span>
          )}
        </MovieDetailTabDetailInline>
        <MovieDetailTabDetailInline label="Tên gốc">
          {originTrimmed ? (
            originTrimmed
          ) : (
            <span className="text-[var(--foreground-muted)]">{empty}</span>
          )}
        </MovieDetailTabDetailInline>
        {viewFormatted ? (
          <MovieDetailTabDetailInline label="Lượt xem">{viewFormatted}</MovieDetailTabDetailInline>
        ) : (
          <MovieDetailTabDetailInline label="Lượt xem">
            <span className="text-[var(--foreground-muted)]">{empty}</span>
          </MovieDetailTabDetailInline>
        )}
        <MovieDetailTabDetailInline label="Trailer">
          {trailerUrl?.trim() ? (
            <a
              href={trailerUrl.trim()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] underline-offset-2 hover:underline"
            >
              Xem trailer
            </a>
          ) : (
            <span className="text-[var(--foreground-muted)]">{empty}</span>
          )}
        </MovieDetailTabDetailInline>
        <MovieDetailTabDetailRow label="Đạo diễn">
          {director.length > 0 ? (
            director.join(", ")
          ) : (
            <span className="text-[var(--foreground-muted)]">{empty}</span>
          )}
        </MovieDetailTabDetailRow>
        <MovieDetailTabDetailRow label="Diễn viên">
          {actor.length > 0 ? (
            <p className="leading-relaxed">{actor.join(", ")}</p>
          ) : (
            <span className="text-[var(--foreground-muted)]">{empty}</span>
          )}
        </MovieDetailTabDetailRow>
        <MovieDetailTabDetailInline label="Nội dung phim">
          {content?.trim() ? (
            <div
              className="prose prose-sm max-w-full break-words text-[var(--foreground-muted)] prose-p:my-1.5 prose-a:break-all prose-a:text-[var(--accent)]"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <span className="text-[var(--foreground-muted)]">{empty}</span>
          )}
        </MovieDetailTabDetailInline>
      </div>
    </TabsContent>
  );
}
