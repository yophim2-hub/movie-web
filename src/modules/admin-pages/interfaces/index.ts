/**
 * Admin Pages module — types cho cấu hình trang và filter (tương thích API).
 */

import type {
  MovieListType,
  SortField,
  SortType,
  SortLang,
} from "@/types/movie-list";

/** Các trang có thể cấu hình (home + các danh sách theo typeList) */
export const ADMIN_PAGE_IDS = [
  "home",
  "phim-le",
  "phim-bo",
  "phim-chieu-rap",
  "hoat-hinh",
  "phim-vietsub",
  "phim-thuyet-minh",
  "phim-long-tieng",
  "tv-shows",
] as const;

export type AdminPageId = (typeof ADMIN_PAGE_IDS)[number];

/**
 * Filter setting cho từng trang — map trực tiếp với API (useMovieList / useLatestMovieList).
 * - typeList: dùng cho GET /danh-sach/{typeList} (bỏ qua cho home, home dùng latest).
 * - category, country, year: slug/string theo API.
 */
export interface AdminFilterSetting {
  typeList?: MovieListType;
  page?: number;
  limit?: number;
  sortField?: SortField;
  sortType?: SortType;
  sortLang?: SortLang;
  category?: string;
  country?: string;
  year?: number;
}

/** Kiểu section: danh sách theo API filter hoặc block phim ghim (chỉ saved). */
export type AdminSectionType = "movie-list" | "pinned";

/**
 * Một section trong trang: có tiêu đề, thứ tự, kiểu (movie-list | pinned), filter và/hoặc phim đã chọn.
 */
export interface AdminSection {
  id: string;
  /** Tiêu đề hiển thị (vd: "Phim mới cập nhật", "Phim đề cử"). */
  title: string;
  /** Thứ tự hiển thị (0 = đầu). */
  order: number;
  type: AdminSectionType;
  /** Filter API cho type "movie-list". */
  filter: AdminFilterSetting;
  /** ID phim (_id) — dùng cho "pinned" hoặc bổ sung cho "movie-list". */
  savedMovieIds: string[];
}

/**
 * Cấu hình một trang: danh sách section (thứ tự, thêm/sửa/xóa/di chuyển).
 */
export interface AdminPageConfig {
  pageId: AdminPageIdAny;
  label: string;
  /** Slug cho custom page (routing) */
  slug?: string;
  filter: AdminFilterSetting;
  savedMovieIds: string[];
  /** Các section trong trang (carousel/block), có thể sắp xếp. */
  sections: AdminSection[];
}

export const ADMIN_PAGE_LABELS: Record<AdminPageId, string> = {
  home: "Trang chủ",
  "phim-le": "Phim lẻ",
  "phim-bo": "Phim bộ",
  "phim-chieu-rap": "Phim chiếu rạp",
  "hoat-hinh": "Hoạt hình",
  "phim-vietsub": "Phim Vietsub",
  "phim-thuyet-minh": "Phim thuyết minh",
  "phim-long-tieng": "Phim lồng tiếng",
  "tv-shows": "TV Shows",
};

/** Slug/path cho trang cố định */
export const ADMIN_PAGE_SLUGS: Record<AdminPageId, string> = {
  home: "/",
  "phim-le": "/phim-le",
  "phim-bo": "/phim-bo",
  "phim-chieu-rap": "/phim-chieu-rap",
  "hoat-hinh": "/hoat-hinh",
  "phim-vietsub": "/phim-vietsub",
  "phim-thuyet-minh": "/phim-thuyet-minh",
  "phim-long-tieng": "/phim-long-tieng",
  "tv-shows": "/tv-shows",
};

/** Trang tùy chỉnh do user thêm */
export interface AdminCustomPageMeta {
  id: string;
  slug: string;
  label: string;
}

/** ID trang = cố định hoặc custom-xxx */
export type AdminPageIdAny = AdminPageId | `custom-${string}`;

/** Một mục trong danh sách trang (cố định hoặc tùy chỉnh) */
export interface AdminPageListItem {
  id: AdminPageIdAny;
  label: string;
  slug: string;
  isBuiltIn: boolean;
}
