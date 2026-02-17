"use client";

import { Suspense, useRef, useEffect, useCallback } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { MovieFilter } from "@/components/ui";
import type { MovieFilterState } from "@/components/ui";
import { SectionByDisplayType } from "@/components/ui/section-renderers";
import { PageLayout } from "@/components/layout";
import { useCountryDetail, useCategories, useCountries } from "@/hooks";
import type { SortField, SortType } from "@/types/movie-list";
import { useParams, useSearchParams, useRouter } from "next/navigation";

function QuocGiaContent() {
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const category = searchParams.get("category") ?? "";
  const yearParam = searchParams.get("year");
  const year = yearParam ? Number.parseInt(yearParam, 10) : undefined;
  const sortField = (searchParams.get("sortField") as SortField) || "modified.time";
  const sortType = (searchParams.get("sortType") as SortType) || "desc";
  const rating = searchParams.get("rating") ?? "";

  const filterState: MovieFilterState = {
    country: slug,
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
      nextParams.set("page", "1");
      if (next.category) nextParams.set("category", next.category);
      if (next.year != null) nextParams.set("year", String(next.year));
      nextParams.set("sortField", next.sortField);
      nextParams.set("sortType", next.sortType);
      if (next.rating) nextParams.set("rating", next.rating);
      if (next.country) {
        router.push(`/quoc-gia/${next.country}?${nextParams.toString()}`);
      } else {
        nextParams.set("type", "phim-le");
        router.push(`/danh-sach?${nextParams.toString()}`);
      }
    },
    [router]
  );

  const { data, isError, isFetching } = useCountryDetail(
    {
      countrySlug: slug,
      page,
      sortField,
      sortType,
      category: category || undefined,
      year,
      limit: 24,
    },
    { enabled: slug.length > 0, placeholderData: keepPreviousData }
  );

  const { data: categories = [] } = useCategories();
  const { data: countries = [] } = useCountries();

  const titlePage = data?.data?.titlePage ?? "Quốc gia";
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
        key={[slug, category, year, sortField, sortType, rating].join("|")}
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
          Chưa có phim nào trong quốc gia này.
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
              `/quoc-gia/${slug}?${new URLSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                page: String(p),
              }).toString()}`,
          }}
        />
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

export default function QuocGiaPage() {
  return (
    <Suspense fallback={fallback}>
      <QuocGiaContent />
    </Suspense>
  );
}
