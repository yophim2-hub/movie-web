import type { Metadata } from "next";
import { fetchMovieDetail } from "@/lib/api";
import { shortenTitleForSeo } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetchMovieDetail(slug);
    const item = res?.data?.item;
    const seo = res?.data?.seoOnPage;
    if (!item) return { title: "Phim" };
    const rawTitle = seo?.titleHead || item.name;
    const title = shortenTitleForSeo(rawTitle);
    const description =
      seo?.descriptionHead ||
      [item.origin_name, item.year, item.quality, item.lang]
        .filter(Boolean)
        .join(" · ") ||
      `Xem phim ${item.name} Vietsub tại Bỏng Phim`;
    const ogImage = seo?.og_image?.[0];
    const url = seo?.og_url || `https://bongphim.vn/phim/${slug}`;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        type: "website",
        ...(ogImage && { images: [{ url: ogImage }] }),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        ...(ogImage && { images: [ogImage] }),
      },
      alternates: { canonical: url },
    };
  } catch {
    return { title: "Phim" };
  }
}

export default function PhimSlugLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
