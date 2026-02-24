import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bảo Trì Hệ Thống",
  description:
    "Rồ Phim đang bảo trì hệ thống để nâng cấp trải nghiệm. Vui lòng quay lại sau.",
  robots: { index: false, follow: false },
};

export default function BaoTriLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Ẩn header/footer của root layout khi vào trang bảo trì */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            body > div > header, body > div > footer,
            body > header, body > footer,
            nav, footer { display: none !important; }
            main { padding: 0 !important; margin: 0 !important; }
          `,
        }}
      />
      {children}
    </>
  );
}
