import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Danh Sách Phim",
  description:
    "Lựa chọn phim theo thể loại, quốc gia, năm, chất lượng. Khám phá danh sách phim lẻ, phim bộ, phim chiếu rạp. Xem ngay miễn phí tại Rồ Phim.",
  alternates: {
    canonical: "https://rophimm.org/danh-sach",
  },
  openGraph: {
    title: "Danh Sách Phim | Rồ Phim",
    description:
      "Lựa chọn phim theo thể loại, quốc gia, năm. Xem ngay miễn phí tại Rồ Phim.",
    url: "https://rophimm.org/danh-sach",
  },
};

export default function DanhSachLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
