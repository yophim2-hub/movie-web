"use client";

import { WatchContent } from "./watch-content";
import { WatchSkeleton } from "./watch-skeleton";
import { PageLayout } from "@/components/layout";
import { useMovieDetail } from "@/hooks";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { EpisodeItem, EpisodeServer } from "@/types/movie-detail";

function findEpisodeBySlug(episodes: EpisodeServer[], episodeSlug: string): EpisodeItem | null {
  for (const server of episodes) {
    const ep = server.server_data?.find((e) => e.slug === episodeSlug);
    if (ep) return ep;
  }
  return null;
}

export default function WatchEpisodePage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const episodeSlug = typeof params?.episodeSlug === "string" ? params.episodeSlug : "";

  const { data, isLoading, isError } = useMovieDetail(slug, {
    enabled: slug.length > 0,
  });

  const movie = data?.data?.item;
  const episodes: EpisodeServer[] = (movie as { episodes?: EpisodeServer[] })?.episodes ?? [];
  const episode = episodeSlug
    ? findEpisodeBySlug(episodes, episodeSlug)
    : episodes[0]?.server_data?.[0] ?? null;
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
        <p className="text-[var(--foreground-muted)]">Chưa có link xem cho tập này.</p>
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
      />
    </div>
  );
}
