"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { fetchCountryDetail, type FetchCountryDetailParams } from "@/lib/api";
import type { MovieListResponse } from "@/types/movie-list";

export const countryDetailQueryKey = (params: FetchCountryDetailParams) =>
  ["country-detail", params] as const;

export function useCountryDetail(
  params: FetchCountryDetailParams,
  options?: Omit<
    UseQueryOptions<
      MovieListResponse,
      Error,
      MovieListResponse,
      ReturnType<typeof countryDetailQueryKey>
    >,
    "queryKey" | "queryFn"
  >
) {
  const enabled =
    typeof params.countrySlug === "string" &&
    params.countrySlug.trim().length > 0;

  return useQuery({
    queryKey: countryDetailQueryKey(params),
    queryFn: () => fetchCountryDetail(params),
    enabled: enabled && (options?.enabled !== false),
    ...options,
  });
}
