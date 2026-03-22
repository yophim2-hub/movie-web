"use client";

import { useState, useRef, useEffect } from "react";
import { useMovieList } from "@/hooks/use-movie-list";
import { useLatestMovieList } from "@/hooks/use-latest-movie-list";
import type { AdminSection } from "@/modules/admin-pages/interfaces";
import { movieDetailToListItem } from "@/modules/admin-pages/utils/movie-detail-to-list-item";
import type { MovieListItem } from "@/types/movie-list";
import { SectionByDisplayType, SectionLoadingSkeleton } from "@/components/ui/section-renderers";
import { keepPreviousData } from "@tanstack/react-query";
import { usePhimApiCache } from "@/modules/admin-pages/providers/phim-api-cache-provider";

export interface SectionRendererProps {
  section: AdminSection;
  basePath?: string;
  seeMoreHref?: string;
  className?: string;
}

/**
 * Render một section: gọi API theo filter, hiển thị theo displayType.
 * Nếu section có `cachedMovieList` (lưu từ admin): dùng snapshot, không gọi API list.
 * Type "movie-list": API theo filter hoặc `cachedMovieList`. Type "pinned": `savedMovies` (chi tiết phim đã lưu).
 */
export function SectionRenderer({
  section,
  basePath = "/phim",
  seeMoreHref,
  className = "",
}: Readonly<SectionRendererProps>) {
  const { staleTimeMs, gcTimeMs } = usePhimApiCache();
  const isGridList = section.displayType === "grid-list";
  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLDivElement>(null);

  const f = section.filter ?? {};
  const typeList = f.typeList ?? "phim-le";
  const isHomeOrNoType = !f.typeList;
  const cachedItems = section.cachedMovieList;
  const useStaticList = Boolean(cachedItems && cachedItems.length > 0);

  const { data: listData, isFetching, isError } = useMovieList(
    {
      typeList,
      page,
      limit: f.limit ?? (isGridList ? 24 : 12),
      sortField: f.sortField,
      sortType: f.sortType,
      category: f.category,
      country: f.country,
      year: f.year,
    },
    {
      enabled: section.type === "movie-list" && !isHomeOrNoType && !useStaticList,
      staleTime: staleTimeMs,
      gcTime: gcTimeMs,
      placeholderData: isGridList ? keepPreviousData : undefined,
    }
  );

  const { data: latestData, isFetching: isLatestLoading } = useLatestMovieList(
    { page: 1 },
    {
      enabled: section.type === "movie-list" && isHomeOrNoType && !useStaticList,
      staleTime: staleTimeMs,
      gcTime: gcTimeMs,
    }
  );

  const loading = useStaticList ? false : isFetching || isLatestLoading;

  let items: MovieListItem[] = [];
  if (useStaticList) {
    items = cachedItems!;
  } else if (isHomeOrNoType) {
    items = (latestData?.items ?? []) as MovieListItem[];
  } else {
    items = listData?.data?.items ?? [];
  }

  const paginationData = listData?.data?.params?.pagination;
  const totalPages = useStaticList ? 1 : (paginationData?.totalPages ?? 1);

  useEffect(() => {
    if (page > 1 && listRef.current) {
      listRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [page]);

  if (section.type === "pinned") {
    const pinnedItems = section.savedMovies.map(movieDetailToListItem);
    if (pinnedItems.length === 0) {
      return null;
    }
    return (
      <div className={className}>
        <SectionByDisplayType
          title={section.title}
          items={pinnedItems}
          displayType={section.displayType}
          basePath={basePath}
          headerVariant={section.headerVariant}
          seeMoreHref={seeMoreHref ?? basePath}
          seeMoreLabel="Xem thêm"
        />
      </div>
    );
  }

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

  if (!useStaticList && isError) {
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
        {...(isGridList && {
          listRef,
          isLoading: useStaticList ? false : isFetching,
          pagination: {
            currentPage: useStaticList ? 1 : page,
            totalPages,
            getPageHref: () => "#",
            onPageChange: (p: number) => {
              if (!useStaticList) setPage(p);
            },
          },
        })}
      />
    </div>
  );
}
