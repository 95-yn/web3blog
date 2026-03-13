'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { useEffect, useState } from 'react'

interface Tool {
  zh: { name: string; desc: string };
  en: { name: string; desc: string };
  href: string;
}

export default function ToolsPage() {
  const { language, theme, mounted } = useLanguage()
  const isDark = mounted ? theme === 'dark' : true
  const [isClient, setIsClient] = useState(false)

  // 防止 hydration 不匹配，同时保持客户端状态
  useEffect(() => {
    setIsClient(true)
  }, [])

  const t = {
    zh: { title: '小工具集合', desc: '日常实用小工具' },
    en: { title: 'Tools Collection', desc: 'Useful daily tools' }
  }[language]

  const tools: Tool[] = [
    {
      zh: { name: '屏幕分辨率检测', desc: '实时显示您的屏幕分辨率信息' },
      en: { name: 'Screen Resolution', desc: 'Display your screen resolution in real-time' },
      href: '/tools/resolution'
    },
    {
      zh: { name: 'JSON 格式化工具', desc: '在线 JSON 格式化、压缩、验证' },
      en: { name: 'JSON Formatter', desc: 'Format, minify and validate JSON online' },
      href: '/tools/json-format'
    },
    {
      zh: { name: '图片裁剪工具', desc: '上传图片并裁剪所需区域' },
      en: { name: 'Image Cropper', desc: 'Upload and crop your image' },
      href: '/tools/image-crop'
    }
  ]

  const bg = isDark ? 'bg-[#000000]' : 'bg-[#f8f8f8]'
  const cardBg = isDark ? 'bg-black/30 border-cyan-500/10 hover:border-cyan-500/30' : 'bg-white/60 border-gray-200 hover:border-gray-300'
  const textMain = isDark ? 'text-white' : 'text-gray-900'
  const textSub = isDark ? 'text-gray-400' : 'text-gray-600'

  return (
    <main className={`min-h-screen ${bg} py-20 px-4 md:px-8`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-3xl font-bold ${textMain} mb-4`}>{t.title}</h1>
        <p className={`text-sm ${textSub} mb-8`}>{t.desc}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map((tool, index) => (
            <Link 
              key={index}
              href={tool.href}
              prefetch={true}
              className={`p-6 rounded-xl border ${cardBg} backdrop-blur-sm transition-all hover:scale-[1.02]`}
            >
              <h2 className={`text-lg font-medium ${textMain} mb-2`}>
                {language === 'zh' ? tool.zh.name : tool.en.name}
              </h2>
              <p className={`text-sm ${textSub}`}>
                {language === 'zh' ? tool.zh.desc : tool.en.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
