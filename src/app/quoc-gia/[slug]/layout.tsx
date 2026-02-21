import type { Metadata } from "next";
import { fetchCountryDetail } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetchCountryDetail({
      countrySlug: slug,
      page: 1,
      limit: 1,
    });
    const titlePage = res?.data?.titlePage;
    const title = titlePage || "Quốc gia";
    const description = titlePage
      ? `Thưởng thức phim ${titlePage} mới nhất Vietsub. Khám phá và xem ngay miễn phí tại Rồ Phim.`
      : "Khám phá và xem ngay phim theo quốc gia tại Rồ Phim.";
    const url = `https://rophimm.org/quoc-gia/${slug}`;
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
    return { title: "Quốc gia" };
  }
}

export default function QuocGiaSlugLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
