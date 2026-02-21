import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phim Theo Quốc Gia",
  description:
    "Khám phá phim theo quốc gia: Hàn Quốc, Trung Quốc, Nhật Bản, Mỹ, Thái Lan, Việt Nam. Lựa chọn và xem ngay phim hay miễn phí tại Rồ Phim.",
  alternates: {
    canonical: "https://rophimm.org/quoc-gia",
  },
  openGraph: {
    title: "Phim Theo Quốc Gia | Rồ Phim",
    description:
      "Khám phá phim theo quốc gia. Lựa chọn và xem ngay tại Rồ Phim.",
    url: "https://rophimm.org/quoc-gia",
  },
};

export default function QuocGiaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
