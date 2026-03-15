import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "@/components/layout/AppLayout";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: "一一的空间 - 一一的博客 | 全栈开发者个人博客",
    template: "%s | 一一的空间",
  },
  description: "一一的个人博客，全栈开发者。记录学习与思考的足迹，分享React、Vue、Node、Web3等技术文章。个人博客网站，一一的空间。",
  keywords: ["一一的空间", "一一的博客", "一一", "博客", "个人博客", "全栈开发者", "React", "Vue", "Node.js", "Web3", "前端开发"],
  authors: [{ name: "一一" }],
  creator: "一一",
  metadataBase: new URL("https://www.yyyyn.cn"),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://www.yyyyn.cn",
    siteName: "一一的空间",
    title: "一一的空间 - 一一的博客 | 全栈开发者个人博客",
    description: "一一的个人博客，全栈开发者。记录学习与思考的足迹，分享React、Vue、Node、Web3等技术文章。",
    images: [
      {
        url: "/brand/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "一一的空间",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "一一的空间 - 一一的博客",
    description: "全栈开发者个人博客，记录学习与思考的足迹",
    images: ["/brand/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "一一",
              "url": "https://www.yyyyn.cn",
              "description": "全栈开发者个人博客，记录学习与思考的足迹",
              "sameAs": [
                "https://github.com/你的GitHub用户名",
                "https://juejin.cn/user/你的掘金ID"
              ],
              "jobTitle": "全栈开发者",
              "knowsAbout": ["React", "Vue", "Node.js", "Web3", "前端工程化"]
            })
          }}
        />
      </head>
      <body className="antialiased">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
