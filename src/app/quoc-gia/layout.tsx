import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phim Theo Quốc Gia",
  description:
    "Xem phim theo quốc gia: Hàn Quốc, Trung Quốc, Nhật Bản, Mỹ, Thái Lan, Việt Nam... Cập nhật nhanh tại Bỏng Phim.",
  openGraph: {
    title: "Phim Theo Quốc Gia | Bỏng Phim",
    description:
      "Xem phim theo quốc gia. Hàn, Trung, Nhật, Mỹ, Thái... tại Bỏng Phim.",
    url: "https://bongphim.vn/quoc-gia",
  },
};

export default function QuocGiaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
