/**
 * Lịch sử xem: một mục = phim + tập (nếu có) + tiến độ.
 * Dùng cho "đang xem dở" và "xem tiếp".
 */
export interface WatchHistoryItem {
  /** Slug phim */
  movieSlug: string;
  /** Tên phim (hiển thị) */
  movieName?: string;
  /** Poster/thumb (hiển thị) */
  posterUrl?: string;
  /** Slug tập đang xem (phim bộ); phim lẻ để trống */
  episodeSlug?: string;
  /** Tên tập (hiển thị) */
  episodeName?: string;
  /** Thời điểm đã xem đến (giây) */
  progressSeconds: number;
  /** Tổng thời lượng tập (giây), nếu có */
  durationSeconds?: number;
  /** Thời điểm cập nhật (ISO string) */
  updatedAt: string;
}

/**
 * Phim yêu thích: slug + meta hiển thị.
 */
export interface FavoriteItem {
  movieSlug: string;
  movieName?: string;
  posterUrl?: string;
  /** Thời điểm thêm (ISO string) */
  addedAt: string;
}

export const WATCH_HISTORY_COOKIE = "bong_watch_history";
export const FAVORITES_COOKIE = "bong_favorites";
/** Số mục tối đa trong lịch sử xem (tránh cookie quá lớn) */
export const WATCH_HISTORY_MAX = 50;
/** Cookie sống 1 năm */
export const COOKIE_MAX_AGE = 365 * 24 * 60 * 60;
