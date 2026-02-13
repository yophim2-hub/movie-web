/**
 * Watch (xem-phim) module — /xem-phim/[slug] and /xem-phim/[slug]/[episodeSlug].
 * Structure: pages, components, hooks, interfaces.
 */

export { WatchFullPage, WatchEpisodePage } from "./pages";
export { WatchContent, WatchSidebar } from "./components";
export type {
  WatchContentProps,
  WatchContentMovie,
  WatchLayout,
  WatchSidebarProps,
} from "./components";
