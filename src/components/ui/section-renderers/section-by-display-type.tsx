"use client";

import type { RefObject } from "react";
import type { MovieListItem } from "@/types/movie-list";
import { SectionBanner } from "./section-banner";
import { SectionBannerSmall } from "./section-banner-small";
import {
  SectionGridList,
  type SectionGridListPagination,
} from "./section-grid-list";
import { SectionPosterList } from "./section-poster-list";
import { SectionPosterThumb } from "./section-poster-thumb";
import { SectionThumbList } from "./section-thumb-list";
import { SectionTopList } from "./section-top-list";

/** Loại hiển thị section — dùng chung với admin config. */
export type SectionDisplayType =
  | "banner"
  | "banner-small"
  | "poster-list"
  | "thumb-list"
  | "grid-list"
  | "poster-thumb"
  | "top-list";

/** Loại header: Xem thêm (mặc định) hoặc nút điều hướng. */
export type SectionHeaderVariant = "see-more" | "navigation";

export interface SectionByDisplayTypeProps {
  title: string;
  items: MovieListItem[];
  displayType?: SectionDisplayType;
  basePath?: string;
  className?: string;
  /** Loại header cho poster-list / thumb-list / poster-thumb (grid-list luôn Xem thêm). Mặc định see-more. */
  headerVariant?: SectionHeaderVariant;
  /** URL khi bấm "Xem thêm" (khi headerVariant=see-more) */
  seeMoreHref?: string;
  /** Label link xem thêm, mặc định "Xem thêm" */
  seeMoreLabel?: string;
  /** Chỉ dùng khi displayType="grid-list": pagination (grid 3/8 cột + Pagination) */
  pagination?: SectionGridListPagination;
  /** Chỉ dùng khi displayType="grid-list": ẩn header (title + xem thêm). Mặc định true. */
  showHeader?: boolean;
  /** Chỉ dùng khi displayType="grid-list": ref wrapper list (scroll into view khi đổi trang) */
  listRef?: RefObject<HTMLDivElement | null>;
  /** Chỉ dùng khi displayType="grid-list": đang tải */
  isLoading?: boolean;
}

/** Chọn và render section theo Loại hiển thị. */
export function SectionByDisplayType({
  title,
  items,
  displayType = "poster-list",
  basePath = "/phim",
  className = "",
  headerVariant = "see-more",
  seeMoreHref,
  seeMoreLabel = "Xem thêm",
  pagination,
  showHeader = true,
  listRef,
  isLoading = false,
}: Readonly<SectionByDisplayTypeProps>) {
  const common = { title, items, basePath, className };
  const headerProps = {
    variant: headerVariant,
    seeMoreHref: seeMoreHref ?? basePath,
    seeMoreLabel,
  };
  /** grid-list không có chọn Loại header — luôn Xem thêm (trừ khi showHeader=false). */
  const gridListHeaderProps = {
    variant: "see-more" as const,
    seeMoreHref: seeMoreHref ?? basePath,
    seeMoreLabel,
  };
  const gridListProps = {
    ...common,
    ...gridListHeaderProps,
    navId: "section-grid-list",
    pagination,
    showHeader,
    listRef,
    isLoading,
  };
  switch (displayType) {
    case "banner":
      return <SectionBanner {...common} />;
    case "banner-small":
      return <SectionBannerSmall {...common} />;
    case "poster-list":
      return <SectionPosterList {...common} {...headerProps} navId="section-poster-list" />;
    case "thumb-list":
      return <SectionThumbList {...common} {...headerProps} />;
    case "grid-list":
      return <SectionGridList {...gridListProps} />;
    case "poster-thumb":
      return <SectionPosterThumb {...common} {...headerProps} navId="section-poster-thumb" />;
    case "top-list":
      return <SectionTopList {...common} />;
    default:
      return <SectionPosterList {...common} {...headerProps} navId="section-poster-list" />;
  }
}
