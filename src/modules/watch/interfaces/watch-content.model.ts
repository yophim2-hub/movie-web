import type { ReactNode } from "react";
import type { EpisodeItem, EpisodeServer } from "@/types/movie-detail";
import type { CategoryRef, CountryRef } from "@/types/movie-list";

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
  /** "split" = 7-3; "stack" = video rồi nội dung bên dưới */
  readonly layout?: WatchLayout;
  readonly movieInfo?: ReactNode;
}
