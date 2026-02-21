import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phim Bộ",
  description:
    "Thưởng thức phim bộ mới nhất Vietsub trọn bộ. Khám phá phim Hàn, Trung, Thái, Âu Mỹ. Xem ngay phim bộ hay miễn phí, cập nhật nhanh tại Rồ Phim.",
  alternates: {
    canonical: "https://rophimm.org/phim-bo",
  },
  openGraph: {
    title: "Phim Bộ | Rồ Phim",
    description:
      "Thưởng thức phim bộ mới nhất Vietsub trọn bộ. Xem ngay miễn phí tại Rồ Phim.",
    url: "https://rophimm.org/phim-bo",
  },
};

export default function PhimBoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
