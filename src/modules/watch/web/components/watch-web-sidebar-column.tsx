"use client";

import type { EpisodeServer } from "@/types/movie-detail";
import { WatchSidebar } from "./watch-sidebar";

export interface WatchWebSidebarColumnProps {
  readonly name: string;
  readonly episodes: EpisodeServer[];
  readonly movieSlug: string;
  readonly fullOnly: boolean;
  readonly posterUrl?: string;
  readonly categorySlug: string;
  readonly activeEpisodeSlug?: string;
}

/** Sidebar desktop trong layout split: absolute theo chiều cao cột video */
export function WatchWebSidebarColumn({
  name,
  episodes,
  movieSlug,
  fullOnly,
  posterUrl,
  categorySlug,
  activeEpisodeSlug,
}: Readonly<WatchWebSidebarColumnProps>) {
  return (
    <div className="hidden lg:absolute lg:inset-0 lg:flex">
      <WatchSidebar
        name={name}
        episodes={episodes}
        movieSlug={movieSlug}
        fullOnly={fullOnly}
        posterUrl={posterUrl}
        categorySlug={categorySlug}
        activeEpisodeSlug={activeEpisodeSlug}
      />
    </div>
  );
}
