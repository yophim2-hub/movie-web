"use client";

import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AdminPageIdAny,
  AdminFilterSetting,
  AdminPageConfig,
  AdminSection,
  AdminCustomPageMeta,
} from "../interfaces";
import type { MovieDetail } from "@/types/movie-detail";
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
import { adminPageConfigQueryKey } from "../lib/admin-config-query-key";
import { usePhimApiCache } from "../providers/phim-api-cache-provider";

type AdminConfigQueryData = {
  configs: Record<string, AdminPageConfig>;
  customPages: AdminCustomPageMeta[];
};

export function useAdminPageConfigs() {
  const queryClient = useQueryClient();
  const { staleTimeMs, gcTimeMs } = usePhimApiCache();

  const query = useQuery({
    queryKey: adminPageConfigQueryKey,
    staleTime: staleTimeMs,
    gcTime: gcTimeMs,
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<AdminConfigQueryData> => {
      const payload = await fetchAdminConfig();
      const merged = mergeFromApiPayload(
        payload.pageConfigs as Record<string, AdminPageConfig>,
        payload.customPages
      );
      if (Object.keys(payload.pageConfigs).length === 0 && payload.customPages.length === 0) {
        const savePayload = toApiPayload(merged);
        await saveAdminConfig(savePayload);
        return {
          configs: merged,
          customPages: savePayload.customPages,
        };
      }
      return {
        configs: merged,
        customPages: payload.customPages,
      };
    },
  });

  const configs: Record<string, AdminPageConfig> =
    query.data?.configs ?? (query.isError ? mergeFromApiPayload({}, []) : {});
  const customPages = query.data?.customPages ?? [];
  const pageList = getPageListFromCustomPages(customPages);

  let error: string | null = null;
  if (query.isError) {
    error = query.error instanceof Error ? query.error.message : "Tải thất bại";
  }

  const setQueryData = useCallback(
    (next: AdminConfigQueryData) => {
      queryClient.setQueryData(adminPageConfigQueryKey, next);
    },
    [queryClient]
  );

  const persist = useCallback(
    async (newConfigs: Record<string, AdminPageConfig>, newCustomPages: AdminCustomPageMeta[]) => {
      const payload = toApiPayload(newConfigs);
      const previous = queryClient.getQueryData<AdminConfigQueryData>(adminPageConfigQueryKey);
      setQueryData({ configs: newConfigs, customPages: newCustomPages });
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 0);
      });
      try {
        await saveAdminConfig(payload);
      } catch (e) {
        if (previous !== undefined) {
          queryClient.setQueryData(adminPageConfigQueryKey, previous);
        }
        throw e;
      }
    },
    [queryClient, setQueryData]
  );

  const reload = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: adminPageConfigQueryKey });
  }, [queryClient]);

  const addCustomPage = useCallback(
    async (params: { slug: string; label: string; seoTitle?: string; seoDescription?: string }) => {
      const { configs: next, customPages: nextCustom, newId } = applyAddCustomPage(
        configs,
        customPages,
        params
      );
      await persist(next, nextCustom);
      return newId;
    },
    [configs, customPages, persist]
  );

  const updateCustomPage = useCallback(
    async (id: string, patch: { slug?: string; label?: string; seoTitle?: string; seoDescription?: string }) => {
      const { configs: next, customPages: nextCustom } = applyUpdateCustomPage(
        configs,
        customPages,
        id,
        patch
      );
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
    async (pageId: AdminPageIdAny, movie: MovieDetail) => {
      const { configs: next } = applyAddSavedMovie(configs, customPages, pageId, movie);
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
      const { configs: next, customPages: nextCustom, newSectionId } = applyAddSection(
        configs,
        customPages,
        pageId,
        section
      );
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
    async (pageId: AdminPageIdAny, sectionId: string, movie: MovieDetail) => {
      const { configs: next } = applyAddSavedMovieToSection(
        configs,
        customPages,
        pageId,
        sectionId,
        movie
      );
      await persist(next, customPages);
    },
    [configs, customPages, persist]
  );

  const removeSavedMovieFromSection = useCallback(
    async (pageId: AdminPageIdAny, sectionId: string, movieId: string) => {
      const { configs: next } = applyRemoveSavedMovieFromSection(
        configs,
        customPages,
        pageId,
        sectionId,
        movieId
      );
      await persist(next, customPages);
    },
    [configs, customPages, persist]
  );

  return {
    configs,
    pageList,
    isLoading: query.isPending,
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
