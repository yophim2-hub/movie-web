"use client";

import { useCallback, useRef, useEffect, Suspense } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { MovieFilter } from "@/components/ui";
import type { MovieFilterState } from "@/components/ui";
import { SectionByDisplayType, SectionLoadingSkeleton } from "@/components/ui/section-renderers";
import { PageLayout } from "@/components/layout";
import { useSearchMovies, useCategories, useCountries } from "@/hooks";
import type { SortField, SortType } from "@/types/movie-list";
import { useSearchParams, useRouter } from "next/navigation";

function TimKiemContent() {
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") ?? "";
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const category = searchParams.get("category") ?? "";
  const country = searchParams.get("country") ?? "";
  const yearParam = searchParams.get("year");
  const year = yearParam ? Number.parseInt(yearParam, 10) : undefined;
  const sortField = (searchParams.get("sortField") as SortField) || "modified.time";
  const sortType = (searchParams.get("sortType") as SortType) || "desc";
  const rating = searchParams.get("rating") ?? "";

  const hasSearched = keyword.trim().length > 0;

  const filterState: MovieFilterState = {
    country,
    typeList: "phim-le",
    rating,
    category,
    year,
    sortField,
    sortType,
  };

  const onApplyFilter = useCallback(
    (next: MovieFilterState) => {
      const nextParams = new URLSearchParams();
      nextParams.set("keyword", keyword);
      nextParams.set("page", "1");
      if (next.country) nextParams.set("country", next.country);
      if (next.category) nextParams.set("category", next.category);
      if (next.year != null) nextParams.set("year", String(next.year));
      nextParams.set("sortField", next.sortField);
      nextParams.set("sortType", next.sortType);
      if (next.rating) nextParams.set("rating", next.rating);
      router.push(`/tim-kiem?${nextParams.toString()}`);
    },
    [router, keyword]
  );

  const { data, isLoading, isError, isFetching } = useSearchMovies(
    {
      keyword: keyword.trim(),
      page,
      sortField,
      sortType,
      category: category || undefined,
      country: country || undefined,
      year,
      limit: 24,
    },
    {
      enabled: hasSearched,
      placeholderData: keepPreviousData,
    }
  );

  const { data: categories = [] } = useCategories();
  const { data: countries = [] } = useCountries();

  const items = data?.data?.items ?? [];
  const pagination = data?.data?.params?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const currentPage = pagination?.currentPage ?? 1;

  useEffect(() => {
    if (page > 1 && listRef.current) {
      listRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [page]);

  return (
    <PageLayout className="pb-24">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          Tìm kiếm
          {hasSearched && (
            <span className="ml-2 font-normal text-[var(--foreground-muted)]">
              &quot;{keyword}&quot;
            </span>
          )}
        </h1>
      </header>

      {!hasSearched && (
        <p className="text-sm text-[var(--foreground-muted)]">
          Nhập từ khóa vào ô tìm kiếm trên header để xem kết quả.
        </p>
      )}

      {hasSearched && (
        <>
          <MovieFilter
            key={[keyword, country, category, year, sortField, sortType, rating].join("|")}
            state={filterState}
            onApply={onApplyFilter}
            countries={countries}
            categories={categories}
            hideMovieType
          />

          {isLoading && !data && (
            <SectionLoadingSkeleton displayType="grid-list" />
          )}

          {isError && (
            <p className="py-8 text-center text-sm text-[var(--foreground-muted)]">
              Không tải được kết quả. Vui lòng thử lại.
            </p>
          )}

          {!isError && !isLoading && items.length === 0 && (
            <p className="py-8 text-center text-sm text-[var(--foreground-muted)]">
              Không có kết quả phù hợp.
            </p>
          )}

          {items.length > 0 && (
            <SectionByDisplayType
              title=""
              items={items}
              displayType="grid-list"
              basePath="/phim"
              showHeader={false}
              listRef={listRef}
              isLoading={isFetching}
              pagination={{
                currentPage,
                totalPages,
                getPageHref: (p) =>
                  `/tim-kiem?${new URLSearchParams({
                    ...Object.fromEntries(searchParams.entries()),
                    page: String(p),
                  }).toString()}`,
              }}
            />
          )}
        </>
      )}
    </PageLayout>
  );
}

export default function TimKiemPage() {
  return (
    <Suspense
      fallback={
        <PageLayout className="pb-24">
          <div className="mb-8 h-8 w-48 skeleton-shimmer rounded" />
          <SectionLoadingSkeleton displayType="grid-list" />
        </PageLayout>
      }
    >
      <TimKiemContent />
    </Suspense>
  );
}
