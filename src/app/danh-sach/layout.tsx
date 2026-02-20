import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Danh Sách Phim",
  description:
    "Danh sách phim đầy đủ với bộ lọc theo thể loại, quốc gia, năm, chất lượng. Xem phim lẻ, phim bộ, phim chiếu rạp tại Rồ Phim.",
  openGraph: {
    title: "Danh Sách Phim | Rồ Phim",
    description:
      "Danh sách phim với bộ lọc theo thể loại, quốc gia, năm. Xem phim miễn phí tại Rồ Phim.",
    url: "https://rophimm.org/danh-sach",
  },
};

export default function DanhSachLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
