'use client'

import Link from "next/link";
import ThreeScene from "@/components/home/ThreeScene";
import { LanguageProvider, useLanguage, translations } from "@/context/LanguageContext";

function HomeContent() {
  const { language, theme, mounted, toggleLanguage, toggleTheme } = useLanguage();
  const t = translations[language];

  // Prevent hydration mismatch - wait until mounted
  const displayTheme = mounted ? theme : 'dark';

  return (
    <main className={`h-screen ${displayTheme === 'dark' ? 'bg-[#000000] text-white' : 'bg-[#f8f8f8] text-gray-700'} overflow-hidden relative`}>
      {/* Three.js 3D Background */}
      <ThreeScene isDark={displayTheme === 'dark'} />

      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 ${displayTheme === 'dark' ? 'bg-black/50 border-cyan-500/20' : 'bg-white/50 border-gray-200'} backdrop-blur-md border-b`}>
        <div className="h-16 max-w-4xl mx-auto flex items-center justify-between px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className={`text-xl font-bold ${displayTheme === 'dark' ? 'text-white hover:text-cyan-400' : 'text-gray-900 hover:text-blue-600'} transition-colors`}>{t.title}</Link>
            <Link href="/articles" className={`${displayTheme === 'dark' ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-600 hover:text-blue-600'} transition-colors text-sm h-full flex items-center`}>{t.articles}</Link>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleLanguage} className={`px-3 py-1 rounded ${displayTheme === 'dark' ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'} transition-colors text-sm`}>
              {language === 'zh' ? 'EN' : '中'}
            </button>
            <button onClick={toggleTheme} className={`px-3 py-1 rounded ${displayTheme === 'dark' ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'} transition-colors text-sm`}>
              {displayTheme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center space-y-8 px-8 animate-fade-in">
          {/* Avatar */}
          <div className="relative w-32 h-32 mx-auto">
            <div className={`absolute inset-0 rounded-full ${displayTheme === 'dark' ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-gradient-to-r from-gray-300 to-gray-400'} animate-spin-slow`}></div>
            <div className="absolute inset-1 rounded-full overflow-hidden bg-black">
              <img
                src="/brand/logo.png"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Name & Intro */}
          <div>
            <h1 className={`text-3xl font-bold ${displayTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>{t.welcome}</h1>
            <p className={`${displayTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-base mb-4`}>{t.subtitle}</p>

            {/* 个人介绍 */}
            <div className={`max-w-lg mx-auto ${displayTheme === 'dark' ? 'text-gray-400 bg-black/30 border-cyan-500/10' : 'text-gray-500 bg-white/60 border-gray-200'} text-sm leading-relaxed backdrop-blur-sm rounded-xl p-5 border`}>
              <p>{t.intro}</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-fade-in { animation: fade-in 1s ease-out; }
      `}</style>
    </main>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <HomeContent />
    </LanguageProvider>
  );
}
