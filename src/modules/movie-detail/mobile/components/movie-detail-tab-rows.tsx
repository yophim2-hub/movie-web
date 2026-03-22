import type { ReactNode } from "react";

export const MOVIE_DETAIL_TAB_EMPTY = "—";

/** Nhãn trên — nội dung dưới (đạo diễn / diễn viên). */
export function MovieDetailTabDetailRow({
  label,
  children,
}: Readonly<{
  label: string;
  children: ReactNode;
}>) {
  return (
    <div className="min-w-0 py-3">
      <span className="block text-[11px] font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
        {label}
      </span>
      <div className="mt-1 min-w-0 break-words text-[13px] text-[var(--foreground)]">{children}</div>
    </div>
  );
}

/** Nhãn và giá trị cùng một hàng. */
export function MovieDetailTabDetailInline({
  label,
  children,
}: Readonly<{
  label: string;
  children: ReactNode;
}>) {
  return (
    <div className="flex min-w-0 gap-3 py-3">
      <span className="w-[6.25rem] shrink-0 text-[11px] font-medium uppercase leading-snug tracking-wide text-[var(--foreground-muted)] sm:w-28">
        {label}
      </span>
      <div className="min-w-0 flex-1 break-words text-[13px] text-[var(--foreground)]">{children}</div>
    </div>
  );
}
