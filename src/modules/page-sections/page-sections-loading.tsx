"use client";

import { SectionLoadingSkeleton } from "@/components/ui/section-renderers";

/**
 * Skeleton loading khi chưa mount (đang đọc config từ localStorage).
 * Hiển thị thay cho "Chưa cấu hình" để tránh nháy empty state.
 */
export function PageSectionsLoading() {
  return (
    <div className="space-y-10 sm:space-y-14 pb-24">
      <SectionLoadingSkeleton displayType="banner" />
      <SectionLoadingSkeleton displayType="poster-list" className="px-4 sm:px-6" />
      <SectionLoadingSkeleton displayType="thumb-list" className="px-4 sm:px-6" />
    </div>
  );
}
