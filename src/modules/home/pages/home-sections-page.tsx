"use client";

import { PageLayout } from "@/components/layout";
import { PageSectionsView, PageSectionsLoading, useHasMounted } from "@/modules/page-sections";
import { useAdminPageConfigs } from "@/modules/admin-pages";
import Link from "next/link";

/**
 * Trang chủ render theo section config (Quản lý).
 * Chưa mount: hiển thị loading. Mount xong không có section: hiển thị empty. Có section: hiển thị nội dung.
 */
export default function HomeSectionsPage() {
  const mounted = useHasMounted();
  const { configs } = useAdminPageConfigs();
  const sections = configs?.home?.sections ?? [];
  const hasSections = sections.length > 0;

  if (!mounted) {
    return <PageSectionsLoading />;
  }

  return (
    <div className="pb-24">
      {hasSections ? (
        <PageSectionsView pageId="home" />
      ) : (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--secondary-bg-solid)]/50 p-8 text-center">
          <p className="text-[15px] text-[var(--foreground-muted)]">
            Chưa cấu hình section cho Trang chủ.
          </p>
          <p className="mt-2 text-[13px] text-[var(--foreground-subtle)]">
            Vào{" "}
            <Link href="/quan-ly" className="text-[var(--accent)] hover:underline">
              Quản lý
            </Link>{" "}
            để thêm section.
          </p>
        </div>
      )}
    </div>
  );
}
