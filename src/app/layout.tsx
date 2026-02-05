import { Geist_Mono } from "next/font/google";

import type { Metadata, Viewport } from "next";

import "@/app/globals.css";

import { Toaster } from "sonner";
import { GoogleAnalytics } from "@next/third-parties/google";

import { I18nProvider } from "@/provider/i18n-provider";

import { Footer } from "@/app/sections/footer";
import { Navbar } from "@/app/sections/navbar";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://rutopio.github.io/Japanese-Mahjong-Font-with-OpenType"
  ),
  title: "麻雀牌図作成ツール | Mahjong Tile Image Generator",
  description:
    "Create beautiful mahjong tile images with customizable notation. Supports monochrome and colorful themes.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "麻雀牌図作成ツール | Mahjong Tile Image Generator",
    description:
      "Create beautiful mahjong tile images with customizable notation. Supports monochrome and colorful themes.",
    type: "website",
    locale: "ja_JP",
    siteName: "Mahjong Tile Image Generator",
    images: [
      {
        url: "/og-image.png",
        width: 1568,
        height: 803,
        alt: "Mahjong Tile Image Generator - OpenType 機能付き麻雀牌図フォント",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "麻雀牌図作成ツール | Mahjong Tile Image Generator",
    description:
      "Create beautiful mahjong tile images with customizable notation.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`h-full font-sans antialiased ${geistMono.variable}`}>
        <I18nProvider>
          <div className="flex h-dvh flex-col">
            <Navbar />
            <main className="container flex min-h-0 flex-1 bg-background">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster
            expand={false}
            // richColors
            closeButton
            position="top-center"
          />
        </I18nProvider>
        <GoogleAnalytics gaId="G-8GTTB3S2GB" />
      </body>
    </html>
  );
}
