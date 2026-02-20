import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phim Lẻ",
  description:
    "Xem phim lẻ mới nhất, phim lẻ hay Vietsub chất lượng HD. Cập nhật nhanh phim hành động, tình cảm, kinh dị, viễn tưởng. Xem phim miễn phí tại Rồ Phim.",
  openGraph: {
    title: "Phim Lẻ | Rồ Phim",
    description:
      "Xem phim lẻ mới nhất, phim lẻ hay Vietsub chất lượng HD. Cập nhật nhanh tại Rồ Phim.",
    url: "https://rophimm.org/phim-le",
  },
};

export default function PhimLeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
