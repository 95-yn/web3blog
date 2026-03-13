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
    },
    {
      zh: { name: '二维码生成器', desc: '自定义颜色、样式、Logo' },
      en: { name: 'QR Code Generator', desc: 'Custom colors, styles and logo' },
      href: '/tools/qrcode'
    },
    {
      zh: { name: 'Markdown 实时预览', desc: '左侧编写 Markdown，右侧实时预览' },
      en: { name: 'Markdown Live Preview', desc: 'Write Markdown on the left, preview on the right' },
      href: '/tools/markdown-preview'
    }
  ]

  const bg = isDark ? 'bg-[#000000]' : 'bg-[#f8f8f8]'
  const cardBg = isDark 
    ? 'bg-gradient-to-br from-gray-900/80 to-black/60 border border-cyan-500/20 hover:border-cyan-500/50 shadow-lg shadow-cyan-500/5 hover:shadow-cyan-500/20' 
    : 'bg-white border border-gray-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10'
  const textMain = isDark ? 'text-white' : 'text-gray-900'
  const textSub = isDark ? 'text-gray-400' : 'text-gray-600'
  const iconBg = isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-blue-500/10 text-blue-500'
  const titleHover = isDark ? 'group-hover:text-cyan-400' : 'group-hover:text-blue-600'

  // 工具图标
  const toolIcons: Record<string, JSX.Element> = {
    '/tools/resolution': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    '/tools/json-format': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    '/tools/image-crop': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    '/tools/qrcode': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
      </svg>
    ),
    '/tools/markdown-preview': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    )
  }

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
              className={`p-6 rounded-xl border ${cardBg} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] group`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${iconBg} group-hover:scale-110 transition-transform duration-300`}>
                  {toolIcons[tool.href]}
                </div>
                <div>
                  <h2 className={`text-lg font-medium ${textMain} mb-1 ${titleHover} transition-colors`}>
                    {language === 'zh' ? tool.zh.name : tool.en.name}
                  </h2>
                  <p className={`text-sm ${textSub}`}>
                    {language === 'zh' ? tool.zh.desc : tool.en.desc}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
