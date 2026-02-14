import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phim Chiếu Rạp",
  description:
    "Xem phim chiếu rạp mới nhất, phim lẻ đang chiếu Vietsub HD. Cập nhật nhanh phim điện ảnh hot. Xem phim chiếu rạp miễn phí tại Bỏng Phim.",
  openGraph: {
    title: "Phim Chiếu Rạp | Bỏng Phim",
    description:
      "Xem phim chiếu rạp mới nhất, phim điện ảnh Vietsub HD. Cập nhật nhanh tại Bỏng Phim.",
    url: "https://bongphim.vn/phim-chieu-rap",
  },
};

export default function PhimChieuRapLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
