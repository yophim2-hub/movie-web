import type { EpisodeServer, MovieDetail } from "@/types/movie-detail";

/** Dữ liệu đã chuẩn hóa cho màn chi tiết phim (mobile + web dùng chung). */
export interface MovieDetailViewModel {
  readonly movie: MovieDetail;
  readonly episodes: EpisodeServer[];
  readonly firstCategorySlug: string;
  readonly timeDisplay: string;
  readonly originNameDisplay: string;
  readonly hasMetaTags: boolean;
}
