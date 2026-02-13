"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { fetchMovieList, type FetchMovieListParams } from "@/lib/api";
import type { MovieListResponse } from "@/types/movie-list";

export const movieListQueryKey = (params: FetchMovieListParams) =>
  ["movie-list", params] as const;

export function useMovieList(
  params: FetchMovieListParams,
  options?: Omit<
    UseQueryOptions<MovieListResponse, Error, MovieListResponse, ReturnType<typeof movieListQueryKey>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: movieListQueryKey(params),
    queryFn: () => fetchMovieList(params),
    ...options,
  });
}
