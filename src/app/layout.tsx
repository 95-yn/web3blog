import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "@/components/layout/AppLayout";
import Script from "next/script";

export const metadata: Metadata = {
  title: "一一的个人小站",
  description: "一一的个人小站：文章、随笔与记录",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <Script
          defer
          data-domain="yyyyn.cn"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="antialiased">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
