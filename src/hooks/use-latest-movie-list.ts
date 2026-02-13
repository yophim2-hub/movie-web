"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { fetchLatestMovieList, type FetchLatestMovieListParams } from "@/lib/api";
import type { LatestMovieListResponse } from "@/types/latest-movie-list";

export const latestMovieListQueryKey = (params: FetchLatestMovieListParams = {}) =>
  ["latest-movie-list", params] as const;

export function useLatestMovieList(
  params: FetchLatestMovieListParams = {},
  options?: Omit<
    UseQueryOptions<
      LatestMovieListResponse,
      Error,
      LatestMovieListResponse,
      ReturnType<typeof latestMovieListQueryKey>
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: latestMovieListQueryKey(params),
    queryFn: () => fetchLatestMovieList(params),
    ...options,
  });
}
