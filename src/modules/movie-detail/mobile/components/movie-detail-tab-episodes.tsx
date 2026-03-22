"use client";

import { TabsContent } from "@/components/ui/tabs";
import type { EpisodeServer } from "@/types/movie-detail";
import { MovieDetailActions } from "../../web/components/movie-detail-actions";

export interface MovieDetailTabEpisodesProps {
  readonly posterUrl: string;
  readonly episodes: EpisodeServer[];
  readonly movieName?: string;
  readonly movieSlug?: string;
}

export function MovieDetailTabEpisodes({
  posterUrl,
  episodes,
  movieName,
  movieSlug,
}: Readonly<MovieDetailTabEpisodesProps>) {
  return (
    <TabsContent value="episodes" className="mt-4 min-w-0 overflow-hidden">
      <MovieDetailActions
        episodes={episodes}
        posterUrl={posterUrl}
        movieName={movieName}
        movieSlug={movieSlug}
        plainEpisodeList
      />
    </TabsContent>
  );
}
