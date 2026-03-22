"use client";

import { useMovieDetail } from "@/hooks";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import type { MovieDetailViewModel } from "../interfaces/movie-detail-view.model";
import { buildMovieDetailViewModel } from "./build-movie-detail-view-model";

export type MovieDetailScreenState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "ready"; model: MovieDetailViewModel };

export function useMovieDetailScreen(): MovieDetailScreenState {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";

  const { data, isLoading, isError } = useMovieDetail(slug, {
    enabled: slug.length > 0,
  });

  const movie = data?.data?.item;

  return useMemo((): MovieDetailScreenState => {
    if (!slug || isLoading) return { status: "loading" };
    if (isError || !movie) return { status: "not-found" };
    return { status: "ready", model: buildMovieDetailViewModel(movie) };
  }, [slug, isLoading, isError, movie]);
}
