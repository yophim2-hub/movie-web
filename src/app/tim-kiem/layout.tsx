import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tìm Kiếm Phim",
  description:
    "Tìm kiếm phim theo tên, từ khóa. Xem phim hay Vietsub, lọc theo thể loại, quốc gia. Tìm phim nhanh tại Rồ Phim.",
  openGraph: {
    title: "Tìm Kiếm Phim | Rồ Phim",
    description:
      "Tìm kiếm phim theo tên, từ khóa. Xem phim miễn phí tại Rồ Phim.",
    url: "https://rophimm.org/tim-kiem",
  },
};

export default function TimKiemLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
