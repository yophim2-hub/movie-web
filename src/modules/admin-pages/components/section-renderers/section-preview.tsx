"use client";

import { useMovieList } from "@/hooks/use-movie-list";
import { useLatestMovieList } from "@/hooks/use-latest-movie-list";
import { usePhimApiCache } from "../../providers/phim-api-cache-provider";
import type { AdminSection } from "../../interfaces";
import { movieDetailToListItem } from "../../utils/movie-detail-to-list-item";
import type { MovieListItem } from "@/types/movie-list";
import { SectionByDisplayType } from "@/components/ui/section-renderers";

export interface SectionPreviewProps {
  section: AdminSection;
  /** Base path cho link phim */
  basePath?: string;
  className?: string;
}

/**
 * Preview section: fetch danh sách phim theo filter của section, render đúng Loại hiển thị.
 * "movie-list": preview từ API / cache. "pinned": preview từ `savedMovies` đã lưu.
 */
export function SectionPreview({
  section,
  basePath = "/phim",
  className = "",
}: Readonly<SectionPreviewProps>) {
  const { staleTimeMs, gcTimeMs } = usePhimApiCache();
  const f = section.filter ?? {};
  const typeList = f.typeList ?? "phim-le";
  const isHomeOrNoType = !f.typeList;
  const cached = section.cachedMovieList;
  const useStaticList = Boolean(cached && cached.length > 0);

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
    {
      enabled: section.type === "movie-list" && !isHomeOrNoType && !useStaticList,
      staleTime: staleTimeMs,
      gcTime: gcTimeMs,
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
    items = cached!;
  } else if (isHomeOrNoType) {
    items = (latestData?.items ?? []) as MovieListItem[];
  } else {
    items = listData?.data?.items ?? [];
  }

  if (section.type === "pinned") {
    const pinnedItems = section.savedMovies.map(movieDetailToListItem);
    if (pinnedItems.length === 0) {
      return (
        <div
          className={`rounded-lg border border-[var(--border)] bg-[var(--secondary-bg-solid)]/30 p-4 text-[13px] text-[var(--foreground-muted)] ${className}`}
        >
          Chưa có phim ghim — thêm phim trong admin và lưu để xem trước.
        </div>
      );
    }
    return (
      <div className={`rounded-lg border border-[var(--border)] bg-[var(--secondary-bg-solid)]/30 p-4 ${className}`}>
        <SectionByDisplayType
          title={section.title}
          items={pinnedItems}
          displayType={section.displayType}
          basePath={basePath}
          headerVariant={section.headerVariant}
          seeMoreHref={basePath}
          seeMoreLabel="Xem thêm"
        />
      </div>
    );
  }

  if (section.type !== "movie-list") {
    return (
      <div className={`rounded-lg border border-[var(--border)] bg-[var(--secondary-bg-solid)]/30 p-4 text-[13px] text-[var(--foreground-muted)] ${className}`}>
        Preview chỉ hỗ trợ section &quot;Danh sách (API)&quot; hoặc &quot;Phim ghim&quot;.
      </div>
    );
  }

  if (loading && items.length === 0) {
    return (
      <div className={`rounded-lg border border-[var(--border)] bg-[var(--secondary-bg-solid)]/30 p-6 text-center text-[13px] text-[var(--foreground-muted)] ${className}`}>
        Đang tải...
      </div>
    );
  }

  if (!useStaticList && isError) {
    return (
      <div className={`rounded-lg border border-[var(--border)] bg-red-500/10 p-4 text-[13px] text-red-600 ${className}`}>
        Lỗi tải dữ liệu.
      </div>
    );
  }

  return (
    <div className={`rounded-lg border border-[var(--border)] bg-[var(--secondary-bg-solid)]/30 p-4 ${className}`}>
      <SectionByDisplayType
        title={section.title}
        items={items}
        displayType={section.displayType}
        basePath={basePath}
        headerVariant={section.headerVariant}
        seeMoreHref={basePath}
        seeMoreLabel="Xem thêm"
      />
    </div>
  );
}
