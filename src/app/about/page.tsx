'use client'

import { useLanguage } from '@/context/LanguageContext'

export default function AboutPage() {
  const { language, theme, mounted } = useLanguage()
  const isDark = mounted ? theme === 'dark' : true

  const t = {
    zh: { 
      title: '个人介绍', 
      name: '一一',
      role: '全栈开发者',
      intro: '全栈开发者，热衷于探索新技术。熟悉 React、Vue、Node、Web3 等技术，专注前端工程化与性能优化，对 AI Agent 开发保持持续学习与实践。',
      contact: '联系方式'
    },
    en: { 
      title: 'About', 
      name: 'Yiyi',
      role: 'Full-stack Developer',
      intro: 'Full-stack developer passionate about exploring new technologies. Experienced with React, Vue, Node, and Web3, focused on frontend engineering and performance optimization, and continuously learning AI Agent development.',
      contact: 'Contact'
    }
  }[language]

  const bg = isDark ? 'bg-[#000000]' : 'bg-[#f8f8f8]'
  const cardBg = isDark ? 'bg-black/30 border-cyan-500/10' : 'bg-white/60 border-gray-200'
  const textMain = isDark ? 'text-white' : 'text-gray-900'
  const textSub = isDark ? 'text-gray-400' : 'text-gray-600'

  return (
    <main className={`min-h-screen ${bg} py-20 px-8`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-3xl font-bold ${textMain} mb-8`}>{t.title}</h1>
        
        <div className={`p-6 rounded-xl border ${cardBg} backdrop-blur-sm mb-6`}>
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-cyan-400 to-blue-500">
              <img src="/brand/logo.png" alt={t.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${textMain}`}>{t.name}</h2>
              <p className={`${textSub}`}>{t.role}</p>
            </div>
          </div>
          
          <p className={`leading-relaxed ${textSub}`}>{t.intro}</p>
        </div>

        <div className={`p-6 rounded-xl border ${cardBg} backdrop-blur-sm`}>
          <h3 className={`text-lg font-medium ${textMain} mb-4`}>{t.contact}</h3>
          <p className={`text-sm ${textSub}`}>Coming soon...</p>
        </div>
      </div>
    </main>
  )
}
