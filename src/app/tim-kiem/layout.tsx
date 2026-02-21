import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tìm Kiếm Phim",
  description:
    "Tìm ngay phim theo tên, từ khóa. Khám phá phim hay Vietsub, lọc theo thể loại, quốc gia. Tìm phim yêu thích nhanh chóng tại Rồ Phim.",
  openGraph: {
    title: "Tìm Kiếm Phim | Rồ Phim",
    description:
      "Tìm ngay và khám phá phim hay Vietsub. Tìm phim yêu thích tại Rồ Phim.",
    url: "https://rophimm.org/tim-kiem",
  },
};

export default function TimKiemLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
