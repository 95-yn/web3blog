'use client'

import ThreeScene from "@/components/home/ThreeScene";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { language, theme, mounted } = useLanguage();
  const t = {
    zh: { title: "一一的空间", welcome: "欢迎来到一一的空间", subtitle: "记录学习与思考的足迹", intro: "全栈开发者，热衷于探索新技术。熟悉 React、Vue、Node、Web3 等技术，专注前端工程化与性能优化，对 AI Agent 开发保持持续学习与实践。" },
    en: { title: "Yiyi's Space", welcome: "Welcome to Yiyi's Space", subtitle: "Notes on Learning and Thinking", intro: "Full-stack developer passionate about exploring new technologies. Experienced with React, Vue, Node, and Web3, focused on frontend engineering and performance optimization." }
  }[language];

  const displayTheme = mounted ? theme : 'dark';

  return (
    <main className="h-screen overflow-hidden relative">
      <ThreeScene isDark={displayTheme === 'dark'} />

      <div className={`relative h-full flex items-center justify-center ${displayTheme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
        <div className="text-center space-y-8 px-8 animate-fade-in">
          <div className="relative w-32 h-32 mx-auto">
            <div className={`absolute inset-0 rounded-full ${displayTheme === 'dark' ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-gradient-to-r from-gray-300 to-gray-400'} animate-spin-slow`}></div>
            <div className="absolute inset-1 rounded-full overflow-hidden bg-black">
              <img src="/brand/logo.png" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>

          <div>
            <h1 className={`text-3xl font-bold ${displayTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>{t.welcome}</h1>
            <p className={`${displayTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-base mb-4`}>{t.subtitle}</p>
            <div className={`max-w-lg mx-auto ${displayTheme === 'dark' ? 'text-gray-400 bg-black/30 border-cyan-500/10' : 'text-gray-500 bg-white/60 border-gray-200'} text-sm leading-relaxed backdrop-blur-sm rounded-xl p-5 border`}>
              <p>{t.intro}</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fade-in { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-fade-in { animation: fade-in 1s ease-out; }
      `}</style>
    </main>
  );
}
