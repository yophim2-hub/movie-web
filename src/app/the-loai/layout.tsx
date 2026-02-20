import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thể Loại Phim",
  description:
    "Chọn thể loại phim: hành động, tình cảm, kinh dị, viễn tưởng, hài, anime... Xem phim theo thể loại tại Rồ Phim.",
  openGraph: {
    title: "Thể Loại Phim | Rồ Phim",
    description:
      "Chọn thể loại phim để xem. Hành động, tình cảm, kinh dị, anime... tại Rồ Phim.",
    url: "https://rophimm.org/the-loai",
  },
};

export default function TheLoaiLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
