import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hoạt Hình",
  description:
    "Xem hoạt hình, anime mới nhất Vietsub. Cập nhật nhanh phim hoạt hình trẻ em, anime Nhật. Xem miễn phí tại Rồ Phim.",
  openGraph: {
    title: "Hoạt Hình | Rồ Phim",
    description:
      "Xem hoạt hình, anime mới nhất Vietsub. Cập nhật nhanh tại Rồ Phim.",
    url: "https://rophimm.org/hoat-hinh",
  },
};

export default function HoatHinhLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
