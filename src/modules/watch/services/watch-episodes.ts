import type { EpisodeServer } from "@/types/movie-detail";

/** Một server, một tập → điều hướng /xem-phim/[slug] không slug tập. */
export function watchEpisodesFullOnly(episodes: EpisodeServer[]): boolean {
  return episodes.length === 1 && (episodes[0].server_data?.length ?? 0) === 1;
}
