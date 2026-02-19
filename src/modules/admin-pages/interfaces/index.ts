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
  "phim-ngan",
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

/** Loại hiển thị danh sách phim trong section. */
export const SECTION_DISPLAY_TYPES = [
  "banner",
  "banner-small",
  "poster-list",
  "thumb-list",
  "grid-list",
  "poster-thumb",
  "top-list",
] as const;
export type SectionDisplayType = (typeof SECTION_DISPLAY_TYPES)[number];

/** Loại header cho section (poster-list, grid-list, thumb-list, poster-thumb): Xem thêm hoặc nút điều hướng. */
export const SECTION_HEADER_VARIANTS = ["see-more", "navigation"] as const;
export type SectionHeaderVariant = (typeof SECTION_HEADER_VARIANTS)[number];

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
  /** Loại hiển thị: banner, danh sách poster / thumb / grid / poster+thumb. */
  displayType?: SectionDisplayType;
  /** Loại header khi dùng poster-list / grid-list / thumb-list / poster-thumb: "Xem thêm" hoặc nút < >. Mặc định see-more. */
  headerVariant?: SectionHeaderVariant;
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
  /** SEO: meta title (thẻ title). */
  seoTitle?: string;
  /** SEO: meta description. */
  seoDescription?: string;
}

export const ADMIN_PAGE_LABELS: Record<AdminPageId, string> = {
  home: "Trang chủ",
  "phim-le": "Phim lẻ",
  "phim-bo": "Phim bộ",
  "phim-chieu-rap": "Phim chiếu rạp",
  "hoat-hinh": "Hoạt hình",
  "phim-ngan": "Phim ngắn",
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
  "phim-ngan": "/phim-ngan",
  "phim-vietsub": "/phim-vietsub",
  "phim-thuyet-minh": "/phim-thuyet-minh",
  "phim-long-tieng": "/phim-long-tieng",
  "tv-shows": "/tv-shows",
};

/** Các trang mặc định hiển thị trong Quản lý (Trang chủ + 5 trang theo type). Trừ Trang chủ, filter mặc định dùng typeList tương ứng. */
export const DEFAULT_PAGE_IDS = [
  "home",
  "phim-le",
  "phim-bo",
  "hoat-hinh",
  "phim-ngan",
  "tv-shows",
  "phim-chieu-rap",
] as const;

export type DefaultPageId = (typeof DEFAULT_PAGE_IDS)[number];

/** Nhãn hiển thị cho trang mặc định (Anime, Phim truyền hình thay cho Hoạt hình / TV Shows). */
export const DEFAULT_PAGE_LABELS: Record<DefaultPageId, string> = {
  home: "Trang chủ",
  "phim-le": "Phim lẻ",
  "phim-bo": "Phim bộ",
  "hoat-hinh": "Anime",
  "phim-ngan": "Phim ngắn",
  "tv-shows": "Phim truyền hình",
  "phim-chieu-rap": "Phim chiếu rạp",
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
