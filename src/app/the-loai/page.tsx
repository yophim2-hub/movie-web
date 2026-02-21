"use client";

import { PageLayout } from "@/components/layout";
import { useCategories } from "@/hooks";
import Link from "next/link";

/** Slugs ẩn khỏi danh sách thể loại (đã có trang riêng). */
const HIDDEN_CATEGORY_SLUGS = new Set(["phim-ngan"]);

export default function TheLoaiListPage() {
  const { data: allCategories, isLoading, isError } = useCategories();
  const categories = allCategories?.filter((c) => !HIDDEN_CATEGORY_SLUGS.has(c.slug));

  return (
    <PageLayout className="pb-24">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          Thể loại
        </h1>
        <p className="mt-2 text-sm text-[var(--foreground-muted)]">
          Chọn thể loại để xem phim, hoặc{" "}
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

      {!isLoading && !isError && (!categories || categories.length === 0) && (
        <p className="text-sm text-[var(--foreground-muted)]">
          Chưa có thể loại nào.
        </p>
      )}

      {categories && categories.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
          {categories.map((cat) => (
            <li key={cat._id}>
              <Link
                href={`/the-loai/${cat.slug}`}
                className="block rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--secondary-bg-solid)] px-4 py-3 text-center text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:bg-[var(--secondary-hover)]"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageLayout>
  );
}
