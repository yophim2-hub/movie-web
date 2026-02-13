import { phimApiClient } from "./axios-client";
import type { MovieListParams, MovieListResponse } from "@/types/movie-list";

export interface FetchCountryDetailParams extends MovieListParams {
  countrySlug: string;
}

/**
 * Fetches movies by country from PhimAPI.
 * GET /v1/api/quoc-gia/{countrySlug}
 */
export async function fetchCountryDetail(
  params: FetchCountryDetailParams
): Promise<MovieListResponse> {
  const {
    countrySlug,
    page = 1,
    sortField,
    sortType,
    sortLang,
    category,
    year,
    limit,
  } = params;

  const searchParams = new URLSearchParams();
  searchParams.set("page", String(page));
  if (sortField) searchParams.set("sort_field", sortField);
  if (sortType) searchParams.set("sort_type", sortType);
  if (sortLang) searchParams.set("sort_lang", sortLang);
  if (category) searchParams.set("category", category);
  if (year != null) searchParams.set("year", String(year));
  if (limit != null) searchParams.set("limit", String(Math.min(limit, 64)));

  const url = `/quoc-gia/${encodeURIComponent(countrySlug)}?${searchParams.toString()}`;
  const { data } = await phimApiClient.get<MovieListResponse>(url);
  return data;
}
