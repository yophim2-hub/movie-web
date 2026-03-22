"use client";

import { EpisodeList } from "@/components/ui/episode-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MovieDetailRelated } from "@/modules/movie-detail";
import type { EpisodeServer } from "@/types/movie-detail";

const TAB_EPISODES = "episodes";
const TAB_SUGGESTED = "suggested";

export interface WatchSidebarProps {
  readonly name: string;
  readonly episodes: EpisodeServer[];
  readonly movieSlug: string;
  readonly fullOnly: boolean;
  readonly posterUrl?: string;
  /** Slug thể loại để lấy phim đề xuất (thường là category[0].slug) */
  readonly categorySlug?: string;
  /** Slug tập đang xem: highlight trong danh sách tập */
  readonly activeEpisodeSlug?: string;
}

export function WatchSidebar({
  name,
  episodes,
  movieSlug,
  fullOnly,
  posterUrl,
  categorySlug = "",
  activeEpisodeSlug,
}: WatchSidebarProps) {
  return (
    <aside className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[var(--radius-panel)] bg-[var(--secondary-bg-solid)] p-3">
      <Tabs defaultValue={TAB_EPISODES} className="flex h-full min-h-0 flex-col">
        <TabsList className="mb-3 shrink-0">
          <TabsTrigger value={TAB_EPISODES}>Tập</TabsTrigger>
          <TabsTrigger value={TAB_SUGGESTED}>Đề xuất</TabsTrigger>
        </TabsList>
        <TabsContent
          value={TAB_EPISODES}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
          forceMount
        >
          {episodes.length > 0 ? (
            <EpisodeList
              episodes={episodes}
              variant="watch"
              title="Tập"
              posterUrl={posterUrl}
              movieName={name}
              movieSlug={movieSlug}
              fullOnly={fullOnly}
              activeEpisodeSlug={activeEpisodeSlug}
              plain
            />
          ) : (
            <p className="py-4 text-[13px] text-[var(--foreground-muted)]">Chưa có danh sách tập.</p>
          )}
        </TabsContent>
        <TabsContent
          value={TAB_SUGGESTED}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
          forceMount
        >
          {categorySlug ? (
            <MovieDetailRelated
              currentSlug={movieSlug}
              categorySlug={categorySlug}
              limit={12}
              variant="list"
            />
          ) : (
            <p className="py-4 text-[13px] text-[var(--foreground-muted)]">Chưa có đề xuất.</p>
          )}
        </TabsContent>
      </Tabs>
    </aside>
  );
}
