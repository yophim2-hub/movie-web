import { formatOriginName } from "@/components/ui/movie-poster-card";
import type { EpisodeServer, MovieDetail } from "@/types/movie-detail";
import type { MovieDetailViewModel } from "../interfaces/movie-detail-view.model";
import { formatMovieTimeToHoursMinutes } from "./format-movie-time";

function getEpisodesFromMovie(movie: MovieDetail): EpisodeServer[] {
  return (movie as MovieDetail & { episodes?: EpisodeServer[] }).episodes ?? [];
}

export function buildMovieDetailViewModel(movie: MovieDetail): MovieDetailViewModel {
  const episodes = getEpisodesFromMovie(movie);
  const firstCategorySlug = movie.category?.[0]?.slug ?? "";
  const timeDisplay = formatMovieTimeToHoursMinutes(movie.time);
  const originNameDisplay = formatOriginName(movie.origin_name);

  const hasMetaTags = Boolean(
    movie.imdb?.id ||
      (movie.tmdb?.vote_average != null && movie.tmdb.vote_average > 0) ||
      movie.quality ||
      (movie.year != null && movie.year > 0) ||
      movie.episode_current ||
      timeDisplay ||
      movie.lang,
  );

  return {
    movie,
    episodes,
    firstCategorySlug,
    timeDisplay,
    originNameDisplay,
    hasMetaTags,
  };
}
