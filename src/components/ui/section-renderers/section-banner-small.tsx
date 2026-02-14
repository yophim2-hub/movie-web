"use client";

import { isPhimimgUrl, webpLoader } from "@/lib/image-loader";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { MovieListItem } from "@/types/movie-list";
import "swiper/css";
import "swiper/css/pagination";

const POSTER_BASE = "https://phimimg.com";

function buildImageUrl(url: string): string {
  return url.startsWith("http") ? url : `${POSTER_BASE}/${url}`;
}

export interface SectionBannerSmallProps {
  title?: string;
  items: MovieListItem[];
  basePath?: string;
  className?: string;
  autoplayDelay?: number;
}

/** Banner nhỏ: slider đơn giản, chỉ dots, tỉ lệ thấp (compact). */
export function SectionBannerSmall({
  items,
  basePath = "/phim",
  className = "",
  autoplayDelay = 5000,
}: Readonly<SectionBannerSmallProps>) {
  if (items.length === 0) return null;

  return (
    <section
      id="top_slider_small"
      className={`min-w-0 w-full ${className}`}
      aria-label="Banner nhỏ"
    >
      <Swiper
        modules={[Pagination, ...(autoplayDelay > 0 ? [Autoplay] : [])]}
        spaceBetween={0}
        slidesPerView={1}
        loop={items.length > 1}
        pagination={{ clickable: true }}
        autoplay={
          autoplayDelay > 0
            ? { delay: autoplayDelay, disableOnInteraction: false }
            : false
        }
        className="section-banner-small [&_.swiper-pagination-bullet]:bg-white/80 [&_.swiper-pagination-bullet-active]:scale-125 [&_.swiper-pagination-bullet-active]:opacity-100"
      >
        {items.map((item) => (
          <SwiperSlide key={item._id}>
            <BannerSmallSlideContent item={item} basePath={basePath} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

function BannerSmallSlideContent({
  item,
  basePath,
}: Readonly<{ item: MovieListItem; basePath: string }>) {
  const href = `${basePath}/${item.slug}`;
  const posterSrc = buildImageUrl(item.poster_url || item.thumb_url);
  const name = item.name;

  return (
    <Link
      href={href}
      className="group relative block w-full overflow-hidden rounded-[var(--radius-panel)] bg-[var(--secondary-bg-solid)]"
      aria-label={`Xem phim ${name}`}
    >
      <div className="relative aspect-[4/1] w-full min-h-[120px] sm:aspect-[5/1] sm:min-h-[140px]">
        <Image
          src={posterSrc}
          alt={name}
          fill
          sizes="100vw"
          className="object-cover object-top transition duration-300 group-hover:scale-[1.03]"
          loader={isPhimimgUrl(posterSrc) ? webpLoader : undefined}
          unoptimized={!isPhimimgUrl(posterSrc)}
          priority
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"
          aria-hidden
        />
        <div className="absolute bottom-0 left-0 right-0 z-[1] p-3 sm:p-4">
          <h3 className="line-clamp-1 text-base font-semibold text-white drop-shadow sm:text-lg">
            {name}
          </h3>
        </div>
      </div>
    </Link>
  );
}
