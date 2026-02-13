"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { fetchCountries } from "@/lib/api";
import type { CountriesResponse } from "@/types/category-country";

const countriesQueryKey = ["countries"] as const;

export function useCountries(
  options?: Omit<
    UseQueryOptions<
      CountriesResponse,
      Error,
      CountriesResponse,
      typeof countriesQueryKey
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: countriesQueryKey,
    queryFn: fetchCountries,
    ...options,
  });
}

export { countriesQueryKey };
