"use client";

import Link from "next/link";

export interface PaginationProps {
  /** Trang hiện tại (1-based) */
  currentPage: number;
  /** Tổng số trang */
  totalPages: number;
  /** Hàm tạo href cho từng trang (nhận page number) */
  getPageHref: (page: number) => string;
  /** Callback khi đổi trang (dùng cho state-based pagination, sẽ preventDefault) */
  onPageChange?: (page: number) => void;
  /** Label nút "Trước" */
  prevLabel?: string;
  /** Label nút "Sau" */
  nextLabel?: string;
  /** Số trang hiển thị hai bên trang hiện tại (mặc định 2 → hiện tối đa 5 số ở giữa) */
  siblingCount?: number;
  className?: string;
}

const defaultPrevLabel = "Trước";
const defaultNextLabel = "Sau";

type PageItem = number | { type: "ellipsis"; id: "left" | "right" };

/** Tạo danh sách số trang + dấu ... để hiển thị (ví dụ: 1 ... 4 5 6 ... 20) */
function getPageItems(
  currentPage: number,
  totalPages: number,
  siblingCount: number
): PageItem[] {
  if (totalPages <= 0) return [];
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const left = Math.max(2, currentPage - siblingCount);
  const right = Math.min(totalPages - 1, currentPage + siblingCount);
  const items: PageItem[] = [1];
  if (left > 2) items.push({ type: "ellipsis", id: "left" });
  for (let p = left; p <= right; p++) items.push(p);
  if (right < totalPages - 1) items.push({ type: "ellipsis", id: "right" });
  if (totalPages > 1) items.push(totalPages);
  return items;
}

const linkClass =
  "min-w-[2.25rem] rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--secondary-bg-solid)] px-3 py-2 text-center text-sm text-[var(--foreground)] transition hover:bg-[var(--secondary-hover)] hover:border-[var(--accent)]";
const currentClass =
  "min-w-[2.25rem] rounded-[var(--radius-button)] border border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-2 text-center text-sm font-medium text-[var(--foreground)]";

export function Pagination({
  currentPage,
  totalPages,
  getPageHref,
  onPageChange,
  prevLabel = defaultPrevLabel,
  nextLabel = defaultNextLabel,
  siblingCount = 2,
  className = "",
}: Readonly<PaginationProps>) {
  if (totalPages <= 1) return null;

  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;
  const pageItems = getPageItems(currentPage, totalPages, siblingCount);

  return (
    <nav
      className={`flex flex-wrap items-center justify-center gap-2 ${className}`}
      aria-label="Phân trang"
    >
      {currentPage > 1 && (
        <Link
          href={getPageHref(prevPage)}
          scroll={false}
          className={linkClass}
          aria-label={`Trang ${prevPage}`}
          onClick={onPageChange ? (e) => { e.preventDefault(); onPageChange(prevPage); } : undefined}
        >
          {prevLabel}
        </Link>
      )}

      {pageItems.map((item) => {
        if (typeof item === "object" && item.type === "ellipsis") {
          return (
            <span
              key={`ellipsis-${item.id}`}
              className="px-1 py-2 text-sm text-[var(--foreground-muted)]"
              aria-hidden
            >
              …
            </span>
          );
        }
        const pageNum = typeof item === "number" ? item : 0;
        if (pageNum === currentPage) {
          return (
            <span
              key={pageNum}
              className={currentClass}
              aria-current="page"
            >
              {pageNum}
            </span>
          );
        }
        return (
          <Link
            key={pageNum}
            href={getPageHref(pageNum)}
            scroll={false}
            className={linkClass}
            aria-label={`Trang ${pageNum}`}
            onClick={onPageChange ? (e) => { e.preventDefault(); onPageChange(pageNum); } : undefined}
          >
            {pageNum}
          </Link>
        );
      })}

      {currentPage < totalPages && (
        <Link
          href={getPageHref(nextPage)}
          scroll={false}
          className={linkClass}
          aria-label={`Trang ${nextPage}`}
          onClick={onPageChange ? (e) => { e.preventDefault(); onPageChange(nextPage); } : undefined}
        >
          {nextLabel}
        </Link>
      )}
    </nav>
  );
}
