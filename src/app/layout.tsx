import type { Metadata } from "next";
import { Geist_Mono, Montserrat } from "next/font/google";
import { Header, Footer } from "@/components/layout";
import { JsonLd } from "@/components/seo";
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
    "Khám phá kho phim khổng lồ tại Rồ Phim. Xem ngay phim mới Vietsub 4K/Full HD miễn phí. Thưởng thức phim bộ, phim lẻ, phim chiếu rạp không quảng cáo. Cập nhật hàng ngày!",
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
      "Khám phá kho phim khổng lồ tại Rồ Phim. Xem ngay phim mới Vietsub 4K/Full HD miễn phí, không quảng cáo.",
    images: [{ url: "https://rophimm.org/logo.png", width: 512, height: 512, alt: "Rồ Phim" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Phim Hay | Rồ Phim | Xem Phim Online HD 4K Không Quảng Cáo",
    description:
      "Khám phá kho phim khổng lồ tại Rồ Phim. Xem ngay phim mới Vietsub 4K/Full HD miễn phí, không quảng cáo.",
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
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": "https://rophimm.org/#website",
                url: "https://rophimm.org",
                name: "Rồ Phim",
                description:
                  "Khám phá kho phim khổng lồ tại Rồ Phim. Xem ngay phim mới Vietsub 4K/Full HD miễn phí.",
                inLanguage: "vi",
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate:
                      "https://rophimm.org/tim-kiem?keyword={search_term_string}",
                  },
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@type": "Organization",
                "@id": "https://rophimm.org/#organization",
                name: "Rồ Phim",
                url: "https://rophimm.org",
                logo: {
                  "@type": "ImageObject",
                  url: "https://rophimm.org/logo.png",
                  width: 512,
                  height: 512,
                },
              },
            ],
          }}
        />
      </head>
      <body className={`${geistMono.variable} ${montserrat.variable} antialiased min-h-screen`}>
        <QueryProvider>
          <ThemeProvider>
            <WatchHistoryProvider>
              <Header />
              <main>{children}</main>
              <Footer />
              <ToastAndProgress />
            </WatchHistoryProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
