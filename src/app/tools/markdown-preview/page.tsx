'use client'

import { useLanguage } from '@/context/LanguageContext'
import BackLink from '@/components/BackLink'
import MarkdownLivePreview from '@/components/tools/MarkdownLivePreview'

export default function MarkdownPreviewPage() {
  const { language, theme, mounted } = useLanguage()
  const isDark = mounted ? theme === 'dark' : true

  const t = {
    zh: { title: 'Markdown 实时预览', back: '返回工具列表' },
    en: { title: 'Markdown Live Preview', back: 'Back to Tools' },
  }[language]

  const bg = isDark ? 'bg-[#000000]' : 'bg-[#f8f8f8]'
  const textMain = isDark ? 'text-white' : 'text-gray-900'
  const textSub = isDark ? 'text-gray-400' : 'text-gray-600'
  const hoverColor = isDark ? 'hover:text-cyan-400' : 'hover:text-blue-600'

  return (
    <main className={`min-h-screen ${bg} py-20 px-4 md:px-6`}>
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <BackLink href="/tools" />
          <h1 className={`text-xl font-semibold ${textMain}`}>{t.title}</h1>
          <div className="w-24" />
        </div>

        <MarkdownLivePreview isDark={isDark} />
      </div>
    </main>
  )
}
