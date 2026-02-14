import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thể Loại Phim",
  description:
    "Chọn thể loại phim: hành động, tình cảm, kinh dị, viễn tưởng, hài, anime... Xem phim theo thể loại tại Bỏng Phim.",
  openGraph: {
    title: "Thể Loại Phim | Bỏng Phim",
    description:
      "Chọn thể loại phim để xem. Hành động, tình cảm, kinh dị, anime... tại Bỏng Phim.",
    url: "https://bongphim.vn/the-loai",
  },
};

export default function TheLoaiLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
