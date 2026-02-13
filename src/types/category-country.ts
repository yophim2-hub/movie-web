/**
 * Types for PhimAPI category & country list endpoints (root domain).
 * GET https://phimapi.com/the-loai  -> CategoryItem[]
 * GET https://phimapi.com/quoc-gia  -> CountryItem[]
 */

/** Single category from GET /the-loai */
export interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
}

/** Single country from GET /quoc-gia */
export interface CountryItem {
  _id: string;
  name: string;
  slug: string;
}

/** Response of GET /the-loai (array only) */
export type CategoriesResponse = CategoryItem[];

/** Response of GET /quoc-gia (array only) */
export type CountriesResponse = CountryItem[];
