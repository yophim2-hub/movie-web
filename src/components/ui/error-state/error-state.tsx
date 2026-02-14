"use client";

import type { ReactNode } from "react";

export interface ErrorStateProps {
  /** Tiêu đề lỗi (vd: "Đã xảy ra lỗi") */
  title: string;
  /** Mô tả chi tiết (vd: "Không tải được dữ liệu. Vui lòng thử lại.") */
  description?: string;
  /** Phần dưới: nút thử lại, link, v.v. */
  footer?: ReactNode;
  /** Class thêm cho wrapper */
  className?: string;
}

/**
 * Component hiển thị trạng thái lỗi: title, description, footer.
 * Dùng cho trang/section khi fetch fail hoặc nội dung không có.
 */
export function ErrorState({
  title,
  description,
  footer,
  className = "",
}: Readonly<ErrorStateProps>) {
  return (
    <div
      className={`rounded-xl border border-[var(--border)] bg-[var(--secondary-bg-solid)]/50 p-8 text-center ${className}`}
      role="alert"
    >
      <h2 className="text-lg font-semibold text-[var(--foreground)]">{title}</h2>
      {description ? (
        <p className="mt-2 text-[15px] text-[var(--foreground-muted)]">{description}</p>
      ) : null}
      {footer ? (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
