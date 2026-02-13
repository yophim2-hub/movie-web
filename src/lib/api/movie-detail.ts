import { phimApiClient } from "./axios-client";
import type { MovieDetailResponse } from "@/types/movie-detail";

/**
 * Fetches movie/series detail and episode list from PhimAPI.
 * GET /phim/{slug}
 */
export async function fetchMovieDetail(
  slug: string
): Promise<MovieDetailResponse> {
  const { data } = await phimApiClient.get<MovieDetailResponse>(
    `/phim/${encodeURIComponent(slug)}`
  );
  return data;
}
