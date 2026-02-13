"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { fetchCategoryDetail, type FetchCategoryDetailParams } from "@/lib/api";
import type { MovieListResponse } from "@/types/movie-list";

export const categoryDetailQueryKey = (params: FetchCategoryDetailParams) =>
  ["category-detail", params] as const;

export function useCategoryDetail(
  params: FetchCategoryDetailParams,
  options?: Omit<
    UseQueryOptions<
      MovieListResponse,
      Error,
      MovieListResponse,
      ReturnType<typeof categoryDetailQueryKey>
    >,
    "queryKey" | "queryFn"
  >
) {
  const enabled =
    typeof params.categorySlug === "string" &&
    params.categorySlug.trim().length > 0;

  return useQuery({
    queryKey: categoryDetailQueryKey(params),
    queryFn: () => fetchCategoryDetail(params),
    enabled: enabled && (options?.enabled !== false),
    ...options,
  });
}
