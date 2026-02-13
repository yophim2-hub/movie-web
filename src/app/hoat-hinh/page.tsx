"use client";

import { Suspense, useRef, useEffect } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { MoviePosterCard, Pagination } from "@/components/ui";
import { PageLayout } from "@/components/layout";
import { useMovieList } from "@/hooks";
import { useSearchParams } from "next/navigation";

function HoatHinhContent() {
  const listRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);

  const { data, isError, isFetching } = useMovieList(
    { typeList: "hoat-hinh", page, limit: 24 },
    { placeholderData: keepPreviousData }
  );

  const titlePage = data?.data?.titlePage ?? "Hoạt hình";
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
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          {titlePage}
        </h1>
      </header>

      {isError && (
        <p className="text-sm text-[var(--foreground-muted)]">
          Không tải được dữ liệu. Vui lòng thử lại.
        </p>
      )}

      {!data?.data?.items?.length && isFetching && (
        <p className="py-8 text-center text-sm text-[var(--foreground-muted)]">
          Đang tải...
        </p>
      )}

      {!isError && items.length === 0 && !isFetching && (
        <p className="text-sm text-[var(--foreground-muted)]">
          Chưa có phim nào.
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
            getPageHref={(p) => `/hoat-hinh?page=${p}`}
            className="mt-8"
          />
        </div>
      )}
    </PageLayout>
  );
}

export default function HoatHinhPage() {
  return (
    <Suspense
      fallback={
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
      }
    >
      <HoatHinhContent />
    </Suspense>
  );
}
