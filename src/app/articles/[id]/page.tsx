"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useLanguage } from "@/context/LanguageContext";
import articlesData from "@/data/articles.json";

// 从 JSON 读取文章 slug 到文件名的映射（顶层常量，避免 useEffect 依赖告警）
const idToFileMap: Record<string, string> = articlesData.articles.reduce(
  (acc: Record<string, string>, article: any) => {
    acc[article.id] = article.slug + ".md";
    return acc;
  },
  {},
);

export default function MdArticlePage() {
  const params = useParams();
  const id = params.id as string;
  const { language, theme, mounted } = useLanguage();
  const isDark = mounted ? theme === "dark" : true;

  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fileName = idToFileMap[id];

    if (!fileName) {
      setError("文章不存在或尚未准备好。");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // 直接从 public/articles 目录通过 HTTP 读取 markdown
        const res = await fetch(`/articles/${fileName}`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        let md = await res.text();

        // 去掉开头的 meta 注释（例如 <!-- meta: ... -->）
        if (md.startsWith("<!--")) {
          const endIndex = md.indexOf("-->");
          if (endIndex !== -1) {
            md = md.slice(endIndex + 3).trimStart();
          }
        }

        // 使用 marked 转成 HTML，并启用 gfm / 自动换行
        let parsed = (await marked.parse(md || "")) as string;

        // 统一处理所有链接：没有 target 的 <a> 自动补上 target/_blank 和 rel
        parsed = parsed.replace(
          /<a\s+([^>]*href="[^"]+"[^>]*)>/g,
          (match, attrs) => {
            if (/target=/.test(attrs)) return match;
            return `<a ${attrs} target="_blank" rel="noopener noreferrer">`;
          },
        );

        // DOMPurify 默认可能会去掉 target，这里显式允许
        const safe = DOMPurify.sanitize(parsed, {
          ADD_ATTR: ["target", "rel"],
        });
        setHtml(safe);
      } catch (err) {
        console.error("加载文章失败:", err);
        setError("文章不存在或尚未准备好。");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <main
        className={`min-h-screen flex items-center justify-center ${isDark ? "bg-gradient-to-br from-black via-[#020308] to-black" : "bg-[#f8f8f8]"}`}
      >
        <div className={isDark ? "text-gray-300" : "text-gray-600"}>
          文章加载中...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main
        className={`min-h-screen flex items-center justify-center ${isDark ? "bg-gradient-to-br from-black via-[#020308] to-black" : "bg-[#f8f8f8]"}`}
      >
        <div className={isDark ? "text-gray-400" : "text-gray-500"}>
          {error}
        </div>
      </main>
    );
  }

  const textSub = isDark ? "text-gray-400" : "text-gray-600";
  const hoverColor = isDark ? "hover:text-cyan-400" : "hover:text-blue-600";
  const articleBg = isDark
    ? "bg-black/40 border border-gray-800"
    : "bg-white border border-gray-200";

  return (
    <main
      className={`min-h-screen py-20 px-4 md:px-6 ${isDark ? "bg-gradient-to-br from-black via-[#020308] to-black" : "bg-[#f8f8f8]"}`}
    >
      <div className="max-w-4xl mx-auto">
        <Link
          href="/articles"
          className={`inline-flex items-center gap-1 mb-4 text-sm ${textSub} ${hoverColor}`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {language === "zh" ? "返回文章列表" : "Back to Articles"}
        </Link>
        <article
          className={`${articleBg} rounded-2xl shadow-xl pt-0 px-6 md:px-10 pb-10 backdrop-blur`}
        >
          <div
            className={`prose ${isDark ? "prose-invert" : ""} prose-lg max-w-none article-content`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>
      </div>
    </main>
  );
}
