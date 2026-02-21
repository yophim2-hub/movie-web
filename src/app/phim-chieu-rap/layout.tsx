import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phim Chiếu Rạp",
  description:
    "Trải nghiệm phim chiếu rạp mới nhất Vietsub HD. Xem ngay phim điện ảnh hot, phim bom tấn. Tận hưởng màn ảnh rộng miễn phí tại Rồ Phim.",
  alternates: {
    canonical: "https://rophimm.org/phim-chieu-rap",
  },
  openGraph: {
    title: "Phim Chiếu Rạp | Rồ Phim",
    description:
      "Trải nghiệm phim chiếu rạp mới nhất Vietsub HD. Xem ngay miễn phí tại Rồ Phim.",
    url: "https://rophimm.org/phim-chieu-rap",
  },
};

export default function PhimChieuRapLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
