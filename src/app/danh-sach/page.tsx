"use client";

import { MoviePosterCard, Pagination, MovieFilter } from "@/components/ui";
import type { MovieFilterState } from "@/components/ui";
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
        <p className="py-8 text-center text-sm text-[var(--foreground-muted)]">
          Đang tải...
        </p>
      )}

      {!isError && items.length === 0 && !isFetching && (
        <p className="py-8 text-center text-sm text-[var(--foreground-muted)]">
          Không có phim nào phù hợp.
        </p>
      )}

      {items.length > 0 && (
        <div ref={listRef} className="relative">
          <div
            className={`transition-opacity duration-200 ${isFetching ? "opacity-60 pointer-events-none" : "opacity-100"}`}
          >
            <ul className="grid grid-cols-3 gap-4 lg:grid-cols-8">
              {items.map((item) => (
                <li key={item._id} className="min-w-0">
                  <MoviePosterCard item={item} />
                </li>
              ))}
            </ul>
          </div>
          {isFetching && (
            <div
              className="absolute inset-0 flex items-center justify-center rounded-[var(--radius-panel)] bg-[var(--background)]/50"
              aria-hidden
            >
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
            </div>
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            getPageHref={(p) =>
              `/danh-sach?${new URLSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                page: String(p),
              }).toString()}`
            }
            className="mt-8"
          />
        </div>
      )}
    </PageLayout>
  );
}

export default function DanhSachPage() {
  return (
    <Suspense
      fallback={
        <PageLayout className="pb-24">
          <div className="mb-6 h-8 w-64 animate-pulse rounded bg-[var(--secondary-bg-solid)]" />
          <div className="h-24 animate-pulse rounded bg-[var(--secondary-bg-solid)]" />
          <p className="py-8 text-center text-sm text-[var(--foreground-muted)]">
            Đang tải...
          </p>
        </PageLayout>
      }
    >
      <DanhSachContent />
    </Suspense>
  );
}
