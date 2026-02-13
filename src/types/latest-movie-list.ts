/**
 * Types for PhimAPI "phim mới cập nhật" list endpoint (root domain).
 * GET https://phimapi.com/danh-sach/phim-moi-cap-nhat-v3?page=...
 * Response: { status, msg, items, pagination } (no data wrapper).
 */

import type { TmdbRef, ImdbRef, TimeStampRef, CategoryRef, CountryRef } from "./movie-list";

/**
 * List item for latest-movie-list API.
 * Omits "created" and "chieurap" which are not returned by this endpoint.
 */
export interface LatestMovieListItem {
  tmdb: TmdbRef;
  imdb: ImdbRef;
  modified: TimeStampRef;
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  type: string;
  poster_url: string;
  thumb_url: string;
  sub_docquyen: boolean;
  time: string;
  episode_current: string;
  quality: string;
  lang: string;
  year: number;
  category: CategoryRef[];
  country: CountryRef[];
  /** Not returned by phim-moi-cap-nhat-v3 */
  created?: TimeStampRef;
  /** Not returned by phim-moi-cap-nhat-v3 */
  chieurap?: boolean;
}

/** Pagination for latest movie list (includes updateToday) */
export interface LatestMovieListPagination {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  totalPages: number;
  updateToday: number;
}

/** Root response of GET /danh-sach/phim-moi-cap-nhat-v3 */
export interface LatestMovieListResponse {
  status: boolean;
  msg: string;
  items: LatestMovieListItem[];
  pagination: LatestMovieListPagination;
}
