'use client'

import { useLanguage } from '@/context/LanguageContext'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import MarkdownLivePreview from '@/components/tools/MarkdownLivePreview'

export default function MarkdownPreviewPage() {
  const { language, theme, mounted } = useLanguage()
  const isDark = mounted ? theme === 'dark' : true

  const t = {
    zh: { title: 'Markdown 实时预览', back: '返回小工具' },
    en: { title: 'Markdown Live Preview', back: 'Back to Tools' },
  }[language]

  const bg = isDark ? 'bg-[#000000]' : 'bg-[#f8f8f8]'
  const textMain = isDark ? 'text-white' : 'text-gray-900'
  const textSub = isDark ? 'text-gray-400' : 'text-gray-600'

  return (
    <main className={`min-h-screen ${bg} py-8 px-4 md:px-8`}>
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/tools"
            className={`inline-flex items-center gap-2 ${textSub} hover:opacity-80 transition-opacity`}
          >
            <ArrowLeft className="w-4 h-4" />
            {t.back}
          </Link>
          <h1 className={`text-xl font-semibold ${textMain}`}>{t.title}</h1>
          <div className="w-24" />
        </div>

        <MarkdownLivePreview isDark={isDark} />
      </div>
    </main>
  )
}
