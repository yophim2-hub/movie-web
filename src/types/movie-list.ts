/**
 * Types for PhimAPI movie list endpoint.
 * GET /v1/api/danh-sach/{typeList}
 * Response structure matches API response exactly.
 */

export const MOVIE_LIST_TYPES = [
  "phim-bo",
  "phim-le",
  "phim-chieu-rap",
  "tv-shows",
  "hoat-hinh",
  "phim-vietsub",
  "phim-thuyet-minh",
  "phim-long-tieng",
] as const;

export type MovieListType = (typeof MOVIE_LIST_TYPES)[number];

export const SORT_FIELDS = ["modified.time", "_id", "year"] as const;
export type SortField = (typeof SORT_FIELDS)[number];

export const SORT_TYPES = ["desc", "asc"] as const;
export type SortType = (typeof SORT_TYPES)[number];

export const SORT_LANGS = ["vietsub", "thuyet-minh", "long-tieng"] as const;
export type SortLang = (typeof SORT_LANGS)[number];

export interface MovieListParams {
  page?: number;
  sortField?: SortField;
  sortType?: SortType;
  sortLang?: SortLang;
  category?: string;
  country?: string;
  year?: number;
  limit?: number;
}

/** TMDB reference; all fields may be null when not available */
export interface TmdbRef {
  type: string | null;
  id: string | null;
  season: number | null;
  vote_average: number;
  vote_count: number;
}

/** IMDB reference */
export interface ImdbRef {
  id: string | null;
}

/** Category item in movie category/country arrays */
export interface CategoryRef {
  id: string;
  name: string;
  slug: string;
}

/** Country item in movie country array */
export interface CountryRef {
  id: string;
  name: string;
  slug: string;
}

/** Created/Modified time wrapper */
export interface TimeStampRef {
  time: string;
}

/** Single movie/series item in list response */
export interface MovieListItem {
  tmdb: TmdbRef;
  imdb: ImdbRef;
  created: TimeStampRef;
  modified: TimeStampRef;
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  type: string;
  poster_url: string;
  thumb_url: string;
  sub_docquyen: boolean;
  chieurap: boolean;
  time: string;
  episode_current: string;
  quality: string;
  lang: string;
  year: number;
  category: CategoryRef[];
  country: CountryRef[];
}

/** Breadcrumb item in SEO breadcrumb list */
export interface BreadCrumbItem {
  name: string;
  slug?: string;
  isCurrent: boolean;
  position: number;
}

/** Pagination info in params */
export interface MovieListPagination {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

/** Params block inside data */
export interface MovieListDataParams {
  type_slug: string;
  filterCategory: string[];
  filterCountry: string[];
  filterYear: string[];
  filterType: string[];
  sortField: string;
  sortType: string;
  pagination: MovieListPagination;
}

/** SEO on-page metadata */
export interface SeoOnPage {
  og_type: string;
  titleHead: string;
  descriptionHead: string;
  og_image: string[];
  og_url: string;
}

/** Full `data` object of movie list API response */
export interface MovieListData {
  seoOnPage: SeoOnPage;
  breadCrumb: BreadCrumbItem[];
  titlePage: string;
  items: MovieListItem[];
  params: MovieListDataParams;
  type_list: string;
  APP_DOMAIN_FRONTEND: string;
  APP_DOMAIN_CDN_IMAGE: string;
}

/** Root response of GET /v1/api/danh-sach/{typeList} */
export interface MovieListResponse {
  status: boolean;
  msg: string;
  data: MovieListData;
}
