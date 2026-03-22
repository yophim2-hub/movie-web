"use client";

import { WatchContent } from "./watch-content";
import { WatchSkeleton } from "./watch-skeleton";
import { PageLayout } from "@/components/layout";
import { useMovieDetail } from "@/hooks";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { EpisodeServer } from "@/types/movie-detail";

function WatchMovieInfo({
  movie,
  slug,
}: {
  readonly movie: {
    name?: string;
    origin_name?: string;
    year?: number;
    time?: string;
    quality?: string;
    lang?: string;
    episode_current?: string;
  };
  readonly slug: string;
}) {
  const meta = [movie.year, movie.episode_current, movie.time, movie.quality, movie.lang].filter(
    Boolean
  );
  return (
    <section className="mt-6 rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--secondary-bg)] p-4">
      <Link
        href={`/phim/${slug}`}
        className="text-[15px] font-semibold text-[var(--foreground)] hover:text-[var(--accent)]"
      >
        {movie.name ?? "Phim"}
      </Link>
      {movie.origin_name ? (
        <p className="mt-0.5 text-[13px] text-[var(--foreground-muted)]">{movie.origin_name}</p>
      ) : null}
      {meta.length > 0 ? (
        <p className="mt-1 text-[12px] text-[var(--foreground-muted)]">{meta.join(" · ")}</p>
      ) : null}
    </section>
  );
}

export default function WatchFullPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";

  const { data, isLoading, isError } = useMovieDetail(slug, {
    enabled: slug.length > 0,
  });

  const movie = data?.data?.item;
  const dataEpisodes: EpisodeServer[] = (data?.data as { episodes?: EpisodeServer[] } | undefined)?.episodes ?? [];
  const movieEpisodes: EpisodeServer[] = (movie as { episodes?: EpisodeServer[] })?.episodes ?? [];
  const episodes = dataEpisodes.length > 0 ? dataEpisodes : movieEpisodes;
  const episode = episodes[0]?.server_data?.[0] ?? null;
  const streamUrl = episode?.link_m3u8 || episode?.link_embed || null;
  const isEmbed = streamUrl?.includes("embed") ?? false;

  if (!slug) {
    return (
      <PageLayout className="py-12">
        <p className="text-[var(--foreground-muted)]">Thiếu slug phim.</p>
        <Link href="/" className="mt-2 text-[var(--accent)] hover:underline">
          Về trang chủ
        </Link>
      </PageLayout>
    );
  }

  if (isLoading) {
    return <WatchSkeleton layout="split" />;
  }

  if (isError || !movie) {
    return (
      <PageLayout className="py-12">
        <p className="text-[var(--foreground-muted)]">Không tìm thấy phim.</p>
        <Link href="/" className="mt-2 text-[var(--accent)] hover:underline">
          Về trang chủ
        </Link>
      </PageLayout>
    );
  }

  if (!streamUrl) {
    return (
      <PageLayout className="py-12">
        <p className="text-[var(--foreground-muted)]">Chưa có link xem.</p>
        <Link href={`/phim/${slug}`} className="mt-2 text-[var(--accent)] hover:underline">
          Quay lại trang phim
        </Link>
      </PageLayout>
    );
  }

  return (
    <div className="content-fade-in">
      <WatchContent
        movie={movie}
        episode={episode}
        episodes={episodes}
        slug={slug}
        streamUrl={streamUrl}
        isEmbed={isEmbed}
        movieInfo={<WatchMovieInfo movie={movie} slug={slug} />}
      />
    </div>
  );
}
