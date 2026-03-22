import type { MovieDetail } from "@/types/movie-detail";
import type { MovieListItem } from "@/types/movie-list";

/** Map `MovieDetail` (API /phim) sang shape dùng cho list / SectionByDisplayType. */
export function movieDetailToListItem(item: MovieDetail): MovieListItem {
  return {
    tmdb: item.tmdb,
    imdb: item.imdb,
    created: item.created,
    modified: item.modified,
    _id: item._id,
    name: item.name,
    slug: item.slug,
    origin_name: item.origin_name,
    type: item.type,
    poster_url: item.poster_url,
    thumb_url: item.thumb_url,
    sub_docquyen: item.sub_docquyen,
    chieurap: item.chieurap,
    time: item.time,
    episode_current: item.episode_current,
    quality: item.quality,
    lang: item.lang,
    year: item.year,
    category: item.category,
    country: item.country,
  };
}
