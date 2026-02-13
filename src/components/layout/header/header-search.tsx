"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useCallback, useEffect } from "react";
import { useSearchMovies } from "@/hooks";

const SEARCH_RESULTS_LIMIT = 5;

const SearchIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 512 512"
    className={className}
    aria-hidden
  >
    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
  </svg>
);

const RemoveIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 512 512"
    className={className}
    aria-hidden
  >
    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
  </svg>
);

export interface HeaderSearchProps {
  /** Mobile: khi true thì hiện ô search (block), desktop luôn flex */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export function HeaderSearch({
  open,
  onOpenChange,
  className = "",
}: Readonly<HeaderSearchProps>) {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const { data: searchData, isLoading: searchLoading } = useSearchMovies(
    { keyword: searchQuery.trim(), page: 1, limit: SEARCH_RESULTS_LIMIT },
    { enabled: searchQuery.trim().length > 0 }
  );

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleSearchSubmit = useCallback(
    (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      const keyword = searchQuery.trim();
      if (keyword) {
        router.push(`/tim-kiem?keyword=${encodeURIComponent(keyword)}`);
      } else {
        router.push("/tim-kiem");
      }
      onOpenChange(false);
      setSearchFocused(false);
    },
    [router, searchQuery, onOpenChange]
  );

  const showSearchDropdown = searchQuery.trim().length > 0 && searchFocused;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchWrapRef.current?.contains(e.target as Node)) return;
      setSearchFocused(false);
    };
    if (showSearchDropdown) {
      globalThis.document?.addEventListener("click", handleClickOutside);
      return () =>
        globalThis.document?.removeEventListener("click", handleClickOutside);
    }
  }, [showSearchDropdown]);

  const handleResultClick = useCallback(() => {
    setSearchFocused(false);
    setSearchQuery("");
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <div
      ref={searchWrapRef}
      id="search"
      className={`relative z-20 max-w-[280px] flex-1 transition-[var(--duration-normal)] sm:max-w-[320px] ${className} ${
        open ? "block w-full lg:flex" : "hidden w-0 lg:flex lg:flex-1"
      }`}
    >
      <form
        action="/tim-kiem"
        method="get"
        onSubmit={handleSearchSubmit}
        className="search-elements flex h-8 w-full min-w-0 items-center gap-1.5 rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--secondary-bg-solid)] px-2 py-1.5 focus-within:border-[var(--accent)] focus-within:ring-1 focus-within:ring-[var(--accent)]"
      >
        <div className="search-icon shrink-0">
          <SearchIcon className="h-3.5 w-3.5 text-[var(--foreground-muted)]" />
        </div>
        <input
          ref={searchInputRef}
          id="main-search"
          type="search"
          name="keyword"
          placeholder="Tìm kiếm phim, diễn viên"
          autoComplete="off"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          className="search-input min-w-0 flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none"
        />
        {searchQuery.length > 0 && (
          <button
            type="button"
            id="remove-text"
            className="remove-icon flex shrink-0 rounded-[var(--radius-button)] p-0.5 text-[var(--foreground-muted)] hover:bg-[var(--secondary-hover)] hover:text-[var(--foreground)] focus-ring"
            aria-label="Xóa"
            onClick={() => {
              setSearchQuery("");
              searchInputRef.current?.focus();
            }}
          >
            <RemoveIcon className="h-3.5 w-3.5" />
          </button>
        )}
      </form>

      {/* Search modal dropdown */}
      {showSearchDropdown && (
        <div
          className="search-modal absolute left-0 right-0 top-full z-20 mt-1 max-h-[70vh] overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--glass-bg-solid)] shadow-[var(--shadow-lg)]"
          style={{ opacity: 1, willChange: "opacity" }}
        >
          <div className="max-h-[60vh] overflow-y-auto p-2">
            <div className="show-group">
              <div className="group-title mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                Danh sách phim
              </div>
              <div className="group-list space-y-0.5">
                {searchLoading && (
                  <div className="px-3 py-4 text-center text-[13px] text-[var(--foreground-muted)]">
                    Đang tìm...
                  </div>
                )}
                {!searchLoading &&
                  searchData != null &&
                  (searchData.data.items == null ||
                    searchData.data.items.length === 0) && (
                    <div className="px-3 py-4 text-center text-[13px] text-[var(--foreground-muted)]">
                      Không có kết quả
                    </div>
                  )}
                {!searchLoading &&
                  ((searchData?.data?.items?.length ?? 0) > 0) &&
                  searchData?.data?.items?.map((item) => (
                    <Link
                      key={item._id}
                      href={`/phim/${item.slug}`}
                      className="h-item s-item flex gap-3 rounded-[var(--radius-button)] px-2 py-2 text-left transition-colors hover:bg-[var(--secondary-bg-solid)]"
                      onClick={handleResultClick}
                    >
                      <div className="v-thumb-s h-20 w-12 shrink-0 overflow-hidden rounded bg-[var(--secondary-bg-solid)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            item.poster_url.startsWith("http")
                              ? item.poster_url
                              : `https://phimimg.com/${item.poster_url}`
                          }
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="info min-w-0 flex-1">
                        <h4 className="item-title lim-2 line-clamp-2 text-[13px] font-medium text-[var(--foreground)]">
                          {item.name}
                        </h4>
                        <div className="alias-title lim-1 line-clamp-1 text-[12px] text-[var(--foreground-muted)]">
                          {item.origin_name}
                        </div>
                        <div className="info-line mt-1 flex flex-wrap gap-1.5">
                          <span className="tag-small text-[11px] text-[var(--foreground-subtle)]">
                            {item.year}
                          </span>
                          <span className="tag-small text-[11px] text-[var(--foreground-subtle)]">
                            {item.episode_current}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
            <Link
              href={
                searchQuery.trim()
                  ? `/tim-kiem?keyword=${encodeURIComponent(searchQuery.trim())}`
                  : "/tim-kiem"
              }
              className="view-all mt-2 block rounded-[var(--radius-button)] px-3 py-2 text-center text-[13px] font-medium text-[var(--accent)] hover:bg-[var(--accent-soft)]"
              onClick={handleResultClick}
            >
              Toàn bộ kết quả
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
