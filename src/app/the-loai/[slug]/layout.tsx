import type { Metadata } from "next";
import { fetchCategoryDetail } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetchCategoryDetail({
      categorySlug: slug,
      page: 1,
      limit: 1,
    });
    const titlePage = res?.data?.titlePage;
    const title = titlePage || "Thể loại";
    const description = titlePage
      ? `Khám phá phim thể loại ${titlePage} mới nhất Vietsub. Xem ngay miễn phí, cập nhật hàng ngày tại Rồ Phim.`
      : "Khám phá và xem ngay phim theo thể loại tại Rồ Phim.";
    const url = `https://rophimm.org/the-loai/${slug}`;
    return {
      title,
      description,
      openGraph: {
        title: `${title} | Rồ Phim`,
        description,
        url,
      },
      alternates: { canonical: url },
    };
  } catch {
    return { title: "Thể loại" };
  }
}

export default function TheLoaiSlugLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
