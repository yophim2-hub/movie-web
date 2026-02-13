/**
 * Types for PhimAPI search movie endpoint.
 * GET /v1/api/tim-kiem?keyword=...&page=...
 * Response structure matches API response exactly.
 */

import type {
  MovieListItem,
  BreadCrumbItem,
  MovieListPagination,
  SortField,
  SortType,
  SortLang,
} from "./movie-list";

export type { SortField, SortType, SortLang } from "./movie-list";

export interface SearchMovieParams {
  keyword: string;
  page?: number;
  sortField?: SortField;
  sortType?: SortType;
  sortLang?: SortLang;
  category?: string;
  country?: string;
  year?: number;
  limit?: number;
}

/** SEO on-page metadata for search (og_image can be null) */
export interface SearchSeoOnPage {
  og_type: string;
  titleHead: string;
  descriptionHead: string;
  og_image: string[] | null;
  og_url: string;
}

/** Params block inside search data (includes keyword) */
export interface SearchMovieDataParams {
  type_slug: string;
  keyword: string;
  filterCategory: string[];
  filterCountry: string[];
  filterYear: string[];
  filterType: string[];
  sortField: string;
  sortType: string;
  pagination: MovieListPagination;
}

/** Full `data` object of search API response */
export interface SearchMovieData {
  seoOnPage: SearchSeoOnPage;
  breadCrumb: BreadCrumbItem[];
  titlePage: string;
  /** Null when no results */
  items: MovieListItem[] | null;
  params: SearchMovieDataParams;
  type_list: string;
  APP_DOMAIN_FRONTEND: string;
  APP_DOMAIN_CDN_IMAGE: string;
}

/** Root response of GET /v1/api/tim-kiem */
export interface SearchMovieResponse {
  status: boolean | string;
  msg: string;
  data: SearchMovieData;
}
