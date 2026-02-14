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
      ? `${item.name} ${item.episode_current} Vietsub - Xem tại Bỏng Phim`
      : `Xem phim ${item.name} Vietsub tại Bỏng Phim`;
    const url = `https://bongphim.vn/xem-phim/${slug}/${episodeSlug}`;
    return {
      title,
      description,
      openGraph: {
        title: `${title} | Bỏng Phim`,
        description,
        url,
      },
      robots: { index: false, follow: true },
      alternates: { canonical: `https://bongphim.vn/phim/${slug}` },
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
