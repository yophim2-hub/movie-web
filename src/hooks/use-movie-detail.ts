"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { fetchMovieDetail } from "@/lib/api";
import type { MovieDetailResponse } from "@/types/movie-detail";

export const movieDetailQueryKey = (slug: string) =>
  ["movie-detail", slug] as const;

export function useMovieDetail(
  slug: string,
  options?: Omit<
    UseQueryOptions<
      MovieDetailResponse,
      Error,
      MovieDetailResponse,
      ReturnType<typeof movieDetailQueryKey>
    >,
    "queryKey" | "queryFn"
  >
) {
  const enabled = typeof slug === "string" && slug.trim().length > 0;

  return useQuery({
    queryKey: movieDetailQueryKey(slug),
    queryFn: () => fetchMovieDetail(slug),
    enabled: enabled && (options?.enabled !== false),
    ...options,
  });
}
