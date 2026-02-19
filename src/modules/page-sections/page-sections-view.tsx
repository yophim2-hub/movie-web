"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { AdminPageIdAny, AdminSection } from "@/modules/admin-pages/interfaces";
import { ADMIN_PAGE_SLUGS } from "@/modules/admin-pages/interfaces";
import { SectionRenderer } from "./section-renderer";
import { SectionLoadingSkeleton } from "@/components/ui/section-renderers";

export interface PageSectionsViewProps {
  /** pageId trong config (home, phim-le, phim-bo, ...) */
  pageId: AdminPageIdAny;
  /** Sections đã resolve từ parent — tránh duplicate fetch */
  sections: AdminSection[];
  /** Base path cho link phim, mặc định /phim */
  basePath?: string;
  /** Slug trang cho link "Xem thêm" (mặc định lấy từ ADMIN_PAGE_SLUGS) */
  seeMoreHref?: string;
  className?: string;
  /** Số section hiển thị ban đầu. Không set = hiển thị tất cả */
  initialVisibleCount?: number;
  /** Số section thêm mỗi lần scroll tới. Mặc định 4 */
  loadMoreStep?: number;
}

/**
 * Render toàn bộ section của một trang theo config.
 * Dùng cho trang chủ, phim-le, phim-bo, hoat-hinh, phim-chieu-rap.
 * Hỗ trợ infinite scroll: cuộn tới đâu load section tới đó.
 */
export function PageSectionsView({
  pageId,
  sections,
  basePath = "/phim",
  seeMoreHref,
  className = "",
  initialVisibleCount,
  loadMoreStep = 4,
}: Readonly<PageSectionsViewProps>) {
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  const slug = seeMoreHref ?? (typeof pageId === "string" && pageId in ADMIN_PAGE_SLUGS ? ADMIN_PAGE_SLUGS[pageId as keyof typeof ADMIN_PAGE_SLUGS] : "/");

  const [visibleCount, setVisibleCount] = useState(
    initialVisibleCount ?? sortedSections.length
  );
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + loadMoreStep, sortedSections.length));
  }, [loadMoreStep, sortedSections.length]);

  // IntersectionObserver: auto load khi sentinel element lọt vào viewport
  useEffect(() => {
    if (initialVisibleCount == null) return;
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "600px" } // load trước 600px trước khi user cuộn tới
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore, initialVisibleCount]);

  if (sortedSections.length === 0) {
    return null;
  }

  const isBanner = (dt?: string) => dt === "banner" || dt === "banner-small";
  const effectiveVisible = initialVisibleCount != null ? visibleCount : sortedSections.length;
  const visibleSections = sortedSections.slice(0, effectiveVisible);
  const hasMore = effectiveVisible < sortedSections.length;

  return (
    <div className={`space-y-10 sm:space-y-14 ${className}`}>
      {visibleSections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          basePath={basePath}
          seeMoreHref={slug}
          className={isBanner(section.displayType) ? undefined : "px-4 sm:px-6"}
        />
      ))}

      {hasMore && (
        <div ref={sentinelRef} className="px-4 sm:px-6">
          <SectionLoadingSkeleton displayType="poster-list" />
        </div>
      )}
    </div>
  );
}
