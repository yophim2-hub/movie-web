"use client";

import { PageLayout } from "@/components/layout";
import { useCountries } from "@/hooks";
import Link from "next/link";

export default function QuocGiaListPage() {
  const { data: countries, isLoading, isError } = useCountries();

  return (
    <PageLayout className="pb-24">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          Quốc gia
        </h1>
        <p className="mt-2 text-sm text-[var(--foreground-muted)]">
          Chọn quốc gia để xem phim, hoặc{" "}
          <Link
            href="/danh-sach"
            className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
          >
            xem tất cả với bộ lọc
          </Link>
        </p>
      </header>

      {isError && (
        <p className="text-sm text-[var(--foreground-muted)]">
          Không tải được dữ liệu. Vui lòng thử lại.
        </p>
      )}

      {!isLoading && !isError && (!countries || countries.length === 0) && (
        <p className="text-sm text-[var(--foreground-muted)]">
          Chưa có quốc gia nào.
        </p>
      )}

      {countries && countries.length > 0 && (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {countries.map((c) => (
            <li key={c._id}>
              <Link
                href={`/quoc-gia/${c.slug}`}
                className="block rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--secondary-bg-solid)] px-4 py-3 text-center text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:bg-[var(--secondary-hover)]"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageLayout>
  );
}
