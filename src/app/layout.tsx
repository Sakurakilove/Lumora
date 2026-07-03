import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lumora — 在无尽喧嚣中寻得清明",
  description:
    "超越提示音、无尽刷屏与无休止需求的混乱。发现如何守护你的当下，带着意图去创造。",
  keywords: ["Lumora", "正念", "专注", "冥想", "清明", "mindfulness", "focus"],
  authors: [{ name: "Lumora" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Lumora — 在无尽喧嚣中寻得清明",
    description: "守护你的当下，带着意图去创造。",
    siteName: "Lumora",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
