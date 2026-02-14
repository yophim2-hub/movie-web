"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  AdminPageIdAny,
  AdminFilterSetting,
  AdminPageConfig,
  AdminSection,
} from "../interfaces";
import {
  getAdminPageConfigs,
  getPageList as persistGetPageList,
  addCustomPage as persistAddCustomPage,
  updateCustomPage as persistUpdateCustomPage,
  removeCustomPage as persistRemoveCustomPage,
  setAdminPageFilter as persistFilter,
  addSavedMovie as persistAddSaved,
  removeSavedMovie as persistRemoveSaved,
  addSection as persistAddSection,
  updateSection as persistUpdateSection,
  removeSection as persistRemoveSection,
  moveSection as persistMoveSection,
  addSavedMovieToSection as persistAddSavedToSection,
  removeSavedMovieFromSection as persistRemoveSavedFromSection,
} from "../store/admin-page-store";

export function useAdminPageConfigs() {
  const [configs, setConfigs] = useState<Record<string, AdminPageConfig>>(
    getAdminPageConfigs
  );

  const reload = useCallback(() => {
    setConfigs(getAdminPageConfigs());
  }, []);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "admin-page-configs" || e.key === "admin-custom-pages")
        reload();
    };
    globalThis.window.addEventListener("storage", handleStorage);
    return () => globalThis.window.removeEventListener("storage", handleStorage);
  }, [reload]);

  const pageList = persistGetPageList();

  const addCustomPage = useCallback((params: { slug: string; label: string }) => {
    const id = persistAddCustomPage(params);
    setConfigs(getAdminPageConfigs());
    return id;
  }, []);

  const updateCustomPage = useCallback(
    (id: string, patch: { slug?: string; label?: string }) => {
      persistUpdateCustomPage(id, patch);
      setConfigs(getAdminPageConfigs());
    },
    []
  );

  const removeCustomPage = useCallback((id: string) => {
    persistRemoveCustomPage(id);
    setConfigs(getAdminPageConfigs());
  }, []);

  const setFilter = useCallback(
    (pageId: AdminPageIdAny, filter: Partial<AdminFilterSetting>) => {
      persistFilter(pageId, filter);
      setConfigs(getAdminPageConfigs());
    },
    []
  );

  const addSavedMovie = useCallback((pageId: AdminPageIdAny, movieId: string) => {
    persistAddSaved(pageId, movieId);
    setConfigs(getAdminPageConfigs());
  }, []);

  const removeSavedMovie = useCallback((pageId: AdminPageIdAny, movieId: string) => {
    persistRemoveSaved(pageId, movieId);
    setConfigs(getAdminPageConfigs());
  }, []);

  const addSection = useCallback(
    (pageId: AdminPageIdAny, section: Omit<AdminSection, "id" | "order">): string => {
      const id = persistAddSection(pageId, section);
      setConfigs(getAdminPageConfigs());
      return id;
    },
    []
  );

  const updateSection = useCallback(
    (
      pageId: AdminPageIdAny,
      sectionId: string,
      patch: Partial<Omit<AdminSection, "id">>
    ) => {
      persistUpdateSection(pageId, sectionId, patch);
      setConfigs(getAdminPageConfigs());
    },
    []
  );

  const removeSection = useCallback((pageId: AdminPageIdAny, sectionId: string) => {
    persistRemoveSection(pageId, sectionId);
    setConfigs(getAdminPageConfigs());
  }, []);

  const moveSection = useCallback(
    (pageId: AdminPageIdAny, sectionId: string, direction: "up" | "down") => {
      persistMoveSection(pageId, sectionId, direction);
      setConfigs(getAdminPageConfigs());
    },
    []
  );

  const addSavedMovieToSection = useCallback(
    (pageId: AdminPageIdAny, sectionId: string, movieId: string) => {
      persistAddSavedToSection(pageId, sectionId, movieId);
      setConfigs(getAdminPageConfigs());
    },
    []
  );

  const removeSavedMovieFromSection = useCallback(
    (pageId: AdminPageIdAny, sectionId: string, movieId: string) => {
      persistRemoveSavedFromSection(pageId, sectionId, movieId);
      setConfigs(getAdminPageConfigs());
    },
    []
  );

  return {
    configs,
    pageList,
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
