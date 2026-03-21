"use client";

import Link from "next/link";
import { MoviePosterCard, formatOriginName } from "../movie-poster-card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { MovieListItem } from "@/types/movie-list";
import "swiper/css";
import "swiper/css/navigation";

const navBtnClass =
  "flex h-8 w-8 min-w-8 shrink-0 items-center justify-center rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--secondary-bg-solid)] text-[var(--foreground)] transition hover:bg-[var(--secondary-hover)] hover:border-[var(--accent)] disabled:opacity-40 sm:h-10 sm:w-10 sm:min-w-10";

const navId = "section-top-list";

export interface SectionTopListProps {
  title: string;
  items: MovieListItem[];
  basePath?: string;
  className?: string;
}

/** Section dạng top/bảng xếp hạng: poster có số thứ tự 1, 2, 3... — Swiper + nút <>. */
export function SectionTopList({
  title,
  items,
  basePath = "/phim",
  className = "",
}: Readonly<SectionTopListProps>) {
  if (items.length === 0) return null;
  const prevClass = `${navId}-prev`;
  const nextClass = `${navId}-next`;

  return (
    <section className={`min-w-0 ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="min-w-0 shrink text-base font-semibold text-[var(--foreground)] sm:text-lg">
          {title}
        </h2>
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
      </div>
      <div className="min-w-0 overflow-hidden">
        <Swiper
          modules={[Navigation]}
          spaceBetween={8}
          slidesPerView={1.5}
          navigation={{ prevEl: `.${prevClass}`, nextEl: `.${nextClass}` }}
          breakpoints={{
            640: { slidesPerView: 4, spaceBetween: 16 },
            768: { slidesPerView: 5, spaceBetween: 16 },
            1024: { slidesPerView: 6, spaceBetween: 16 },
            1280: { slidesPerView: 8, spaceBetween: 16 },
          }}
        >
          {items.map((item, index) => (
            <SwiperSlide key={item._id} className="!h-auto">
              <div className="flex w-full flex-col gap-2 sm:gap-3">
                <div className="[&_.info]:hidden">
                  <MoviePosterCard item={item} basePath={basePath} className="w-full max-w-full" />
                </div>
                <div className="flex min-w-0 items-start gap-2 sm:gap-4">
                  <span
                    className="shrink-0 text-[3rem] font-black italic leading-none text-[var(--accent)] drop-shadow-sm sm:text-[2.5rem]"
                    style={{ transform: "skewX(-10deg)", lineHeight: 1 }}
                  >
                    {index + 1}
                  </span>
                  <div className="info min-w-0 flex-1 space-y-1 sm:space-y-0.5">
                    <h4 className="item-title lim-1 min-w-0 text-[15px] font-medium leading-snug sm:text-[13px] sm:leading-tight">
                      <Link
                        href={`${basePath}/${item.slug}`}
                        title={item.name}
                        className="block truncate text-[var(--foreground)] hover:text-[var(--accent)]"
                      >
                        {item.name}
                      </Link>
                    </h4>
                    <h4 className="alias-title lim-1 min-w-0 text-[13px] leading-snug text-[var(--accent)] sm:text-[12px] sm:leading-tight">
                      <Link
                        href={`${basePath}/${item.slug}`}
                        title={formatOriginName(item.origin_name)}
                        className="block truncate hover:text-[var(--accent-hover)]"
                      >
                        {formatOriginName(item.origin_name) || "\u00A0"}
                      </Link>
                    </h4>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
