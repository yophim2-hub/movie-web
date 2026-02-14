"use client";

import { PageLayout } from "@/components/layout";
import { ErrorState } from "@/components/ui";
import { PageSectionsView, PageSectionsLoading, useHasMounted } from "@/modules/page-sections";
import { useAdminPageConfigs } from "@/modules/admin-pages";
import Link from "next/link";

/**
 * Trang Phim lẻ — render theo section config.
 * Chưa mount: loading. Mount xong không có section: empty. Có section: nội dung.
 */
export default function PhimLePage() {
  const mounted = useHasMounted();
  const { configs } = useAdminPageConfigs();
  const sections = configs?.["phim-le"]?.sections ?? [];
  const hasSections = sections.length > 0;

  if (!mounted) {
    return (
      <PageLayout className="pb-24">
        <PageSectionsLoading />
      </PageLayout>
    );
  }

  return (
    <div className="pb-24">
      {hasSections ? (
        <PageSectionsView pageId="phim-le" />
      ) : (
        <ErrorState
          title="Chưa cấu hình section cho Phim lẻ"
          footer={
            <Link href="/danh-sach?type=phim-le" className="text-[var(--accent)] hover:underline">
              Xem danh sách phim lẻ
            </Link>
          }
        />
      )}
    </div>
  );
}
