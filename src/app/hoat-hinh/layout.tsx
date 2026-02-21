import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hoạt Hình",
  description:
    "Khám phá thế giới hoạt hình, anime mới nhất Vietsub. Xem ngay anime Nhật, hoạt hình trẻ em chất lượng HD. Trải nghiệm miễn phí tại Rồ Phim.",
  alternates: {
    canonical: "https://rophimm.org/hoat-hinh",
  },
  openGraph: {
    title: "Hoạt Hình | Rồ Phim",
    description:
      "Khám phá hoạt hình, anime mới nhất Vietsub. Xem ngay miễn phí tại Rồ Phim.",
    url: "https://rophimm.org/hoat-hinh",
  },
};

export default function HoatHinhLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
