import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tìm Kiếm Phim",
  description:
    "Tìm kiếm phim theo tên, từ khóa. Xem phim hay Vietsub, lọc theo thể loại, quốc gia. Tìm phim nhanh tại Bỏng Phim.",
  openGraph: {
    title: "Tìm Kiếm Phim | Bỏng Phim",
    description:
      "Tìm kiếm phim theo tên, từ khóa. Xem phim miễn phí tại Bỏng Phim.",
    url: "https://bongphim.vn/tim-kiem",
  },
};

export default function TimKiemLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
