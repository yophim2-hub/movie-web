"use client";

import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { MovieListItem } from "@/types/movie-list";
import "swiper/css";
import "swiper/css/navigation";

const POSTER_BASE = "https://phimimg.com";

function buildImageUrl(url: string): string {
  return url.startsWith("http") ? url : `${POSTER_BASE}/${url}`;
}

const navBtnClass =
  "flex h-8 w-8 min-w-8 shrink-0 items-center justify-center rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--secondary-bg-solid)] text-[var(--foreground)] transition hover:bg-[var(--secondary-hover)] hover:border-[var(--accent)] disabled:opacity-40 sm:h-10 sm:w-10 sm:min-w-10";

export type SectionPosterThumbVariant = "see-more" | "navigation";

export interface SectionPosterThumbProps {
  title: string;
  items: MovieListItem[];
  basePath?: string;
  className?: string;
  /**
   * see-more: hiển thị link "Xem thêm" bên phải title.
   * navigation: hiển thị nút < > điều hướng, nội dung vuốt Swiper.
   */
  variant?: SectionPosterThumbVariant;
  /** URL khi bấm "Xem thêm" (dùng khi variant="see-more"), mặc định dùng basePath */
  seeMoreHref?: string;
  /** Label link xem thêm, mặc định "Xem thêm" */
  seeMoreLabel?: string;
  /** Id cho nút nav (khi variant="navigation"), mặc định "section-poster-thumb" */
  navId?: string;
}

/** Card: ảnh thumb trên, dưới là poster bên trái + thông tin bên phải. */
function PosterThumbCard({
  item,
  basePath,
}: Readonly<{ item: MovieListItem; basePath: string }>) {
  const href = `${basePath}/${item.slug}`;
  const thumbSrc = buildImageUrl(item.thumb_url || item.poster_url);
  const posterSrc = buildImageUrl(item.poster_url || item.thumb_url);
  const name = item.name;
  const alias = item.origin_name || "";
  const pin = item.episode_current ?? "";

  return (
    <div className="flex flex-col overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--secondary-bg-solid)]">
      {/* Ảnh thumb bên trên */}
      <Link href={href} className="group relative block">
        {pin ? (
          <div className="absolute left-0 top-0 z-[1] flex items-center rounded-br-[var(--radius-button)] bg-[var(--accent)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--foreground)] shadow-[var(--shadow-sm)] sm:px-2 sm:py-1 sm:text-[11px]">
            {pin}
          </div>
        ) : null}
        <div className="aspect-video relative w-full overflow-hidden bg-[var(--secondary-bg-solid)]">
          <Image
            src={thumbSrc}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, 280px"
            className="object-cover transition duration-200 group-hover:scale-[1.03]"
          />
        </div>
      </Link>
      {/* Dưới: poster bên trái + thông tin bên phải */}
      <div className="flex gap-3 p-2">
        <Link
          href={href}
          className="v-thumbnail shrink-0 overflow-hidden rounded-[var(--radius-button)] bg-[var(--secondary-bg-solid)]"
        >
          <div className="aspect-[2/3] relative w-[72px] overflow-hidden sm:w-[80px]">
            <Image
              src={posterSrc}
              alt={name}
              fill
              sizes="80px"
              className="object-cover transition duration-200 hover:scale-[1.03]"
            />
          </div>
        </Link>
        <div className="info min-w-0 flex-1">
          <h4 className="item-title line-clamp-2">
            <Link
              href={href}
              title={name}
              className="block text-[12px] font-medium text-[var(--foreground)] hover:text-[var(--accent)] sm:text-[13px]"
            >
              {name}
            </Link>
          </h4>
          {alias ? (
            <p className="alias-title mt-0.5 line-clamp-1 text-[11px] text-[var(--foreground-muted)] sm:text-[12px]">
              <Link href={href} title={alias} className="hover:text-[var(--accent)]">
                {alias}
              </Link>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Section: mỗi item có thumb trên, poster + thông tin dưới. Có thể chọn header: Xem thêm hoặc nút < >. */
export function SectionPosterThumb({
  title,
  items,
  basePath = "/phim",
  className = "",
  variant = "see-more",
  seeMoreHref,
  seeMoreLabel = "Xem thêm",
  navId = "section-poster-thumb",
}: Readonly<SectionPosterThumbProps>) {
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
            <button
              type="button"
              className={`${prevClass} ${navBtnClass}`}
              aria-label="Trước"
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              className={`${nextClass} ${navBtnClass}`}
              aria-label="Sau"
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ) : (
          <Link
            href={seeMoreHref ?? basePath}
            className="shrink-0 text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] sm:text-sm"
          >
            {seeMoreLabel}
          </Link>
        )}
      </div>

      {useNavigation ? (
        <div className="min-w-0 overflow-hidden">
          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={1}
            navigation={{ prevEl: `.${prevClass}`, nextEl: `.${nextClass}` }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
          >
            {items.map((item) => (
              <SwiperSlide key={item._id} className="!h-auto">
                <PosterThumbCard item={item} basePath={basePath} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((item) => (
            <PosterThumbCard key={item._id} item={item} basePath={basePath} />
          ))}
        </div>
      )}
    </section>
  );
}
