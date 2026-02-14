"use client";

import Link from "next/link";
import type { RefObject, ReactNode } from "react";
import { Pagination } from "@/components/ui";
import { MoviePosterCard } from "../movie-poster-card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { MovieListItem } from "@/types/movie-list";
import "swiper/css";
import "swiper/css/navigation";

const navBtnClass =
  "flex h-8 w-8 min-w-8 shrink-0 items-center justify-center rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--secondary-bg-solid)] text-[var(--foreground)] transition hover:bg-[var(--secondary-hover)] hover:border-[var(--accent)] disabled:opacity-40 sm:h-10 sm:w-10 sm:min-w-10";

export type SectionGridListVariant = "see-more" | "navigation";

export interface SectionGridListPagination {
  currentPage: number;
  totalPages: number;
  getPageHref: (page: number) => string;
}

export interface SectionGridListProps {
  title?: string;
  items: MovieListItem[];
  basePath?: string;
  className?: string;
  /** see-more: link "Xem thêm". navigation: nút < >. Mặc định see-more. */
  variant?: SectionGridListVariant;
  /** URL khi bấm "Xem thêm" (khi variant=see-more) */
  seeMoreHref?: string;
  /** Label link xem thêm, mặc định "Xem thêm" */
  seeMoreLabel?: string;
  /** Id cho nút nav (khi variant=navigation) */
  navId?: string;
  /** Khi có: hiển thị grid 3 cột / 8 cột (như trang thể loại) + Pagination bên dưới. Không dùng Swiper. */
  pagination?: SectionGridListPagination;
  /** Đang tải: làm mờ list + overlay spinner */
  isLoading?: boolean;
  /** Ref gắn vào wrapper list (scroll into view khi đổi trang) */
  listRef?: RefObject<HTMLDivElement | null>;
  /** Hiển thị header (title + see-more/nav). Mặc định true. Trang thể loại truyền false. */
  showHeader?: boolean;
}

/** Grid 3 cột (mobile) / 8 cột (lg) — dùng cho cả mode section và mode trang (pagination). */
const gridListClass = "grid grid-cols-3 gap-4 lg:grid-cols-8";

/** Section grid poster. Hỗ trợ mode section (header + grid/Swiper) hoặc mode trang (grid 3/8 cột + Pagination). */
export function SectionGridList({
  title = "",
  items,
  basePath = "/phim",
  className = "",
  variant = "see-more",
  seeMoreHref,
  seeMoreLabel = "Xem thêm",
  navId = "section-grid-list",
  pagination,
  isLoading = false,
  listRef,
  showHeader = true,
}: Readonly<SectionGridListProps>) {
  const usePagination = Boolean(pagination);
  const useNavigation = !usePagination && variant === "navigation";
  const prevClass = `${navId}-prev`;
  const nextClass = `${navId}-next`;

  if (items.length === 0 && !usePagination) return null;

  let gridContent: ReactNode;
  if (usePagination) {
    gridContent = (
      <ul className={gridListClass}>
        {items.map((item) => (
          <li key={item._id} className="min-w-0">
            <MoviePosterCard item={item} basePath={basePath} />
          </li>
        ))}
      </ul>
    );
  } else if (useNavigation) {
    gridContent = (
      <div className="min-w-0 overflow-hidden">
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={3}
          navigation={{ prevEl: `.${prevClass}`, nextEl: `.${nextClass}` }}
          breakpoints={{
            640: { slidesPerView: 4 },
            768: { slidesPerView: 5 },
            1024: { slidesPerView: 6 },
            1280: { slidesPerView: 8 },
          }}
        >
          {items.map((item) => (
            <SwiperSlide key={item._id} className="!h-auto">
              <MoviePosterCard item={item} basePath={basePath} className="w-full max-w-full" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  } else {
    /** Mode section (see-more, không pagination): cùng layout 3/8 cột như trang thể loại. */
    gridContent = (
      <div className={gridListClass}>
        {items.map((item) => (
          <MoviePosterCard key={item._id} item={item} basePath={basePath} />
        ))}
      </div>
    );
  }

  return (
    <section className={`min-w-0 ${className}`}>
      {showHeader && (title || variant === "see-more" || useNavigation) && (
        <div className="mb-4 flex items-center justify-between gap-4">
          {title ? (
            <h2 className="min-w-0 shrink text-lg font-semibold text-[var(--foreground)]">
              {title}
            </h2>
          ) : (
            <span />
          )}
          {!usePagination &&
            (useNavigation ? (
              <div className="flex shrink-0 gap-2">
                <button type="button" className={`${prevClass} ${navBtnClass}`} aria-label="Trước">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button type="button" className={`${nextClass} ${navBtnClass}`} aria-label="Sau">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ) : (
              <Link
                href={seeMoreHref ?? basePath}
                className="shrink-0 text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]"
              >
                {seeMoreLabel}
              </Link>
            ))}
        </div>
      )}
      {usePagination ? (
        <div ref={listRef as RefObject<HTMLDivElement>} className="relative">
          <div
            className={`transition-opacity duration-200 ${isLoading ? "opacity-60 pointer-events-none" : "opacity-100"}`}
          >
            {gridContent}
          </div>
          {isLoading && (
            <div
              className="absolute inset-0 flex items-center justify-center rounded-[var(--radius-panel)] bg-[var(--background)]/50"
              aria-hidden
            >
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
            </div>
          )}
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              getPageHref={pagination.getPageHref}
              className="mt-8"
            />
          )}
        </div>
      ) : (
        gridContent
      )}
    </section>
  );
}
