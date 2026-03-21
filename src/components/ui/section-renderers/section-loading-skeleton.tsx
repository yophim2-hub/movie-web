"use client";

import type { SectionDisplayType } from "./section-by-display-type";

export interface SectionLoadingSkeletonProps {
  displayType?: SectionDisplayType;
  title?: string;
  className?: string;
}

function SkeletonBox({ className = "" }: Readonly<{ className?: string }>) {
  return <div className={`skeleton-shimmer ${className}`} aria-hidden />;
}

export function SectionLoadingSkeleton({
  displayType = "poster-list",
  className = "",
}: Readonly<SectionLoadingSkeletonProps>) {
  if (displayType === "banner") {
    return (
      <section className={`min-w-0 w-full ${className}`} aria-busy="true">
        <div className="relative w-full overflow-hidden rounded-[var(--radius-panel)]">
          <SkeletonBox className="min-h-[35vh] w-full aspect-[2/1] sm:min-h-0 sm:aspect-[21/9] md:aspect-[3/1] md:max-h-[90vh]" />
        </div>
      </section>
    );
  }

  if (displayType === "banner-small") {
    return (
      <section className={`min-w-0 w-full ${className}`} aria-busy="true">
        <SkeletonBox className="aspect-[4/1] w-full min-h-[120px] rounded-[var(--radius-panel)] sm:aspect-[5/1] sm:min-h-[140px]" />
      </section>
    );
  }

  const isList = ["poster-list", "thumb-list", "grid-list", "poster-thumb", "top-list"].includes(
    displayType
  );
  if (isList) {
    const isPoster = displayType === "poster-list" || displayType === "grid-list" || displayType === "poster-thumb";
    const isGrid = displayType === "grid-list";
    const count = isGrid ? 24 : 10;

    return (
      <section className={`min-w-0 ${className}`} aria-busy="true">
        {!isGrid && (
          <div className="mb-4 flex items-center justify-between gap-4">
            <SkeletonBox className="h-6 w-32 rounded-[var(--radius-button)]" />
            <SkeletonBox className="h-4 w-16 rounded-[var(--radius-button)]" />
          </div>
        )}
        {isGrid ? (
          <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-8 lg:gap-4">
            {Array.from({ length: count }, (_, i) => (
              <SkeletonBox
                key={i}
                className="aspect-[2/3] w-full rounded-[var(--radius-panel)]"
              />
            ))}
          </div>
        ) : (
          <div className="flex gap-2 overflow-hidden sm:gap-4">
            {Array.from({ length: count }, (_, i) =>
              isPoster ? (
                <SkeletonBox
                  key={i}
                  className="aspect-[2/3] w-[28vw] min-w-[100px] shrink-0 rounded-[var(--radius-panel)] sm:w-[180px]"
                />
              ) : (
                <SkeletonBox
                  key={i}
                  className="aspect-video w-[40vw] min-w-[140px] shrink-0 rounded-[var(--radius-panel)] sm:w-[220px]"
                />
              )
            )}
          </div>
        )}
      </section>
    );
  }

  return (
    <section className={`min-w-0 ${className}`} aria-busy="true">
      <div className="mb-4 flex items-center justify-between gap-4">
        <SkeletonBox className="h-6 w-32 rounded-[var(--radius-button)]" />
        <SkeletonBox className="h-4 w-16 rounded-[var(--radius-button)]" />
      </div>
      <div className="flex gap-2 overflow-hidden sm:gap-4">
        {Array.from({ length: 10 }, (_, i) => (
          <SkeletonBox
            key={i}
            className="aspect-[2/3] w-[28vw] min-w-[100px] shrink-0 rounded-[var(--radius-panel)] sm:w-[180px]"
          />
        ))}
      </div>
    </section>
  );
}
