"use client";

import { Suspense, useRef, useEffect, useCallback } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { MoviePosterCard, Pagination, MovieFilter } from "@/components/ui";
import type { MovieFilterState } from "@/components/ui";
import { PageLayout } from "@/components/layout";
import { useCategoryDetail, useCategories, useCountries } from "@/hooks";
import type { SortField, SortType } from "@/types/movie-list";
import { useParams, useSearchParams, useRouter } from "next/navigation";

function TheLoaiContent() {
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const country = searchParams.get("country") ?? "";
  const yearParam = searchParams.get("year");
  const year = yearParam ? Number.parseInt(yearParam, 10) : undefined;
  const sortField = (searchParams.get("sortField") as SortField) || "modified.time";
  const sortType = (searchParams.get("sortType") as SortType) || "desc";
  const rating = searchParams.get("rating") ?? "";

  const filterState: MovieFilterState = {
    country,
    typeList: "phim-le",
    rating,
    category: slug,
    year,
    sortField,
    sortType,
  };

  const onApplyFilter = useCallback(
    (next: MovieFilterState) => {
      const nextParams = new URLSearchParams();
      nextParams.set("page", "1");
      if (next.country) nextParams.set("country", next.country);
      if (next.year != null) nextParams.set("year", String(next.year));
      nextParams.set("sortField", next.sortField);
      nextParams.set("sortType", next.sortType);
      if (next.rating) nextParams.set("rating", next.rating);
      if (next.category) {
        router.push(`/the-loai/${next.category}?${nextParams.toString()}`);
      } else {
        nextParams.set("type", "phim-le");
        router.push(`/danh-sach?${nextParams.toString()}`);
      }
    },
    [router]
  );

  const { data, isError, isFetching } = useCategoryDetail(
    {
      categorySlug: slug,
      page,
      sortField,
      sortType,
      country: country || undefined,
      year,
      limit: 24,
    },
    { enabled: slug.length > 0, placeholderData: keepPreviousData }
  );

  const { data: categories = [] } = useCategories();
  const { data: countries = [] } = useCountries();

  const titlePage = data?.data?.titlePage ?? "Thể loại";
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
          {titlePage}
        </h1>
      </header>

      <MovieFilter
        key={[slug, country, year, sortField, sortType, rating].join("|")}
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
          Chưa có phim nào trong thể loại này.
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
              `/the-loai/${slug}?${new URLSearchParams({
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

const fallback = (
  <PageLayout className="pb-24">
    <div className="mb-8 h-9 w-48 animate-pulse rounded bg-[var(--secondary-bg-solid)]" />
    <div className="grid grid-cols-3 gap-4 lg:grid-cols-8">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="aspect-[2/3] animate-pulse rounded-[var(--radius-panel)] bg-[var(--secondary-bg-solid)]"
        />
      ))}
    </div>
  </PageLayout>
);

export default function TheLoaiPage() {
  return (
    <Suspense fallback={fallback}>
      <TheLoaiContent />
    </Suspense>
  );
}
