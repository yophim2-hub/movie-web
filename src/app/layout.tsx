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
  metadataBase: new URL("https://bongphim.vn"),
  title: {
    default: "Phim Hay | Bỏng Phim | Xem Phim Online HD 4K Không Quảng Cáo",
    template: "%s | Bỏng Phim",
  },
  description:
    "Bỏng Phim - Trang xem phim hay, phim mới Vietsub chất lượng 4K/Full HD. Cập nhật nhanh nhất phim bộ, phim lẻ, phim chiếu rạp. Trải nghiệm xem phim mượt mà, không quảng cáo, hoàn toàn miễn phí.",
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
    "Bỏng Phim",
  ],
  authors: [{ name: "Bỏng Phim" }],
  creator: "Bỏng Phim",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://bongphim.vn",
    siteName: "Bỏng Phim",
    title: "Phim Hay | Bỏng Phim | Xem Phim Online HD 4K Không Quảng Cáo",
    description:
      "Bỏng Phim - Trang xem phim hay, phim mới Vietsub chất lượng 4K/Full HD. Cập nhật nhanh nhất phim bộ, phim lẻ, phim chiếu rạp. Trải nghiệm xem phim mượt mà, không quảng cáo, hoàn toàn miễn phí.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Phim Hay | Bỏng Phim | Xem Phim Online HD 4K Không Quảng Cáo",
    description:
      "Bỏng Phim - Trang xem phim hay, phim mới Vietsub chất lượng 4K/Full HD. Cập nhật nhanh nhất phim bộ, phim lẻ, phim chiếu rạp.",
  },
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://bongphim.vn",
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
