import { phimApiRootClient } from "./axios-client";
import type { CategoriesResponse } from "@/types/category-country";

/**
 * Fetches all categories from PhimAPI.
 * GET https://phimapi.com/the-loai
 */
export async function fetchCategories(): Promise<CategoriesResponse> {
  const { data } = await phimApiRootClient.get<CategoriesResponse>("/the-loai");
  return data;
}
