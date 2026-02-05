import { Geist_Mono } from "next/font/google";

import type { Metadata } from "next";

import "./globals.css";

import { Toaster } from "sonner";

import { I18nProvider } from "@/provider/i18n-provider";

import { Footer } from "./sections/footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Navbar } from "./sections/navbar";

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
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
    },
    twitter: {
        card: "summary",
        title: "麻雀牌図作成ツール | Mahjong Tile Image Generator",
        description:
            "Create beautiful mahjong tile images with customizable notation.",
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
                className={`h-full font-notosans antialiased ${geistMono.variable}`}
            >
                <I18nProvider>
                    <div className="flex flex-col min-h-dvh">
                        <Navbar />
                        <main className="flex-1 flex bg-background">{children}</main>
                        <Footer />
                    </div>
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
