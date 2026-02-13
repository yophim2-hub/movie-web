"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { MovieThumbCard } from "@/components/ui/movie-thumb-card";
import type { MovieListItem } from "@/types/movie-list";
import "swiper/css";
import "swiper/css/navigation";

const navBtnClass =
  "flex h-8 w-8 min-w-8 shrink-0 items-center justify-center rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--secondary-bg-solid)] text-[var(--foreground)] transition hover:bg-[var(--secondary-hover)] hover:border-[var(--accent)] disabled:opacity-40 sm:h-12 sm:w-12 sm:min-w-12";

export type MovieThumbCarouselVariant = "navigation" | "see-more";

export interface MovieThumbCarouselProps {
  /** Tiêu đề hiển thị cùng hàng với nút/link */
  title: string;
  /** Id cho heading (aria-labelledby của section) */
  titleId?: string;
  /** Danh sách phim */
  items: MovieListItem[];
  /**
   * navigation: nút Trước/Sau điều hướng carousel.
   * see-more: link "Xem thêm" điều hướng qua trang danh sách (cần seeMoreHref).
   */
  variant?: MovieThumbCarouselVariant;
  /** Id duy nhất cho nút nav (bắt buộc khi variant="navigation") */
  navId?: string;
  /** URL khi bấm "Xem thêm" (bắt buộc khi variant="see-more") */
  seeMoreHref?: string;
  /** Label link xem thêm, mặc định "Xem thêm" */
  seeMoreLabel?: string;
  /** Base path cho link phim */
  basePath?: string;
  className?: string;
}

export function MovieThumbCarousel({
  title,
  titleId,
  items,
  variant = "navigation",
  navId = "carousel",
  seeMoreHref,
  seeMoreLabel = "Xem thêm",
  basePath = "/phim",
  className = "",
}: Readonly<MovieThumbCarouselProps>) {
  if (items.length === 0) return null;

  const prevClass = `movie-thumb-carousel-${navId}-prev`;
  const nextClass = `movie-thumb-carousel-${navId}-next`;
  const useNavigation = variant === "navigation";

  return (
    <section
      className={`min-w-0 ${className}`}
      aria-labelledby={titleId ?? undefined}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2
          id={titleId}
          className="min-w-0 shrink text-lg font-semibold text-[var(--foreground)]"
        >
          {title}
        </h2>
        {useNavigation && (
          <div className="flex shrink-0 gap-2 sm:gap-3">
            <button
              type="button"
              className={`${prevClass} ${navBtnClass}`}
              aria-label="Trước"
            >
              <svg className="h-4 w-4 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              className={`${nextClass} ${navBtnClass}`}
              aria-label="Sau"
            >
              <svg className="h-4 w-4 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
        {!useNavigation && seeMoreHref && (
          <Link
            href={seeMoreHref}
            className="shrink-0 text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            {seeMoreLabel}
          </Link>
        )}
      </div>
      <div className="min-w-0 overflow-hidden">
        <Swiper
          modules={useNavigation ? [Navigation] : []}
          spaceBetween={16}
          slidesPerView={2}
          {...(useNavigation && {
            navigation: {
              prevEl: `.${prevClass}`,
              nextEl: `.${nextClass}`,
            },
          })}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
        >
          {items.map((item) => (
            <SwiperSlide key={item._id} className="!h-auto">
              <MovieThumbCard item={item} basePath={basePath} className="w-full max-w-full" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
