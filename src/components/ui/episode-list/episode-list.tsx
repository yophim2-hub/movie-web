"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import type { EpisodeItem, EpisodeServer } from "@/types/movie-detail";
import { EpisodeCard, SingleMovieCard, TvMonitorIcon } from "./episode-list-items";

const tabContentTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.2, ease: "easeOut" as const },
};

export type EpisodeListVariant = "simple" | "grid" | "watch";

export interface EpisodeListProps {
  readonly episodes: EpisodeServer[];
  readonly title?: string;
  readonly className?: string;
  /** "simple" = danh sách link, "grid" = lưới thẻ, "watch" = ngang (tập) + dọc (bản phim lẻ) */
  readonly variant?: EpisodeListVariant;
  /** Số tập hiển thị khi rút gọn (grid). Mặc định 12. */
  readonly defaultVisibleCount?: number;
  /** Ngưỡng số tập để hiện thanh range (Tập 1-100, 101-200...). Mặc định 100. */
  readonly rangeThreshold?: number;
  /** Số tập mỗi range. Mặc định 100. */
  readonly rangeSize?: number;
  /** Ảnh thumb/poster (phim lẻ: thẻ xem bản). */
  readonly posterUrl?: string;
  /** Tên phim (phim lẻ: tiêu đề thẻ). */
  readonly movieName?: string;
  /** Slug phim: khi có thì link tập điều hướng /xem-phim/slug hoặc /xem-phim/slug/id-tap */
  readonly movieSlug?: string;
  /** true = phim full (1 server 1 tập): chỉ dùng /xem-phim/slug, không truyền tập */
  readonly fullOnly?: boolean;
  /** Số cột tối đa lưới tập (4 = sidebar, 8 = mặc định). */
  readonly maxGridCols?: 4 | 8;
  /** Slug tập đang xem (trang xem-phim): thẻ tập trùng slug sẽ được highlight. */
  readonly activeEpisodeSlug?: string;
}

const RANGE_THRESHOLD_DEFAULT = 100;
const RANGE_SIZE_DEFAULT = 100;

interface EpisodeListWatchProps {
  readonly episodes: EpisodeServer[];
  readonly activeIndex: number;
  readonly setServerIndex: (i: number) => void;
  readonly hasMultipleServers: boolean;
  readonly useRanges: boolean;
  readonly rangeCount: number;
  readonly rangeSize: number;
  readonly baseItems: EpisodeItem[];
  readonly items: EpisodeItem[];
  readonly activeRangeIndex: number;
  readonly setActiveRangeIndex: (i: number) => void;
  readonly posterUrl?: string;
  readonly movieName?: string;
  readonly movieSlug?: string;
  readonly fullOnly: boolean;
  readonly activeEpisodeSlug?: string;
  readonly title: string;
  readonly className: string;
}

function EpisodeListWatch({
  episodes,
  activeIndex,
  setServerIndex,
  hasMultipleServers,
  useRanges,
  rangeCount,
  rangeSize,
  baseItems,
  items,
  activeRangeIndex,
  setActiveRangeIndex,
  posterUrl,
  movieName,
  movieSlug,
  fullOnly,
  activeEpisodeSlug,
  title,
  className,
}: EpisodeListWatchProps) {
  const horizontalItems = useRanges ? baseItems : items;
  const isSingleMovie = episodes.every((s) => (s.server_data?.length ?? 0) <= 1);
  return (
    <div className={`flex min-h-0 min-w-0 flex-col gap-4 ${className}`.trim()}>
      {isSingleMovie ? (
        <div className="min-w-0 flex-1 overflow-y-auto overscroll-contain rounded-[var(--radius-panel)] bg-[var(--secondary-bg-solid)] p-3">
          <h3 className="mb-2 text-sm font-semibold text-[var(--foreground)]">Chọn bản xem</h3>
          <div className="flex flex-col gap-2">
            {episodes.map((s, i) => (
              <SingleMovieCard
                key={`${s.server_name}-${i}`}
                server={s}
                posterUrl={posterUrl}
                movieName={movieName}
                movieSlug={movieSlug}
                fullOnly={fullOnly}
                isActive={i === activeIndex}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <h3 className="mb-2 shrink-0 text-sm font-semibold text-[var(--foreground)]">{title}</h3>
          {hasMultipleServers && (
            <div className="mb-2 shrink-0 flex flex-wrap gap-1">
              {episodes.map((s, i) => (
                <button
                  key={`${s.server_name}-${i}`}
                  type="button"
                  onClick={() => setServerIndex(i)}
                  className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition ${
                    i === activeIndex
                      ? "border-[var(--accent)] bg-[var(--secondary-bg-solid)] text-[var(--accent)]"
                      : "border-[var(--border)] bg-[var(--secondary-bg-solid)] text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  }`}
                >
                  <TvMonitorIcon className="h-3.5 w-3.5" />
                  {s.server_name}
                </button>
              ))}
            </div>
          )}
          {useRanges && rangeCount > 0 && (
            <div className="mb-2 shrink-0 overflow-x-auto overflow-y-hidden">
              <div className="flex gap-2 py-0.5">
                {Array.from({ length: rangeCount }, (_, i) => (
                  <button
                    key={`range-${i}`}
                    type="button"
                    onClick={() => setActiveRangeIndex(i)}
                    className={`shrink-0 rounded-[var(--radius-button)] border px-2.5 py-1.5 text-xs transition ${
                      i === activeRangeIndex
                        ? "border-[var(--accent)] bg-[var(--secondary-bg-solid)] text-[var(--accent)]"
                        : "border-[var(--border)] bg-[var(--secondary-bg-solid)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    }`}
                  >
                    Tập {i * rangeSize + 1}-{Math.min((i + 1) * rangeSize, items.length)}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
            {horizontalItems.map((ep) => (
              <EpisodeCard
                key={ep.slug}
                ep={ep}
                movieSlug={movieSlug}
                fullOnly={fullOnly}
                isActive={activeEpisodeSlug != null && activeEpisodeSlug === ep.slug}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function EpisodeList({
  episodes,
  title = "Tập phim",
  className = "",
  variant = "simple",
  defaultVisibleCount = 12,
  rangeThreshold = RANGE_THRESHOLD_DEFAULT,
  rangeSize = RANGE_SIZE_DEFAULT,
  posterUrl,
  movieName,
  movieSlug,
  fullOnly = false,
  maxGridCols = 8,
  activeEpisodeSlug,
}: EpisodeListProps) {
  const [activeServerIndex, setActiveServerIndex] = useState(0);
  const [collapsed, setCollapsed] = useState(true);
  const [activeRangeIndex, setActiveRangeIndex] = useState(0);

  if (episodes.length === 0) return null;

  const activeIndex = Math.min(activeServerIndex, Math.max(0, episodes.length - 1));
  const server = episodes[activeIndex];
  const items = server?.server_data ?? [];

  const isSingleMovie = episodes.every((s) => (s.server_data?.length ?? 0) <= 1);
  const setServerIndex = (i: number) => {
    setActiveServerIndex(i);
    setActiveRangeIndex(0);
  };
  const hasMultipleServers = episodes.length > 1;
  const useRanges = items.length > rangeThreshold;
  const rangeCount = useRanges ? Math.ceil(items.length / rangeSize) : 0;

  const baseItems = useRanges
    ? items.slice(
        activeRangeIndex * rangeSize,
        (activeRangeIndex + 1) * rangeSize
      )
    : items;
  const visibleCount = collapsed ? defaultVisibleCount : baseItems.length;
  const visibleItems = useRanges ? baseItems : baseItems.slice(0, visibleCount);
  const hasMore = !useRanges && baseItems.length > defaultVisibleCount;

  if (variant === "watch") {
    return (
      <EpisodeListWatch
        episodes={episodes}
        activeIndex={activeIndex}
        setServerIndex={setServerIndex}
        hasMultipleServers={hasMultipleServers}
        useRanges={useRanges}
        rangeCount={rangeCount}
        rangeSize={rangeSize}
        baseItems={baseItems}
        items={items}
        activeRangeIndex={activeRangeIndex}
        setActiveRangeIndex={setActiveRangeIndex}
        posterUrl={posterUrl}
        movieName={movieName}
        movieSlug={movieSlug}
        fullOnly={fullOnly}
        activeEpisodeSlug={activeEpisodeSlug}
        title={title}
        className={className}
      />
    );
  }

  if (variant === "grid" && isSingleMovie) {
    return (
      <div className={`min-w-0 ${className}`.trim()}>
        <div className="rounded-[var(--radius-panel)] bg-[var(--secondary-bg-solid)] p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              {title}
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {episodes.map((s, i) => (
              <SingleMovieCard
                key={`${s.server_name}-${i}`}
                server={s}
                posterUrl={posterUrl}
                movieName={movieName}
                movieSlug={movieSlug}
                fullOnly={fullOnly}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className={`min-w-0 ${className}`.trim()}>
        <div className="min-w-0 rounded-[var(--radius-panel)] bg-[var(--secondary-bg-solid)] p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              {title}
            </h3>
          </div>
          {hasMultipleServers && (
          <div className={`flex flex-wrap gap-1 ${useRanges ? "mb-3" : "mb-0"}`}>
            {episodes.map((s, i) => (
              <button
                key={`${s.server_name}-${i}`}
                type="button"
                onClick={() => setServerIndex(i)}
                className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs transition ${
                  i === activeIndex
                    ? "border-[var(--accent)] bg-[var(--secondary-bg-solid)] text-[var(--accent)]"
                    : "border-[var(--border)] bg-[var(--secondary-bg-solid)] text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                }`}
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                  <TvMonitorIcon className="h-4 w-4" />
                </span>
                {s.server_name}
              </button>
            ))}
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={`server-${activeIndex}-range-${activeRangeIndex}`}
            {...tabContentTransition}
            className="mt-0"
          >
            {useRanges && rangeCount > 0 && (
              <div className="mb-4 mt-0 overflow-x-auto overflow-y-hidden">
                <div className="flex items-stretch gap-3 py-1">
                  {Array.from({ length: rangeCount }, (_, i) => {
                    const start = i * rangeSize + 1;
                    const end = Math.min((i + 1) * rangeSize, items.length);
                    return (
                      <button
                        key={`range-${i}`}
                        type="button"
                        onClick={() => setActiveRangeIndex(i)}
                        className={`shrink-0 rounded-[var(--radius-button)] border px-3 py-2 text-xs transition ${
                          i === activeRangeIndex
                            ? "border-[var(--accent)] bg-[var(--secondary-bg-solid)] text-[var(--accent)]"
                            : "border-[var(--border)] bg-[var(--secondary-bg-solid)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                        }`}
                      >
                        Tập {start} - {end}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="mt-3 min-w-0">
              <div
                className={
                  maxGridCols === 4
                    ? "grid min-w-0 grid-cols-3 gap-2 sm:grid-cols-4"
                    : "grid min-w-0 grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-8"
                }
              >
                {visibleItems.map((ep) => (
                  <EpisodeCard
                    key={ep.slug}
                    ep={ep}
                    movieSlug={movieSlug}
                    fullOnly={fullOnly}
                    isActive={activeEpisodeSlug != null && activeEpisodeSlug === ep.slug}
                  />
                ))}
              </div>
            </div>
            {hasMore && (
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCollapsed((c) => !c)}
                  className="rounded-md border border-[var(--border)] bg-[var(--secondary-bg-solid)] px-3 py-1.5 text-xs text-[var(--foreground-muted)] transition hover:border-[var(--accent)] hover:bg-[var(--secondary-hover)] hover:text-[var(--accent)]"
                >
                  {collapsed
                    ? `Xem thêm (${baseItems.length - defaultVisibleCount} tập)`
                    : "Rút gọn"}
                </button> 
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        </div>
      </div>
    );
  }

  /* variant === "simple" */
  return (
    <div className={`min-w-0 ${className}`.trim()}>
      <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">
        {title}
      </h3>
      <div className="flex flex-col gap-4">
        {episodes.map((s) => (
          <div key={s.server_name}>
            <p className="mb-2 text-xs font-medium text-[var(--foreground-muted)]">
              {s.server_name}
            </p>
            <div className="flex flex-wrap gap-2">
              {s.server_data.map((ep) => {
                let watchHref = ep.link_embed || ep.link_m3u8;
                if (movieSlug) {
                  watchHref = fullOnly
                    ? `/xem-phim/${encodeURIComponent(movieSlug)}`
                    : `/xem-phim/${encodeURIComponent(movieSlug)}/${encodeURIComponent(ep.slug)}`;
                }
                const isActive = activeEpisodeSlug != null && activeEpisodeSlug === ep.slug;
                const linkClass = isActive
                  ? "rounded-md border border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-1.5 text-xs text-[var(--accent)] no-underline transition"
                  : "rounded-md border border-[var(--border)] bg-[var(--secondary-bg-solid)] px-3 py-1.5 text-xs text-[var(--foreground)] no-underline transition hover:border-[var(--accent)] hover:bg-[var(--secondary-hover)] hover:text-[var(--accent)]";
                return movieSlug ? (
                  <Link key={ep.slug} href={watchHref} className={linkClass}>
                    {ep.name}
                  </Link>
                ) : (
                  <a
                    key={ep.slug}
                    href={watchHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {ep.name}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
