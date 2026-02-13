import { phimApiClient } from "./axios-client";
import type { SearchMovieParams, SearchMovieResponse } from "@/types/search-movie";

/**
 * Fetches search results from PhimAPI.
 * GET /tim-kiem?keyword=...&page=...
 */
export async function fetchSearchMovies(
  params: SearchMovieParams
): Promise<SearchMovieResponse> {
  const {
    keyword,
    page = 1,
    sortField,
    sortType,
    sortLang,
    category,
    country,
    year,
    limit,
  } = params;

  const searchParams = new URLSearchParams();
  searchParams.set("keyword", keyword);
  searchParams.set("page", String(page));
  if (sortField) searchParams.set("sort_field", sortField);
  if (sortType) searchParams.set("sort_type", sortType);
  if (sortLang) searchParams.set("sort_lang", sortLang);
  if (category) searchParams.set("category", category);
  if (country) searchParams.set("country", country);
  if (year != null) searchParams.set("year", String(year));
  if (limit != null) searchParams.set("limit", String(Math.min(limit, 64)));

  const url = `/tim-kiem?${searchParams.toString()}`;
  const { data } = await phimApiClient.get<SearchMovieResponse>(url);
  return data;
}
