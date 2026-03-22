"use client";

import { useState, useCallback } from "react";
import type { AdminSection } from "../interfaces";
import { fetchMovieListItemsForSection } from "../lib/fetch-section-movie-list";
import { Button } from "@/components/ui/button";

function formatSavedAt(iso?: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return iso;
  }
}

export function SectionListCachePanel({
  section,
  onUpdate,
}: Readonly<{
  section: AdminSection;
  onUpdate: (patch: Partial<Omit<AdminSection, "id">>) => void;
}>) {
  const [busy, setBusy] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const count = section.cachedMovieList?.length ?? 0;
  const savedAt = section.cachedMovieListSavedAt;

  const handleSaveCache = useCallback(async () => {
    setBusy(true);
    setLastError(null);
    try {
      const items = await fetchMovieListItemsForSection(section);
      if (items.length === 0) {
        setLastError("API trả về 0 phim — kiểm tra filter.");
        return;
      }
      onUpdate({
        cachedMovieList: items,
        cachedMovieListSavedAt: new Date().toISOString(),
      });
    } catch (e) {
      setLastError(e instanceof Error ? e.message : "Lỗi tải danh sách");
    } finally {
      setBusy(false);
    }
  }, [section, onUpdate]);

  const handleClearCache = useCallback(() => {
    onUpdate({ cachedMovieList: undefined, cachedMovieListSavedAt: undefined });
    setLastError(null);
  }, [onUpdate]);

  let cacheButtonLabel = "Lưu cache danh sách";
  if (busy) cacheButtonLabel = "Đang tải…";
  else if (count > 0) cacheButtonLabel = "Cập nhật cache danh sách";

  return (
    <section className="space-y-3 rounded-lg border border-[var(--border)] bg-[var(--secondary-bg-solid)]/30 p-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
        Cache danh sách (theo filter hiện tại)
      </h4>
      <p className="text-[12px] text-[var(--foreground-muted)]">
        Ghi kết quả API vào bản nháp section; bấm Lưu ở cuối form chỉnh sửa section để ghi cấu hình. Khi đã lưu, trang chủ / danh sách dùng cache này và không gọi lại API list cho section cho đến khi bạn xóa cache hoặc cập nhật lại.
      </p>
      {count > 0 && savedAt && (
        <p className="text-[13px] text-[var(--foreground)]">
          Đang dùng cache: <strong>{count}</strong> phim · lưu lúc{" "}
          <span className="font-mono text-[12px]">{formatSavedAt(savedAt)}</span>
        </p>
      )}
      {lastError && <p className="text-[13px] text-red-600">{lastError}</p>}
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" size="sm" type="button" disabled={busy} onClick={() => void handleSaveCache()}>
          {cacheButtonLabel}
        </Button>
        {count > 0 && (
          <Button variant="secondary" size="sm" type="button" disabled={busy} onClick={handleClearCache}>
            Xóa cache (gọi API lại)
          </Button>
        )}
      </div>
    </section>
  );
}
