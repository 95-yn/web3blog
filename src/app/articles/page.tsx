'use client'

import { useLanguage } from '@/context/LanguageContext'

export default function ArticlesPage() {
  const { language, theme, mounted } = useLanguage()
  const isDark = mounted ? theme === 'dark' : true

  const t = {
    zh: { title: '文章', desc: '记录学习与思考的足迹' },
    en: { title: 'Articles', desc: 'Notes on learning and thinking' }
  }[language]

  const bg = isDark ? 'bg-[#000000]' : 'bg-[#f8f8f8]'
  const cardBg = isDark ? 'bg-black/30 border-cyan-500/10' : 'bg-white/60 border-gray-200'
  const textMain = isDark ? 'text-white' : 'text-gray-900'
  const textSub = isDark ? 'text-gray-400' : 'text-gray-600'

  return (
    <main className={`min-h-screen ${bg} py-24 px-12`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-3xl font-bold ${textMain} mb-2`}>{t.title}</h1>
        <p className={`text-sm ${textSub} mb-8`}>{t.desc}</p>
        
        <div className={`p-8 rounded-xl border ${cardBg} backdrop-blur-sm text-center`}>
          <p className={textSub}>
            {language === 'zh' ? '文章内容即将上线...' : 'Articles coming soon...'}
          </p>
        </div>
      </div>
    </main>
  )
}
