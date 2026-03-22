"use client";

import { PageLayout } from "@/components/layout";
import Link from "next/link";

export function MovieDetailNotFound() {
  return (
    <PageLayout className="pb-24">
      <p className="text-sm text-[var(--foreground-muted)]">
        Không tìm thấy phim.{" "}
        <Link href="/" className="text-[var(--accent)] underline">
          Về trang chủ
        </Link>
      </p>
    </PageLayout>
  );
}
