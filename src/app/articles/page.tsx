"use client";

import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function ArticlesPage() {
  const { language, theme, mounted } = useLanguage();
  const isDark = mounted ? theme === "dark" : true;

  const t = {
    zh: { title: "文章", desc: "记录学习与思考的足迹" },
    en: { title: "Articles", desc: "Notes on learning and thinking" },
  }[language];

  const bg = isDark ? "bg-[#000000]" : "bg-[#f8f8f8]";
  const cardBg = isDark
    ? "bg-black/30 border-cyan-500/10"
    : "bg-white/60 border-gray-200";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const textSub = isDark ? "text-gray-400" : "text-gray-600";

  // 目前先使用手动维护的文章配置，id 对应站内路由 /articles/[id]
  const articles = [
    {
      id: "1",
      titleZh: "前端性能优化：思路、防御与监控选型",
      titleEn: "Frontend Performance Optimization: Strategy & Monitoring",
      descZh:
        "系统梳理前端性能优化思路、分片方案、防御机制与监控系统选型实践。",
      descEn:
        "A systematic overview of frontend performance optimization, task slicing, defense mechanisms, and monitoring options.",
      date: "2025-02-10",
      tags: ["前端", "性能优化"],
    },
    {
      id: "2",
      titleZh: "jQuery 基本用法入门",
      titleEn: "jQuery Basics ",
      descZh: "jQuery 的核心用法与常见场景",
      descEn: "jQuery core APIs and common use cases.",
      date: "2018-09-19",
      tags: ["jQuery", "基础"],
    },
  ];

  const tArticles = articles.map((a) => ({
    ...a,
    title: language === "zh" ? a.titleZh : a.titleEn,
    desc: language === "zh" ? a.descZh : a.descEn,
  }));

  return (
    <main className={`min-h-screen ${bg} py-20 px-4 md:px-8`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-3xl font-bold ${textMain} mb-2`}>{t.title}</h1>
        <p className={`text-sm ${textSub} mb-8`}>{t.desc}</p>

        <div className="space-y-4">
          {tArticles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className={`block rounded-xl border ${cardBg} backdrop-blur-sm px-6 py-5 transition hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/10`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className={`text-lg font-semibold mb-2 ${textMain}`}>
                    {article.title}
                  </h2>
                  <p className={`text-sm ${textSub}`}>{article.desc}</p>
                  {article.tags && article.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 text-[11px] text-cyan-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {(article.date ||
                  (article.tags && article.tags.length > 0)) && (
                  <div className="flex flex-col items-end gap-1 mt-1 whitespace-nowrap">
                    {article.date && (
                      <span className="text-xs text-cyan-400">
                        {article.date}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <p className="mt-3 text-xs text-cyan-400">
                {language === "zh"
                  ? "站内详情 · 点击阅读全文 →"
                  : "Internal article · Read more →"}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
