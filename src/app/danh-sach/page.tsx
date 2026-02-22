"use client";

import { MovieFilter } from "@/components/ui";
import type { MovieFilterState } from "@/components/ui";
import { SectionByDisplayType, SectionLoadingSkeleton } from "@/components/ui/section-renderers";
import { PageLayout } from "@/components/layout";
import {
  useMovieList,
  useCategories,
  useCountries,
} from "@/hooks";
import type { MovieListType, SortField, SortType } from "@/types/movie-list";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, Suspense, useRef, useEffect } from "react";
import { keepPreviousData } from "@tanstack/react-query";

function DanhSachContent() {
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const typeList = (searchParams.get("type") as MovieListType) || "phim-le";
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const category = searchParams.get("category") ?? "";
  const country = searchParams.get("country") ?? "";
  const yearParam = searchParams.get("year");
  const year = yearParam ? Number.parseInt(yearParam, 10) : undefined;
  const sortField = (searchParams.get("sortField") as SortField) || "modified.time";
  const sortType = (searchParams.get("sortType") as SortType) || "desc";
  const rating = searchParams.get("rating") ?? "";

  const filterState: MovieFilterState = {
    country,
    typeList,
    rating,
    category,
    year,
    sortField,
    sortType,
  };

  const onApplyFilter = useCallback(
    (next: MovieFilterState) => {
      const nextParams = new URLSearchParams();
      nextParams.set("page", "1");
      nextParams.set("type", next.typeList);
      if (next.country) nextParams.set("country", next.country);
      if (next.category) nextParams.set("category", next.category);
      if (next.year != null) nextParams.set("year", String(next.year));
      nextParams.set("sortField", next.sortField);
      nextParams.set("sortType", next.sortType);
      if (next.rating) nextParams.set("rating", next.rating);
      router.push(`/danh-sach?${nextParams.toString()}`);
    },
    [router]
  );

  const { data, isError, isFetching } = useMovieList(
    {
      typeList,
      page,
      sortField,
      sortType,
      category: category || undefined,
      country: country || undefined,
      year,
      limit: 24,
    },
    { placeholderData: keepPreviousData }
  );

  const { data: categories = [] } = useCategories();
  const { data: countries = [] } = useCountries();

  const items = data?.data?.items ?? [];
  const pagination = data?.data?.params?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const currentPage = pagination?.currentPage ?? 1;
  const titlePage = data?.data?.titlePage ?? "Danh sách phim";

  useEffect(() => {
    if (page > 1 && listRef.current) {
      listRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [page]);

  return (
    <PageLayout className="pb-24">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          {titlePage}
        </h1>
      </header>

      <MovieFilter
        key={[country, category, typeList, year, sortField, sortType, rating].join("|")}
        state={filterState}
        onApply={onApplyFilter}
        countries={countries}
        categories={categories}
      />

      {isError && (
        <p className="py-8 text-center text-sm text-[var(--foreground-muted)]">
          Không tải được dữ liệu. Vui lòng thử lại.
        </p>
      )}

      {!data?.data?.items?.length && isFetching && (
        <SectionLoadingSkeleton displayType="grid-list" />
      )}

      {!isError && items.length === 0 && !isFetching && (
        <p className="py-8 text-center text-sm text-[var(--foreground-muted)]">
          Không có phim nào phù hợp.
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
              `/danh-sach?${new URLSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                page: String(p),
              }).toString()}`,
          }}
        />
      )}
    </PageLayout>
  );
}

export default function DanhSachPage() {
  return (
    <Suspense
      fallback={
        <PageLayout className="pb-24">
          <div className="mb-6 h-8 w-64 skeleton-shimmer rounded" />
          <SectionLoadingSkeleton displayType="grid-list" />
        </PageLayout>
      }
    >
      <DanhSachContent />
    </Suspense>
  );
}
