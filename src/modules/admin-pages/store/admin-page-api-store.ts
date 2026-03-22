/**
 * Admin page store — logic thuần (pure functions) cho API persistence.
 * Không dùng localStorage; hook sẽ fetch/save qua API.
 */

import type {
  AdminPageConfig,
  AdminPageId,
  AdminPageIdAny,
  AdminFilterSetting,
  AdminSection,
  AdminCustomPageMeta,
  AdminPageListItem,
} from "../interfaces";
import type { MovieDetail } from "@/types/movie-detail";
import {
  ADMIN_PAGE_IDS,
  ADMIN_PAGE_LABELS,
  ADMIN_PAGE_SLUGS,
  DEFAULT_PAGE_IDS,
  DEFAULT_PAGE_LABELS,
} from "../interfaces";

type OtherPageId = "phim-le" | "phim-bo" | "phim-chieu-rap" | "hoat-hinh";

/** Pages that use category filter instead of typeList (no forced typeList). */
const CATEGORY_BASED_PAGES = new Set<string>(["home", "phim-ngan"]);

function isCustomPageId(id: string): id is `custom-${string}` {
  return id.startsWith("custom-");
}

/** Chuẩn hóa mảng phim lưu trong JSON; bỏ phần tử không phải object có `_id`. */
function parseSavedMoviesJson(raw: unknown): MovieDetail[] {
  if (!Array.isArray(raw)) return [];
  const out: MovieDetail[] = [];
  for (const x of raw) {
    if (x && typeof x === "object" && typeof (x as MovieDetail)._id === "string") {
      out.push(x as MovieDetail);
    }
  }
  return out;
}

/** Merge một section từ API/JSON: hỗ trợ legacy `savedMovieIds` (chỉ id — bỏ qua, cần ghim lại trong admin). */
function normalizeSectionFromMerge(raw: unknown): AdminSection | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as Record<string, unknown>;
  if (typeof s.id !== "string" || typeof s.order !== "number") return null;
  const savedMovies = parseSavedMoviesJson(s.savedMovies);
  const type = s.type === "pinned" ? "pinned" : "movie-list";
  const title = typeof s.title === "string" ? s.title : "";
  const filter =
    s.filter && typeof s.filter === "object" && s.filter !== null
      ? { ...(s.filter as AdminFilterSetting) }
      : {};
  return {
    id: s.id,
    order: s.order,
    title,
    type,
    filter,
    savedMovies,
    displayType: s.displayType as AdminSection["displayType"],
    headerVariant: s.headerVariant as AdminSection["headerVariant"],
    cachedMovieList: Array.isArray(s.cachedMovieList) ? (s.cachedMovieList as AdminSection["cachedMovieList"]) : undefined,
    cachedMovieListSavedAt:
      typeof s.cachedMovieListSavedAt === "string" ? s.cachedMovieListSavedAt : undefined,
  };
}

function defaultConfig(
  pageId: AdminPageIdAny,
  customMeta?: AdminCustomPageMeta | null
): AdminPageConfig {
  if (isCustomPageId(pageId) && customMeta) {
    return {
      pageId,
      label: customMeta.label,
      slug: customMeta.slug,
      filter: { page: 1, limit: 24 },
      savedMovies: [],
      sections: [],
    };
  }
  const label = ADMIN_PAGE_LABELS[pageId as AdminPageId];
  const filter: AdminFilterSetting = CATEGORY_BASED_PAGES.has(pageId)
    ? pageId === "phim-ngan"
      ? { category: "phim-ngan", page: 1, limit: 24 }
      : { page: 1, limit: 24 }
    : { typeList: pageId as AdminFilterSetting["typeList"], page: 1, limit: 24 };
  return {
    pageId,
    label,
    filter,
    savedMovies: [],
    sections: [],
  };
}

function mergeConfig(
  def: AdminPageConfig,
  parsed: AdminPageConfig | undefined,
  pageId: string
): AdminPageConfig {
  if (!parsed || typeof parsed !== "object") return def;
  const p = parsed as unknown as Record<string, unknown>;
  const sectionsRaw = p.sections;
  const sections = Array.isArray(sectionsRaw)
    ? sectionsRaw.map(normalizeSectionFromMerge).filter((s): s is AdminSection => s !== null)
    : [];
  const pageSaved = parseSavedMoviesJson(p.savedMovies);
  const merged: AdminPageConfig = {
    ...def,
    ...parsed,
    pageId: pageId as AdminPageConfig["pageId"],
    label: parsed.label ?? def.label,
    filter: { ...def.filter, ...parsed.filter },
    savedMovies: pageSaved,
    sections,
  };
  delete (merged as unknown as Record<string, unknown>).savedMovieIds;
  if (!isCustomPageId(pageId) && !CATEGORY_BASED_PAGES.has(pageId)) {
    (merged.filter as AdminFilterSetting).typeList = pageId as AdminFilterSetting["typeList"];
  }
  return merged;
}

function nextSectionId(): string {
  return typeof globalThis.crypto !== "undefined" && globalThis.crypto.randomUUID
    ? globalThis.crypto.randomUUID()
    : `section-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getDefaultHomeSections(): AdminSection[] {
  return [
    { id: nextSectionId(), order: 0, title: "Banner trang chủ", type: "movie-list", filter: { page: 1, limit: 8 }, savedMovies: [], displayType: "banner" },
    { id: nextSectionId(), order: 1, title: "Đây Rồi Top Phim Xem Nhiều Nhất", type: "movie-list", filter: { typeList: "phim-le", page: 1, limit: 24, sortField: "modified.time", sortType: "desc" }, savedMovies: [], displayType: "poster-list" },
    { id: nextSectionId(), order: 2, title: "Phim Điện Ảnh Mới Cóng", type: "movie-list", filter: { typeList: "phim-le", page: 1, limit: 24, country: "viet-nam", sortField: "modified.time", sortType: "desc" }, savedMovies: [], displayType: "poster-list" },
    { id: nextSectionId(), order: 3, title: "Mãn Nhãn với Phim Chiếu Rạp", type: "movie-list", filter: { typeList: "phim-chieu-rap", page: 1, limit: 24, sortField: "modified.time", sortType: "desc" }, savedMovies: [], displayType: "thumb-list" },
    { id: nextSectionId(), order: 4, title: "Top 10 phim lẻ hôm nay", type: "movie-list", filter: { typeList: "phim-le", page: 1, limit: 10, sortField: "modified.time", sortType: "desc" }, savedMovies: [], displayType: "top-list" },
    { id: nextSectionId(), order: 5, title: "Kho tàng anime", type: "movie-list", filter: { typeList: "hoat-hinh", page: 1, limit: 24, sortField: "modified.time", sortType: "desc" }, savedMovies: [], displayType: "poster-list" },
    { id: nextSectionId(), order: 6, title: "Phim Hành động việt", type: "movie-list", filter: { typeList: "phim-le", page: 1, limit: 24, country: "viet-nam", category: "hanh-dong", sortField: "modified.time", sortType: "desc" }, savedMovies: [], displayType: "poster-list" },
    { id: nextSectionId(), order: 7, title: "Thế giới quyến rũ", type: "movie-list", filter: { typeList: "phim-le", page: 1, limit: 24, category: "phim-18", sortField: "modified.time", sortType: "desc" }, savedMovies: [], displayType: "thumb-list" },
  ];
}

const OTHER_PAGE_SECTION_LABELS: Record<OtherPageId, { banner: string; thumb: string; grid: string }> = {
  "phim-le": { banner: "Phim lẻ mới nhất", thumb: "Lẻ xem nhiều nhất", grid: "Kho phim lẻ" },
  "phim-bo": { banner: "Phim bộ mới nhất", thumb: "Bộ xem nhiều nhất", grid: "Kho phim bộ" },
  "phim-chieu-rap": { banner: "Phim chiếu rạp mới nhất", thumb: "Chiếu rạp xem nhiều nhất", grid: "Kho phim chiếu rạp" },
  "hoat-hinh": { banner: "Anime mới nhất", thumb: "Anime xem nhiều nhất", grid: "Kho anime" },
};

function getDefaultPhimNganSections(): AdminSection[] {
  const cat = "phim-ngan";
  return [
    { id: nextSectionId(), order: 0, title: "Phim ngắn mới nhất", type: "movie-list", filter: { typeList: "phim-bo", page: 1, limit: 8, category: cat, sortField: "modified.time", sortType: "desc" }, savedMovies: [], displayType: "banner" },
    { id: nextSectionId(), order: 1, title: "Phim ngắn xem nhiều", type: "movie-list", filter: { typeList: "phim-bo", page: 1, limit: 16, category: cat, sortField: "modified.time", sortType: "desc" }, savedMovies: [], displayType: "thumb-list" },
    { id: nextSectionId(), order: 2, title: "Kho phim ngắn", type: "movie-list", filter: { typeList: "phim-bo", page: 1, limit: 24, category: cat, sortField: "modified.time", sortType: "desc" }, savedMovies: [], displayType: "grid-list" },
  ];
}

function getDefaultOtherPageSections(pageId: OtherPageId): AdminSection[] {
  const labels = OTHER_PAGE_SECTION_LABELS[pageId];
  const typeList = pageId;
  const baseFilter = { typeList, page: 1, limit: 24, sortField: "modified.time" as const, sortType: "desc" as const };
  return [
    { id: nextSectionId(), order: 0, title: labels.banner, type: "movie-list", filter: { typeList, page: 1, limit: 8, sortField: "modified.time", sortType: "desc" }, savedMovies: [], displayType: "banner" },
    { id: nextSectionId(), order: 1, title: labels.thumb, type: "movie-list", filter: { ...baseFilter, limit: 16 }, savedMovies: [], displayType: "thumb-list" },
    { id: nextSectionId(), order: 2, title: labels.grid, type: "movie-list", filter: baseFilter, savedMovies: [], displayType: "grid-list" },
  ];
}

function isEmptyPayload(pageConfigs: Record<string, unknown>, customPages: AdminCustomPageMeta[]): boolean {
  return Object.keys(pageConfigs).length === 0 && customPages.length === 0;
}

export interface ApiPayload {
  pageConfigs: Record<string, AdminPageConfig>;
  customPages: AdminCustomPageMeta[];
}

/** Merge payload từ API thành configs đầy đủ. Nếu rỗng thì seed mặc định. */
export function mergeFromApiPayload(pageConfigs: Record<string, AdminPageConfig>, customPages: AdminCustomPageMeta[]): Record<string, AdminPageConfig> {
  if (isEmptyPayload(pageConfigs, customPages)) {
    const result: Record<string, AdminPageConfig> = {};
    for (const id of ADMIN_PAGE_IDS) result[id] = defaultConfig(id);
    for (const p of customPages) result[p.id] = defaultConfig(p.id as AdminPageIdAny, p);
    result["home"] = { ...result["home"]!, sections: getDefaultHomeSections() };
    result["phim-ngan"] = { ...result["phim-ngan"]!, sections: getDefaultPhimNganSections() };
    const otherIds: OtherPageId[] = ["phim-le", "phim-bo", "phim-chieu-rap", "hoat-hinh"];
    for (const pageId of otherIds) {
      result[pageId] = { ...result[pageId]!, sections: getDefaultOtherPageSections(pageId) };
    }
    return result;
  }
  const result: Record<string, AdminPageConfig> = {};
  for (const id of ADMIN_PAGE_IDS) {
    const def = defaultConfig(id);
    const p = pageConfigs[id];
    result[id] = mergeConfig(def, p, id);
  }
  for (const cp of customPages) {
    const def = defaultConfig(cp.id as AdminPageIdAny, cp);
    const p = pageConfigs[cp.id];
    result[cp.id] = mergeConfig(def, p, cp.id);
  }
  return result;
}

/** Chuyển configs thành payload gửi API. */
export function toApiPayload(configs: Record<string, AdminPageConfig>): ApiPayload {
  const customPageIds = Object.keys(configs).filter((id) => isCustomPageId(id));
  const customPages: AdminCustomPageMeta[] = customPageIds.map((id) => {
    const c = configs[id]!;
    return { id, slug: c.slug ?? `/${id}`, label: c.label };
  });
  return { pageConfigs: configs, customPages };
}

export function getPageListFromCustomPages(customPages: AdminCustomPageMeta[]): AdminPageListItem[] {
  const builtIn: AdminPageListItem[] = DEFAULT_PAGE_IDS.map((id) => ({
    id,
    label: DEFAULT_PAGE_LABELS[id],
    slug: ADMIN_PAGE_SLUGS[id],
    isBuiltIn: true,
  }));
  const custom: AdminPageListItem[] = customPages.map((p) => ({
    id: p.id as AdminPageIdAny,
    label: p.label,
    slug: p.slug.startsWith("/") ? p.slug : `/${p.slug}`,
    isBuiltIn: false,
  }));
  return [...builtIn, ...custom];
}

function nextCustomId(): string {
  return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function applyAddCustomPage(
  configs: Record<string, AdminPageConfig>,
  customPages: AdminCustomPageMeta[],
  params: { slug: string; label: string; seoTitle?: string; seoDescription?: string }
): { configs: Record<string, AdminPageConfig>; customPages: AdminCustomPageMeta[]; newId: string } {
  const slug = params.slug.startsWith("/") ? params.slug : `/${params.slug}`;
  const id = nextCustomId();
  const meta: AdminCustomPageMeta = { id, slug, label: params.label };
  const pages = [...customPages, meta];
  const base = defaultConfig(id as AdminPageIdAny, meta);
  const nextConfigs = { ...configs, [id]: { ...base, seoTitle: params.seoTitle?.trim() || undefined, seoDescription: params.seoDescription?.trim() || undefined } };
  return { configs: nextConfigs, customPages: pages, newId: id };
}

export function applyUpdateCustomPage(
  configs: Record<string, AdminPageConfig>,
  customPages: AdminCustomPageMeta[],
  id: string,
  patch: { slug?: string; label?: string; seoTitle?: string; seoDescription?: string }
): { configs: Record<string, AdminPageConfig>; customPages: AdminCustomPageMeta[] } {
  if (!isCustomPageId(id)) return { configs, customPages };
  const pages = customPages.map((p) =>
    p.id === id ? { ...p, slug: patch.slug != null ? (patch.slug.startsWith("/") ? patch.slug : `/${patch.slug}`) : p.slug, label: patch.label ?? p.label } : p
  );
  const cfg = configs[id];
  if (!cfg) return { configs, customPages };
  const meta = pages.find((x) => x.id === id);
  const next = { ...cfg, label: meta?.label ?? cfg.label, slug: meta?.slug ?? cfg.slug };
  if (patch.seoTitle !== undefined) next.seoTitle = patch.seoTitle.trim() || undefined;
  if (patch.seoDescription !== undefined) next.seoDescription = patch.seoDescription.trim() || undefined;
  return { configs: { ...configs, [id]: next }, customPages: pages };
}

export function applyRemoveCustomPage(
  configs: Record<string, AdminPageConfig>,
  customPages: AdminCustomPageMeta[],
  id: string
): { configs: Record<string, AdminPageConfig>; customPages: AdminCustomPageMeta[] } {
  if (!isCustomPageId(id)) return { configs, customPages };
  const pages = customPages.filter((p) => p.id !== id);
  const next = { ...configs };
  delete next[id];
  return { configs: next, customPages: pages };
}

export function applySetAdminPageFilter(
  configs: Record<string, AdminPageConfig>,
  customPages: AdminCustomPageMeta[],
  pageId: AdminPageIdAny,
  filter: Partial<AdminFilterSetting>
): { configs: Record<string, AdminPageConfig>; customPages: AdminCustomPageMeta[] } {
  const customMeta = isCustomPageId(pageId) ? customPages.find((p) => p.id === pageId) ?? null : null;
  const current = configs[pageId] ?? defaultConfig(pageId, customMeta);
  const next = { ...configs, [pageId]: { ...current, filter: { ...current.filter, ...filter } } };
  return { configs: next, customPages };
}

export function applyAddSavedMovie(
  configs: Record<string, AdminPageConfig>,
  customPages: AdminCustomPageMeta[],
  pageId: AdminPageIdAny,
  movie: MovieDetail
): { configs: Record<string, AdminPageConfig>; customPages: AdminCustomPageMeta[] } {
  const customMeta = isCustomPageId(pageId) ? customPages.find((p) => p.id === pageId) ?? null : null;
  const current = configs[pageId] ?? defaultConfig(pageId, customMeta);
  if (current.savedMovies.some((m) => m._id === movie._id)) return { configs, customPages };
  const next = { ...configs, [pageId]: { ...current, savedMovies: [...current.savedMovies, movie] } };
  return { configs: next, customPages };
}

export function applyRemoveSavedMovie(
  configs: Record<string, AdminPageConfig>,
  customPages: AdminCustomPageMeta[],
  pageId: AdminPageIdAny,
  movieId: string
): { configs: Record<string, AdminPageConfig>; customPages: AdminCustomPageMeta[] } {
  const customMeta = isCustomPageId(pageId) ? customPages.find((p) => p.id === pageId) ?? null : null;
  const current = configs[pageId] ?? defaultConfig(pageId, customMeta);
  const next = { ...configs, [pageId]: { ...current, savedMovies: current.savedMovies.filter((m) => m._id !== movieId) } };
  return { configs: next, customPages };
}

export function applyAddSection(
  configs: Record<string, AdminPageConfig>,
  customPages: AdminCustomPageMeta[],
  pageId: AdminPageIdAny,
  section: Omit<AdminSection, "id" | "order">
): { configs: Record<string, AdminPageConfig>; customPages: AdminCustomPageMeta[]; newSectionId: string } {
  const customMeta = isCustomPageId(pageId) ? customPages.find((p) => p.id === pageId) ?? null : null;
  const current = configs[pageId] ?? defaultConfig(pageId, customMeta);
  const order = current.sections.length;
  const defaultFilter: AdminFilterSetting =
    CATEGORY_BASED_PAGES.has(pageId as string) || isCustomPageId(pageId) ? { page: 1, limit: 24 } : { typeList: pageId as AdminFilterSetting["typeList"], page: 1, limit: 24 };
  const newSection: AdminSection = {
    id: nextSectionId(),
    order,
    title: section.title || "Section mới",
    type: section.type ?? "movie-list",
    filter: section.filter ?? defaultFilter,
    savedMovies: Array.isArray(section.savedMovies) ? section.savedMovies : [],
  };
  const sections = [...current.sections, newSection].sort((a, b) => a.order - b.order);
  const next = { ...configs, [pageId]: { ...current, sections } };
  return { configs: next, customPages, newSectionId: newSection.id };
}

export function applyUpdateSection(
  configs: Record<string, AdminPageConfig>,
  customPages: AdminCustomPageMeta[],
  pageId: AdminPageIdAny,
  sectionId: string,
  patch: Partial<Omit<AdminSection, "id">>
): { configs: Record<string, AdminPageConfig>; customPages: AdminCustomPageMeta[] } {
  const customMeta = isCustomPageId(pageId) ? customPages.find((p) => p.id === pageId) ?? null : null;
  const current = configs[pageId] ?? defaultConfig(pageId, customMeta);
  const sections = current.sections.map((s) => (s.id === sectionId ? { ...s, ...patch } : s));
  const next = { ...configs, [pageId]: { ...current, sections } };
  return { configs: next, customPages };
}

export function applyRemoveSection(
  configs: Record<string, AdminPageConfig>,
  customPages: AdminCustomPageMeta[],
  pageId: AdminPageIdAny,
  sectionId: string
): { configs: Record<string, AdminPageConfig>; customPages: AdminCustomPageMeta[] } {
  const customMeta = isCustomPageId(pageId) ? customPages.find((p) => p.id === pageId) ?? null : null;
  const current = configs[pageId] ?? defaultConfig(pageId, customMeta);
  const sections = current.sections.filter((s) => s.id !== sectionId).map((s, i) => ({ ...s, order: i }));
  const next = { ...configs, [pageId]: { ...current, sections } };
  return { configs: next, customPages };
}

export function applyMoveSection(
  configs: Record<string, AdminPageConfig>,
  customPages: AdminCustomPageMeta[],
  pageId: AdminPageIdAny,
  sectionId: string,
  direction: "up" | "down"
): { configs: Record<string, AdminPageConfig>; customPages: AdminCustomPageMeta[] } {
  const customMeta = isCustomPageId(pageId) ? customPages.find((p) => p.id === pageId) ?? null : null;
  const current = configs[pageId] ?? defaultConfig(pageId, customMeta);
  const idx = current.sections.findIndex((s) => s.id === sectionId);
  if (idx < 0) return { configs, customPages };
  const nextIdx = direction === "up" ? idx - 1 : idx + 1;
  if (nextIdx < 0 || nextIdx >= current.sections.length) return { configs, customPages };
  const reordered = [...current.sections].sort((a, b) => a.order - b.order);
  const [removed] = reordered.splice(idx, 1);
  if (!removed) return { configs, customPages };
  reordered.splice(nextIdx, 0, removed);
  const sections = reordered.map((s, i) => ({ ...s, order: i }));
  const next = { ...configs, [pageId]: { ...current, sections } };
  return { configs: next, customPages };
}

export function applyAddSavedMovieToSection(
  configs: Record<string, AdminPageConfig>,
  customPages: AdminCustomPageMeta[],
  pageId: AdminPageIdAny,
  sectionId: string,
  movie: MovieDetail
): { configs: Record<string, AdminPageConfig>; customPages: AdminCustomPageMeta[] } {
  const customMeta = isCustomPageId(pageId) ? customPages.find((p) => p.id === pageId) ?? null : null;
  const current = configs[pageId] ?? defaultConfig(pageId, customMeta);
  const section = current.sections.find((s) => s.id === sectionId);
  if (!section || section.savedMovies.some((m) => m._id === movie._id)) return { configs, customPages };
  const sections = current.sections.map((s) =>
    s.id === sectionId ? { ...s, savedMovies: [...s.savedMovies, movie] } : s
  );
  const next = { ...configs, [pageId]: { ...current, sections } };
  return { configs: next, customPages };
}

export function applyRemoveSavedMovieFromSection(
  configs: Record<string, AdminPageConfig>,
  customPages: AdminCustomPageMeta[],
  pageId: AdminPageIdAny,
  sectionId: string,
  movieId: string
): { configs: Record<string, AdminPageConfig>; customPages: AdminCustomPageMeta[] } {
  const customMeta = isCustomPageId(pageId) ? customPages.find((p) => p.id === pageId) ?? null : null;
  const current = configs[pageId] ?? defaultConfig(pageId, customMeta);
  const sections = current.sections.map((s) =>
    s.id === sectionId ? { ...s, savedMovies: s.savedMovies.filter((m) => m._id !== movieId) } : s
  );
  const next = { ...configs, [pageId]: { ...current, sections } };
  return { configs: next, customPages };
}
