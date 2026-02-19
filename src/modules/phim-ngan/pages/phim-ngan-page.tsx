"use client";

import { PageLayout } from "@/components/layout";
import { ErrorState } from "@/components/ui";
import { PageSectionsView, PageSectionsLoading, useHasMounted } from "@/modules/page-sections";
import { useAdminPageConfigs } from "@/modules/admin-pages";
import Link from "next/link";

/**
 * Trang Phim ngắn — render theo section config.
 * Chưa mount: loading. Mount xong không có section: empty. Có section: nội dung.
 */
export default function PhimNganPage() {
  const mounted = useHasMounted();
  const { configs, isLoading } = useAdminPageConfigs();
  const sections = configs?.["phim-ngan"]?.sections ?? [];
  const hasSections = sections.length > 0;

  if (!mounted || isLoading) {
    return (
      <PageLayout className="pb-24">
        <PageSectionsLoading />
      </PageLayout>
    );
  }

  return (
    <div className="pb-24">
      {hasSections ? (
        <PageSectionsView pageId="phim-ngan" />
      ) : (
        <ErrorState
          title="Chưa cấu hình section cho Phim ngắn"
          footer={
            <Link href="/the-loai/phim-ngan" className="text-[var(--accent)] hover:underline">
              Xem danh sách phim ngắn
            </Link>
          }
        />
      )}
    </div>
  );
}
