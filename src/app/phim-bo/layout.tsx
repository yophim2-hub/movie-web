import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phim Bộ",
  description:
    "Xem phim bộ mới nhất, phim bộ hay Vietsub trọn bộ. Cập nhật nhanh phim Hàn, Trung, Thái, Âu Mỹ. Xem phim bộ miễn phí tại Bỏng Phim.",
  openGraph: {
    title: "Phim Bộ | Bỏng Phim",
    description:
      "Xem phim bộ mới nhất, phim bộ hay Vietsub trọn bộ. Cập nhật nhanh tại Bỏng Phim.",
    url: "https://bongphim.vn/phim-bo",
  },
};

export default function PhimBoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
