'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

export default function PublicHeader() {
  const { language, theme, mounted, toggleLanguage, toggleTheme } = useLanguage()
  const isDark = mounted ? theme === 'dark' : true

  const navBg = isDark ? 'bg-black/50' : 'bg-white/50'
  const textColor = isDark ? 'text-white' : 'text-gray-900'
  const hoverColor = isDark ? 'hover:text-cyan-400' : 'hover:text-blue-600'
  const borderColor = isDark ? 'border-cyan-500/20' : 'border-gray-200'
  const btnBg = isDark ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${navBg} backdrop-blur-md border-b ${borderColor}`}>
      <div className="h-16 max-w-4xl mx-auto flex items-center justify-between px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className={`text-xl font-bold ${textColor} ${hoverColor} transition-colors`}>
            {language === 'zh' ? '一一的空间' : "Yiyi's Space"}
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/articles" className={`text-sm ${textColor} ${hoverColor} transition-colors`}>
              {language === 'zh' ? '文章' : 'Articles'}
            </Link>
            <Link href="/tools" className={`text-sm ${textColor} ${hoverColor} transition-colors`}>
              {language === 'zh' ? '小工具' : 'Tools'}
            </Link>
            <Link href="/about" className={`text-sm ${textColor} ${hoverColor} transition-colors`}>
              {language === 'zh' ? '个人介绍' : 'About'}
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleLanguage} className={`px-3 py-1 rounded ${btnBg} transition-colors text-sm`}>
            {language === 'zh' ? 'EN' : '中'}
          </button>
          <button onClick={toggleTheme} className={`px-3 py-1 rounded ${btnBg} transition-colors text-sm`}>
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  )
}
