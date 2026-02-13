"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/api";
import type { CategoriesResponse } from "@/types/category-country";

const categoriesQueryKey = ["categories"] as const;

export function useCategories(
  options?: Omit<
    UseQueryOptions<
      CategoriesResponse,
      Error,
      CategoriesResponse,
      typeof categoriesQueryKey
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: categoriesQueryKey,
    queryFn: fetchCategories,
    ...options,
  });
}

export { categoriesQueryKey };
