"use client";

import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import articlesData from "@/data/articles.json";
import BlurText from "@/components/reactbits/BlurText";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import SpotlightCard from "@/components/reactbits/SpotlightCard";

export default function ArticlesPage() {
  const { language, theme, mounted } = useLanguage();
  const isDark = mounted ? theme === "dark" : true;

  const t = {
    zh: { title: "文章", desc: "记录学习与思考的足迹" },
    en: { title: "Articles", desc: "Notes on learning and thinking" },
  }[language];

  const textMain = isDark ? "text-white" : "text-gray-900";
  const textSub = isDark ? "text-gray-400" : "text-gray-600";
  const tagBg = isDark
    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
    : "bg-blue-500/10 border-blue-500/30 text-blue-600";
  const linkText = isDark ? "text-cyan-400" : "text-blue-600";

  const tArticles = articlesData.articles
    .map((a: any) => ({
      ...a,
      title: language === "zh" ? a.title.zh : a.title.en,
      desc: language === "zh" ? a.description.zh : a.description.en,
    }))
    .sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

  const accentColors = isDark
    ? ['border-l-cyan-500', 'border-l-blue-500', 'border-l-purple-500', 'border-l-emerald-500', 'border-l-amber-500']
    : ['border-l-blue-500', 'border-l-violet-500', 'border-l-pink-500', 'border-l-emerald-500', 'border-l-amber-500'];

  return (
    <main className={`min-h-screen ${isDark ? 'bg-[#000000]' : 'bg-[#f8f8f8]'} py-20 px-4 md:px-6`}>
      <div className="max-w-4xl mx-auto">
        <BlurText
          text={t.title}
          className={`text-3xl font-bold mb-2 ${textMain}`}
          delay={100}
          animateBy="letters"
          direction="top"
          stepDuration={0.3}
        />
        <AnimatedContent distance={15} duration={0.4} delay={0.2}>
          <p className={`text-sm ${textSub} mb-8`}>{t.desc}</p>
        </AnimatedContent>

        <div className="space-y-4">
          {tArticles.map((article: any, index: number) => (
            <AnimatedContent
              key={article.id}
              distance={25}
              duration={0.4}
              delay={Math.min(index * 0.03, 0.15)}
              threshold={0.05}
            >
              <SpotlightCard
                className={`rounded-xl border-l-[3px] ${accentColors[index % accentColors.length]} ${isDark ? 'bg-gradient-to-br from-gray-900/80 to-black/60 border border-cyan-500/10 hover:border-cyan-500/30 shadow-lg shadow-cyan-500/5 hover:shadow-cyan-500/15' : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10'} transition-all duration-300 hover:translate-x-1`}
                spotlightColor={isDark ? 'rgba(0, 212, 255, 0.1)' : 'rgba(59, 130, 246, 0.06)'}
              >
                <Link
                  href={`/articles/${article.id}`}
                  className="block px-6 py-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h2 className={`text-lg font-semibold mb-2 ${textMain}`}>
                        {article.title}
                      </h2>
                      <p className={`text-sm ${textSub}`}>{article.desc}</p>
                      {article.tags && article.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {article.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] ${tagBg}`}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {article.date && (
                      <div className="flex flex-col items-end gap-1 mt-1 whitespace-nowrap">
                        <span className={`text-xs ${linkText}`}>
                          {article.date}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className={`mt-3 text-xs ${linkText}`}>
                    {language === "zh"
                      ? "站内详情 · 点击阅读全文 →"
                      : "Internal article · Read more →"}
                  </p>
                </Link>
              </SpotlightCard>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </main>
  );
}
