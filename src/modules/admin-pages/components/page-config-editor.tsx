"use client";

import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { useAdminPageConfigs } from "../hooks";
import { usePhimApiCache } from "../providers/phim-api-cache-provider";
import { AdminPhimCacheToolbar } from "./admin-phim-cache-toolbar";
import { useCategories, useCountries } from "@/hooks";
import { keepPreviousData } from "@tanstack/react-query";
import { useSearchMovies } from "@/hooks/use-search-movies";
import { useMovieList } from "@/hooks/use-movie-list";
import { useMovieDetail } from "@/hooks/use-movie-detail";
import { SectionByDisplayType } from "@/components/ui/section-renderers";
import type { MovieListItem, MovieListType } from "@/types/movie-list";
import type { MovieDetail } from "@/types/movie-detail";
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
import { movieDetailToListItem } from "../utils/movie-detail-to-list-item";
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
import { SectionListCachePanel } from "./section-list-cache-panel";
import {
  SectionEditDisplayAndFilterPanel,
  MovieListFilterTwoRows,
  DISPLAY_TYPE_LABELS,
  HEADER_VARIANT_LABELS,
  DISPLAY_TYPES_WITH_HEADER,
} from "./section-edit-display-and-filter";

const SECTION_TYPE_LABELS: Record<AdminSectionType, string> = {
  "movie-list": "Danh sách (API)",
  pinned: "Phim ghim",
};

const EMPTY_TAXONOMY: { _id: string; name: string; slug: string }[] = [];
const EMPTY_SECTIONS: AdminSection[] = [];
/** Modal chọn phim ghim: limit cố định khi gọi API list/search (không còn ô Limit trên UI). */
const BROWSE_PINNED_LIST_LIMIT = 24;

export function PageConfigEditor() {
  const { staleTimeMs, gcTimeMs } = usePhimApiCache();
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
    reload,
  } = useAdminPageConfigs();
  const { data: categoriesData } = useCategories({
    staleTime: staleTimeMs,
    gcTime: gcTimeMs,
  });
  const categories = categoriesData ?? EMPTY_TAXONOMY;
  const { data: countriesData } = useCountries({
    staleTime: staleTimeMs,
    gcTime: gcTimeMs,
  });
  const countries = countriesData ?? EMPTY_TAXONOMY;

  const [selectedPageId, setSelectedPageId] = useState<AdminPageIdAny | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [addPageFormOpen, setAddPageFormOpen] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  /** Tăng sau mỗi lần lưu section thành công — SectionEditForm đồng bộ draft từ server. */
  const [sectionSaveRevision, setSectionSaveRevision] = useState(0);

  const config = selectedPageId ? configs[selectedPageId] : null;
  const sortedSections = useMemo(() => {
    const list = config?.sections ?? EMPTY_SECTIONS;
    return [...list].sort((a, b) => a.order - b.order);
  }, [config]);
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
      savedMovies: [],
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

  const handleSaveSectionDraft = useCallback(
    async (draft: AdminSection) => {
      if (!selectedPageId) return;
      const { id: sectionId, ...patch } = draft;
      await updateSection(selectedPageId, sectionId, patch);
      setSectionSaveRevision((r) => r + 1);
    },
    [selectedPageId, updateSection]
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
      <AdminPhimCacheToolbar />
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
                        {sec.savedMovies.length > 0
                          ? ` · ${sec.savedMovies.length} phim`
                          : ""}
                        {sec.type === "movie-list" &&
                        sec.cachedMovieList &&
                        sec.cachedMovieList.length > 0
                          ? ` · cache ${sec.cachedMovieList.length} phim`
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
                key={editingSection.id}
                section={editingSection}
                sectionSaveRevision={sectionSaveRevision}
                categories={categories}
                countries={countries}
                onSaveDraft={handleSaveSectionDraft}
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

function mergeSectionPatch(
  d: AdminSection,
  patch: Partial<Omit<AdminSection, "id">>
): AdminSection {
  const { filter: fPatch, ...rest } = patch;
  const next: AdminSection = { ...d, ...rest };
  if (fPatch !== undefined) {
    next.filter = { ...(d.filter ?? {}), ...fPatch };
  }
  return next;
}

function SectionEditForm({
  section,
  sectionSaveRevision,
  categories,
  countries,
  onSaveDraft,
  onClose,
}: Readonly<{
  section: AdminSection;
  sectionSaveRevision: number;
  categories: { _id: string; name: string; slug: string }[];
  countries: { _id: string; name: string; slug: string }[];
  onSaveDraft: (draft: AdminSection) => Promise<void>;
  onClose: () => void;
}>) {
  const [draft, setDraft] = useState<AdminSection>(() => section);
  const [showTestPreview, setShowTestPreview] = useState(false);
  const [pinnedPickerOpen, setPinnedPickerOpen] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const sectionRef = useRef(section);
  sectionRef.current = section;

  /** Chỉ đồng bộ draft sau khi Lưu (revision tăng). Không phụ thuộc `section` theo reference — mỗi lần persist/re-render parent tạo object mới và sẽ gây reset form / giật. */
  useEffect(() => {
    if (sectionSaveRevision === 0) return;
    setDraft(sectionRef.current);
  }, [sectionSaveRevision]);

  const patchDraft = useCallback((patch: Partial<Omit<AdminSection, "id">>) => {
    setDraft((d) => mergeSectionPatch(d, patch));
  }, []);

  const updateFilter = useCallback((fp: Partial<AdminFilterSetting>) => {
    setDraft((d) => ({
      ...d,
      filter: { ...(d.filter ?? {}), ...fp },
    }));
  }, []);

  const addPinnedMovie = useCallback((movie: MovieDetail) => {
    setDraft((d) => ({
      ...d,
      savedMovies: d.savedMovies.some((m) => m._id === movie._id)
        ? d.savedMovies
        : [...d.savedMovies, movie],
    }));
  }, []);

  const removePinnedMovie = useCallback((movieId: string) => {
    setDraft((d) => ({
      ...d,
      savedMovies: d.savedMovies.filter((m) => m._id !== movieId),
    }));
  }, []);

  const handleSave = useCallback(async () => {
    setSaveError(null);
    setIsSaving(true);
    try {
      await onSaveDraft(draft);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Lưu thất bại");
    } finally {
      setIsSaving(false);
    }
  }, [draft, onSaveDraft]);

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
              value={draft.title}
              onChange={(e) => patchDraft({ title: e.target.value })}
              placeholder="VD: Phim mới cập nhật"
              className="max-w-[280px]"
            />
          </FilterRow>
          <FilterRow label="Kiểu">
            <select
              value={draft.type}
              onChange={(e) =>
                patchDraft({ type: e.target.value as AdminSectionType })
              }
              className="rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              <option value="movie-list">Danh sách (API)</option>
              <option value="pinned">Phim ghim</option>
            </select>
          </FilterRow>
        </section>

        <SectionEditDisplayAndFilterPanel
          displayType={draft.displayType}
          headerVariant={draft.headerVariant}
          onPatchDisplay={(patch) => patchDraft(patch)}
          filter={draft.filter ?? {}}
          onUpdateFilter={updateFilter}
          categories={categories}
          countries={countries}
          showMovieListFilters={draft.type === "movie-list"}
        />

        {draft.type === "movie-list" && (
          <SectionListCachePanel section={draft} onUpdate={patchDraft} />
        )}

        {/* 4. Phim ghim — nút mở modal bảng + lọc */}
        {draft.type === "pinned" && (
          <section className="rounded-lg border border-[var(--border)] bg-[var(--secondary-bg-solid)]/30 p-4">
            <button
              type="button"
              onClick={() => setPinnedPickerOpen(true)}
              className="w-full rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-left transition-colors hover:border-[var(--accent)] hover:bg-[var(--secondary-bg-solid)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                Phim đã chọn
              </span>
              <p className="mt-1 text-[14px] font-medium text-[var(--foreground)]">
                {draft.savedMovies.length === 0
                  ? "Chưa có phim — bấm để mở bảng chọn"
                  : `${draft.savedMovies.length} phim đã ghim — bấm để sửa hoặc thêm`}
              </p>
            </button>

            <Modal
              open={pinnedPickerOpen}
              onClose={() => setPinnedPickerOpen(false)}
              title="Chọn phim ghim — bảng và lọc"
              panelClassName="!max-w-3xl !max-h-[min(88vh,720px)] !flex !flex-col"
              zIndex={70}
            >
              <div className="space-y-4">
                <AddMovieBlockForSection
                  browseEnabled={pinnedPickerOpen}
                  savedMovies={draft.savedMovies}
                  sectionTitle={draft.title}
                  sectionDisplayType={draft.displayType}
                  sectionHeaderVariant={draft.headerVariant}
                  categories={categories}
                  countries={countries}
                  onAdd={addPinnedMovie}
                  onRemove={removePinnedMovie}
                  onPatchSectionDisplay={(patch) => patchDraft(patch)}
                />
                <div className="flex justify-end border-t border-[var(--border)] pt-4">
                  <Button variant="secondary" size="sm" type="button" onClick={() => setPinnedPickerOpen(false)}>
                    Đóng
                  </Button>
                </div>
              </div>
            </Modal>
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
          onClick={() => window.open(buildSectionTestUrl(draft), "_blank", "noopener,noreferrer")}
        >
          Mở trang (tab mới)
        </Button>
        <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
          {saveError && (
            <span className="max-w-[220px] text-[12px] text-red-600">{saveError}</span>
          )}
          <Button
            variant="primary"
            size="sm"
            type="button"
            disabled={isSaving}
            onClick={() => void handleSave()}
          >
            {isSaving ? "Đang lưu…" : "Lưu"}
          </Button>
          <Button variant="secondary" size="sm" type="button" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>

      {/* Preview theo Loại hiển thị — hiện bên dưới khi bấm Xem thử */}
      {showTestPreview && (
        <div className="mt-4 border-t border-[var(--border)] pt-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
            Preview
          </h4>
          <SectionPreview section={draft} />
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

function PinnedMoviePreviewModal({
  open,
  onClose,
  candidate,
  sectionTitle,
  sectionDisplayType,
  sectionHeaderVariant,
  alreadySaved,
  onConfirm,
}: Readonly<{
  open: boolean;
  onClose: () => void;
  candidate: { _id: string; slug: string; name: string; provisionalItem: MovieListItem } | null;
  sectionTitle: string;
  sectionDisplayType?: SectionDisplayType;
  sectionHeaderVariant?: SectionHeaderVariant;
  alreadySaved: boolean;
  onConfirm: (
    detail: MovieDetail,
    displayPatch?: { displayType?: SectionDisplayType; headerVariant?: SectionHeaderVariant }
  ) => void;
}>) {
  const { staleTimeMs, gcTimeMs } = usePhimApiCache();
  const slug = candidate?.slug ?? "";
  const missingSlug = Boolean(open && candidate && slug.length === 0);
  const { data, isLoading, isError, refetch, isFetching } = useMovieDetail(slug, {
    enabled: open && slug.length > 0,
    staleTime: staleTimeMs,
    gcTime: gcTimeMs,
  });

  const detailItem = data?.data?.item;
  const resolved = Boolean(detailItem);
  const loadingDetail = open && slug.length > 0 && (isLoading || isFetching) && !detailItem;

  const defaultDisplay = sectionDisplayType ?? "banner";
  const defaultHeader = sectionHeaderVariant ?? "see-more";

  const [previewDisplay, setPreviewDisplay] = useState<SectionDisplayType>(defaultDisplay);
  const [previewHeader, setPreviewHeader] = useState<SectionHeaderVariant>(defaultHeader);

  const previewItems: MovieListItem[] = useMemo(() => {
    if (!candidate) return [];
    if (detailItem) return [movieDetailToListItem(detailItem)];
    return [candidate.provisionalItem];
  }, [candidate, detailItem]);

  const showHeaderVariant =
    previewDisplay && DISPLAY_TYPES_WITH_HEADER.includes(previewDisplay);

  const handleConfirm = () => {
    if (!candidate || !detailItem) return;
    const displayPatch =
      previewDisplay !== defaultDisplay || previewHeader !== defaultHeader
        ? { displayType: previewDisplay, headerVariant: previewHeader }
        : undefined;
    onConfirm(detailItem, displayPatch);
    onClose();
  };

  return (
    <Modal
      open={open && candidate !== null}
      onClose={onClose}
      title={alreadySaved ? "Phim đã ghim — xem trước" : "Xem trước & ghim phim"}
      panelClassName="!max-w-4xl !w-full !max-h-[min(92vh,880px)] !flex !flex-col"
      zIndex={80}
    >
      {candidate ? (
        <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch">
          <div className="mx-auto w-full max-w-[400px] shrink-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-inner">
            <p className="bg-[var(--secondary-bg-solid)] px-2 py-2 text-center text-[11px] font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Khung mobile (theo loại hiển thị)
            </p>
            <div className="max-h-[min(58vh,520px)] overflow-x-hidden overflow-y-auto">
              {missingSlug && (
                <p className="px-4 py-8 text-center text-[13px] text-[var(--foreground-muted)]">
                  Chưa có slug phim trong phiên làm việc — không gọi được API chi tiết. Hãy tìm phim theo tên và
                  chọn lại, hoặc xóa chip rồi ghim lại để lưu slug.
                </p>
              )}
              {!missingSlug && isError && (
                <div className="space-y-3 p-4 text-center">
                  <p className="text-[13px] text-red-600">Không tải được chi tiết phim (API /phim).</p>
                  <Button variant="secondary" size="sm" type="button" onClick={() => refetch()}>
                    Thử lại
                  </Button>
                </div>
              )}
              {!missingSlug && !isError && loadingDetail && (
                <p className="px-4 py-10 text-center text-[13px] text-[var(--foreground-muted)]">
                  Đang gọi API chi tiết phim…
                </p>
              )}
              {!missingSlug && !isError && !loadingDetail && previewItems.length > 0 && (
                <div className="p-1">
                  <SectionByDisplayType
                    title={sectionTitle}
                    items={previewItems}
                    displayType={previewDisplay}
                    basePath="/phim"
                    headerVariant={showHeaderVariant ? previewHeader : "see-more"}
                    seeMoreHref="/phim"
                    seeMoreLabel="Xem thêm"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            <div>
              <p className="text-[12px] text-[var(--foreground-muted)]">Phim chọn</p>
              <p className="text-[15px] font-semibold text-[var(--foreground)]">{candidate.name}</p>
              {resolved && detailItem && (
                <p className="mt-1 text-[12px] text-[var(--foreground-muted)]">
                  {detailItem.origin_name ? `${detailItem.origin_name} · ` : ""}
                  {detailItem.year ? `Năm ${detailItem.year}` : ""}
                </p>
              )}
            </div>

            <div className="space-y-3 rounded-lg border border-[var(--border)] bg-[var(--secondary-bg-solid)]/30 p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                Loại hiển thị (section)
              </h4>
              <FilterRow label="Dạng mobile">
                <select
                  value={previewDisplay}
                  onChange={(e) =>
                    setPreviewDisplay(e.target.value as SectionDisplayType)
                  }
                  className="min-w-[200px] rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                >
                  {SECTION_DISPLAY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {DISPLAY_TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </FilterRow>
              {showHeaderVariant && (
                <FilterRow label="Header">
                  <select
                    value={previewHeader}
                    onChange={(e) =>
                      setPreviewHeader(e.target.value as SectionHeaderVariant)
                    }
                    className="min-w-[200px] rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  >
                    {SECTION_HEADER_VARIANTS.map((v) => (
                      <option key={v} value={v}>
                        {HEADER_VARIANT_LABELS[v]}
                      </option>
                    ))}
                  </select>
                </FilterRow>
              )}
              <p className="text-[12px] text-[var(--foreground-muted)]">
                {alreadySaved
                  ? "Bấm \"Xong\" để ghi loại hiển thị / header vào bản nháp. Bấm Lưu ở form section để lưu cấu hình."
                  : "Bấm \"Ghim phim\" để thêm phim và cập nhật loại hiển thị / header trên bản nháp. Bấm Lưu ở form section để lưu cấu hình."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <Button variant="secondary" size="sm" type="button" onClick={onClose}>
                Hủy
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="button"
                disabled={!resolved}
                onClick={handleConfirm}
              >
                {alreadySaved ? "Xong" : "Ghim phim"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}

const PHIMIMG_CDN_BASE = "https://phimimg.com";

/** API list/search trả poster/thumb thường là path (upload/...), cần ghép CDN giống MovieCoverCard / header-search. */
function movieListItemImageSrc(posterUrl: string, thumbUrl: string): string {
  const raw = (posterUrl || thumbUrl).trim();
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return `${PHIMIMG_CDN_BASE}/${raw.replace(/^\//, "")}`;
}

function PinnedMovieTableThumb({ item }: Readonly<{ item: MovieListItem }>) {
  const [broken, setBroken] = useState(false);
  const url = movieListItemImageSrc(item.poster_url, item.thumb_url);
  if (!url || broken) {
    return (
      <div
        className="h-12 w-10 shrink-0 rounded bg-[var(--secondary-bg-solid)]"
        aria-hidden
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- admin thumb từ CDN, không cần Image tối ưu
    <img
      src={url}
      alt=""
      className="h-12 w-10 shrink-0 rounded object-cover bg-[var(--secondary-bg-solid)]"
      loading="lazy"
      onError={() => setBroken(true)}
    />
  );
}

function AddMovieBlockForSection({
  browseEnabled,
  savedMovies,
  sectionTitle,
  sectionDisplayType,
  sectionHeaderVariant,
  categories,
  countries,
  onAdd,
  onRemove,
  onPatchSectionDisplay,
}: Readonly<{
  browseEnabled: boolean;
  savedMovies: MovieDetail[];
  sectionTitle: string;
  sectionDisplayType?: SectionDisplayType;
  sectionHeaderVariant?: SectionHeaderVariant;
  categories: { _id: string; name: string; slug: string }[];
  countries: { _id: string; name: string; slug: string }[];
  onAdd: (movie: MovieDetail) => void;
  onRemove: (movieId: string) => void;
  onPatchSectionDisplay: (patch: {
    displayType?: SectionDisplayType;
    headerVariant?: SectionHeaderVariant;
  }) => void;
}>) {
  const [keyword, setKeyword] = useState("");
  const [browseTypeList, setBrowseTypeList] = useState<MovieListType>("phim-le");
  const [browseCategory, setBrowseCategory] = useState("");
  const [browseCountry, setBrowseCountry] = useState("");
  const [browseYear, setBrowseYear] = useState<number | "">("");
  const [pickCandidate, setPickCandidate] = useState<{
    _id: string;
    slug: string;
    name: string;
    provisionalItem: MovieListItem;
  } | null>(null);
  const { staleTimeMs, gcTimeMs } = usePhimApiCache();

  const savedIds = useMemo(() => savedMovies.map((m) => m._id), [savedMovies]);

  const hasSearchKeyword = keyword.trim().length >= 2;

  const browseFilterSnapshot = useMemo(
    () => ({
      typeList: browseTypeList,
      category: browseCategory || undefined,
      country: browseCountry || undefined,
      year: browseYear === "" ? undefined : browseYear,
    }),
    [browseTypeList, browseCategory, browseCountry, browseYear]
  );

  const applyBrowseFilterPatch = useCallback((p: Partial<AdminFilterSetting>) => {
    if (p.typeList !== undefined) {
      setBrowseTypeList((p.typeList as MovieListType) ?? "phim-le");
    }
    if (p.category !== undefined) setBrowseCategory(p.category ?? "");
    if (p.country !== undefined) setBrowseCountry(p.country ?? "");
    if (p.year !== undefined) setBrowseYear(p.year === undefined ? "" : p.year);
  }, []);

  const movieListParams = useMemo(
    () => ({
      typeList: browseTypeList,
      page: 1,
      limit: BROWSE_PINNED_LIST_LIMIT,
      ...(browseCategory ? { category: browseCategory } : {}),
      ...(browseCountry ? { country: browseCountry } : {}),
      ...(browseYear !== "" && browseYear != null ? { year: Number(browseYear) } : {}),
    }),
    [browseTypeList, browseCategory, browseCountry, browseYear]
  );

  const searchQueryParams = useMemo(
    () => ({
      keyword: keyword.trim(),
      page: 1,
      limit: BROWSE_PINNED_LIST_LIMIT,
      ...(browseCategory ? { category: browseCategory } : {}),
      ...(browseCountry ? { country: browseCountry } : {}),
      ...(browseYear !== "" && browseYear != null ? { year: Number(browseYear) } : {}),
    }),
    [keyword, browseCategory, browseCountry, browseYear]
  );

  const { data: searchData, isFetching: isSearching } = useSearchMovies(searchQueryParams, {
    enabled: browseEnabled && hasSearchKeyword,
    staleTime: staleTimeMs,
    gcTime: gcTimeMs,
    placeholderData: keepPreviousData,
  });
  const rawSearch = searchData?.data?.items;
  const searchItems: MovieListItem[] = Array.isArray(rawSearch) ? rawSearch : [];

  const { data: movieListData, isFetching: isMovieListLoading } = useMovieList(movieListParams, {
    enabled: browseEnabled && !hasSearchKeyword,
    staleTime: staleTimeMs,
    gcTime: gcTimeMs,
    placeholderData: keepPreviousData,
  });
  const browseListItems: MovieListItem[] =
    movieListData?.status && Array.isArray(movieListData.data?.items) ? movieListData.data.items : [];

  const listRows: MovieListItem[] = hasSearchKeyword ? searchItems : browseListItems;
  const isFetching = hasSearchKeyword ? isSearching : isMovieListLoading;
  const showTableSkeletonLoading = isFetching && listRows.length === 0;

  const openPickModal = useCallback(
    (listItem: MovieListItem) => {
      if (savedIds.includes(listItem._id)) return;
      setPickCandidate({
        _id: listItem._id,
        slug: listItem.slug,
        name: listItem.name,
        provisionalItem: listItem,
      });
    },
    [savedIds]
  );

  const openSavedMovieModal = useCallback(
    (id: string) => {
      const m = savedMovies.find((x) => x._id === id);
      if (!m) return;
      setPickCandidate({
        _id: m._id,
        slug: m.slug,
        name: m.name,
        provisionalItem: movieDetailToListItem(m),
      });
    },
    [savedMovies]
  );

  const handleConfirmPin = useCallback(
    (
      detail: MovieDetail,
      displayPatch?: { displayType?: SectionDisplayType; headerVariant?: SectionHeaderVariant }
    ) => {
      if (displayPatch) {
        onPatchSectionDisplay(displayPatch);
      }
      if (!savedIds.includes(detail._id)) {
        onAdd(detail);
      }
    },
    [savedIds, onAdd, onPatchSectionDisplay]
  );

  return (
    <>
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
            Đã ghim
          </p>
          <div className="flex min-h-[44px] flex-wrap gap-1.5 rounded-[var(--radius-button)] border border-dashed border-[var(--border)] bg-[var(--background)]/50 px-3 py-2">
            {savedMovies.length === 0 ? (
              <span className="self-center text-[13px] text-[var(--foreground-muted)]">Chưa chọn phim</span>
            ) : (
              savedMovies.map((m) => (
                <span
                  key={m._id}
                  className="inline-flex max-w-full items-center gap-0.5 rounded-md bg-[var(--secondary-bg-solid)] px-2 py-0.5 text-[13px] text-[var(--foreground)]"
                >
                  <button
                    type="button"
                    className="min-w-0 max-w-[200px] truncate text-left hover:underline"
                    onClick={() => openSavedMovieModal(m._id)}
                  >
                    {m.name}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onRemove(m._id);
                    }}
                    className="ml-0.5 shrink-0 rounded p-0.5 hover:bg-[var(--border)] hover:text-red-600"
                    aria-label="Xóa"
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--secondary-bg-solid)]/30 p-4">
          <MovieListFilterTwoRows
            heading="Bộ lọc (danh sách và tìm kiếm)"
            filter={browseFilterSnapshot}
            onUpdateFilter={applyBrowseFilterPatch}
            categories={categories}
            countries={countries}
            allowEmptyTypeList={false}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
            Tìm theo tên
          </label>
          <Input
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Từ 2 ký tự trở lên: tìm /tim-kiem (cùng bộ lọc). Để trống: danh sách /danh-sach theo Loại phim + lọc."
            className="w-full max-w-none"
          />
        </div>

        <div className="max-h-[min(50vh,380px)] overflow-auto rounded-[var(--radius-panel)] border border-[var(--border)]">
          {isFetching && listRows.length > 0 && (
            <p className="border-b border-[var(--border)] bg-[var(--secondary-bg-solid)]/40 px-3 py-1.5 text-center text-[12px] text-[var(--foreground-muted)]">
              Đang tải danh sách mới…
            </p>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-14">Ảnh</TableHead>
                <TableHead>Tên phim</TableHead>
                <TableHead className="w-20">Năm</TableHead>
                <TableHead className="w-[120px] text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {showTableSkeletonLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-[13px] text-[var(--foreground-muted)]">
                    Đang tải…
                  </TableCell>
                </TableRow>
              )}
              {!showTableSkeletonLoading && listRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-[13px] text-[var(--foreground-muted)]">
                    {hasSearchKeyword ? "Không tìm thấy phim." : "Chưa có dữ liệu."}
                  </TableCell>
                </TableRow>
              )}
              {listRows.length > 0 &&
                listRows.map((item) => {
                  const selected = savedIds.includes(item._id);
                  return (
                    <TableRow key={item._id}>
                      <TableCell className="w-14 p-2 align-middle">
                        <PinnedMovieTableThumb item={item} />
                      </TableCell>
                      <TableCell className="max-w-[220px] truncate font-medium text-[var(--foreground)]">
                        {item.name}
                      </TableCell>
                      <TableCell className="text-[13px] text-[var(--foreground-muted)]">
                        {item.year ?? "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {selected ? (
                          <span className="text-[12px] text-[var(--foreground-muted)]">Đã ghim</span>
                        ) : (
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => openPickModal(item)}
                          >
                            Chọn
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </div>

      <PinnedMoviePreviewModal
        key={pickCandidate?._id ?? "pinned-pick-idle"}
        open={pickCandidate !== null}
        onClose={() => setPickCandidate(null)}
        candidate={pickCandidate}
        sectionTitle={sectionTitle}
        sectionDisplayType={sectionDisplayType}
        sectionHeaderVariant={sectionHeaderVariant}
        alreadySaved={pickCandidate ? savedIds.includes(pickCandidate._id) : false}
        onConfirm={handleConfirmPin}
      />
    </>
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
