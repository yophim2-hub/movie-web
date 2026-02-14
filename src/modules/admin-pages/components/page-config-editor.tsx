"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useAdminPageConfigs } from "../hooks";
import { useCategories, useCountries } from "@/hooks";
import { useSearchMovies } from "@/hooks/use-search-movies";
import { useLatestMovieList } from "@/hooks/use-latest-movie-list";
import type {
  AdminPageIdAny,
  AdminFilterSetting,
  AdminSection,
  AdminSectionType,
  SectionDisplayType,
  SectionHeaderVariant,
} from "../interfaces";
import {
  ADMIN_PAGE_LABELS,
  SECTION_DISPLAY_TYPES,
  SECTION_HEADER_VARIANTS,
} from "../interfaces";
import type { MovieListType, SortField, SortType } from "@/types/movie-list";
import { MOVIE_LIST_TYPES, SORT_FIELDS, SORT_TYPES } from "@/types/movie-list";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { SectionPreview } from "./section-renderers";

const SORT_LABELS: Record<string, string> = {
  "modified.time": "Mới cập nhật",
  _id: "ID",
  year: "Năm",
};

const SORT_TYPE_LABELS: Record<SortType, string> = {
  desc: "Giảm dần",
  asc: "Tăng dần",
};

const SECTION_TYPE_LABELS: Record<AdminSectionType, string> = {
  "movie-list": "Danh sách (API)",
  pinned: "Phim ghim",
};

const DISPLAY_TYPE_LABELS: Record<SectionDisplayType, string> = {
  banner: "Banner (lớn)",
  "banner-small": "Banner (nhỏ)",
  "poster-list": "Danh sách poster",
  "thumb-list": "Danh sách thumb",
  "grid-list": "Danh sách grid",
  "poster-thumb": "Danh sách poster + thumb",
  "top-list": "Top / bảng xếp hạng",
};

const HEADER_VARIANT_LABELS: Record<SectionHeaderVariant, string> = {
  "see-more": "Xem thêm",
  navigation: "Nút điều hướng (< >)",
};

/** Loại hiển thị có chọn Loại header (Xem thêm / Nút điều hướng). grid-list không có. */
const DISPLAY_TYPES_WITH_HEADER: SectionDisplayType[] = [
  "poster-list",
  "thumb-list",
  "poster-thumb",
];

export function PageConfigEditor() {
  const {
    configs,
    pageList,
    isLoading,
    error,
    addCustomPage,
    updateCustomPage,
    removeCustomPage,
    addSection,
    updateSection,
    removeSection,
    moveSection,
    addSavedMovieToSection,
    removeSavedMovieFromSection,
    reload,
  } = useAdminPageConfigs();
  const { data: categoriesData } = useCategories();
  const categories = categoriesData ?? [];
  const { data: countriesData } = useCountries();
  const countries = countriesData ?? [];

  const [selectedPageId, setSelectedPageId] = useState<AdminPageIdAny | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [addPageFormOpen, setAddPageFormOpen] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);

  const config = selectedPageId ? configs[selectedPageId] : null;
  const sections = config?.sections ?? [];
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  const editingSection = editingSectionId
    ? sortedSections.find((s) => s.id === editingSectionId)
    : null;
  const selectedPageMeta = pageList.find((p) => p.id === selectedPageId);

  const handleAddSection = useCallback(async () => {
    if (!selectedPageId) return;
    const id = await addSection(selectedPageId, {
      title: "Section mới",
      type: "movie-list",
      filter: {},
      savedMovieIds: [],
    });
    setEditingSectionId(id);
  }, [selectedPageId, addSection]);

  const handleRemoveSection = useCallback(
    async (sectionId: string) => {
      if (!selectedPageId || !confirm("Xóa section này?")) return;
      await removeSection(selectedPageId, sectionId);
      if (editingSectionId === sectionId) setEditingSectionId(null);
    },
    [selectedPageId, removeSection, editingSectionId]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-[13px] text-[var(--foreground-muted)]">
        Đang tải cấu hình…
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2 py-4">
        <p className="text-[13px] text-red-600">{error}</p>
        <Button variant="secondary" size="sm" onClick={reload}>
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bảng quản lý trang */}
      <section className="rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--secondary-bg-solid)]/50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            Quản lý trang
          </h3>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setAddPageFormOpen(true)}
          >
            Thêm trang
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Tên trang</TableHead>
              <TableHead className="w-24">Loại</TableHead>
              <TableHead className="w-[220px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-[13px] text-[var(--foreground-muted)]">
                  Chưa có trang. Bấm &quot;Thêm trang&quot; để tạo trang và quản lý section.
                </TableCell>
              </TableRow>
            ) : (
              pageList.map((page, idx) => (
                <TableRow key={page.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell className="font-medium">{page.label}</TableCell>
                  <TableCell>
                    {page.isBuiltIn ? (
                      <span className="text-[12px] text-[var(--foreground-muted)]">Cố định</span>
                    ) : (
                      <span className="text-[12px] text-amber-600">Tùy chỉnh</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPageId(page.id);
                        setEditingSectionId(null);
                        setEditingPageId(null);
                      }}
                      className={`mr-2 text-[13px] underline hover:text-[var(--accent)] ${
                        selectedPageId === page.id
                          ? "font-medium text-[var(--accent)]"
                          : "text-[var(--foreground-muted)]"
                      }`}
                    >
                      Quản lý
                    </button>
                    {!page.isBuiltIn && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingPageId(editingPageId === page.id ? null : page.id)
                          }
                          className="mr-2 text-[13px] text-[var(--foreground-muted)] underline hover:text-[var(--accent)]"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (confirm(`Xóa trang "${page.label}"?`)) {
                              await removeCustomPage(page.id);
                              if (selectedPageId === page.id) setSelectedPageId(null);
                              setEditingPageId(null);
                            }
                          }}
                          className="text-[13px] text-[var(--foreground-muted)] underline hover:text-red-600"
                        >
                          Xóa
                        </button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {editingPageId && (() => {
          const pg = pageList.find((p) => p.id === editingPageId);
          const cfg = editingPageId ? configs[editingPageId] : null;
          if (!pg || pg.isBuiltIn) return null;
          return (
            <EditPageForm
              label={pg.label}
              slug={pg.slug}
              seoTitle={cfg?.seoTitle}
              seoDescription={cfg?.seoDescription}
              onSave={async (label, slug, seoTitle, seoDescription) => {
                await updateCustomPage(editingPageId, { label, slug, seoTitle, seoDescription });
                setEditingPageId(null);
              }}
              onCancel={() => setEditingPageId(null)}
            />
          );
        })()}
      </section>

      {/* Modal Thêm trang */}
      {addPageFormOpen && (
        <Modal
          open={true}
          onClose={() => setAddPageFormOpen(false)}
          title="Thêm trang"
          panelClassName="!max-w-2xl !min-w-[28rem]"
        >
          <AddPageForm
            onSubmit={async (label, slug, seoTitle, seoDescription) => {
              const id = (await addCustomPage({ label, slug, seoTitle, seoDescription })) as AdminPageIdAny;
              setAddPageFormOpen(false);
              setSelectedPageId(id);
              setEditingSectionId(null);
            }}
            onCancel={() => setAddPageFormOpen(false)}
          />
        </Modal>
      )}

      {/* Modal quản lý section khi bấm Quản lý */}
      {config && selectedPageMeta && (
        <Modal
          open={true}
          onClose={() => {
            setSelectedPageId(null);
            setEditingSectionId(null);
          }}
          title={`Quản lý: ${selectedPageMeta.label}`}
          panelClassName="!max-w-5xl !max-h-[90vh] !flex !flex-col"
        >
          <div className="space-y-4">
            <p className="text-[13px] text-[var(--foreground-muted)]">
              Slug: <span className="font-mono text-[var(--foreground)]">{selectedPageMeta.slug}</span>
            </p>
            <div className="flex justify-end">
              <Button variant="primary" size="sm" onClick={handleAddSection}>
                Thêm section
              </Button>
            </div>

            {sortedSections.length === 0 ? (
              <p className="text-[13px] text-[var(--foreground-muted)]">
                Chưa có section. Bấm &quot;Thêm section&quot; để tạo.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Tiêu đề</TableHead>
                    <TableHead className="w-32">Kiểu</TableHead>
                    <TableHead>Cấu hình</TableHead>
                    <TableHead className="w-[200px] text-right">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedSections.map((sec, idx) => (
                    <TableRow key={sec.id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell className="font-medium">{sec.title}</TableCell>
                      <TableCell>
                        {SECTION_TYPE_LABELS[sec.type]}
                      </TableCell>
                      <TableCell className="text-[12px] text-[var(--foreground-muted)]">
                        {sec.type === "movie-list"
                          ? (() => {
                              const t = sec.filter?.typeList;
                              const typePart = t ? `${ADMIN_PAGE_LABELS[t]} · ` : "";
                              return `Filter: ${typePart}${sec.filter?.category || "—"} / ${sec.filter?.country || "—"} / limit ${sec.filter?.limit ?? 24}`;
                            })()
                          : ""}
                        {sec.savedMovieIds.length > 0
                          ? ` · ${sec.savedMovieIds.length} phim`
                          : ""}
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingSectionId(editingSectionId === sec.id ? null : sec.id)
                          }
                          className="mr-2 text-[13px] text-[var(--foreground-muted)] underline hover:text-[var(--accent)]"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => selectedPageId && moveSection(selectedPageId, sec.id, "up").catch(console.error)}
                          disabled={idx === 0}
                          className="mr-2 text-[13px] text-[var(--foreground-muted)] underline hover:text-[var(--accent)] disabled:opacity-40"
                          title="Lên"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => selectedPageId && moveSection(selectedPageId, sec.id, "down").catch(console.error)}
                          disabled={idx === sortedSections.length - 1}
                          className="mr-2 text-[13px] text-[var(--foreground-muted)] underline hover:text-[var(--accent)] disabled:opacity-40"
                          title="Xuống"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveSection(sec.id)}
                          className="text-[13px] text-[var(--foreground-muted)] underline hover:text-red-600"
                        >
                          Xóa
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Popup chỉnh sửa section (khi chọn Sửa hoặc vừa Thêm) — portal + z-index cao để không bị cắt bởi modal quản lý */}
          {editingSection && selectedPageId && (
            <Modal
              open={true}
              onClose={() => setEditingSectionId(null)}
              title={`Chỉnh sửa section: ${editingSection.title}`}
              panelClassName="!max-w-4xl !max-h-[90vh] !flex !flex-col"
              zIndex={60}
            >
              <SectionEditForm
                pageId={selectedPageId}
                section={editingSection}
                categories={categories}
                countries={countries}
                onUpdate={(patch) =>
                  updateSection(selectedPageId, editingSection.id, patch).catch(console.error)
                }
                onAddMovie={(movieId) =>
                  addSavedMovieToSection(selectedPageId, editingSection.id, movieId).catch(console.error)
                }
                onRemoveMovie={(movieId) =>
                  removeSavedMovieFromSection(
                    selectedPageId,
                    editingSection.id,
                    movieId
                  ).catch(console.error)
                }
                onClose={() => setEditingSectionId(null)}
              />
            </Modal>
          )}
        </Modal>
      )}
    </div>
  );
}

/** Build URL xem thử section: danh-sách với filter của section (movie-list) hoặc trang chủ (pinned). */
function buildSectionTestUrl(section: AdminSection): string {
  if (section.type === "pinned") {
    return "/";
  }
  const f = section.filter ?? {};
  const typeList = f.typeList ?? "phim-le";
  const params = new URLSearchParams();
  params.set("type", typeList);
  params.set("page", "1");
  if (f.category) params.set("category", f.category);
  if (f.country) params.set("country", f.country);
  if (f.year != null) params.set("year", String(f.year));
  if (f.sortField) params.set("sortField", f.sortField);
  if (f.sortType) params.set("sortType", f.sortType);
  return `/danh-sach?${params.toString()}`;
}

function SectionEditForm({
  section,
  categories,
  countries,
  onUpdate,
  onAddMovie,
  onRemoveMovie,
  onClose,
}: Readonly<{
  pageId: AdminPageIdAny;
  section: AdminSection;
  categories: { _id: string; name: string; slug: string }[];
  countries: { _id: string; name: string; slug: string }[];
  onUpdate: (patch: Partial<Omit<AdminSection, "id">>) => void;
  onAddMovie: (movieId: string) => void;
  onRemoveMovie: (movieId: string) => void;
  onClose: () => void;
}>) {
  const [showTestPreview, setShowTestPreview] = useState(false);
  const updateFilter = useCallback(
    (patch: Partial<AdminFilterSetting>) => {
      const current = section.filter ?? {};
      onUpdate({ filter: { ...current, ...patch } });
    },
    [section.filter, onUpdate]
  );

  return (
    <>
      <div className="space-y-6">
        {/* 1. Thông tin cơ bản */}
        <section className="space-y-3 rounded-lg border border-[var(--border)] bg-[var(--secondary-bg-solid)]/30 p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
            Thông tin cơ bản
          </h4>
          <FilterRow label="Tiêu đề">
            <Input
              value={section.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="VD: Phim mới cập nhật"
              className="max-w-[280px]"
            />
          </FilterRow>
          <FilterRow label="Kiểu">
            <select
              value={section.type}
              onChange={(e) =>
                onUpdate({ type: e.target.value as AdminSectionType })
              }
              className="rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              <option value="movie-list">Danh sách (API)</option>
              <option value="pinned">Phim ghim</option>
            </select>
          </FilterRow>
          <FilterRow label="Loại hiển thị">
            <select
              value={section.displayType ?? ""}
              onChange={(e) =>
                onUpdate({
                  displayType: (e.target.value || undefined) as SectionDisplayType | undefined,
                })
              }
              className="rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] min-w-[180px]"
            >
              <option value="">Mặc định</option>
              {SECTION_DISPLAY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {DISPLAY_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </FilterRow>
          {section.displayType &&
            DISPLAY_TYPES_WITH_HEADER.includes(section.displayType) && (
              <FilterRow label="Loại header">
                <select
                  value={section.headerVariant ?? "see-more"}
                  onChange={(e) =>
                    onUpdate({
                      headerVariant: e.target.value as SectionHeaderVariant,
                    })
                  }
                  className="rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] min-w-[180px]"
                >
                  {SECTION_HEADER_VARIANTS.map((v) => (
                    <option key={v} value={v}>
                      {HEADER_VARIANT_LABELS[v]}
                    </option>
                  ))}
                </select>
              </FilterRow>
            )}
        </section>

        {section.type === "movie-list" && (
          <>
            {/* 2. Filter (nguồn dữ liệu + sắp xếp & giới hạn) */}
            <section className="space-y-4 rounded-lg border border-[var(--border)] bg-[var(--secondary-bg-solid)]/30 p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                Filter
              </h4>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="shrink-0 text-[13px] text-[var(--foreground-muted)]">Loại phim</span>
                <select
                  value={section.filter?.typeList ?? ""}
                  onChange={(e) =>
                    updateFilter({
                      typeList: (e.target.value || undefined) as MovieListType | undefined,
                    })
                  }
                  className="rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] min-w-[140px]"
                >
                  <option value="">Mặc định (theo trang)</option>
                  {MOVIE_LIST_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {ADMIN_PAGE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="shrink-0 text-[13px] text-[var(--foreground-muted)]">Thể loại</span>
                <select
                  value={section.filter?.category ?? ""}
                  onChange={(e) =>
                    updateFilter({ category: e.target.value || undefined })
                  }
                  className="rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] min-w-[120px]"
                >
                  <option value="">Tất cả</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <span className="shrink-0 text-[13px] text-[var(--foreground-muted)]">Quốc gia</span>
                <select
                  value={section.filter?.country ?? ""}
                  onChange={(e) =>
                    updateFilter({ country: e.target.value || undefined })
                  }
                  className="rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] min-w-[120px]"
                >
                  <option value="">Tất cả</option>
                  {countries.map((c) => (
                    <option key={c._id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <span className="shrink-0 text-[13px] text-[var(--foreground-muted)]">Năm</span>
                <input
                  type="number"
                  min={1900}
                  max={2030}
                  placeholder="VD: 2024"
                  value={section.filter?.year ?? ""}
                  onChange={(e) => {
                    const v = e.target.value.trim();
                    updateFilter({
                      year: v ? Math.min(2030, Math.max(1900, Number(v))) : undefined,
                    });
                  }}
                  className="min-w-[10rem] w-36 rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="shrink-0 text-[13px] text-[var(--foreground-muted)]">Sắp xếp</span>
                <select
                value={section.filter?.sortField ?? ""}
                onChange={(e) =>
                  updateFilter({
                    sortField: (e.target.value || undefined) as SortField | undefined,
                  })
                }
                className="rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] min-w-[120px]"
              >
                <option value="">Mặc định</option>
                {SORT_FIELDS.map((f) => (
                  <option key={f} value={f}>
                    {SORT_LABELS[f] ?? f}
                  </option>
                ))}
              </select>
              <select
                value={section.filter?.sortType ?? ""}
                onChange={(e) =>
                  updateFilter({
                    sortType: (e.target.value || undefined) as SortType | undefined,
                  })
                }
                className="rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] min-w-[90px]"
              >
                <option value="">—</option>
                {SORT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {SORT_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
              <span className="shrink-0 text-[13px] text-[var(--foreground-muted)]">Limit</span>
              <input
                type="number"
                min={8}
                max={64}
                value={section.filter?.limit ?? 24}
                onChange={(e) =>
                  updateFilter({
                    limit: Math.min(
                      64,
                      Math.max(8, Number(e.target.value) || 24)
                    ),
                  })
                }
                className="w-16 rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
              </div>
            </section>
          </>
        )}

        {/* 4. Phim đã chọn — chỉ hiển thị khi Kiểu = Phim ghim */}
        {section.type === "pinned" && (
          <section className="space-y-3 rounded-lg border border-[var(--border)] bg-[var(--secondary-bg-solid)]/30 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
              Phim đã chọn
            </h4>
            <AddMovieBlockForSection
              savedIds={section.savedMovieIds}
              onAdd={onAddMovie}
              onRemove={onRemoveMovie}
            />
          </section>
        )}
      </div>

      {/* 5. Hành động */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowTestPreview((v) => !v)}
        >
          {showTestPreview ? "Ẩn xem thử" : "Xem thử"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-[12px] text-[var(--foreground-muted)]"
          onClick={() => window.open(buildSectionTestUrl(section), "_blank", "noopener,noreferrer")}
        >
          Mở trang (tab mới)
        </Button>
        <Button variant="secondary" size="sm" onClick={onClose} className="ml-auto">
          Đóng
        </Button>
      </div>

      {/* Preview theo Loại hiển thị — hiện bên dưới khi bấm Xem thử */}
      {showTestPreview && (
        <div className="mt-4 border-t border-[var(--border)] pt-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
            Preview
          </h4>
          <SectionPreview section={section} />
        </div>
      )}
    </>
  );
}


function FilterRow({
  label,
  children,
}: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-4">
      <span className="w-[140px] shrink-0 text-[13px] text-[var(--foreground-muted)]">
        {label}
      </span>
      {children}
    </div>
  );
}

function AddMovieBlockForSection({
  savedIds,
  onAdd,
  onRemove,
}: Readonly<{
  savedIds: string[];
  onAdd: (movieId: string) => void;
  onRemove: (movieId: string) => void;
}>) {
  const [keyword, setKeyword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [nameById, setNameById] = useState<Record<string, string>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const hasSearchKeyword = keyword.trim().length >= 2;

  const { data: searchData, isFetching: isSearching } = useSearchMovies(
    { keyword: keyword.trim(), page: 1, limit: 15 },
    { enabled: hasSearchKeyword }
  );
  const searchItems = searchData?.data?.items ?? [];

  const { data: latestData, isFetching: isLatestLoading } = useLatestMovieList(
    { page: 1 },
    { enabled: isOpen && !hasSearchKeyword }
  );
  const latestItems = latestData?.items ?? [];

  const items = hasSearchKeyword
    ? searchItems
    : latestItems.map((item) => ({ _id: item._id, name: item.name, year: item.year }));
  const isFetching = hasSearchKeyword ? isSearching : isLatestLoading;

  const handleSelect = useCallback(
    (movieId: string, name: string) => {
      if (savedIds.includes(movieId)) return;
      onAdd(movieId);
      setNameById((prev) => ({ ...prev, [movieId]: name }));
      setKeyword("");
    },
    [savedIds, onAdd]
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown = isOpen;
  const listboxId = "section-movie-listbox";

  return (
    <div ref={containerRef} className="relative w-full max-w-[360px]">
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Escape") setIsOpen(false);
        }}
        className="min-h-[80px] rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-[var(--accent)] focus-within:border-[var(--accent)]"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex flex-wrap gap-1.5">
          {savedIds.map((id) => (
            <span
              key={id}
              className="inline-flex items-center gap-1 rounded-md bg-[var(--secondary-bg-solid)] px-2 py-0.5 text-[13px] text-[var(--foreground)]"
            >
              {nameById[id] ?? id}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(id);
                  setNameById((prev) => {
                    const next = { ...prev };
                    delete next[id];
                    return next;
                  });
                }}
                className="ml-0.5 rounded p-0.5 hover:bg-[var(--border)] hover:text-red-600"
                aria-label="Xóa"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="search"
            placeholder={savedIds.length === 0 ? "Chọn phim hoặc tìm theo tên..." : "Tìm thêm phim..."}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="min-w-[140px] flex-1 border-0 bg-transparent py-1 text-[13px] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-0"
          />
        </div>
      </div>
      {showDropdown && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute top-full left-0 z-50 mt-1 max-h-56 w-full overflow-auto rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--glass-bg)] shadow-lg backdrop-blur-xl"
        >
          {isFetching && (
            <p className="px-3 py-3 text-center text-[13px] text-[var(--foreground-muted)]">
              Đang tải...
            </p>
          )}
          {!isFetching && items.length === 0 && (
            <p className="px-3 py-3 text-[13px] text-[var(--foreground-muted)]">
              {hasSearchKeyword ? "Không tìm thấy phim." : "Chưa có dữ liệu."}
            </p>
          )}
          {!isFetching && items.length > 0 && (
            <ul className="py-1">
              {items.map((item) => {
                const selected = savedIds.includes(item._id);
                return (
                  <li key={item._id} role="option" aria-selected={selected}>
                    <button
                      type="button"
                      onClick={() => handleSelect(item._id, item.name)}
                      disabled={selected}
                      className="w-full px-3 py-2 text-left text-[13px] hover:bg-[var(--secondary-bg-solid)] disabled:opacity-50 disabled:hover:bg-transparent"
                    >
                      {item.name}
                      {item.year ? ` (${item.year})` : ""}
                      {selected ? " ✓" : ""}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function AddPageForm({
  onSubmit,
  onCancel,
}: Readonly<{
  onSubmit: (label: string, slug: string, seoTitle?: string, seoDescription?: string) => void;
  onCancel: () => void;
}>) {
  const [label, setLabel] = useState("");
  const [slug, setSlug] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const s = slug.trim() || label.toLowerCase().replace(/\s+/g, "-");
    const finalSlug = s.startsWith("/") ? s : `/${s}`;
    onSubmit(
      label.trim() || "Trang mới",
      finalSlug,
      seoTitle.trim() || undefined,
      seoDescription.trim() || undefined
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--foreground-muted)]">
            Tên trang
          </label>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="VD: Phim đề cử"
            className="w-full text-base py-2.5"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--foreground-muted)]">
            Slug (đường dẫn)
          </label>
          <div className="flex gap-2">
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="VD: /de-cu hoặc de-cu"
              className="flex-1 font-mono text-base py-2.5"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="shrink-0 px-3 py-2.5"
              onClick={() => {
                const gen = label.trim()
                  ? label
                      .trim()
                      .toLowerCase()
                      .normalize("NFD")
                      .replace(/\p{Diacritic}/gu, "")
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, "")
                  : "";
                setSlug(gen ? `/${gen}` : "");
              }}
              title="Tạo slug từ tên trang"
            >
              Gen
            </Button>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-[var(--border)] bg-[var(--secondary-bg-solid)]/50 p-4">
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
          SEO
        </h4>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--foreground-muted)]">
              Meta title
            </label>
            <Input
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Tiêu đề hiển thị trên tab & kết quả tìm kiếm"
              className="w-full text-base py-2.5"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--foreground-muted)]">
              Meta description
            </label>
            <textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Mô tả ngắn cho công cụ tìm kiếm"
              rows={4}
              className="w-full resize-y rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-base text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-1">
        <Button type="button" variant="secondary" size="sm" onClick={onCancel} className="px-4 py-2">
          Hủy
        </Button>
        <Button type="submit" variant="primary" size="sm" className="px-4 py-2">
          Thêm
        </Button>
      </div>
    </form>
  );
}

function EditPageForm({
  label: initialLabel,
  slug: initialSlug,
  seoTitle: initialSeoTitle,
  seoDescription: initialSeoDescription,
  onSave,
  onCancel,
}: Readonly<{
  label: string;
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  onSave: (label: string, slug: string, seoTitle?: string, seoDescription?: string) => void;
  onCancel: () => void;
}>) {
  const [label, setLabel] = useState(initialLabel);
  const [slug, setSlug] = useState(initialSlug.replace(/^\//, ""));
  const [seoTitle, setSeoTitle] = useState(initialSeoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(initialSeoDescription ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = slug.trim().startsWith("/") ? slug.trim() : `/${slug.trim() || "page"}`;
    onSave(
      label.trim() || "Trang",
      finalSlug,
      seoTitle.trim() || undefined,
      seoDescription.trim() || undefined
    );
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--foreground-muted)]">
            Tên trang
          </label>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Tên trang"
            className="w-full text-base py-2.5"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--foreground-muted)]">
            Slug (đường dẫn)
          </label>
          <div className="flex gap-2">
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="de-cu"
              className="flex-1 font-mono text-base py-2.5"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="shrink-0 px-3 py-2.5"
              onClick={() => {
                const gen = label.trim()
                  ? label
                      .trim()
                      .toLowerCase()
                      .normalize("NFD")
                      .replace(/\p{Diacritic}/gu, "")
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, "")
                  : "";
                setSlug(gen ? `/${gen}` : "");
              }}
              title="Tạo slug từ tên trang"
            >
              Gen
            </Button>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-[var(--border)] bg-[var(--secondary-bg-solid)]/50 p-4">
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
          SEO
        </h4>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--foreground-muted)]">
              Meta title
            </label>
            <Input
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Tiêu đề hiển thị trên tab & kết quả tìm kiếm"
              className="w-full text-base py-2.5"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--foreground-muted)]">
              Meta description
            </label>
            <textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Mô tả ngắn cho công cụ tìm kiếm"
              rows={4}
              className="w-full resize-y rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-base text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <Button type="submit" variant="primary" size="sm" className="px-4 py-2">
          Lưu
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={onCancel} className="px-4 py-2">
          Hủy
        </Button>
      </div>
    </form>
  );
}
