import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hoạt Hình",
  description:
    "Xem hoạt hình, anime mới nhất Vietsub. Cập nhật nhanh phim hoạt hình trẻ em, anime Nhật. Xem miễn phí tại Bỏng Phim.",
  openGraph: {
    title: "Hoạt Hình | Bỏng Phim",
    description:
      "Xem hoạt hình, anime mới nhất Vietsub. Cập nhật nhanh tại Bỏng Phim.",
    url: "https://bongphim.vn/hoat-hinh",
  },
};

export default function HoatHinhLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
