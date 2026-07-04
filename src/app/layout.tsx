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
  title: "Lumora Skills — 发现、安装、分享高质量 Skills",
  description:
    "为 OpenClaw 与 Claude Code 而生的 Skills 注册目录。一行命令安装，即插即用，全部开源免费。",
  keywords: ["Lumora Skills", "OpenClaw", "Claude Code", "Skills", "AI", "正念", "工具", "目录"],
  authors: [{ name: "朝歌 @Sakurakilove" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Lumora Skills — 发现、安装、分享高质量 Skills",
    description: "为 OpenClaw 与 Claude Code 而生的 Skills 注册目录",
    siteName: "Lumora Skills",
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
        <link rel="preconnect" href="https://fonts.loli.net" />
        <link
          rel="preconnect"
          href="https://gstatic.loli.net"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.loli.net/css2?family=Instrument+Serif:ital@0;1&family=Noto+Serif+SC:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ fontFamily: "'Instrument Serif', 'Noto Serif SC', serif" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
