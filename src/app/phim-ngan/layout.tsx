import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phim Ngắn",
  description:
    "Thưởng thức phim ngắn hay nhất Vietsub HD. Khám phá phim ngắn tình cảm, hài hước, kinh dị. Xem ngay miễn phí tại Rồ Phim.",
  alternates: {
    canonical: "https://rophimm.org/phim-ngan",
  },
  openGraph: {
    title: "Phim Ngắn | Rồ Phim",
    description:
      "Thưởng thức phim ngắn hay nhất Vietsub HD. Xem ngay miễn phí tại Rồ Phim.",
    url: "https://rophimm.org/phim-ngan",
  },
};

export default function PhimNganLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
