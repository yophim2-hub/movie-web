import type { Metadata } from "next";
import { fetchMovieDetail } from "@/lib/api";
import { shortenTitleForSeo } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetchMovieDetail(slug);
    const item = res?.data?.item;
    if (!item) return { title: "Xem phim" };
    const title = `Xem phim: ${shortenTitleForSeo(item.name)}`;
    const description =
      item.origin_name || item.episode_current
        ? [item.origin_name, item.episode_current].filter(Boolean).join(" · ")
        : `Xem phim ${item.name} Vietsub tại Rồ Phim`;
    const url = `https://rophimm.org/xem-phim/${slug}`;
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

export default function XemPhimSlugLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
