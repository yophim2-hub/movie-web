import { fetchLatestMovieList, fetchMovieList } from "@/lib/api";
import type { AdminSection } from "../interfaces";
import type { LatestMovieListItem } from "@/types/latest-movie-list";
import type { MovieListItem } from "@/types/movie-list";

function latestToMovieListItem(item: LatestMovieListItem): MovieListItem {
  return {
    tmdb: item.tmdb,
    imdb: item.imdb,
    created: item.created ?? { time: item.modified?.time ?? "" },
    modified: item.modified,
    _id: item._id,
    name: item.name,
    slug: item.slug,
    origin_name: item.origin_name,
    type: item.type,
    poster_url: item.poster_url,
    thumb_url: item.thumb_url,
    sub_docquyen: item.sub_docquyen,
    chieurap: item.chieurap ?? false,
    time: item.time,
    episode_current: item.episode_current,
    quality: item.quality,
    lang: item.lang,
    year: item.year,
    category: item.category,
    country: item.country,
  };
}

/**
 * Gọi đúng API list theo filter section (danh-sách hoặc phim mới cập nhật khi không có typeList).
 */
export async function fetchMovieListItemsForSection(section: AdminSection): Promise<MovieListItem[]> {
  const f = section.filter ?? {};
  const limit = Math.min(64, Math.max(8, f.limit ?? 24));

  if (!f.typeList) {
    const res = await fetchLatestMovieList({ page: 1 });
    if (!res.status || !Array.isArray(res.items)) return [];
    return res.items.slice(0, limit).map(latestToMovieListItem);
  }

  const res = await fetchMovieList({
    typeList: f.typeList,
    page: 1,
    limit,
    sortField: f.sortField,
    sortType: f.sortType,
    sortLang: f.sortLang,
    category: f.category,
    country: f.country,
    year: f.year,
  });
  const items = res.data?.items ?? [];
  return items.slice(0, limit);
}
