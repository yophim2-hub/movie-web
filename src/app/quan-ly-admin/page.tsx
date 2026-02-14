import { redirect } from "next/navigation";
import { AdminManagementContent } from "@/components/layout/header/admin-management-modal";

/**
 * Trang Quản lý admin — chỉ mở được khi chạy ở chế độ development (debug).
 * Production: truy cập /quan-ly-admin sẽ bị chuyển về trang chủ.
 */
export default function QuanLyAdminPage() {
  if (process.env.NODE_ENV !== "development") {
    redirect("/");
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <div className="shrink-0 border-b border-[var(--border)] bg-[var(--secondary-bg-solid)]/50 px-4 py-3 sm:px-6">
        <h1 className="text-lg font-semibold text-[var(--foreground)]">
          Quản lý admin
        </h1>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden p-4 sm:p-6">
        <AdminManagementContent />
      </div>
    </div>
  );
}
