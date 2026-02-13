import { phimApiClient } from "./axios-client";
import type { MovieListParams, MovieListResponse } from "@/types/movie-list";

export interface FetchYearDetailParams extends MovieListParams {
  year: number;
}

/**
 * Fetches movies by year from PhimAPI.
 * GET /v1/api/nam/{year}
 */
export async function fetchYearDetail(
  params: FetchYearDetailParams
): Promise<MovieListResponse> {
  const {
    year,
    page = 1,
    sortField,
    sortType,
    sortLang,
    category,
    country,
    limit,
  } = params;

  const searchParams = new URLSearchParams();
  searchParams.set("page", String(page));
  if (sortField) searchParams.set("sort_field", sortField);
  if (sortType) searchParams.set("sort_type", sortType);
  if (sortLang) searchParams.set("sort_lang", sortLang);
  if (category) searchParams.set("category", category);
  if (country) searchParams.set("country", country);
  if (limit != null) searchParams.set("limit", String(Math.min(limit, 64)));

  const url = `/nam/${encodeURIComponent(String(year))}?${searchParams.toString()}`;
  const { data } = await phimApiClient.get<MovieListResponse>(url);
  return data;
}
