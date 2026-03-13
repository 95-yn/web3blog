'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import BackLink from '@/components/BackLink'

const TOTAL_PHOTOS = 160
const LOAD_COUNT = 10

export default function PhotoGalleryPage() {
  const { language, theme, mounted } = useLanguage()
  const isDark = mounted ? theme === 'dark' : true
  const [selectedImg, setSelectedImg] = useState<string | null>(null)
  const [displayCount, setDisplayCount] = useState(LOAD_COUNT)
  const [loading, setLoading] = useState(false)
  const loaderRef = useRef<HTMLDivElement>(null)

  const t = {
    zh: { title: '照片墙', back: '返回', loading: '加载中...', count: `${TOTAL_PHOTOS} 张照片` },
    en: { title: 'Photo Gallery', back: 'Back', loading: 'Loading...', count: `${TOTAL_PHOTOS} photos` },
  }[language]

  const bg = isDark ? 'bg-[#000000]' : 'bg-[#f8f8f8]'
  const textMain = isDark ? 'text-white' : 'text-gray-900'
  const textSub = isDark ? 'text-gray-400' : 'text-gray-600'
  const overlayBg = isDark ? 'bg-black/90' : 'bg-black/80'

  // 无限滚动
  const handleScroll = useCallback(() => {
    if (loading || displayCount >= TOTAL_PHOTOS) return
    
    const scrollTop = window.scrollY
    const windowHeight = window.innerHeight
    const docHeight = document.documentElement.scrollHeight
    
    if (scrollTop + windowHeight >= docHeight - 500) {
      setLoading(true)
      setTimeout(() => {
        setDisplayCount(prev => Math.min(prev + LOAD_COUNT, TOTAL_PHOTOS))
        setLoading(false)
      }, 300)
    }
  }, [loading, displayCount])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <main className={`min-h-screen ${bg} py-20 px-4 md:px-6`}>
      <div className="max-w-6xl mx-auto">
        <BackLink href="/about" text={t.back} />
        <h1 className={`text-3xl font-bold ${textMain} mt-4`}>{t.title}</h1>
        <p className={`text-sm ${textSub} mb-8`}>{t.count}</p>

        {/* 照片瀑布流 */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {Array.from({ length: displayCount }, (_, i) => i + 1).map((num) => {
            const imgUrl = `/photos/${num}.jpg`
            return (
              <div 
                key={num}
                className="break-inside-avoid cursor-pointer overflow-hidden rounded-lg bg-gray-800 relative group"
                onClick={() => setSelectedImg(imgUrl)}
              >
                <img
                  src={imgUrl}
                  alt={`Photo ${num}`}
                  className="w-full h-auto object-cover block transition-opacity duration-300"
                  loading="lazy"
                  decoding="async"
                  onLoad={(e) => {
                    e.currentTarget.style.opacity = '1'
                  }}
                  style={{ opacity: 0 }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
            )
          })}
        </div>

        {/* 加载提示 */}
        {displayCount < TOTAL_PHOTOS && (
          <div ref={loaderRef} className="text-center py-8">
            <span className={`${textSub}`}>{loading ? t.loading : '↓'}</span>
          </div>
        )}

        {/* 大图预览 */}
        {selectedImg && (
          <div 
            className={`fixed inset-0 z-50 ${overlayBg} flex items-center justify-center p-4 cursor-zoom-out`}
            onClick={() => setSelectedImg(null)}
          >
            <button 
              className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedImg(null)
              }}
            >
              ×
            </button>
            <img 
              src={selectedImg} 
              alt="Preview" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg animate-fade-in"
            />
          </div>
        )}
      </div>
    </main>
  )
}
