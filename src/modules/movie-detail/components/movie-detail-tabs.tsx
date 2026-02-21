"use client";

import { formatMovieType } from "@/lib/movie-labels";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MovieStatusBlock } from "@/components/ui/movie-status-block";
import Link from "next/link";
import type { EpisodeServer } from "@/types/movie-detail";
import type { CategoryRef, CountryRef } from "@/types/movie-list";
import { MovieDetailActions } from "./movie-detail-actions";
import { MovieDetailRelated } from "./movie-detail-related";

export interface MovieDetailTabsProps {
  /** Tab Thông tin: chi tiết thông tin */
  readonly category: CategoryRef[];
  readonly country: CountryRef[];
  readonly actor: string[];
  readonly director: string[];
  readonly episodeCurrent?: string;
  readonly episodeTotal?: string;
  readonly status?: string;
  readonly type?: string;
  readonly content?: string | null;
  /** Tập */
  readonly posterUrl: string;
  readonly episodes: EpisodeServer[];
  readonly movieName?: string;
  readonly movieSlug?: string;
  /** Đề xuất */
  readonly currentSlug: string;
  readonly categorySlug: string;
  readonly relatedLimit?: number;
}

function DetailRow({
  label,
  children,
}: Readonly<{
  label: string;
  children: React.ReactNode;
}>) {
  return (
    <div className="min-w-0 border-b border-[var(--border)] py-3 first:pt-0 last:border-0">
      <span className="block text-[11px] font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
        {label}
      </span>
      <div className="mt-1 min-w-0 break-words text-[13px] text-[var(--foreground)]">{children}</div>
    </div>
  );
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
}: MovieDetailTabsProps) {
  return (
    <Tabs defaultValue="info" className="w-full min-w-0">
      <TabsList className="grid w-full min-w-0 grid-cols-3">
        <TabsTrigger value="info">Thông tin</TabsTrigger>
        <TabsTrigger value="episodes">Tập</TabsTrigger>
        <TabsTrigger value="related">Đề xuất</TabsTrigger>
      </TabsList>
      <TabsContent value="info" className="mt-4 min-w-0 overflow-hidden">
        <div className="flex min-w-0 flex-col gap-2">
          {(status != null || episodeCurrent != null || episodeTotal != null) && (
            <DetailRow label="Trạng thái">
              <MovieStatusBlock
                status={status ?? "ongoing"}
                episodeCurrent={episodeCurrent}
                episodeTotal={episodeTotal}
              />
            </DetailRow>
          )}
          {type != null && type !== "" && (
            <DetailRow label="Loại phim">
              {formatMovieType(type)}
            </DetailRow>
          )}
          {category.length > 0 && (
            <DetailRow label="Thể loại">
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
            </DetailRow>
          )}
          {country.length > 0 && (
            <DetailRow label="Quốc gia">
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
            </DetailRow>
          )}
          {director.length > 0 && (
            <DetailRow label="Đạo diễn">{director.join(", ")}</DetailRow>
          )}
          {actor.length > 0 && (
            <DetailRow label="Diễn viên">
              <p className="leading-relaxed">{actor.join(", ")}</p>
            </DetailRow>
          )}
          {content ? (
            <DetailRow label="Nội dung phim">
              <div
                className="prose prose-sm max-w-full overflow-hidden break-words text-[var(--foreground-muted)] prose-p:my-1.5 prose-a:break-all prose-a:text-[var(--accent)]"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </DetailRow>
          ) : null}
        </div>
      </TabsContent>
      <TabsContent value="episodes" className="mt-4 min-w-0 overflow-hidden">
        <MovieDetailActions
          episodes={episodes}
          posterUrl={posterUrl}
          movieName={movieName}
          movieSlug={movieSlug}
        />
      </TabsContent>
      <TabsContent value="related" className="mt-4 min-w-0 overflow-hidden">
        <MovieDetailRelated
          currentSlug={currentSlug}
          categorySlug={categorySlug}
          limit={relatedLimit}
        />
      </TabsContent>
    </Tabs>
  );
}
