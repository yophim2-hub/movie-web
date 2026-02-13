"use client";

import { useState, useCallback } from "react";
import type { MovieListType, SortField, SortType } from "@/types/movie-list";
import type { CategoryItem, CountryItem } from "@/types/category-country";

const FilterIcon = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 512 512"
    className="h-4 w-4 shrink-0"
    aria-hidden
  >
    <path d="M3.9 54.9C10.5 40.9 24.5 32 40 32l432 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9 320 448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" />
  </svg>
);

const ArrowIcon = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 448 512"
    className="ml-1 h-4 w-4 shrink-0"
    aria-hidden
  >
    <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
  </svg>
);

const RATING_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Tất cả" },
  { value: "p", label: "P (Mọi lứa tuổi)" },
  { value: "k", label: "K (Dưới 13 tuổi)" },
  { value: "t13", label: "T13 (13 tuổi trở lên)" },
  { value: "t16", label: "T16 (16 tuổi trở lên)" },
  { value: "t18", label: "T18 (18 tuổi trở lên)" },
];

const SORT_OPTIONS: { field: SortField; type: SortType; label: string }[] = [
  { field: "modified.time", type: "desc", label: "Mới nhất" },
  { field: "_id", type: "desc", label: "Điểm IMDb" },
  { field: "year", type: "desc", label: "Lượt xem" },
];

const YEARS = (() => {
  const y = new Date().getFullYear();
  return Array.from({ length: 16 }, (_, i) => y - i);
})();

const MOVIE_TYPE_OPTIONS: { value: MovieListType; label: string }[] = [
  { value: "phim-le", label: "Phim lẻ" },
  { value: "phim-bo", label: "Phim bộ" },
  { value: "phim-chieu-rap", label: "Phim chiếu rạp" },
  { value: "tv-shows", label: "TV Shows" },
  { value: "hoat-hinh", label: "Hoạt hình" },
  { value: "phim-vietsub", label: "Vietsub" },
  { value: "phim-thuyet-minh", label: "Thuyết minh" },
  { value: "phim-long-tieng", label: "Lồng tiếng" },
];

export interface MovieFilterState {
  country: string;
  typeList: MovieListType;
  rating: string;
  category: string;
  year: number | undefined;
  sortField: SortField;
  sortType: SortType;
}

export interface MovieFilterProps {
  /** Current filter state (from URL) */
  state: MovieFilterState;
  /** Apply filter: update URL and optionally close panel */
  onApply: (state: MovieFilterState) => void;
  countries: CountryItem[];
  categories: CategoryItem[];
  /** Default open on desktop */
  defaultOpen?: boolean;
  /** Hide "Loại phim" row (e.g. for search page) */
  hideMovieType?: boolean;
}

function FilterRow({
  label,
  children,
}: Readonly<{
  label: string;
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-wrap items-start gap-2 border-b border-[var(--border)] py-3 last:border-b-0 md:flex-nowrap md:gap-4">
      <div className="w-full shrink-0 text-[var(--foreground-muted)] md:w-[140px] md:pt-1">
        {label}
      </div>
      <div className="flex min-w-0 flex-1 flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: Readonly<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center rounded-full border px-3 py-1.5 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
        active
          ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--foreground)]"
          : "border-[var(--border)] bg-[var(--secondary-bg-solid)] text-[var(--foreground)] hover:border-[var(--border-strong)] hover:bg-[var(--secondary-hover)]"
      }`}
    >
      {children}
    </button>
  );
}

export function MovieFilter({
  state,
  onApply,
  countries,
  categories,
  defaultOpen = false,
  hideMovieType = false,
}: Readonly<MovieFilterProps>) {
  const [open, setOpen] = useState(defaultOpen);
  const [draft, setDraft] = useState<MovieFilterState>(state);

  const updateDraft = useCallback((updates: Partial<MovieFilterState>) => {
    setDraft((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleApply = useCallback(() => {
    onApply(draft);
    setOpen(false);
  }, [draft, onApply]);

  const handleClose = useCallback(() => {
    setDraft(state);
    setOpen(false);
  }, [state]);

  return (
    <div className="v-filter mb-8">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`filter-toggle flex items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:bg-[var(--secondary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${open ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "bg-[var(--secondary-bg-solid)]"}`}
        aria-expanded={open}
        aria-controls="filter-elements"
      >
        <FilterIcon />
        <span>Bộ lọc</span>
      </button>

      <div
        id="filter-elements"
        className={`filter-elements overflow-hidden transition-[height,opacity] duration-200 ${
          open ? "visible opacity-100" : "invisible h-0 opacity-0"
        }`}
      >
        <div className="mt-4 rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--secondary-bg-solid)] p-4">
          <FilterRow label="Quốc gia:">
            <FilterChip
              active={!draft.country}
              onClick={() => updateDraft({ country: "" })}
            >
              Tất cả
            </FilterChip>
            {countries.map((c) => (
              <FilterChip
                key={c._id}
                active={draft.country === c.slug}
                onClick={() => updateDraft({ country: c.slug })}
              >
                {c.name}
              </FilterChip>
            ))}
          </FilterRow>

          {!hideMovieType && (
            <FilterRow label="Loại phim:">
              {MOVIE_TYPE_OPTIONS.map((t) => (
                <FilterChip
                  key={t.value}
                  active={draft.typeList === t.value}
                  onClick={() => updateDraft({ typeList: t.value })}
                >
                  {t.label}
                </FilterChip>
              ))}
            </FilterRow>
          )}

          <FilterRow label="Xếp hạng:">
            {RATING_OPTIONS.map((r) => (
              <FilterChip
                key={r.value || "all"}
                active={draft.rating === r.value}
                onClick={() => updateDraft({ rating: r.value })}
              >
                {r.label}
              </FilterChip>
            ))}
          </FilterRow>

          <FilterRow label="Thể loại:">
            <FilterChip
              active={!draft.category}
              onClick={() => updateDraft({ category: "" })}
            >
              Tất cả
            </FilterChip>
            {categories.map((c) => (
              <FilterChip
                key={c._id}
                active={draft.category === c.slug}
                onClick={() => updateDraft({ category: c.slug })}
              >
                {c.name}
              </FilterChip>
            ))}
          </FilterRow>

          <FilterRow label="Năm sản xuất:">
            <FilterChip
              active={draft.year === undefined}
              onClick={() => updateDraft({ year: undefined })}
            >
              Tất cả
            </FilterChip>
            {YEARS.map((y) => (
              <FilterChip
                key={y}
                active={draft.year === y}
                onClick={() => updateDraft({ year: y })}
              >
                {y}
              </FilterChip>
            ))}
          </FilterRow>

          <FilterRow label="Sắp xếp:">
            {SORT_OPTIONS.map((s, i) => (
              <FilterChip
                key={`${s.field}-${s.type}-${i}`}
                active={
                  draft.sortField === s.field && draft.sortType === s.type
                }
                onClick={() =>
                  updateDraft({ sortField: s.field, sortType: s.type })
                }
              >
                {s.label}
              </FilterChip>
            ))}
          </FilterRow>

          <div className="fe-row-end mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-4">
            <span className="w-[140px] shrink-0 md:block">&nbsp;</span>
            <div className="flex flex-1 flex-wrap gap-2">
              <button
                type="button"
                onClick={handleApply}
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] shadow-[var(--shadow-sm)] transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                Lọc kết quả
                <ArrowIcon />
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center rounded-full border border-[var(--border)] bg-transparent px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--secondary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
