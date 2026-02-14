"use client";

import type {
  AdminPageConfig,
  AdminPageId,
  AdminPageIdAny,
  AdminFilterSetting,
  AdminSection,
  AdminCustomPageMeta,
  AdminPageListItem,
} from "../interfaces";
import {
  ADMIN_PAGE_IDS,
  ADMIN_PAGE_LABELS,
  ADMIN_PAGE_SLUGS,
} from "../interfaces";

const STORAGE_KEY = "admin-page-configs";
const CUSTOM_PAGES_KEY = "admin-custom-pages";

function isCustomPageId(id: string): id is `custom-${string}` {
  return id.startsWith("custom-");
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
      savedMovieIds: [],
      sections: [],
    };
  }
  const label = ADMIN_PAGE_LABELS[pageId as AdminPageId];
  const filter: AdminFilterSetting =
    pageId === "home"
      ? { page: 1, limit: 24 }
      : { typeList: pageId as AdminFilterSetting["typeList"], page: 1, limit: 24 };
  return {
    pageId,
    label,
    filter,
    savedMovieIds: [],
    sections: [],
  };
}

function loadCustomPages(): AdminCustomPageMeta[] {
  if (typeof globalThis.window === "undefined") return [];
  try {
    const raw = globalThis.localStorage.getItem(CUSTOM_PAGES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (p): p is AdminCustomPageMeta =>
        p && typeof p.id === "string" && typeof p.slug === "string" && typeof p.label === "string"
    );
  } catch {
    return [];
  }
}

function saveCustomPages(pages: AdminCustomPageMeta[]): void {
  if (typeof globalThis.window === "undefined") return;
  try {
    globalThis.localStorage.setItem(CUSTOM_PAGES_KEY, JSON.stringify(pages));
  } catch {
    // ignore
  }
}

export function getPageList(): AdminPageListItem[] {
  const builtIn: AdminPageListItem[] = ADMIN_PAGE_IDS.map((id) => ({
    id,
    label: ADMIN_PAGE_LABELS[id],
    slug: ADMIN_PAGE_SLUGS[id],
    isBuiltIn: true,
  }));
  const custom = loadCustomPages().map((p) => ({
    id: p.id as AdminPageIdAny,
    label: p.label,
    slug: p.slug.startsWith("/") ? p.slug : `/${p.slug}`,
    isBuiltIn: false,
  }));
  return [...builtIn, ...custom];
}

function loadFromStorage(): Record<string, AdminPageConfig> {
  const customPages = loadCustomPages();
  const getCustomMeta = (id: string) =>
    customPages.find((p) => p.id === id) ?? null;

  if (typeof globalThis.window === "undefined") {
    const result: Record<string, AdminPageConfig> = {};
    for (const id of ADMIN_PAGE_IDS) result[id] = defaultConfig(id);
    for (const p of customPages) result[p.id] = defaultConfig(p.id as AdminPageIdAny, p);
    return result;
  }
  try {
    const raw = globalThis.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Record<string, AdminPageConfig>) : {};
    const result: Record<string, AdminPageConfig> = {};

    for (const id of ADMIN_PAGE_IDS) {
      const def = defaultConfig(id);
      const p = parsed[id];
      result[id] = mergeConfig(def, p, id);
    }
    for (const cp of customPages) {
      const def = defaultConfig(cp.id as AdminPageIdAny, cp);
      const p = parsed[cp.id];
      result[cp.id] = mergeConfig(def, p, cp.id);
    }
    return result;
  } catch {
    const result: Record<string, AdminPageConfig> = {};
    for (const id of ADMIN_PAGE_IDS) result[id] = defaultConfig(id);
    for (const p of customPages) result[p.id] = defaultConfig(p.id as AdminPageIdAny, p);
    return result;
  }
}

function mergeConfig(
  def: AdminPageConfig,
  parsed: AdminPageConfig | undefined,
  pageId: string
): AdminPageConfig {
  if (!parsed || typeof parsed.savedMovieIds !== "object") return def;
  const sections = Array.isArray(parsed.sections)
    ? (parsed.sections as AdminSection[]).filter(
        (s) => s && typeof s.id === "string" && typeof s.order === "number"
      )
    : [];
  const merged: AdminPageConfig = {
    ...def,
    ...parsed,
    pageId: pageId as AdminPageConfig["pageId"],
    label: parsed.label ?? def.label,
    filter: { ...def.filter, ...parsed.filter },
    savedMovieIds: parsed.savedMovieIds.filter((x): x is string => typeof x === "string"),
    sections,
  };
  if (!isCustomPageId(pageId) && pageId !== "home") {
    (merged.filter as AdminFilterSetting).typeList = pageId as AdminFilterSetting["typeList"];
  }
  return merged;
}

function getDefaultConfigs(): Record<string, AdminPageConfig> {
  const result: Record<string, AdminPageConfig> = {};
  for (const id of ADMIN_PAGE_IDS) result[id] = defaultConfig(id);
  for (const p of loadCustomPages()) result[p.id] = defaultConfig(p.id as AdminPageIdAny, p);
  return result;
}

function saveToStorage(configs: Record<string, AdminPageConfig>) {
  if (typeof globalThis.window === "undefined") return;
  try {
    globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
  } catch {
    // ignore
  }
}

export function getAdminPageConfigs(): Record<string, AdminPageConfig> {
  return loadFromStorage();
}

function nextCustomId(): string {
  return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function addCustomPage(params: { slug: string; label: string }): string {
  const slug = params.slug.startsWith("/") ? params.slug : `/${params.slug}`;
  const id = nextCustomId();
  const pages = [...loadCustomPages(), { id, slug, label: params.label }];
  saveCustomPages(pages);
  const configs = loadFromStorage();
  configs[id] = defaultConfig(id as AdminPageIdAny, { id, slug, label: params.label });
  saveToStorage(configs);
  return id;
}

export function updateCustomPage(
  id: string,
  patch: { slug?: string; label?: string }
): void {
  if (!isCustomPageId(id)) return;
  const pages = loadCustomPages().map((p) =>
    p.id === id
      ? {
          ...p,
          slug: patch.slug != null ? (patch.slug.startsWith("/") ? patch.slug : `/${patch.slug}`) : p.slug,
          label: patch.label ?? p.label,
        }
      : p
  );
  saveCustomPages(pages);
  const configs = loadFromStorage();
  const cfg = configs[id];
  if (cfg) {
    const meta = pages.find((x) => x.id === id);
    if (meta) configs[id] = { ...cfg, label: meta.label, slug: meta.slug };
    saveToStorage(configs);
  }
}

export function removeCustomPage(id: string): void {
  if (!isCustomPageId(id)) return;
  saveCustomPages(loadCustomPages().filter((p) => p.id !== id));
  const configs = loadFromStorage();
  delete configs[id];
  saveToStorage(configs);
}

export function setAdminPageFilter(
  pageId: AdminPageIdAny,
  filter: Partial<AdminFilterSetting>
): void {
  const configs = loadFromStorage();
  const customMeta = isCustomPageId(pageId) ? loadCustomPages().find((p) => p.id === pageId) ?? null : null;
  const current = configs[pageId] ?? defaultConfig(pageId, customMeta);
  configs[pageId] = { ...current, filter: { ...current.filter, ...filter } };
  saveToStorage(configs);
}

export function addSavedMovie(pageId: AdminPageIdAny, movieId: string): void {
  const configs = loadFromStorage();
  const customMeta = isCustomPageId(pageId) ? loadCustomPages().find((p) => p.id === pageId) ?? null : null;
  const current = configs[pageId] ?? defaultConfig(pageId, customMeta);
  if (current.savedMovieIds.includes(movieId)) return;
  configs[pageId] = {
    ...current,
    savedMovieIds: [...current.savedMovieIds, movieId],
  };
  saveToStorage(configs);
}

export function removeSavedMovie(pageId: AdminPageIdAny, movieId: string): void {
  const configs = loadFromStorage();
  const customMeta = isCustomPageId(pageId) ? loadCustomPages().find((p) => p.id === pageId) ?? null : null;
  const current = configs[pageId] ?? defaultConfig(pageId, customMeta);
  configs[pageId] = {
    ...current,
    savedMovieIds: current.savedMovieIds.filter((id) => id !== movieId),
  };
  saveToStorage(configs);
}

export function reorderSavedMovies(
  pageId: AdminPageIdAny,
  fromIndex: number,
  toIndex: number
): void {
  const configs = loadFromStorage();
  const customMeta = isCustomPageId(pageId) ? loadCustomPages().find((p) => p.id === pageId) ?? null : null;
  const current = configs[pageId] ?? defaultConfig(pageId, customMeta);
  const list = [...current.savedMovieIds];
  const [removed] = list.splice(fromIndex, 1);
  if (removed == null) return;
  list.splice(toIndex, 0, removed);
  configs[pageId] = { ...current, savedMovieIds: list };
  saveToStorage(configs);
}

function nextSectionId(): string {
  return typeof globalThis.crypto !== "undefined" && globalThis.crypto.randomUUID
    ? globalThis.crypto.randomUUID()
    : `section-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function addSection(
  pageId: AdminPageIdAny,
  section: Omit<AdminSection, "id" | "order">
): string {
  const configs = loadFromStorage();
  const customMeta = isCustomPageId(pageId) ? loadCustomPages().find((p) => p.id === pageId) ?? null : null;
  const current = configs[pageId] ?? defaultConfig(pageId, customMeta);
  const order = current.sections.length;
  const defaultFilter: AdminFilterSetting =
    pageId === "home" || isCustomPageId(pageId)
      ? { page: 1, limit: 24 }
      : { typeList: pageId as AdminFilterSetting["typeList"], page: 1, limit: 24 };
  const newSection: AdminSection = {
    id: nextSectionId(),
    order,
    title: section.title || "Section mới",
    type: section.type ?? "movie-list",
    filter: section.filter ?? defaultFilter,
    savedMovieIds: Array.isArray(section.savedMovieIds) ? section.savedMovieIds : [],
  };
  configs[pageId] = {
    ...current,
    sections: [...current.sections, newSection].sort((a, b) => a.order - b.order),
  };
  saveToStorage(configs);
  return newSection.id;
}

export function updateSection(
  pageId: AdminPageIdAny,
  sectionId: string,
  patch: Partial<Omit<AdminSection, "id">>
): void {
  const configs = loadFromStorage();
  const customMeta = isCustomPageId(pageId) ? loadCustomPages().find((p) => p.id === pageId) ?? null : null;
  const current = configs[pageId] ?? defaultConfig(pageId, customMeta);
  const sections = current.sections.map((s) =>
    s.id === sectionId ? { ...s, ...patch } : s
  );
  configs[pageId] = { ...current, sections };
  saveToStorage(configs);
}

export function removeSection(pageId: AdminPageIdAny, sectionId: string): void {
  const configs = loadFromStorage();
  const customMeta = isCustomPageId(pageId) ? loadCustomPages().find((p) => p.id === pageId) ?? null : null;
  const current = configs[pageId] ?? defaultConfig(pageId, customMeta);
  const sections = current.sections
    .filter((s) => s.id !== sectionId)
    .map((s, i) => ({ ...s, order: i }));
  configs[pageId] = { ...current, sections };
  saveToStorage(configs);
}

export function moveSection(
  pageId: AdminPageIdAny,
  sectionId: string,
  direction: "up" | "down"
): void {
  const configs = loadFromStorage();
  const customMeta = isCustomPageId(pageId) ? loadCustomPages().find((p) => p.id === pageId) ?? null : null;
  const current = configs[pageId] ?? defaultConfig(pageId, customMeta);
  const idx = current.sections.findIndex((s) => s.id === sectionId);
  if (idx < 0) return;
  const nextIdx = direction === "up" ? idx - 1 : idx + 1;
  if (nextIdx < 0 || nextIdx >= current.sections.length) return;
  const reordered = [...current.sections].sort((a, b) => a.order - b.order);
  const [removed] = reordered.splice(idx, 1);
  if (!removed) return;
  reordered.splice(nextIdx, 0, removed);
  const sections = reordered.map((s, i) => ({ ...s, order: i }));
  configs[pageId] = { ...current, sections };
  saveToStorage(configs);
}

export function addSavedMovieToSection(
  pageId: AdminPageIdAny,
  sectionId: string,
  movieId: string
): void {
  const configs = loadFromStorage();
  const customMeta = isCustomPageId(pageId) ? loadCustomPages().find((p) => p.id === pageId) ?? null : null;
  const current = configs[pageId] ?? defaultConfig(pageId, customMeta);
  const section = current.sections.find((s) => s.id === sectionId);
  if (!section || section.savedMovieIds.includes(movieId)) return;
  const sections = current.sections.map((s) =>
    s.id === sectionId
      ? { ...s, savedMovieIds: [...s.savedMovieIds, movieId] }
      : s
  );
  configs[pageId] = { ...current, sections };
  saveToStorage(configs);
}

export function removeSavedMovieFromSection(
  pageId: AdminPageIdAny,
  sectionId: string,
  movieId: string
): void {
  const configs = loadFromStorage();
  const customMeta = isCustomPageId(pageId) ? loadCustomPages().find((p) => p.id === pageId) ?? null : null;
  const current = configs[pageId] ?? defaultConfig(pageId, customMeta);
  const sections = current.sections.map((s) =>
    s.id === sectionId
      ? { ...s, savedMovieIds: s.savedMovieIds.filter((id) => id !== movieId) }
      : s
  );
  configs[pageId] = { ...current, sections };
  saveToStorage(configs);
}
