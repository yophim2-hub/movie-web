"use client";

import { PageLayout } from "@/components/layout";
import { ErrorState } from "@/components/ui";
import { PageSectionsView, PageSectionsLoading, useHasMounted } from "@/modules/page-sections";
import { useAdminPageConfigs } from "@/modules/admin-pages";
import Link from "next/link";

/**
 * Trang Phim chiếu rạp — render theo section config.
 * Chưa mount: loading. Mount xong không có section: empty. Có section: nội dung.
 */
export default function PhimChieuRapPage() {
  const mounted = useHasMounted();
  const { configs, isLoading } = useAdminPageConfigs();
  const sections = configs?.["phim-chieu-rap"]?.sections ?? [];
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
        <PageSectionsView pageId="phim-chieu-rap" sections={sections} />
      ) : (
        <ErrorState
          title="Chưa cấu hình section cho Phim chiếu rạp"
          footer={
            <Link href="/danh-sach?type=phim-chieu-rap" className="text-[var(--accent)] hover:underline">
              Xem danh sách phim chiếu rạp
            </Link>
          }
        />
      )}
    </div>
  );
}
