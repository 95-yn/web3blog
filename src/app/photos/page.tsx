'use client'

import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import BackLink from '@/components/BackLink'

// 照片列表
const photoList = [
  '微信图片_20260312225118_10840_169.jpg',
  '微信图片_20260312225120_10841_169.jpg',
  '微信图片_20260312225133_10850_169.jpg',
  '微信图片_20260312225140_10854_169.jpg',
  '微信图片_20260312225142_10855_169.jpg',
  '微信图片_20260312225143_10856_169.jpg',
  '微信图片_20260312225146_10857_169.jpg',
  '微信图片_20260312225159_10858_169.jpg',
  '微信图片_20260312225207_10861_169.jpg',
  '微信图片_20260312225210_10863_169.jpg',
  '微信图片_20260312225213_10864_169.jpg',
  '微信图片_20260312225215_10865_169.jpg',
  '微信图片_20260312225224_10868_169.jpg',
  '微信图片_20260312225225_10869_169.jpg',
  '微信图片_20260312225226_10870_169.jpg',
  '微信图片_20260312225227_10871_169.jpg',
  '微信图片_20260312225230_10872_169.jpg',
  '微信图片_20260312225231_10873_169.jpg',
  '微信图片_20260312225232_10874_169.jpg',
  '微信图片_20260312225233_10875_169.jpg',
  '微信图片_20260312225234_10876_169.jpg',
  '微信图片_20260312225259_10877_169.jpg',
  '微信图片_20260312225301_10879_169.jpg',
  '微信图片_20260312225302_10880_169.jpg',
  '微信图片_20260312225602_10881_169.jpg',
  '微信图片_20260312225616_10882_169.jpg',
  '微信图片_20260312225620_10883_169.jpg',
  '微信图片_20260312225624_10884_169.jpg',
  '微信图片_20260312225629_10885_169.jpg',
  '微信图片_20260312225630_10886_169.jpg',
  '微信图片_20260312225634_10887_169.jpg',
  '微信图片_20260312225637_10888_169.jpg',
  '微信图片_20260313164120_10898_169.jpg',
  '微信图片_20260313164122_10899_169.jpg',
  '微信图片_20260313164127_10900_169.jpg',
  '微信图片_20260313164129_10901_169.jpg',
  '微信图片_20260313164130_10902_169.jpg',
  '微信图片_20260313164132_10903_169.jpg',
  '微信图片_20260313164134_10904_169.jpg',
  '微信图片_20260313164136_10905_169.jpg',
  '微信图片_20260313164138_10906_169.jpg',
  '微信图片_20260313164141_10907_169.jpg',
  '微信图片_20260313164143_10908_169.jpg',
  '微信图片_20260313164151_10909_169.jpg',
  '微信图片_20260313164153_10910_169.jpg',
  '微信图片_20260313164155_10911_169.jpg',
  '微信图片_20260313164157_10912_169.jpg',
  '微信图片_20260313164159_10913_169.jpg',
  '微信图片_20260313164201_10914_169.jpg',
  '微信图片_20260313164205_10915_169.jpg',
  '微信图片_20260313164206_10916_169.jpg',
  '微信图片_20260313164207_10917_169.jpg',
  '微信图片_20260313164208_10918_169.jpg',
  '微信图片_20260313164210_10919_169.jpg',
  '微信图片_20260313164212_10920_169.jpg',
  '微信图片_20260313164216_10921_169.jpg',
]

export default function PhotoGalleryPage() {
  const { language, theme, mounted } = useLanguage()
  const isDark = mounted ? theme === 'dark' : true
  const [selectedImg, setSelectedImg] = useState<string | null>(null)

  const photos = photoList.map((name) => ({ src: `/photos/${name}`, name }))

  const t = {
    zh: { title: '照片墙', back: '返回' },
    en: { title: 'Photo Gallery', back: 'Back' },
  }[language]

  const bg = isDark ? 'bg-[#000000]' : 'bg-[#f8f8f8]'
  const textMain = isDark ? 'text-white' : 'text-gray-900'
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
              key={photo.name}
              className="break-inside-avoid cursor-pointer overflow-hidden rounded-lg hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImg(photo.src)}
            >
              <img
                src={photo.src}
                alt={photo.name}
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
