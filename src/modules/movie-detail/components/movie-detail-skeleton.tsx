"use client";

import { PageLayout } from "@/components/layout";

/** Skeleton khớp layout trang chi tiết phim: hero + nội dung (mobile/desktop). Dùng shimmer mượt, tránh giật. */
export function MovieDetailSkeleton() {
  return (
    <div className="min-w-0 overflow-x-hidden pb-24">
      {/* Hero placeholder — cùng tỉ lệ & margin như MovieDetailHero */}
      <div
        className="top-detail-wrap relative z-[1] -mx-6 w-[calc(100%+3rem)] overflow-hidden aspect-[21/6] min-h-[160px] sm:-mx-8 sm:min-h-[200px] sm:w-[calc(100%+4rem)]"
        aria-hidden
      >
        <div
          className="skeleton-shimmer absolute inset-0 rounded-none"
          style={{ borderRadius: 0 }}
        />
        <div className="cover-fade absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background)]" />
      </div>

      <PageLayout className="relative z-[2] min-w-0 -mt-[14.3%] rounded-t-2xl pt-6 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
        {/* Mobile */}
        <div className="flex min-w-0 flex-col gap-6 lg:hidden">
          <div className="flex min-w-0 flex-col items-center gap-4">
            {/* Poster */}
            <div className="skeleton-shimmer aspect-[2/3] w-full max-w-[140px] rounded-[var(--radius-panel)]" />
            {/* Title + origin */}
            <div className="w-full min-w-0 flex flex-col items-center gap-2">
              <div className="skeleton-shimmer h-6 w-3/4 max-w-[240px] rounded-md" />
              <div className="skeleton-shimmer h-4 w-1/2 max-w-[160px] rounded-md" />
            </div>
            {/* Tags row */}
            <ul className="flex flex-wrap justify-center gap-2 border-t border-[var(--border)] pt-4 list-none p-0 m-0">
              {[1, 2, 3, 4, 5].map((i) => (
                <li
                  key={i}
                  className="skeleton-shimmer h-6 w-12 rounded-[var(--radius-button)]"
                />
              ))}
            </ul>
          </div>
          {/* Nút Xem phim */}
          <div className="skeleton-shimmer h-11 w-full max-w-[200px] mx-auto rounded-[var(--radius-button)]" />
          {/* Khu vực tab / danh sách tập */}
          <div className="flex flex-col gap-4 min-w-0">
            <div className="skeleton-shimmer h-5 w-24 rounded-md" />
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="skeleton-shimmer aspect-video rounded-[var(--radius-panel)]"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop — grid sidebar + content */}
        <div className="hidden grid-cols-1 gap-8 lg:grid lg:grid-cols-[minmax(0,280px)_1fr]">
          <div className="lg:sticky lg:top-24 lg:self-start flex flex-col gap-6">
            <div className="skeleton-shimmer aspect-[2/3] w-full max-w-[280px] rounded-[var(--radius-panel)]" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="skeleton-shimmer h-6 w-14 rounded-[var(--radius-button)]"
                />
              ))}
            </div>
            <div className="skeleton-shimmer h-5 w-full rounded-md" />
            <div className="skeleton-shimmer h-4 w-2/3 rounded-md" />
            <div className="flex flex-wrap gap-1.5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="skeleton-shimmer h-6 w-16 rounded-[var(--radius-button)]"
                />
              ))}
            </div>
          </div>
          <div className="flex min-w-0 flex-col gap-8">
            <div className="min-w-0">
              <div className="skeleton-shimmer h-8 w-2/3 max-w-[320px] rounded-md mb-2" />
              <div className="skeleton-shimmer h-4 w-1/2 max-w-[200px] rounded-md" />
            </div>
            <section>
              <div className="skeleton-shimmer h-4 w-28 rounded-md mb-2" />
              <div className="space-y-2">
                <div className="skeleton-shimmer h-3 w-full rounded" />
                <div className="skeleton-shimmer h-3 w-full rounded" />
                <div className="skeleton-shimmer h-3 w-4/5 rounded" />
              </div>
            </section>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="skeleton-shimmer h-20 w-[calc(50%-4px)] min-w-[140px] rounded-[var(--radius-panel)]"
                />
              ))}
            </div>
            <div>
              <div className="skeleton-shimmer h-5 w-32 rounded-md mb-4" />
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="skeleton-shimmer aspect-[2/3] rounded-[var(--radius-panel)]"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
}
