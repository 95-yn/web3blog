'use client'

import ThreeScene from "@/components/home/ThreeScene";
import BlurText from "@/components/reactbits/BlurText";
import ShinyText from "@/components/reactbits/ShinyText";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { language, theme, mounted } = useLanguage();
  const t = {
    zh: { title: "一一的空间", welcome: "欢迎来到一一的空间", subtitle: "记录学习与思考的足迹", intro: "白天调性能、拆架构，晚上跟 AI 对线。一个被代码耽误的自驾爱好者，自驾过 200+ 城市，debug 过更多的 bug。" },
    en: { title: "Yiyi's Space", welcome: "Welcome to Yiyi's Space", subtitle: "Notes on Learning and Thinking", intro: "Tuning performance by day, arguing with AI by night. A road-trip lover disguised as a developer — 200+ cities driven, mass bugs debugged." }
  }[language];

  const displayTheme = mounted ? theme : 'dark';
  const isDark = displayTheme === 'dark';

  return (
    <main className={`h-screen ${isDark ? 'bg-[#000000] text-white' : 'bg-[#f8f8f8] text-gray-700'} overflow-hidden relative`}>
      <ThreeScene isDark={isDark} />

      <div className="relative h-full flex items-center justify-center px-4">
        <div className="text-center space-y-4 md:space-y-6 px-2 md:px-8">
          <div className="relative w-24 md:w-32 h-24 md:h-32 mx-auto animate-fade-in">
            <div className={`absolute inset-0 rounded-full ${isDark ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-gradient-to-r from-gray-300 to-gray-400'} animate-spin-slow`}></div>
            <div className="absolute inset-1 rounded-full overflow-hidden bg-black">
              <img src="/brand/logo.png" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>

          <div>
            <BlurText
              text={t.welcome}
              className={`text-2xl md:text-3xl font-bold justify-center mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
              delay={80}
              animateBy="words"
              direction="top"
              stepDuration={0.4}
            />

            <div className="mb-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <ShinyText
                text={t.subtitle}
                className="text-sm md:text-base"
                color={isDark ? '#9ca3af' : '#6b7280'}
                shineColor={isDark ? '#22d3ee' : '#3b82f6'}
                speed={3}
              />
            </div>

            <div className="relative max-w-lg mx-auto animate-fade-in group/card" style={{ animationDelay: '0.8s' }}>
              <div className={`absolute -inset-[1px] rounded-xl overflow-hidden ${isDark ? 'opacity-50' : 'opacity-30'}`}>
                <div className="absolute inset-[-50%] animate-border-spin" style={{
                  background: isDark
                    ? 'conic-gradient(from 0deg, transparent 0%, #22d3ee 10%, transparent 20%, transparent 50%, #3b82f6 60%, transparent 70%)'
                    : 'conic-gradient(from 0deg, transparent 0%, #3b82f6 10%, transparent 20%, transparent 50%, #8b5cf6 60%, transparent 70%)',
                }} />
              </div>
              <div className={`relative ${isDark ? 'text-gray-400 bg-black/60' : 'text-gray-500 bg-white/80'} text-xs md:text-sm leading-relaxed backdrop-blur-sm rounded-xl p-4 md:p-5`}>
                <p>{t.intro}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes border-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-fade-in { animation: fade-in 0.8s ease-out both; }
        .animate-border-spin { animation: border-spin 8s linear infinite; }
      `}</style>
    </main>
  );
}
