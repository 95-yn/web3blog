'use client'

import { useLanguage } from '@/context/LanguageContext'

export default function ArticlesPage() {
  const { language, theme, mounted } = useLanguage()
  const isDark = mounted ? theme === 'dark' : true

  const t = {
    zh: { title: '技术文章', desc: '记录学习与思考的足迹' },
    en: { title: 'Articles', desc: 'Notes on learning and thinking' }
  }[language]

  return (
    <main className={`min-h-screen ${isDark ? 'bg-[#000000] text-white' : 'bg-[#f8f8f8] text-gray-700'}`}>
      <div className="max-w-4xl mx-auto px-8 py-16">
        <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-8`}>{t.desc}</p>
        
        <div className={`p-8 ${isDark ? 'bg-black/30 border-cyan-500/10' : 'bg-white/60 border-gray-200'} border rounded-xl text-center`}>
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            {language === 'zh' ? '文章内容即将上线...' : 'Articles coming soon...'}
          </p>
        </div>
      </div>
    </main>
  )
}
