"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  AdminPageIdAny,
  AdminFilterSetting,
  AdminPageConfig,
  AdminSection,
  AdminCustomPageMeta,
} from "../interfaces";
import {
  mergeFromApiPayload,
  toApiPayload,
  getPageListFromCustomPages,
  applyAddCustomPage,
  applyUpdateCustomPage,
  applyRemoveCustomPage,
  applySetAdminPageFilter,
  applyAddSavedMovie,
  applyRemoveSavedMovie,
  applyAddSection,
  applyUpdateSection,
  applyRemoveSection,
  applyMoveSection,
  applyAddSavedMovieToSection,
  applyRemoveSavedMovieFromSection,
} from "../store/admin-page-api-store";
import { fetchAdminConfig, saveAdminConfig } from "@/lib/admin-config-api";

export function useAdminPageConfigs() {
  const [configs, setConfigs] = useState<Record<string, AdminPageConfig>>({});
  const [customPages, setCustomPages] = useState<AdminCustomPageMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageList = getPageListFromCustomPages(customPages);

  const persist = useCallback(
    async (newConfigs: Record<string, AdminPageConfig>, newCustomPages: AdminCustomPageMeta[]) => {
      try {
        const payload = toApiPayload(newConfigs);
        await saveAdminConfig(payload);
        setConfigs(newConfigs);
        setCustomPages(newCustomPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lưu thất bại");
        throw err;
      }
    },
    []
  );

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await fetchAdminConfig();
      const merged = mergeFromApiPayload(
        payload.pageConfigs as Record<string, AdminPageConfig>,
        payload.customPages
      );
      setConfigs(merged);
      setCustomPages(payload.customPages);
      if (Object.keys(payload.pageConfigs).length === 0 && payload.customPages.length === 0) {
        const savePayload = toApiPayload(merged);
        await saveAdminConfig(savePayload);
        setCustomPages(savePayload.customPages);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tải thất bại");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addCustomPage = useCallback(
    async (params: { slug: string; label: string; seoTitle?: string; seoDescription?: string }) => {
      const { configs: next, customPages: nextCustom, newId } = applyAddCustomPage(configs, customPages, params);
      await persist(next, nextCustom);
      return newId;
    },
    [configs, customPages, persist]
  );

  const updateCustomPage = useCallback(
    async (id: string, patch: { slug?: string; label?: string; seoTitle?: string; seoDescription?: string }) => {
      const { configs: next, customPages: nextCustom } = applyUpdateCustomPage(configs, customPages, id, patch);
      await persist(next, nextCustom);
    },
    [configs, customPages, persist]
  );

  const removeCustomPage = useCallback(
    async (id: string) => {
      const { configs: next, customPages: nextCustom } = applyRemoveCustomPage(configs, customPages, id);
      await persist(next, nextCustom);
    },
    [configs, customPages, persist]
  );

  const setFilter = useCallback(
    async (pageId: AdminPageIdAny, filter: Partial<AdminFilterSetting>) => {
      const { configs: next } = applySetAdminPageFilter(configs, customPages, pageId, filter);
      await persist(next, customPages);
    },
    [configs, customPages, persist]
  );

  const addSavedMovie = useCallback(
    async (pageId: AdminPageIdAny, movieId: string) => {
      const { configs: next } = applyAddSavedMovie(configs, customPages, pageId, movieId);
      await persist(next, customPages);
    },
    [configs, customPages, persist]
  );

  const removeSavedMovie = useCallback(
    async (pageId: AdminPageIdAny, movieId: string) => {
      const { configs: next } = applyRemoveSavedMovie(configs, customPages, pageId, movieId);
      await persist(next, customPages);
    },
    [configs, customPages, persist]
  );

  const addSection = useCallback(
    async (pageId: AdminPageIdAny, section: Omit<AdminSection, "id" | "order">): Promise<string> => {
      const { configs: next, customPages: nextCustom, newSectionId } = applyAddSection(configs, customPages, pageId, section);
      await persist(next, nextCustom);
      return newSectionId;
    },
    [configs, customPages, persist]
  );

  const updateSection = useCallback(
    async (pageId: AdminPageIdAny, sectionId: string, patch: Partial<Omit<AdminSection, "id">>) => {
      const { configs: next } = applyUpdateSection(configs, customPages, pageId, sectionId, patch);
      await persist(next, customPages);
    },
    [configs, customPages, persist]
  );

  const removeSection = useCallback(
    async (pageId: AdminPageIdAny, sectionId: string) => {
      const { configs: next } = applyRemoveSection(configs, customPages, pageId, sectionId);
      await persist(next, customPages);
    },
    [configs, customPages, persist]
  );

  const moveSection = useCallback(
    async (pageId: AdminPageIdAny, sectionId: string, direction: "up" | "down") => {
      const { configs: next } = applyMoveSection(configs, customPages, pageId, sectionId, direction);
      await persist(next, customPages);
    },
    [configs, customPages, persist]
  );

  const addSavedMovieToSection = useCallback(
    async (pageId: AdminPageIdAny, sectionId: string, movieId: string) => {
      const { configs: next } = applyAddSavedMovieToSection(configs, customPages, pageId, sectionId, movieId);
      await persist(next, customPages);
    },
    [configs, customPages, persist]
  );

  const removeSavedMovieFromSection = useCallback(
    async (pageId: AdminPageIdAny, sectionId: string, movieId: string) => {
      const { configs: next } = applyRemoveSavedMovieFromSection(configs, customPages, pageId, sectionId, movieId);
      await persist(next, customPages);
    },
    [configs, customPages, persist]
  );

  return {
    configs,
    pageList,
    isLoading,
    error,
    addCustomPage,
    updateCustomPage,
    removeCustomPage,
    setFilter,
    addSavedMovie,
    removeSavedMovie,
    addSection,
    updateSection,
    removeSection,
    moveSection,
    addSavedMovieToSection,
    removeSavedMovieFromSection,
    reload,
  };
}
