"use client";

import { PageLayout } from "@/components/layout";
import { ErrorState } from "@/components/ui";
import { PageSectionsView, PageSectionsLoading, useHasMounted } from "@/modules/page-sections";
import { useAdminPageConfigs } from "@/modules/admin-pages";
import Link from "next/link";

/**
 * Trang Hoạt hình / Anime — render theo section config.
 * Chưa mount: loading. Mount xong không có section: empty. Có section: nội dung.
 */
export default function HoatHinhPage() {
  const mounted = useHasMounted();
  const { configs, isLoading } = useAdminPageConfigs();
  const sections = configs?.["hoat-hinh"]?.sections ?? [];
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
        <PageSectionsView pageId="hoat-hinh" sections={sections} />
      ) : (
        <ErrorState
          title="Chưa cấu hình section cho Hoạt hình"
          footer={
            <Link href="/danh-sach?type=hoat-hinh" className="text-[var(--accent)] hover:underline">
              Xem danh sách hoạt hình
            </Link>
          }
        />
      )}
    </div>
  );
}
