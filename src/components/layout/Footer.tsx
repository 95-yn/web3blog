'use client'

import { useLanguage } from '@/context/LanguageContext'

// 备案信息配置 - 在这里填写你的备案号
const ICP_LICENSE = '辽ICP备2026004192号'  // 替换为你的ICP备案号
const POLICE_LICENSE = ''  // 公安备案号（可选）
const COPYRIGHT_NAME = '一一'

export default function Footer() {
  const { language, theme, mounted } = useLanguage()
  const isDark = mounted ? theme === 'dark' : true
  
  const isZh = language === 'zh'

  const footerBg = isDark ? 'bg-black/20 border-gray-800/30' : 'bg-gray-50 border-gray-200'
  const textColor = isDark ? 'text-gray-500' : 'text-gray-500'
  const linkColor = isDark ? 'text-gray-600 hover:text-cyan-400' : 'text-gray-500 hover:text-blue-600'

  return (
    <footer className={`py-6 px-4 border-t ${footerBg}`}>
      <div className="max-w-4xl mx-auto text-center">
        <p className={`text-sm ${textColor} mb-2`}>
          © {new Date().getFullYear()} {COPYRIGHT_NAME}. {isZh ? '保留所有权利' : 'All rights reserved.'}
        </p>
        
        {(ICP_LICENSE || POLICE_LICENSE) && (
          <div className="flex justify-center gap-4 text-xs">
            {ICP_LICENSE && (
              <a 
                href="http://beian.miit.gov.cn/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={linkColor}
              >
                {ICP_LICENSE}
              </a>
            )}
            {POLICE_LICENSE && (
              <a 
                href="https://www.beian.gov.cn/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={linkColor}
              >
                {POLICE_LICENSE}
              </a>
            )}
          </div>
        )}
      </div>
    </footer>
  )
}
