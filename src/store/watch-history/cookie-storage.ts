"use client";

import {
  COOKIE_MAX_AGE,
  FAVORITES_COOKIE,
  WATCH_HISTORY_COOKIE,
  WATCH_HISTORY_MAX,
} from "./types";
import type { FavoriteItem, WatchHistoryItem } from "./types";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/[^a-z0-9]/gi, (c) => "\\" + c) + "=([^;]*)"));
  const value = match ? decodeURIComponent(match[1]) : null;
  return value ?? null;
}

function setCookie(name: string, value: string, maxAge: number = COOKIE_MAX_AGE): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function getWatchHistoryFromCookie(): WatchHistoryItem[] {
  const raw = getCookie(WATCH_HISTORY_COOKIE);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setWatchHistoryCookie(items: WatchHistoryItem[]): void {
  const trimmed = items.slice(-WATCH_HISTORY_MAX);
  setCookie(WATCH_HISTORY_COOKIE, JSON.stringify(trimmed));
}

export function getFavoritesFromCookie(): FavoriteItem[] {
  const raw = getCookie(FAVORITES_COOKIE);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setFavoritesCookie(items: FavoriteItem[]): void {
  setCookie(FAVORITES_COOKIE, JSON.stringify(items));
}
