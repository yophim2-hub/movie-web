"use client";

import { EpisodeList } from "@/components/ui/episode-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MovieDetailRelated } from "@/modules/movie-detail";
import type { EpisodeItem, EpisodeServer } from "@/types/movie-detail";
import type { WatchContentMovie } from "../../interfaces/watch-content.model";
import { watchEpisodesFullOnly } from "../../services";
import { WatchMovieInfoBlock } from "./watch-movie-info-block";

export interface WatchMobileSplitColumnProps {
  readonly movie: WatchContentMovie;
  readonly slug: string;
  readonly episode: EpisodeItem | null;
  readonly episodes: EpisodeServer[];
}

/**
 * Cột phải layout split trên mobile: tab Thông tin | Tập | Đề xuất.
 * Toàn bộ markup + điều kiện hiển thị nằm trong mobile module.
 */
export function WatchMobileSplitColumn({
  movie,
  slug,
  episode,
  episodes,
}: Readonly<WatchMobileSplitColumnProps>) {
  const fullOnly = watchEpisodesFullOnly(episodes);

  return (
    <div className="lg:hidden">
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-3 grid w-full grid-cols-3">
          <TabsTrigger value="info">Thông tin</TabsTrigger>
          <TabsTrigger value="episodes">Tập</TabsTrigger>
          <TabsTrigger value="suggested">Đề xuất</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="mt-0" forceMount>
          <WatchMovieInfoBlock movie={movie} slug={slug} />
        </TabsContent>
        <TabsContent value="episodes" className="mt-0" forceMount>
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
              plain
            />
          ) : (
            <p className="py-4 text-[13px] text-[var(--foreground-muted)]">Chưa có danh sách tập.</p>
          )}
        </TabsContent>
        <TabsContent value="suggested" className="mt-0" forceMount>
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
  );
}
