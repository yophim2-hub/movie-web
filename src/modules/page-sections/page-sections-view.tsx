"use client";

import { useAdminPageConfigs } from "@/modules/admin-pages";
import type { AdminPageIdAny } from "@/modules/admin-pages/interfaces";
import { ADMIN_PAGE_SLUGS } from "@/modules/admin-pages/interfaces";
import { useHasMounted } from "./use-has-mounted";
import { SectionRenderer } from "./section-renderer";
import { PageSectionsLoading } from "./page-sections-loading";

export interface PageSectionsViewProps {
  /** pageId trong config (home, phim-le, phim-bo, ...) */
  pageId: AdminPageIdAny;
  /** Base path cho link phim, mặc định /phim */
  basePath?: string;
  /** Slug trang cho link "Xem thêm" (mặc định lấy từ ADMIN_PAGE_SLUGS) */
  seeMoreHref?: string;
  className?: string;
}

/**
 * Render toàn bộ section của một trang theo config (localStorage).
 * Dùng cho trang chủ, phim-le, phim-bo, hoat-hinh, phim-chieu-rap.
 */
export function PageSectionsView({
  pageId,
  basePath = "/phim",
  seeMoreHref,
  className = "",
}: Readonly<PageSectionsViewProps>) {
  const mounted = useHasMounted();
  const { configs, isLoading } = useAdminPageConfigs();
  const config = configs[pageId];
  const sections = config?.sections ?? [];
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  const slug = seeMoreHref ?? (typeof pageId === "string" && pageId in ADMIN_PAGE_SLUGS ? ADMIN_PAGE_SLUGS[pageId as keyof typeof ADMIN_PAGE_SLUGS] : "/");

  if (!mounted || isLoading) {
    return <PageSectionsLoading />;
  }

  if (sortedSections.length === 0) {
    return null;
  }

  const isBanner = (dt?: string) => dt === "banner" || dt === "banner-small";

  return (
    <div className={`space-y-10 sm:space-y-14 ${className}`}>
      {sortedSections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          basePath={basePath}
          seeMoreHref={slug}
          className={!isBanner(section.displayType) ? "px-4 sm:px-6" : undefined}
        />
      ))}
    </div>
  );
}
