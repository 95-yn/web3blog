import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

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
      <body className="antialiased">
        {children}
        <Toaster
          position="top-right"
          theme="dark"
          richColors
          closeButton
          className="web3-toast"
        />
      </body>
    </html>
  );
}
