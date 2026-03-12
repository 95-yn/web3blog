'use client'

import { useLanguage } from '@/context/LanguageContext'

export default function ToolsPage() {
  const { language, theme, mounted } = useLanguage()
  const isDark = mounted ? theme === 'dark' : true

  const t = {
    zh: { title: '小工具集合', desc: '日常实用小工具' },
    en: { title: 'Tools Collection', desc: 'Useful daily tools' }
  }[language]

  const bg = isDark ? 'bg-[#000000]' : 'bg-[#f8f8f8]'
  const cardBg = isDark ? 'bg-black/30 border-cyan-500/10' : 'bg-white/60 border-gray-200'
  const textMain = isDark ? 'text-white' : 'text-gray-900'
  const textSub = isDark ? 'text-gray-400' : 'text-gray-600'

  return (
    <main className={`min-h-screen ${bg} py-24 px-12`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-3xl font-bold ${textMain} mb-4`}>{t.title}</h1>
        <p className={`text-sm ${textSub} mb-8`}>{t.desc}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 占位卡片 */}
          <div className={`p-6 rounded-xl border ${cardBg} backdrop-blur-sm`}>
            <h2 className={`text-lg font-medium ${textMain} mb-2`}>Coming Soon</h2>
            <p className={`text-sm ${textSub}`}>更多工具正在开发中...</p>
          </div>
        </div>
      </div>
    </main>
  )
}
