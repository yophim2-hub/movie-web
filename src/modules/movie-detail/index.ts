/**
 * Movie Detail — /phim/[slug]
 *
 * - interfaces/, services/ — logic + view model
 * - mobile/components, web/components — UI
 * - pages/ — hero, skeleton, not-found + route page
 */

export { default } from "./pages";
export * from "./pages";
export * from "./web/components";
export {
  MovieDetailMobileLayout,
  MovieDetailMetaTags,
  MovieDetailTabs,
  type MovieDetailMobileLayoutProps,
  type MovieDetailMetaTagsProps,
  type MovieDetailTabsProps,
} from "./mobile/components";
export { MovieDetailHero } from "./pages/movie-detail-hero";
export { MovieDetailNotFound } from "./pages/movie-detail-not-found";
export { MovieDetailSkeleton } from "./pages/movie-detail-skeleton";
export * from "./interfaces";
export * from "./services";
