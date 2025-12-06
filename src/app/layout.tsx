import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Web3 DApp",
  description: "Modern Web3 DApp with Next.js, Supabase, and Tiptap",
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
