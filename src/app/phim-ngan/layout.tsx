import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phim Ngắn",
  description:
    "Xem phim ngắn hay nhất, phim ngắn Vietsub chất lượng HD. Cập nhật nhanh phim ngắn tình cảm, hài hước, kinh dị. Xem phim miễn phí tại Rồ Phim.",
  openGraph: {
    title: "Phim Ngắn | Rồ Phim",
    description:
      "Xem phim ngắn hay nhất, phim ngắn Vietsub chất lượng HD. Cập nhật nhanh tại Rồ Phim.",
    url: "https://rophimm.org/phim-ngan",
  },
};

export default function PhimNganLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
