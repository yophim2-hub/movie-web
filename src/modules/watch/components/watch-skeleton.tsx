"use client";

import { PageLayout } from "@/components/layout";

export type WatchSkeletonLayout = "split" | "stack";

export interface WatchSkeletonProps {
  /** "split" = video trái, sidebar phải (trang tập); "stack" = video rồi thông tin rồi danh sách (trang full) */
  readonly layout?: WatchSkeletonLayout;
}

/** Skeleton khớp layout trang xem phim. Dùng shimmer mượt, tránh giật. */
export function WatchSkeleton({ layout = "split" }: WatchSkeletonProps) {
  const breadcrumb = (
    <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1">
      <div className="skeleton-shimmer h-4 w-16 rounded" />
      <div className="skeleton-shimmer h-3 w-3 rounded-full shrink-0" />
      <div className="skeleton-shimmer h-4 w-20 rounded" />
      <div className="skeleton-shimmer h-3 w-3 rounded-full shrink-0" />
      <div className="skeleton-shimmer h-4 w-24 rounded" />
      <div className="skeleton-shimmer h-3 w-3 rounded-full shrink-0" />
      <div className="skeleton-shimmer h-4 w-28 rounded" />
    </div>
  );

  const playerBlock = (
    <div className="skeleton-shimmer aspect-video w-full overflow-hidden rounded-[var(--radius-panel)]" />
  );

  if (layout === "stack") {
    return (
      <div className="pb-24">
        <PageLayout className="py-4">
          {breadcrumb}
          {playerBlock}
          {/* Card thông tin phim (WatchMovieInfo) */}
          <section className="mt-6 rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--secondary-bg)] p-4">
            <div className="skeleton-shimmer h-5 w-3/4 max-w-[280px] rounded-md" />
            <div className="mt-2 skeleton-shimmer h-4 w-1/2 max-w-[180px] rounded" />
            <div className="mt-2 skeleton-shimmer h-3 w-full max-w-[240px] rounded" />
          </section>
          {/* Danh sách tập */}
          <div className="mt-8">
            <div className="skeleton-shimmer mb-3 h-4 w-28 rounded-md" />
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={`stack-ep-${i}`}
                  className="skeleton-shimmer aspect-video rounded-[var(--radius-panel)]"
                />
              ))}
            </div>
          </div>
        </PageLayout>
      </div>
    );
  }

  /* layout === "split": grid video (7fr) | sidebar (3fr) */
  return (
    <div className="flex h-dvh flex-col overflow-hidden lg:h-auto lg:overflow-visible lg:pb-24">
      <PageLayout className="flex flex-1 flex-col py-4 min-h-0 lg:flex-none">
        {breadcrumb}
        <div className="mt-4 grid flex-1 min-h-0 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:items-start lg:overflow-visible">
          <div className="flex min-w-0 shrink-0 flex-col lg:shrink">
            {playerBlock}
            {/* Desktop: block thông tin dưới video */}
            <div className="mt-4 hidden space-y-2 lg:block">
              <div className="skeleton-shimmer h-5 w-2/3 rounded-md" />
              <div className="skeleton-shimmer h-4 w-1/2 rounded" />
              <div className="skeleton-shimmer h-3 w-full rounded" />
            </div>
          </div>
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:flex-none lg:sticky lg:top-24 lg:self-start">
            {/* Mobile: tabs */}
            <div className="mb-3 flex gap-1 lg:mb-3">
              <div className="skeleton-shimmer h-9 flex-1 rounded-[var(--radius-button)]" />
              <div className="skeleton-shimmer h-9 flex-1 rounded-[var(--radius-button)]" />
              <div className="hidden skeleton-shimmer h-9 flex-1 rounded-[var(--radius-button)] sm:block" />
            </div>
            {/* Nội dung: tiêu đề + lưới tập */}
            <div className="mt-2 flex flex-col gap-4 lg:mt-0">
              <div className="skeleton-shimmer h-4 w-24 rounded-md" />
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 8 }, (_, i) => (
                  <div
                    key={`split-ep-${i}`}
                    className="skeleton-shimmer aspect-video rounded-[var(--radius-panel)]"
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
