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
      ? `Xem phim thể loại ${titlePage} mới nhất Vietsub. Cập nhật nhanh tại Bỏng Phim.`
      : "Xem phim theo thể loại tại Bỏng Phim.";
    const url = `https://bongphim.vn/the-loai/${slug}`;
    return {
      title,
      description,
      openGraph: {
        title: `${title} | Bỏng Phim`,
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
