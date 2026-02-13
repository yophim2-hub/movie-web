import { phimApiClient } from "./axios-client";
import type {
  MovieListType,
  MovieListParams,
  MovieListResponse,
} from "@/types/movie-list";

export interface FetchMovieListParams extends MovieListParams {
  typeList: MovieListType;
}

/**
 * Fetches a paginated movie list from PhimAPI.
 * GET /danh-sach/{typeList}
 */
export async function fetchMovieList(
  params: FetchMovieListParams
): Promise<MovieListResponse> {
  const { typeList, page = 1, sortField, sortType, sortLang, category, country, year, limit } = params;

  const searchParams = new URLSearchParams();
  searchParams.set("page", String(page));
  if (sortField) searchParams.set("sort_field", sortField);
  if (sortType) searchParams.set("sort_type", sortType);
  if (sortLang) searchParams.set("sort_lang", sortLang);
  if (category) searchParams.set("category", category);
  if (country) searchParams.set("country", country);
  if (year != null) searchParams.set("year", String(year));
  if (limit != null) searchParams.set("limit", String(Math.min(limit, 64)));

  const url = `/danh-sach/${typeList}?${searchParams.toString()}`;
  const { data } = await phimApiClient.get<MovieListResponse>(url);
  return data;
}
