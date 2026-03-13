"use client";

import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function AboutPage() {
  const { language, theme, mounted } = useLanguage();
  const isDark = mounted ? theme === "dark" : true;

  const t = {
    zh: {
      title: "个人介绍",
      name: "一一",
      role: "全栈开发者",
      intro:
        "全栈开发者，热衷于探索新技术。熟悉 React、Vue、Node、Web3 等技术，专注前端工程化与性能优化，AI Agent工具开发学习中~",
      contact: "联系方式",
      phone: "电话",
      wechat: "微信",
      email: "邮箱",
      hobbies: "爱好",
    },
    en: {
      title: "About",
      name: "Yiyi",
      role: "Full-stack Developer",
      intro:
        "Full-stack developer passionate about exploring new technologies. Experienced with React, Vue, Node, and Web3, focused on frontend engineering and performance optimization, learning AI Agent tool development~",
      contact: "Contact",
      phone: "Phone",
      wechat: "WeChat",
      email: "Email",
      hobbies: "Hobbies",
    },
  }[language];

  const bg = isDark ? "bg-[#000000]" : "bg-[#f8f8f8]";
  const cardBg = isDark 
    ? "bg-gradient-to-br from-gray-900/80 to-black/60 border border-cyan-500/20 hover:border-cyan-500/50" 
    : "bg-white border border-gray-200 hover:border-blue-400";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const textSub = isDark ? "text-gray-400" : "text-gray-600";

  return (
    <main className={`min-h-screen ${bg} py-20 px-4 md:px-6`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-3xl font-bold ${textMain} mb-8`}>{t.title}</h1>

        <div
          className={`p-6 rounded-xl border ${cardBg} backdrop-blur-sm mb-6`}
        >
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-cyan-400 to-blue-500">
              <img
                src="/brand/logo.png"
                alt={t.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${textMain}`}>{t.name}</h2>
              <p className={textSub}>{t.role}</p>
            </div>
          </div>

          <p className={`leading-relaxed ${textSub}`}>{t.intro}</p>
        </div>

        <div className={`p-6 rounded-xl border ${cardBg} backdrop-blur-sm`}>
          <h3 className={`text-lg font-medium ${textMain} mb-4`}>
            {t.contact}
          </h3>
          <div className="space-y-4">
            {/* Phone */}
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${isDark ? "bg-cyan-500/10" : "bg-blue-500/10"}`}
              >
                <svg
                  className={`w-5 h-5 ${isDark ? "text-cyan-400" : "text-blue-500"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <p className={`text-xs ${textSub}`}>{t.phone}</p>
                <p className={`${textMain}`}>19186879540</p>
              </div>
            </div>

            {/* WeChat */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div>
                <p className={`text-xs ${textSub}`}>{t.wechat}</p>
                <div className="flex items-center gap-2">
                  <p className={`${textMain}`}>19186879540</p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${isDark ? "bg-cyan-500/10" : "bg-blue-500/10"}`}
              >
                <svg
                  className={`w-5 h-5 ${isDark ? "text-cyan-400" : "text-blue-500"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className={`text-xs ${textSub}`}>{t.email}</p>
                <p className={`${textMain}`}>95.yyyyn@gmail.com</p>
              </div>
            </div>
          </div>

          {/* 爱好 */}
          <div className="mt-6">
            <h3 className={`text-lg font-medium ${textMain} mb-3`}>{t.hobbies}</h3>
            <div className="flex flex-wrap gap-3">
              {/* 自驾游 - 可点击 */}
              <Link 
                href="/photos"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm cursor-pointer transition-all hover:scale-105 ${isDark ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20' : 'bg-blue-500/10 border border-blue-500/30 text-blue-600 hover:bg-blue-500/20'}`}
              >
                <span className="text-base">🚗</span>
                <span>{language === 'zh' ? '自驾游 - 31省/200+城市' : 'Road Trip - 31 provinces'}</span>
                <span className="opacity-70">📸</span>
              </Link>
              
              {/* 打游戏 */}
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${isDark ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300' : 'bg-blue-500/10 border border-blue-500/30 text-blue-600'}`}>
                <span className="text-base">🎮</span>
                <span>{language === 'zh' ? '打游戏 - 王者荣耀/金铲铲/炉石/LOL' : 'Gaming - Honor of Kings/Spill/Stove/LOL'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
