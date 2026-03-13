'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import BackLink from '@/components/BackLink'

export default function PhotoGalleryPage() {
  const { language, theme, mounted } = useLanguage()
  const isDark = mounted ? theme === 'dark' : true
  const [selectedImg, setSelectedImg] = useState<string | null>(null)

  const photos = Array.from({ length: 33 }, (_, i) => ({
    src: `/photos/photo-${String(i).padStart(2, '0')}.jpg`,
    index: i
  }))

  const t = {
    zh: { title: '照片墙', back: '返回' },
    en: { title: 'Photo Gallery', back: 'Back' },
  }[language]

  const bg = isDark ? 'bg-[#000000]' : 'bg-[#f8f8f8]'
  const textMain = isDark ? 'text-white' : 'text-gray-900'
  const textSub = isDark ? 'text-gray-400' : 'text-gray-600'
  const overlayBg = isDark ? 'bg-black/90' : 'bg-black/80'

  return (
    <main className={`min-h-screen ${bg} py-20 px-4 md:px-6`}>
      <div className="max-w-6xl mx-auto">
        <BackLink href="/about" text={t.back} />
        <h1 className={`text-3xl font-bold ${textMain} mb-8 mt-4`}>{t.title}</h1>

        {/* 照片网格 */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {photos.map((photo) => (
            <div 
              key={photo.index}
              className="break-inside-avoid cursor-pointer overflow-hidden rounded-lg hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImg(photo.src)}
            >
              <img
                src={photo.src}
                alt={`Photo ${photo.index + 1}`}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* 大图预览 */}
        {selectedImg && (
          <div 
            className={`fixed inset-0 z-50 ${overlayBg} flex items-center justify-center p-4`}
            onClick={() => setSelectedImg(null)}
          >
            <button 
              className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
              onClick={() => setSelectedImg(null)}
            >
              ×
            </button>
            <img 
              src={selectedImg} 
              alt="Preview" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        )}
      </div>
    </main>
  )
}
