import type { Metadata } from "next";
import { Geist_Mono, Montserrat } from "next/font/google";
import { Header } from "@/components/layout";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ToastAndProgress } from "@/providers/toast-and-progress";
import { WatchHistoryProvider } from "@/store/watch-history";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rophimm.org"),
  title: {
    default: "Phim Hay | Rồ Phim | Xem Phim Online HD 4K Không Quảng Cáo",
    template: "%s | Rồ Phim",
  },
  description:
    "Rồ Phim - Trang xem phim hay, phim mới Vietsub chất lượng 4K/Full HD. Cập nhật nhanh nhất phim bộ, phim lẻ, phim chiếu rạp. Trải nghiệm xem phim mượt mà, không quảng cáo, hoàn toàn miễn phí.",
  keywords: [
    "phim hay",
    "xem phim online",
    "phim Vietsub",
    "phim 4K",
    "phim Full HD",
    "phim bộ",
    "phim lẻ",
    "phim chiếu rạp",
    "phim miễn phí",
    "Rồ Phim",
  ],
  authors: [{ name: "Rồ Phim" }],
  creator: "Rồ Phim",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://rophimm.org",
    siteName: "Rồ Phim",
    title: "Phim Hay | Rồ Phim | Xem Phim Online HD 4K Không Quảng Cáo",
    description:
      "Rồ Phim - Trang xem phim hay, phim mới Vietsub chất lượng 4K/Full HD. Cập nhật nhanh nhất phim bộ, phim lẻ, phim chiếu rạp. Trải nghiệm xem phim mượt mà, không quảng cáo, hoàn toàn miễn phí.",
    images: [{ url: "https://rophimm.org/logo.png", width: 512, height: 512, alt: "Rồ Phim" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Phim Hay | Rồ Phim | Xem Phim Online HD 4K Không Quảng Cáo",
    description:
      "Rồ Phim - Trang xem phim hay, phim mới Vietsub chất lượng 4K/Full HD. Cập nhật nhanh nhất phim bộ, phim lẻ, phim chiếu rạp.",
    images: ["https://rophimm.org/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://rophimm.org",
  },
};

const themeScript = `
(function() {
  var t = localStorage.getItem('theme');
  if (t !== 'dark' && t !== 'light') {
    t = 'dark';
    localStorage.setItem('theme', t);
  }
  document.documentElement.classList.add('theme-' + t);
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeScript }}
          suppressHydrationWarning
        />
      </head>
      <body className={`${geistMono.variable} ${montserrat.variable} antialiased min-h-screen`}>
        <QueryProvider>
          <ThemeProvider>
            <WatchHistoryProvider>
              <Header />
              <main>{children}</main>
              <ToastAndProgress />
            </WatchHistoryProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
