import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phim Lẻ",
  description:
    "Khám phá bộ sưu tập phim lẻ hay nhất Vietsub HD. Xem ngay phim hành động, tình cảm, kinh dị, viễn tưởng. Trải nghiệm xem phim miễn phí, cập nhật mỗi ngày tại Rồ Phim.",
  alternates: {
    canonical: "https://rophimm.org/phim-le",
  },
  openGraph: {
    title: "Phim Lẻ | Rồ Phim",
    description:
      "Khám phá phim lẻ hay nhất Vietsub HD. Xem ngay miễn phí tại Rồ Phim.",
    url: "https://rophimm.org/phim-le",
  },
};

export default function PhimLeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
