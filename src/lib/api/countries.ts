import { phimApiRootClient } from "./axios-client";
import type { CountriesResponse } from "@/types/category-country";

/**
 * Fetches all countries from PhimAPI.
 * GET https://phimapi.com/quoc-gia
 */
export async function fetchCountries(): Promise<CountriesResponse> {
  const { data } = await phimApiRootClient.get<CountriesResponse>("/quoc-gia");
  return data;
}
