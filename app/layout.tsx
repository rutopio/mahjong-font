import { Geist, Geist_Mono } from "next/font/google";

import type { Metadata } from "next";

import "./globals.css";

import { Toaster } from "sonner";

import { I18nProvider } from "@/components/i18n-provider";

import { Footer } from "./components/footer";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "麻雀牌図作成ツール | Mahjong Tile Generator",
  description: "麻雀牌図作成ツール | Mahjong Tile Generator",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className={`font-notosans antialiased ${geistSans.variable} ${geistMono.variable}`}
      >
        <I18nProvider>
          {children}
          <Footer />
          <Toaster
            expand={false}
            richColors
            closeButton
            position="top-center"
          />
        </I18nProvider>
        <GoogleAnalytics gaId="G-8GTTB3S2GB" />
      </body>
    </html>
  );
}
