const STORAGE_KEY = "bongmovie-phim-api-cache-enabled";
export const PHIM_CACHE_CHANGE_EVENT = "bongmovie-phim-cache-settings";

/** Khi bật: staleTime dài → tái dùng dữ liệu theo từng section (query key). */
export const PHIM_CACHE_STALE_MS = 10 * 60 * 1000;
export const PHIM_CACHE_GC_MS = 45 * 60 * 1000;
export const PHIM_NO_CACHE_GC_MS = 2 * 60 * 1000;

export function readPhimCacheEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const v = window.localStorage.getItem(STORAGE_KEY);
  if (v === null) return true;
  return v !== "0";
}

export function writePhimCacheEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
  window.dispatchEvent(new CustomEvent(PHIM_CACHE_CHANGE_EVENT, { detail: { enabled } }));
}
