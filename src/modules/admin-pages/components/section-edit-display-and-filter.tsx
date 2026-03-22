"use client";

import type { ReactNode } from "react";
import type {
  AdminFilterSetting,
  SectionDisplayType,
  SectionHeaderVariant,
} from "../interfaces";
import {
  ADMIN_PAGE_LABELS,
  SECTION_DISPLAY_TYPES,
  SECTION_HEADER_VARIANTS,
} from "../interfaces";
import type { MovieListType } from "@/types/movie-list";
import { MOVIE_LIST_TYPES } from "@/types/movie-list";

export const DISPLAY_TYPES_WITH_HEADER: SectionDisplayType[] = [
  "poster-list",
  "thumb-list",
  "poster-thumb",
];

export const DISPLAY_TYPE_LABELS: Record<SectionDisplayType, string> = {
  banner: "Banner (lớn)",
  "banner-small": "Banner (nhỏ)",
  "poster-list": "Danh sách poster",
  "thumb-list": "Danh sách thumb",
  "grid-list": "Danh sách grid",
  "poster-thumb": "Danh sách poster + thumb",
  "top-list": "Top / bảng xếp hạng",
};

export const HEADER_VARIANT_LABELS: Record<SectionHeaderVariant, string> = {
  "see-more": "Xem thêm",
  navigation: "Nút điều hướng (< >)",
};

const FIELD_LABEL =
  "whitespace-nowrap text-[11px] font-semibold uppercase tracking-wide text-[var(--foreground-muted)]";

const SELECT_BASE =
  "min-h-[38px] min-w-[7rem] max-w-[12rem] shrink-0 rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--background)] px-2.5 py-2 text-[13px] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]";

const INPUT_NUM =
  "min-h-[38px] w-[4.5rem] shrink-0 rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--background)] px-2.5 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]";

function FieldCell({
  label,
  children,
}: Readonly<{ label: string; children: ReactNode }>) {
  return (
    <div className="flex shrink-0 flex-col gap-1">
      <span className={FIELD_LABEL}>{label}</span>
      {children}
    </div>
  );
}

export type MovieListFilterTwoRowsProps = Readonly<{
  filter: AdminFilterSetting;
  onUpdateFilter: (patch: Partial<AdminFilterSetting>) => void;
  categories: { _id: string; name: string; slug: string }[];
  countries: { _id: string; name: string; slug: string }[];
  /** Section editor: cho phép typeList rỗng = theo trang */
  allowEmptyTypeList: boolean;
  /** Tiêu đề khối (tuỳ chọn) */
  heading?: string;
}>;

/**
 * Bộ lọc API danh sách phim — một hàng (Loại phim, Thể loại, Quốc gia, Năm), cuộn ngang nếu hẹp.
 */
export function MovieListFilterTwoRows({
  filter,
  onUpdateFilter,
  categories,
  countries,
  allowEmptyTypeList,
  heading,
}: MovieListFilterTwoRowsProps) {
  const f = filter ?? {};

  return (
    <div className="space-y-2">
      {heading ? (
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
          {heading}
        </h4>
      ) : null}
      <div className="flex min-w-0 flex-nowrap items-end gap-2 overflow-x-auto overscroll-x-contain pb-0.5 [-webkit-overflow-scrolling:touch]">
        <FieldCell label="Loại phim">
            <select
              value={f.typeList ?? ""}
              onChange={(e) =>
                onUpdateFilter({
                  typeList: (e.target.value || undefined) as MovieListType | undefined,
                })
              }
              className={`${SELECT_BASE} min-w-[8.5rem]`}
            >
              {allowEmptyTypeList ? (
                <option value="">Mặc định (theo trang)</option>
              ) : null}
              {MOVIE_LIST_TYPES.map((t) => (
                <option key={t} value={t}>
                  {ADMIN_PAGE_LABELS[t] ?? t}
                </option>
              ))}
            </select>
        </FieldCell>
        <FieldCell label="Thể loại">
            <select
              value={f.category ?? ""}
              onChange={(e) =>
                onUpdateFilter({ category: e.target.value || undefined })
              }
              className={SELECT_BASE}
            >
              <option value="">Tất cả</option>
              {categories.map((c) => (
                <option key={c._id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
        </FieldCell>
        <FieldCell label="Quốc gia">
            <select
              value={f.country ?? ""}
              onChange={(e) =>
                onUpdateFilter({ country: e.target.value || undefined })
              }
              className={SELECT_BASE}
            >
              <option value="">Tất cả</option>
              {countries.map((c) => (
                <option key={c._id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
        </FieldCell>
        <FieldCell label="Năm">
            <input
              type="number"
              min={1900}
              max={2030}
              placeholder="2024"
              value={f.year ?? ""}
              onChange={(e) => {
                const v = e.target.value.trim();
                onUpdateFilter({
                  year: v ? Math.min(2030, Math.max(1900, Number(v))) : undefined,
                });
              }}
              className={`${INPUT_NUM} w-[5.5rem]`}
            />
        </FieldCell>
      </div>
    </div>
  );
}

export type SectionEditDisplayAndFilterPanelProps = Readonly<{
  displayType?: SectionDisplayType;
  headerVariant?: SectionHeaderVariant;
  onPatchDisplay: (patch: {
    displayType?: SectionDisplayType | undefined;
    headerVariant?: SectionHeaderVariant;
  }) => void;
  filter: AdminFilterSetting;
  onUpdateFilter: (patch: Partial<AdminFilterSetting>) => void;
  categories: { _id: string; name: string; slug: string }[];
  countries: { _id: string; name: string; slug: string }[];
  showMovieListFilters: boolean;
}>;

/**
 * Khối **Hiển thị** (loại hiển thị + header) và **Filter** API cho form chỉnh section.
 */
export function SectionEditDisplayAndFilterPanel({
  displayType,
  headerVariant,
  onPatchDisplay,
  filter,
  onUpdateFilter,
  categories,
  countries,
  showMovieListFilters,
}: SectionEditDisplayAndFilterPanelProps) {
  const showHeaderRow =
    displayType != null && DISPLAY_TYPES_WITH_HEADER.includes(displayType);

  return (
    <>
      <section className="space-y-3 rounded-lg border border-[var(--border)] bg-[var(--secondary-bg-solid)]/30 p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
          Hiển thị
        </h4>
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end">
          <FieldCell label="Loại hiển thị">
            <select
              value={displayType ?? ""}
              onChange={(e) =>
                onPatchDisplay({
                  displayType: (e.target.value || undefined) as SectionDisplayType | undefined,
                })
              }
              className={`${SELECT_BASE} min-w-[11rem] max-w-none sm:max-w-[16rem]`}
            >
              <option value="">Mặc định</option>
              {SECTION_DISPLAY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {DISPLAY_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </FieldCell>
          {showHeaderRow ? (
            <FieldCell label="Loại header">
              <select
                value={headerVariant ?? "see-more"}
                onChange={(e) =>
                  onPatchDisplay({
                    headerVariant: e.target.value as SectionHeaderVariant,
                  })
                }
                className={`${SELECT_BASE} min-w-[11rem] max-w-none sm:max-w-[16rem]`}
              >
                {SECTION_HEADER_VARIANTS.map((v) => (
                  <option key={v} value={v}>
                    {HEADER_VARIANT_LABELS[v]}
                  </option>
                ))}
              </select>
            </FieldCell>
          ) : null}
        </div>
      </section>

      {showMovieListFilters ? (
        <section className="space-y-3 rounded-lg border border-[var(--border)] bg-[var(--secondary-bg-solid)]/30 p-4">
          <MovieListFilterTwoRows
            heading="Filter"
            filter={filter}
            onUpdateFilter={onUpdateFilter}
            categories={categories}
            countries={countries}
            allowEmptyTypeList
          />
        </section>
      ) : null}
    </>
  );
}
