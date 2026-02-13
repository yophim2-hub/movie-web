/**
 * Types for PhimAPI movie detail endpoint.
 * GET /v1/api/phim/{slug}
 * Response structure matches API response exactly.
 */

import type {
  TmdbRef,
  ImdbRef,
  TimeStampRef,
  CategoryRef,
  CountryRef,
} from "./movie-list";

/** Single episode item (one server source) */
export interface EpisodeItem {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

/** Episode server group (e.g. "Vietsub" or "Lồng Tiếng") */
export interface EpisodeServer {
  server_name: string;
  server_data: EpisodeItem[];
}

/** Full movie/series detail (item in detail response) */
export interface MovieDetail {
  tmdb: TmdbRef;
  imdb: ImdbRef;
  created: TimeStampRef;
  modified: TimeStampRef;
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  content: string;
  type: string;
  status: string;
  poster_url: string;
  thumb_url: string;
  is_copyright: boolean;
  sub_docquyen: boolean;
  chieurap: boolean;
  trailer_url: string;
  time: string;
  episode_current: string;
  episode_total: string;
  quality: string;
  lang: string;
  notify: string;
  showtimes: string;
  year: number;
  view: number;
  actor: string[];
  director: string[];
  category: CategoryRef[];
  country: CountryRef[];
}

/** Detail page SEO (may include seoSchema) */
export interface MovieDetailSeoOnPage {
  og_type: string;
  titleHead: string;
  descriptionHead: string;
  og_image: string[];
  og_url: string;
  seoSchema?: unknown;
  updated_time?: number;
}

/** Breadcrumb item for detail (slug optional) */
export interface MovieDetailBreadCrumbItem {
  name: string;
  slug?: string;
  isCurrent?: boolean;
  position: number;
}

/** Full `data` object of movie detail API response */
export interface MovieDetailData {
  seoOnPage: MovieDetailSeoOnPage;
  breadCrumb: MovieDetailBreadCrumbItem[];
  params: { slug: string };
  item: MovieDetail;
  episodes: EpisodeServer[];
}

/** Root response of GET /v1/api/phim/{slug} */
export interface MovieDetailResponse {
  status: boolean;
  msg: string;
  data: MovieDetailData;
}
