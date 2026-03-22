"use client";

import { Button } from "@/components/ui/button";
import { usePhimApiCache } from "../providers/phim-api-cache-provider";

export function AdminPhimCacheToolbar() {
  const { cacheEnabled, setCacheEnabled, clearPhimCaches } = usePhimApiCache();

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--secondary-bg-solid)]/40 px-3 py-2.5 text-[13px]">
      <label className="inline-flex cursor-pointer items-center gap-2 text-[var(--foreground)]">
        <input
          type="checkbox"
          checked={cacheEnabled}
          onChange={(e) => setCacheEnabled(e.target.checked)}
          className="size-4 rounded border-[var(--border)] accent-[var(--accent)]"
        />
        <span>Cache API phim (theo section / query)</span>
      </label>
      <span className="hidden text-[var(--foreground-muted)] sm:inline">|</span>
      <p className="min-w-0 flex-1 text-[12px] text-[var(--foreground-muted)]">
        Tắt để luôn coi dữ liệu là cũ và refetch nhanh hơn khi thao tác. Xóa cache để tải mới ngay.
      </p>
      <Button variant="secondary" size="sm" type="button" onClick={() => clearPhimCaches()}>
        Xóa cache &amp; tải lại
      </Button>
    </div>
  );
}
