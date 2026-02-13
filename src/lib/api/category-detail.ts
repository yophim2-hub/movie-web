import { phimApiClient } from "./axios-client";
import type { MovieListParams, MovieListResponse } from "@/types/movie-list";

export interface FetchCategoryDetailParams extends MovieListParams {
  categorySlug: string;
}

/**
 * Fetches movies by category from PhimAPI.
 * GET /v1/api/the-loai/{categorySlug}
 */
export async function fetchCategoryDetail(
  params: FetchCategoryDetailParams
): Promise<MovieListResponse> {
  const {
    categorySlug,
    page = 1,
    sortField,
    sortType,
    sortLang,
    country,
    year,
    limit,
  } = params;

  const searchParams = new URLSearchParams();
  searchParams.set("page", String(page));
  if (sortField) searchParams.set("sort_field", sortField);
  if (sortType) searchParams.set("sort_type", sortType);
  if (sortLang) searchParams.set("sort_lang", sortLang);
  if (country) searchParams.set("country", country);
  if (year != null) searchParams.set("year", String(year));
  if (limit != null) searchParams.set("limit", String(Math.min(limit, 64)));

  const url = `/the-loai/${encodeURIComponent(categorySlug)}?${searchParams.toString()}`;
  const { data } = await phimApiClient.get<MovieListResponse>(url);
  return data;
}
