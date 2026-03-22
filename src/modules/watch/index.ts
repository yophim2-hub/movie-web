/**
 * Watch (xem-phim) — /xem-phim/[slug], /xem-phim/[slug]/[episodeSlug]
 *
 * - interfaces/, services/
 * - mobile/components — UI + logic tab/stack mobile
 * - web/components — sidebar desktop
 * - pages — compose + skeleton + route pages
 */

export {
  WatchContent,
  WatchEpisodePage,
  WatchFullPage,
  WatchSkeleton,
  type WatchSkeletonLayout,
  type WatchSkeletonProps,
} from "./pages";
export * from "./web/components";
export {
  WatchMobileSplitColumn,
  WatchMobileStackLayout,
  WatchMovieInfoBlock,
  type WatchMobileSplitColumnProps,
  type WatchMobileStackLayoutProps,
  type WatchMovieInfoBlockProps,
} from "./mobile/components";
export * from "./interfaces";
export * from "./services";
