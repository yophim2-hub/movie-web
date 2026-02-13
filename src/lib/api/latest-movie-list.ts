import { phimApiRootClient } from "./axios-client";
import type { LatestMovieListResponse } from "@/types/latest-movie-list";

const LATEST_LIST_SLUG = "phim-moi-cap-nhat-v3";

export interface FetchLatestMovieListParams {
  page?: number;
}

/**
 * Fetches "phim mới cập nhật" list from PhimAPI (root domain).
 * GET /danh-sach/phim-moi-cap-nhat-v3?page=...
 */
export async function fetchLatestMovieList(
  params: FetchLatestMovieListParams = {}
): Promise<LatestMovieListResponse> {
  const { page = 1 } = params;
  const url = `/danh-sach/${LATEST_LIST_SLUG}?page=${page}`;
  const { data } = await phimApiRootClient.get<LatestMovieListResponse>(url);
  return data;
}
