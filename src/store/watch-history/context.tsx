"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  initialWatchHistoryState,
  watchHistoryReducer,
  type WatchHistoryState,
} from "./store";
import type { FavoriteItem, WatchHistoryItem } from "./types";

interface WatchHistoryContextValue extends WatchHistoryState {
  /** Thêm hoặc cập nhật tiến độ xem (đang xem dở) */
  addOrUpdateWatchProgress: (item: WatchHistoryItem) => void;
  /** Lấy tiến độ xem cho phim+tập (để xem tiếp) */
  getProgress: (movieSlug: string, episodeSlug?: string) => WatchHistoryItem | null;
  /** Xóa một mục khỏi lịch sử */
  removeFromHistory: (movieSlug: string, episodeSlug?: string) => void;
  /** Xóa toàn bộ lịch sử */
  clearHistory: () => void;
  /** Thêm yêu thích */
  addFavorite: (item: FavoriteItem) => void;
  /** Bỏ yêu thích */
  removeFavorite: (movieSlug: string) => void;
  /** Đã yêu thích chưa */
  isFavorite: (movieSlug: string) => boolean;
  /** Bật/tắt yêu thích */
  toggleFavorite: (item: FavoriteItem) => void;
}

const WatchHistoryContext = createContext<WatchHistoryContextValue | null>(null);

export function WatchHistoryProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [state, dispatch] = useReducer(watchHistoryReducer, initialWatchHistoryState);

  useEffect(() => {
    dispatch({ type: "LOAD_FROM_COOKIES" });
  }, []);

  const addOrUpdateWatchProgress = useCallback((item: WatchHistoryItem) => {
    dispatch({ type: "ADD_OR_UPDATE_WATCH", payload: item });
  }, []);

  const getProgress = useCallback(
    (movieSlug: string, episodeSlug?: string): WatchHistoryItem | null => {
      const key =
        episodeSlug == null ? movieSlug : `${movieSlug}:${episodeSlug}`;
      const found = state.watchHistory.find((x) => {
        const xKey = x.episodeSlug ? `${x.movieSlug}:${x.episodeSlug}` : x.movieSlug;
        return xKey === key;
      });
      return found ?? null;
    },
    [state.watchHistory]
  );

  const removeFromHistory = useCallback((movieSlug: string, episodeSlug?: string) => {
    dispatch({ type: "REMOVE_FROM_HISTORY", payload: { movieSlug, episodeSlug } });
  }, []);

  const clearHistory = useCallback(() => {
    dispatch({ type: "CLEAR_HISTORY" });
  }, []);

  const addFavorite = useCallback((item: FavoriteItem) => {
    dispatch({ type: "ADD_FAVORITE", payload: item });
  }, []);

  const removeFavorite = useCallback((movieSlug: string) => {
    dispatch({ type: "REMOVE_FAVORITE", payload: movieSlug });
  }, []);

  const isFavorite = useCallback(
    (movieSlug: string) => state.favorites.some((f) => f.movieSlug === movieSlug),
    [state.favorites]
  );

  const toggleFavorite = useCallback((item: FavoriteItem) => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: item });
  }, []);

  const value = useMemo<WatchHistoryContextValue>(
    () => ({
      ...state,
      addOrUpdateWatchProgress,
      getProgress,
      removeFromHistory,
      clearHistory,
      addFavorite,
      removeFavorite,
      isFavorite,
      toggleFavorite,
    }),
    [
      state,
      addOrUpdateWatchProgress,
      getProgress,
      removeFromHistory,
      clearHistory,
      addFavorite,
      removeFavorite,
      isFavorite,
      toggleFavorite,
    ]
  );

  return (
    <WatchHistoryContext.Provider value={value}>
      {children}
    </WatchHistoryContext.Provider>
  );
}

export function useWatchHistory(): WatchHistoryContextValue {
  const ctx = useContext(WatchHistoryContext);
  if (!ctx) {
    throw new Error("useWatchHistory must be used within WatchHistoryProvider");
  }
  return ctx;
}
