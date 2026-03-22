"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { adminPageConfigQueryKey } from "../lib/admin-config-query-key";
import {
  PHIM_CACHE_CHANGE_EVENT,
  PHIM_CACHE_GC_MS,
  PHIM_CACHE_STALE_MS,
  PHIM_NO_CACHE_GC_MS,
  readPhimCacheEnabled,
  writePhimCacheEnabled,
} from "../lib/phim-api-cache-storage";

function subscribePhimCache(onStoreChange: () => void) {
  if (typeof globalThis.window === "undefined") return () => {};
  const w = globalThis.window;
  const handler = () => onStoreChange();
  w.addEventListener(PHIM_CACHE_CHANGE_EVENT, handler);
  w.addEventListener("storage", handler);
  return () => {
    w.removeEventListener(PHIM_CACHE_CHANGE_EVENT, handler);
    w.removeEventListener("storage", handler);
  };
}

export type PhimApiCacheContextValue = {
  /** Bật cache API phim (danh sách, chi tiết, tìm kiếm, thể loại…) theo query key từng section. */
  cacheEnabled: boolean;
  setCacheEnabled: (enabled: boolean) => void;
  staleTimeMs: number;
  gcTimeMs: number;
  /** Xóa cache React Query phim + refetch cấu hình admin. */
  clearPhimCaches: () => void;
};

const defaultValue: PhimApiCacheContextValue = {
  cacheEnabled: true,
  setCacheEnabled: () => {},
  staleTimeMs: PHIM_CACHE_STALE_MS,
  gcTimeMs: PHIM_CACHE_GC_MS,
  clearPhimCaches: () => {},
};

const PhimApiCacheContext = createContext<PhimApiCacheContextValue>(defaultValue);

export function PhimApiCacheProvider({ children }: Readonly<{ children: ReactNode }>) {
  const queryClient = useQueryClient();
  const cacheEnabled = useSyncExternalStore(
    subscribePhimCache,
    readPhimCacheEnabled,
    () => true
  );

  const setCacheEnabled = useCallback((enabled: boolean) => {
    writePhimCacheEnabled(enabled);
  }, []);

  const staleTimeMs = cacheEnabled ? PHIM_CACHE_STALE_MS : 0;
  const gcTimeMs = cacheEnabled ? PHIM_CACHE_GC_MS : PHIM_NO_CACHE_GC_MS;

  const clearPhimCaches = useCallback(() => {
    queryClient.removeQueries({ queryKey: ["movie-list"] });
    queryClient.removeQueries({ queryKey: ["latest-movie-list"] });
    queryClient.removeQueries({ queryKey: ["movie-detail"] });
    queryClient.removeQueries({ queryKey: ["search-movies"] });
    queryClient.removeQueries({ queryKey: ["categories"] });
    queryClient.removeQueries({ queryKey: ["countries"] });
    queryClient.invalidateQueries({ queryKey: adminPageConfigQueryKey });
  }, [queryClient]);

  const value = useMemo(
    (): PhimApiCacheContextValue => ({
      cacheEnabled,
      setCacheEnabled,
      staleTimeMs,
      gcTimeMs,
      clearPhimCaches,
    }),
    [cacheEnabled, setCacheEnabled, staleTimeMs, gcTimeMs, clearPhimCaches]
  );

  return (
    <PhimApiCacheContext.Provider value={value}>{children}</PhimApiCacheContext.Provider>
  );
}

export function usePhimApiCache(): PhimApiCacheContextValue {
  return useContext(PhimApiCacheContext);
}
