"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { fetchSearchMovies } from "@/lib/api";
import type { SearchMovieParams, SearchMovieResponse } from "@/types/search-movie";

export const searchMoviesQueryKey = (params: SearchMovieParams) =>
  ["search-movies", params] as const;

export function useSearchMovies(
  params: SearchMovieParams,
  options?: Omit<
    UseQueryOptions<
      SearchMovieResponse,
      Error,
      SearchMovieResponse,
      ReturnType<typeof searchMoviesQueryKey>
    >,
    "queryKey" | "queryFn"
  >
) {
  const enabled =
    typeof params.keyword === "string" && params.keyword.trim().length > 0;

  return useQuery({
    queryKey: searchMoviesQueryKey(params),
    queryFn: () => fetchSearchMovies(params),
    enabled: enabled && (options?.enabled !== false),
    ...options,
  });
}
