"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { marked } from "marked";
import DOMPurify from "dompurify";

export default function MdArticlePage() {
  const params = useParams();
  const id = params.id as string;
  const { language, theme, mounted } = useLanguage()
  const isDark = mounted ? theme === 'dark' : true

  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 路由使用数字 id 表示文章，例如 /articles/1
  // 在代码中将 id 映射到具体的 markdown 静态文件（位于 public/articles 下）
  const idToFileMap: Record<string, string> = {
    "1": "frontend-performance-optimization.md",
    "2": "jquery-basics.md",
  };

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

        const parsed = marked.parse(md || "");
        const safe = DOMPurify.sanitize(parsed);
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
      <main className="min-h-screen bg-gradient-to-br from-black via-[#020308] to-black flex items-center justify-center">
        <div className="text-gray-300 text-sm">文章加载中...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-black via-[#020308] to-black flex items-center justify-center">
        <div className="text-gray-400 text-sm">{error}</div>
      </main>
    );
  }

  const textSub = isDark ? 'text-gray-400' : 'text-gray-600'
  const hoverColor = isDark ? 'hover:text-cyan-400' : 'hover:text-blue-600'

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#020308] to-black py-10 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <a href="/articles" className={`inline-flex items-center gap-1 text-sm ${textSub} ${hoverColor} mb-4`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {language === 'zh' ? '返回文章列表' : 'Back to Articles'}
        </a>
        <article className="bg-black/40 border border-gray-800 rounded-2xl shadow-xl p-6 md:p-10 backdrop-blur">
          <div
            className="prose prose-invert prose-lg max-w-none article-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>
      </div>
    </main>
  );
}

