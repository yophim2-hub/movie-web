import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thể Loại Phim",
  description:
    "Khám phá phim theo thể loại: hành động, tình cảm, kinh dị, viễn tưởng, hài, anime. Lựa chọn thể loại yêu thích và xem ngay tại Rồ Phim.",
  alternates: {
    canonical: "https://rophimm.org/the-loai",
  },
  openGraph: {
    title: "Thể Loại Phim | Rồ Phim",
    description:
      "Khám phá phim theo thể loại yêu thích. Xem ngay tại Rồ Phim.",
    url: "https://rophimm.org/the-loai",
  },
};

export default function TheLoaiLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
