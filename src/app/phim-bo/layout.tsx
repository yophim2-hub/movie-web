import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phim Bộ",
  description:
    "Xem phim bộ mới nhất, phim bộ hay Vietsub trọn bộ. Cập nhật nhanh phim Hàn, Trung, Thái, Âu Mỹ. Xem phim bộ miễn phí tại Rồ Phim.",
  openGraph: {
    title: "Phim Bộ | Rồ Phim",
    description:
      "Xem phim bộ mới nhất, phim bộ hay Vietsub trọn bộ. Cập nhật nhanh tại Rồ Phim.",
    url: "https://rophimm.org/phim-bo",
  },
};

export default function PhimBoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
