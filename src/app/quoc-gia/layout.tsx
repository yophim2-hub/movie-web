import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phim Theo Quốc Gia",
  description:
    "Xem phim theo quốc gia: Hàn Quốc, Trung Quốc, Nhật Bản, Mỹ, Thái Lan, Việt Nam... Cập nhật nhanh tại Rồ Phim.",
  openGraph: {
    title: "Phim Theo Quốc Gia | Rồ Phim",
    description:
      "Xem phim theo quốc gia. Hàn, Trung, Nhật, Mỹ, Thái... tại Rồ Phim.",
    url: "https://rophimm.org/quoc-gia",
  },
};

export default function QuocGiaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
