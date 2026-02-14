"use client";

import { useState, useCallback } from "react";
import { useAdminPageConfigs } from "../hooks";
import { useCategories, useCountries } from "@/hooks";
import { useSearchMovies } from "@/hooks/use-search-movies";
import type {
  AdminPageIdAny,
  AdminFilterSetting,
  AdminSection,
  AdminSectionType,
} from "../interfaces";
import type { SortField, SortType } from "@/types/movie-list";
import { SORT_FIELDS, SORT_TYPES } from "@/types/movie-list";
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

const YEARS = (() => {
  const y = new Date().getFullYear();
  return Array.from({ length: 12 }, (_, i) => y - i);
})();

export function PageConfigEditor() {
  const {
    configs,
    pageList,
    addCustomPage,
    updateCustomPage,
    removeCustomPage,
    addSection,
    updateSection,
    removeSection,
    moveSection,
    addSavedMovieToSection,
    removeSavedMovieFromSection,
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

  const handleAddSection = useCallback(() => {
    if (!selectedPageId) return;
    const id = addSection(selectedPageId, {
      title: "Section mới",
      type: "movie-list",
      filter: {},
      savedMovieIds: [],
    });
    setEditingSectionId(id);
  }, [selectedPageId, addSection]);

  const handleRemoveSection = useCallback(
    (sectionId: string) => {
      if (!selectedPageId || !confirm("Xóa section này?")) return;
      removeSection(selectedPageId, sectionId);
      if (editingSectionId === sectionId) setEditingSectionId(null);
    },
    [selectedPageId, removeSection, editingSectionId]
  );

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
            onClick={() => setAddPageFormOpen((o) => !o)}
          >
            Thêm trang
          </Button>
        </div>

        {addPageFormOpen && (
          <AddPageForm
            onSubmit={(label, slug) => {
              const id = addCustomPage({ label, slug }) as AdminPageIdAny;
              setAddPageFormOpen(false);
              setSelectedPageId(id);
              setEditingSectionId(null);
            }}
            onCancel={() => setAddPageFormOpen(false)}
          />
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Tên trang</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="w-24">Loại</TableHead>
              <TableHead className="w-[220px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageList.map((page, idx) => (
              <TableRow key={page.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell className="font-medium">{page.label}</TableCell>
                <TableCell className="font-mono text-[12px]">{page.slug}</TableCell>
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
                        onClick={() => {
                          if (confirm(`Xóa trang "${page.label}"?`)) {
                            removeCustomPage(page.id);
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
            ))}
          </TableBody>
        </Table>

        {editingPageId && (() => {
          const pg = pageList.find((p) => p.id === editingPageId);
          if (!pg || pg.isBuiltIn) return null;
          return (
            <EditPageForm
              label={pg.label}
              slug={pg.slug}
              onSave={(label, slug) => {
                updateCustomPage(editingPageId, { label, slug });
                setEditingPageId(null);
              }}
              onCancel={() => setEditingPageId(null)}
            />
          );
        })()}
      </section>

      {config && selectedPageMeta && (
        <>
          {/* Quản lý section khi đã chọn trang */}
          <section className="rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--secondary-bg-solid)]/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Đang quản lý: {selectedPageMeta.label}
                <span className="ml-2 font-mono text-[12px] font-normal text-[var(--foreground-muted)]">
                  {selectedPageMeta.slug}
                </span>
              </h3>
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
                          ? `Filter: ${sec.filter?.category || "—"} / ${sec.filter?.country || "—"} / limit ${sec.filter?.limit ?? 24}`
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
                          onClick={() => selectedPageId && moveSection(selectedPageId, sec.id, "up")}
                          disabled={idx === 0}
                          className="mr-2 text-[13px] text-[var(--foreground-muted)] underline hover:text-[var(--accent)] disabled:opacity-40"
                          title="Lên"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => selectedPageId && moveSection(selectedPageId, sec.id, "down")}
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

            {/* Form chỉnh sửa section (hiện khi chọn Sửa hoặc vừa Thêm) */}
            {editingSection && selectedPageId && (
              <SectionEditForm
                pageId={selectedPageId}
                section={editingSection}
                categories={categories}
                countries={countries}
                onUpdate={(patch) =>
                  updateSection(selectedPageId, editingSection.id, patch)
                }
                onAddMovie={(movieId) =>
                  addSavedMovieToSection(selectedPageId, editingSection.id, movieId)
                }
                onRemoveMovie={(movieId) =>
                  removeSavedMovieFromSection(
                    selectedPageId,
                    editingSection.id,
                    movieId
                  )
                }
                onClose={() => setEditingSectionId(null)}
              />
            )}
          </section>
        </>
      )}
    </div>
  );
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
  const updateFilter = useCallback(
    (patch: Partial<AdminFilterSetting>) => {
      const current = section.filter ?? {};
      onUpdate({ filter: { ...current, ...patch } });
    },
    [section.filter, onUpdate]
  );

  return (
    <div className="mt-6 rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--background)] p-4">
      <h4 className="mb-4 text-sm font-semibold text-[var(--foreground)]">
        Chỉnh sửa section: {section.title}
      </h4>

      <div className="space-y-4">
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

        {section.type === "movie-list" && (
          <>
            <FilterRow label="Thể loại">
              <select
                value={section.filter?.category ?? ""}
                onChange={(e) =>
                  updateFilter({ category: e.target.value || undefined })
                }
                className="rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                <option value="">Tất cả</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </FilterRow>
            <FilterRow label="Quốc gia">
              <select
                value={section.filter?.country ?? ""}
                onChange={(e) =>
                  updateFilter({ country: e.target.value || undefined })
                }
                className="rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                <option value="">Tất cả</option>
                {countries.map((c) => (
                  <option key={c._id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </FilterRow>
            <FilterRow label="Năm">
              <select
                value={section.filter?.year ?? ""}
                onChange={(e) =>
                  updateFilter({
                    year: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                <option value="">Tất cả</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </FilterRow>
            <FilterRow label="Sắp xếp">
              <select
                value={section.filter?.sortField ?? ""}
                onChange={(e) =>
                  updateFilter({
                    sortField: (e.target.value || undefined) as SortField | undefined,
                  })
                }
                className="rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
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
                className="ml-2 rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                <option value="">—</option>
                {SORT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {SORT_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </FilterRow>
            <FilterRow label="Limit">
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
                className="w-20 rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </FilterRow>
          </>
        )}

        <FilterRow label="Phim đã chọn">
          <AddMovieBlockForSection
            savedIds={section.savedMovieIds}
            onAdd={onAddMovie}
          />
        </FilterRow>

        {section.savedMovieIds.length > 0 && (
          <div className="ml-[140px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead className="w-16 text-right">Xóa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {section.savedMovieIds.map((id, i) => (
                  <TableRow key={id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-mono text-[12px]">{id}</TableCell>
                    <TableCell className="text-right">
                      <button
                        type="button"
                        onClick={() => onRemoveMovie(id)}
                        className="text-[13px] text-[var(--foreground-muted)] underline hover:text-red-600"
                      >
                        Xóa
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="secondary" size="sm" onClick={onClose}>
          Đóng
        </Button>
      </div>
    </div>
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
}: Readonly<{
  savedIds: string[];
  onAdd: (movieId: string) => void;
}>) {
  const [keyword, setKeyword] = useState("");
  const { data, isFetching } = useSearchMovies(
    { keyword: keyword.trim(), page: 1, limit: 10 },
    { enabled: keyword.trim().length >= 2 }
  );
  const items = data?.data?.items ?? [];

  const handleSelect = useCallback(
    (movieId: string) => {
      if (savedIds.includes(movieId)) return;
      onAdd(movieId);
      setKeyword("");
    },
    [savedIds, onAdd]
  );

  return (
    <div className="space-y-2">
      <Input
        type="search"
        placeholder="Tìm phim (2+ ký tự)..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="max-w-[280px]"
      />
      {keyword.trim().length >= 2 && (
        <div className="max-h-40 overflow-y-auto rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--background)] p-2">
          {isFetching && (
            <p className="py-2 text-center text-[13px] text-[var(--foreground-muted)]">
              Đang tải...
            </p>
          )}
          {!isFetching && items.length === 0 && (
            <p className="py-2 text-[13px] text-[var(--foreground-muted)]">
              Không tìm thấy.
            </p>
          )}
          {!isFetching && items.length > 0 && (
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item._id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(item._id)}
                    disabled={savedIds.includes(item._id)}
                    className="w-full rounded-[var(--radius-button)] px-2 py-1.5 text-left text-[13px] hover:bg-[var(--secondary-bg-solid)] disabled:opacity-50"
                  >
                    {item.name}
                    {item.year ? ` (${item.year})` : ""}
                    {savedIds.includes(item._id) ? " ✓" : ""}
                  </button>
                </li>
              ))}
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
  onSubmit: (label: string, slug: string) => void;
  onCancel: () => void;
}>) {
  const [label, setLabel] = useState("");
  const [slug, setSlug] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const s = slug.trim() || label.toLowerCase().replace(/\s+/g, "-");
    const finalSlug = s.startsWith("/") ? s : `/${s}`;
    onSubmit(label.trim() || "Trang mới", finalSlug);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 flex flex-wrap items-end gap-3 rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--background)] p-4"
    >
      <div>
        <label className="mb-1 block text-[12px] text-[var(--foreground-muted)]">
          Tên trang
        </label>
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="VD: Phim đề cử"
          className="min-w-[180px]"
        />
      </div>
      <div>
        <label className="mb-1 block text-[12px] text-[var(--foreground-muted)]">
          Slug (đường dẫn)
        </label>
        <Input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="VD: /de-cu hoặc de-cu"
          className="min-w-[180px] font-mono"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" variant="primary" size="sm">
          Thêm
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
          Hủy
        </Button>
      </div>
    </form>
  );
}

function EditPageForm({
  label: initialLabel,
  slug: initialSlug,
  onSave,
  onCancel,
}: Readonly<{
  label: string;
  slug: string;
  onSave: (label: string, slug: string) => void;
  onCancel: () => void;
}>) {
  const [label, setLabel] = useState(initialLabel);
  const [slug, setSlug] = useState(initialSlug.replace(/^\//, ""));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = slug.trim().startsWith("/") ? slug.trim() : `/${slug.trim() || "page"}`;
    onSave(label.trim() || "Trang", finalSlug);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 flex flex-wrap items-end gap-3 rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--background)] p-4"
    >
      <div>
        <label className="mb-1 block text-[12px] text-[var(--foreground-muted)]">
          Tên trang
        </label>
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Tên trang"
          className="min-w-[180px]"
        />
      </div>
      <div>
        <label className="mb-1 block text-[12px] text-[var(--foreground-muted)]">
          Slug
        </label>
        <Input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="de-cu"
          className="min-w-[180px] font-mono"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" variant="primary" size="sm">
          Lưu
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
          Hủy
        </Button>
      </div>
    </form>
  );
}
