"use client";

import { MoviePosterCard } from "../movie-poster-card";
import { SectionSeeMoreLink } from "./section-see-more-link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { MovieListItem } from "@/types/movie-list";
import "swiper/css";
import "swiper/css/navigation";

const navBtnClass =
  "flex h-8 w-8 min-w-8 shrink-0 items-center justify-center rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--secondary-bg-solid)] text-[var(--foreground)] transition hover:bg-[var(--secondary-hover)] hover:border-[var(--accent)] disabled:opacity-40 sm:h-10 sm:w-10 sm:min-w-10";

export type SectionPosterListVariant = "see-more" | "navigation";

export interface SectionPosterListProps {
  title: string;
  items: MovieListItem[];
  basePath?: string;
  className?: string;
  /** see-more: link "Xem thêm". navigation: nút < >. Mặc định see-more. */
  variant?: SectionPosterListVariant;
  /** URL khi bấm "Xem thêm" (khi variant=see-more) */
  seeMoreHref?: string;
  /** Label link xem thêm, mặc định "Xem thêm" */
  seeMoreLabel?: string;
  /** Id cho nút nav (khi variant=navigation) */
  navId?: string;
}

/** Section danh sách poster (dọc), vuốt ngang bằng Swiper. Màn nhỏ 3, màn lớn 8. */
export function SectionPosterList({
  title,
  items,
  basePath = "/phim",
  className = "",
  variant = "see-more",
  seeMoreHref,
  seeMoreLabel = "Xem thêm",
  navId = "section-poster-list",
}: Readonly<SectionPosterListProps>) {
  if (items.length === 0) return null;
  const useNavigation = variant === "navigation";
  const prevClass = `${navId}-prev`;
  const nextClass = `${navId}-next`;

  return (
    <section className={`min-w-0 ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="min-w-0 shrink text-base font-semibold text-[var(--foreground)] sm:text-lg">
          {title}
        </h2>
        {useNavigation ? (
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
          <SectionSeeMoreLink href={seeMoreHref ?? basePath} label={seeMoreLabel} />
        )}
      </div>
      <div className="min-w-0 overflow-hidden">
        <Swiper
          modules={useNavigation ? [Navigation] : []}
          spaceBetween={8}
          slidesPerView={3}
          {...(useNavigation && {
            navigation: { prevEl: `.${prevClass}`, nextEl: `.${nextClass}` },
          })}
          breakpoints={{
            640: { slidesPerView: 4, spaceBetween: 16 },
            768: { slidesPerView: 5, spaceBetween: 16 },
            1024: { slidesPerView: 6, spaceBetween: 16 },
            1280: { slidesPerView: 8, spaceBetween: 16 },
          }}
        >
          {items.map((item) => (
            <SwiperSlide key={item._id} className="!h-auto">
              <MoviePosterCard item={item} basePath={basePath} className="w-full max-w-full" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
