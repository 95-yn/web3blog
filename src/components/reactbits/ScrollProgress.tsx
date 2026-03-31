'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const { theme, mounted } = useLanguage()
  const isDark = mounted ? theme === 'dark' : true

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) {
        setProgress(0)
        return
      }
      setProgress(Math.min((scrollTop / docHeight) * 100, 100))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (progress <= 0) return null

  return (
    <div className="fixed top-16 left-0 right-0 z-40 h-[2px]">
      <div
        className="h-full transition-[width] duration-150 ease-out"
        style={{
          width: `${progress}%`,
          background: isDark
            ? 'linear-gradient(90deg, #22d3ee, #3b82f6, #8b5cf6)'
            : 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)',
          boxShadow: isDark
            ? '0 0 8px rgba(34, 211, 238, 0.6)'
            : '0 0 8px rgba(59, 130, 246, 0.4)',
        }}
      />
    </div>
  )
}
