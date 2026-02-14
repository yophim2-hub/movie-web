"use client";

import { MovieThumbCarousel } from "../movie-thumb-carousel";
import type { MovieThumbCarouselVariant } from "../movie-thumb-carousel";
import type { MovieListItem } from "@/types/movie-list";

export interface SectionThumbListProps {
  title: string;
  items: MovieListItem[];
  basePath?: string;
  className?: string;
  /** see-more: link "Xem thêm". navigation: nút < >. Mặc định see-more. */
  variant?: MovieThumbCarouselVariant;
  /** URL khi bấm "Xem thêm" (khi variant=see-more) */
  seeMoreHref?: string;
  /** Label link xem thêm, mặc định "Xem thêm" */
  seeMoreLabel?: string;
  /** Id cho nút nav (khi variant=navigation) */
  navId?: string;
}

/** Section danh sách thumb dạng carousel (trượt ngang). */
export function SectionThumbList({
  title,
  items,
  basePath = "/phim",
  className = "",
  variant = "see-more",
  seeMoreHref,
  seeMoreLabel = "Xem thêm",
  navId,
}: Readonly<SectionThumbListProps>) {
  if (items.length === 0) return null;
  return (
    <MovieThumbCarousel
      title={title}
      items={items}
      variant={variant}
      navId={navId ?? `section-thumb-${title.replaceAll(/\s/g, "-")}`}
      seeMoreHref={seeMoreHref}
      seeMoreLabel={seeMoreLabel}
      basePath={basePath}
      className={className}
    />
  );
}
