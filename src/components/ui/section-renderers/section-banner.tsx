"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Thumbs } from "swiper/modules";
import type { MovieListItem } from "@/types/movie-list";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/thumbs";

const POSTER_BASE = "https://phimimg.com";

function buildImageUrl(url: string): string {
  return url.startsWith("http") ? url : `${POSTER_BASE}/${url}`;
}

export interface SectionBannerProps {
  title?: string;
  items: MovieListItem[];
  basePath?: string;
  className?: string;
  autoplayDelay?: number;
}

export function SectionBanner({
  items,
  basePath = "/phim",
  className = "",
  autoplayDelay = 5000,
}: Readonly<SectionBannerProps>) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const dotsContainerRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const el = dotRefs.current[activeIndex];
    const container = dotsContainerRef.current?.firstElementChild as HTMLElement | null;
    if (el && container) {
      const left = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2;
      container.scrollTo({ left, behavior: "smooth" });
    }
  }, [activeIndex]);

  if (items.length === 0) return null;

  return (
    <section id="top_slider" className={`min-w-0 w-full ${className}`}>
      <div className="slide-wrapper top-slide-wrap relative">
        <Swiper
          onSwiper={setMainSwiper}
          onSlideChange={(sw) => setActiveIndex(sw.realIndex)}
          modules={[Thumbs, ...(autoplayDelay > 0 ? [Autoplay] : [])]}
          thumbs={{
            swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
            autoScrollOffset: 1,
          }}
          spaceBetween={16}
          slidesPerView={1}
          loop={items.length > 1}
          autoplay={
            autoplayDelay > 0
              ? { delay: autoplayDelay, disableOnInteraction: false }
              : false
          }
          className="slider-chinh top-slide-main section-banner-swiper"
        >
          {items.map((item) => (
            <SwiperSlide key={item._id}>
              <BannerSlideContent item={item} basePath={basePath} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="slider-chinh-nho top-slide-small absolute bottom-4 right-4 z-10 hidden md:block w-full max-w-[366px] sm:max-w-[414px]">
          <Swiper
            onSwiper={setThumbsSwiper}
            watchSlidesProgress
            spaceBetween={6}
            slidesPerView="auto"
            freeMode
            className="thumbs-banner !overflow-hidden [&_.swiper-slide-thumb-active>div]:scale-[1.02] [&_.swiper-slide-thumb-active>div]:shadow-md"
          >
            {items.map((item) => (
              <SwiperSlide key={item._id} className="!w-14 !flex-shrink-0 sm:!w-16 cursor-pointer">
                <div className="relative aspect-video w-full overflow-hidden rounded-[var(--radius-button)] border-0 ring-0 shadow-lg transition-all duration-200 hover:scale-[1.02]">
                  <Image
                    src={buildImageUrl(item.poster_url || item.thumb_url)}
                    alt={item.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <div
        ref={dotsContainerRef}
        className="banner-custom-dots flex justify-center pt-3 md:hidden"
        aria-label="Chọn slide"
      >
        <div className="flex max-w-[50vw] flex-nowrap items-center justify-center gap-1.5 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item, i) => (
            <button
              key={item._id}
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              type="button"
              onClick={() => mainSwiper?.slideToLoop(i)}
              className={`h-2 w-2 shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                activeIndex === i ? "bg-[var(--accent)]" : "bg-[var(--accent)]/40 hover:bg-[var(--accent)]/60"
              }`}
              aria-label={`Slide ${i + 1}`}
              aria-current={activeIndex === i ? "true" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function BannerSlideContent({
  item,
  basePath,
}: Readonly<{ item: MovieListItem; basePath: string }>) { 
  const href = `${basePath}/${item.slug}`;
  const posterSrc = buildImageUrl(item.thumb_url || item.poster_url);
  const name = item.name;
  const alias = item.origin_name || "";
  const year = item.year;
  const episodeLabel = item.episode_current ?? "";
  const categories = item.category ?? [];

  return (
    <div className="slide-elements relative w-full overflow-hidden rounded-[var(--radius-panel)] border-0 ring-0 bg-[var(--secondary-bg-solid)]">
      <Link
        href={href}
        className="slide-url absolute inset-0 z-[2]"
        aria-label={`Xem phim ${name}`}
      />
      <div
        className="background-fade absolute inset-0 bg-cover bg-top opacity-30"
        style={{ backgroundImage: `url('${posterSrc}')` }}
        aria-hidden
      />
      <div className="cover-fade relative min-h-[35vh] w-full aspect-[2/1] sm:min-h-0 sm:aspect-[21/9] md:aspect-auto md:h-[80vh]">
        <div className="cover-image absolute inset-0">
          <Image
            src={posterSrc}
            alt={name}
            fill
            sizes="100vw"
            className="object-cover object-top"
            style={{ color: "transparent" }}
            priority
          />
        </div>
        {/* Dotted overlay */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{ backgroundImage: "url('/images/dotted.png')", backgroundRepeat: "repeat" }}
          aria-hidden
        />
      </div>
      {/* Gradient top — header readable */}
      <div
        className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-transparent"
        aria-hidden
      />
      {/* Gradient bottom — fade to page background */}
      <div
        className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[var(--background)] via-transparent to-transparent"
        aria-hidden
      />
      <div className="safe-area absolute bottom-0 left-0 right-0 z-[1] p-3 sm:p-6">
        <div className="slide-content max-w-3xl">
          <div className="media-item">
            <h3 className="media-title text-base font-semibold text-white drop-shadow sm:text-xl md:text-2xl">
              <Link href={href} className="hover:text-[var(--accent)]">
                {name}
              </Link>
            </h3>
            {alias ? (
              <h3 className="media-alias-title mt-0.5 text-xs text-white/90 sm:text-base">
                <Link href={href}>{alias}</Link>
              </h3>
            ) : null}
            <div className="hl-tags mt-1.5 sm:mt-2 flex flex-wrap gap-1.5 sm:gap-2">
              {year ? (
                <div className="tag-classic rounded bg-white/20 px-2 py-0.5 text-xs text-white">
                  <span>{year}</span>
                </div>
              ) : null}
             
              {episodeLabel ? (
                <div className="tag-classic rounded bg-white/20 px-2 py-0.5 text-xs text-white">
                  <span>{episodeLabel}</span>
                </div>
              ) : null}
            </div>
            {categories.length > 0 ? (
              <div className="hl-tags mb-2 sm:mb-4 mt-1.5 sm:mt-2 hidden sm:flex flex-wrap gap-1.5 sm:gap-2">
                {categories.map((cat, i) => (
                  <Link
                    key={`${cat.slug}-${i}`}
                    href={`/the-loai/${cat.slug}`}
                    className="tag-topic rounded bg-white/15 px-2 py-0.5 text-xs text-white/95 hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
                    title={cat.name}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            ) : null}
            <div className="description lim-3 mt-1.5 sm:mt-2 line-clamp-2 sm:line-clamp-3 text-xs sm:text-sm text-white/85" />
            <div className="touch mt-3 sm:mt-4 hidden md:block">
              <Link
                href={href}
                className="button-play inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--foreground)] shadow-[var(--shadow-md)] transition hover:bg-[var(--accent-hover)] sm:h-12 sm:w-12"
                aria-label="Xem phim"
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth={0}
                  viewBox="0 0 384 512"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  aria-hidden
                >
                  <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
