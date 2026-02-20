import type { Metadata } from "next";
import { fetchMovieDetail } from "@/lib/api";
import { shortenTitleForSeo } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string; episodeSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, episodeSlug } = await params;
  try {
    const res = await fetchMovieDetail(slug);
    const item = res?.data?.item;
    if (!item) return { title: "Xem phim" };
    const title = `Xem: ${shortenTitleForSeo(item.name)} - Tập ${episodeSlug}`;
    const description = item.episode_current
      ? `${item.name} ${item.episode_current} Vietsub - Xem tại Rồ Phim`
      : `Xem phim ${item.name} Vietsub tại Rồ Phim`;
    const url = `https://rophimm.org/xem-phim/${slug}/${episodeSlug}`;
    return {
      title,
      description,
      openGraph: {
        title: `${title} | Rồ Phim`,
        description,
        url,
      },
      robots: { index: false, follow: true },
      alternates: { canonical: `https://rophimm.org/phim/${slug}` },
    };
  } catch {
    return { title: "Xem phim" };
  }
}

export default function XemPhimEpisodeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
