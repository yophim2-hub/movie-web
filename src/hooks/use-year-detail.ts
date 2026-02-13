"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { fetchYearDetail, type FetchYearDetailParams } from "@/lib/api";
import type { MovieListResponse } from "@/types/movie-list";

export const yearDetailQueryKey = (params: FetchYearDetailParams) =>
  ["year-detail", params] as const;

export function useYearDetail(
  params: FetchYearDetailParams,
  options?: Omit<
    UseQueryOptions<
      MovieListResponse,
      Error,
      MovieListResponse,
      ReturnType<typeof yearDetailQueryKey>
    >,
    "queryKey" | "queryFn"
  >
) {
  const enabled =
    params.year != null && String(params.year).trim().length > 0;

  return useQuery({
    queryKey: yearDetailQueryKey(params),
    queryFn: () => fetchYearDetail(params),
    enabled: enabled && (options?.enabled !== false),
    ...options,
  });
}
