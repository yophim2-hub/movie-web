"use client";

import { useMovieList } from "@/hooks/use-movie-list";
import { useLatestMovieList } from "@/hooks/use-latest-movie-list";
import type { AdminSection } from "@/modules/admin-pages/interfaces";
import type { MovieListItem } from "@/types/movie-list";
import { SectionByDisplayType, SectionLoadingSkeleton } from "@/components/ui/section-renderers";

export interface SectionRendererProps {
  section: AdminSection;
  basePath?: string;
  seeMoreHref?: string;
  className?: string;
}

/**
 * Render một section: gọi API theo filter, hiển thị theo displayType.
 * Chỉ hỗ trợ type "movie-list". Pinned chưa hỗ trợ.
 */
export function SectionRenderer({
  section,
  basePath = "/phim",
  seeMoreHref,
  className = "",
}: Readonly<SectionRendererProps>) {
  const f = section.filter ?? {};
  const typeList = f.typeList ?? "phim-le";
  const isHomeOrNoType = !f.typeList;

  const { data: listData, isFetching, isError } = useMovieList(
    {
      typeList,
      page: 1,
      limit: f.limit ?? 12,
      sortField: f.sortField,
      sortType: f.sortType,
      category: f.category,
      country: f.country,
      year: f.year,
    },
    { enabled: section.type === "movie-list" && !isHomeOrNoType }
  );

  const { data: latestData, isFetching: isLatestLoading } = useLatestMovieList(
    { page: 1 },
    { enabled: section.type === "movie-list" && isHomeOrNoType }
  );

  const loading = isFetching || isLatestLoading;
  const items: MovieListItem[] = isHomeOrNoType
    ? ((latestData?.items ?? []) as MovieListItem[])
    : (listData?.data?.items ?? []);

  if (section.type !== "movie-list") {
    return null;
  }

  if (loading && items.length === 0) {
    return (
      <SectionLoadingSkeleton
        displayType={section.displayType}
        className={className}
      />
    );
  }

  if (isError) {
    return (
      <div
        className={`rounded-lg border border-[var(--border)] bg-red-500/10 p-4 text-[13px] text-red-600 ${className}`}
      >
        Lỗi tải dữ liệu.
      </div>
    );
  }

  return (
    <div className={className}>
      <SectionByDisplayType
        title={section.title}
        items={items}
        displayType={section.displayType}
        basePath={basePath}
        headerVariant={section.headerVariant}
        seeMoreHref={seeMoreHref ?? basePath}
        seeMoreLabel="Xem thêm"
      />
    </div>
  );
}
