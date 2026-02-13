"use client";

import {
  getFavoritesFromCookie,
  getWatchHistoryFromCookie,
  setFavoritesCookie,
  setWatchHistoryCookie,
} from "./cookie-storage";
import type { FavoriteItem, WatchHistoryItem } from "./types";

export interface WatchHistoryState {
  watchHistory: WatchHistoryItem[];
  favorites: FavoriteItem[];
}

export type WatchHistoryAction =
  | { type: "LOAD_FROM_COOKIES" }
  | {
      type: "ADD_OR_UPDATE_WATCH";
      payload: WatchHistoryItem;
    }
  | { type: "REMOVE_FROM_HISTORY"; payload: { movieSlug: string; episodeSlug?: string } }
  | { type: "CLEAR_HISTORY" }
  | { type: "ADD_FAVORITE"; payload: FavoriteItem }
  | { type: "REMOVE_FAVORITE"; payload: string }
  | { type: "TOGGLE_FAVORITE"; payload: FavoriteItem };

function updateHistoryList(
  list: WatchHistoryItem[],
  item: WatchHistoryItem
): WatchHistoryItem[] {
  const key = item.episodeSlug ? `${item.movieSlug}:${item.episodeSlug}` : item.movieSlug;
  const rest = list.filter(
    (x) => (x.episodeSlug ? `${x.movieSlug}:${x.episodeSlug}` : x.movieSlug) !== key
  );
  return [...rest, item];
}

export function watchHistoryReducer(
  state: WatchHistoryState,
  action: WatchHistoryAction
): WatchHistoryState {
  switch (action.type) {
    case "LOAD_FROM_COOKIES":
      return {
        watchHistory: getWatchHistoryFromCookie(),
        favorites: getFavoritesFromCookie(),
      };
    case "ADD_OR_UPDATE_WATCH": {
      const next = updateHistoryList(state.watchHistory, action.payload);
      setWatchHistoryCookie(next);
      return { ...state, watchHistory: next };
    }
    case "REMOVE_FROM_HISTORY": {
      const { movieSlug, episodeSlug } = action.payload;
      const next = state.watchHistory.filter((x) => {
        if (x.movieSlug !== movieSlug) return true;
        const sameEpisode =
          episodeSlug == null ? !x.episodeSlug : x.episodeSlug === episodeSlug;
        return !sameEpisode;
      });
      setWatchHistoryCookie(next);
      return { ...state, watchHistory: next };
    }
    case "CLEAR_HISTORY":
      setWatchHistoryCookie([]);
      return { ...state, watchHistory: [] };
    case "ADD_FAVORITE": {
      const exists = state.favorites.some((f) => f.movieSlug === action.payload.movieSlug);
      const next = exists
        ? state.favorites
        : [...state.favorites, action.payload];
      if (!exists) setFavoritesCookie(next);
      return { ...state, favorites: next };
    }
    case "REMOVE_FAVORITE": {
      const next = state.favorites.filter((f) => f.movieSlug !== action.payload);
      setFavoritesCookie(next);
      return { ...state, favorites: next };
    }
    case "TOGGLE_FAVORITE": {
      const has = state.favorites.some((f) => f.movieSlug === action.payload.movieSlug);
      const next = has
        ? state.favorites.filter((f) => f.movieSlug !== action.payload.movieSlug)
        : [...state.favorites, action.payload];
      setFavoritesCookie(next);
      return { ...state, favorites: next };
    }
    default:
      return state;
  }
}

export const initialWatchHistoryState: WatchHistoryState = {
  watchHistory: [],
  favorites: [],
};
