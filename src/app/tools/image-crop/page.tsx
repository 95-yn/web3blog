'use client'

import { useState, useRef } from 'react'
import { useLanguage } from '@/context/LanguageContext'

export default function ImageCropPage() {
  const { language, theme, mounted } = useLanguage()
  const isDark = mounted ? theme === 'dark' : true

  const [image, setImage] = useState<string | null>(null)
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 200, height: 200 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height })
        setImage(event.target?.result as string)
        // 默认裁剪区域
        const maxSize = Math.min(img.width, img.height, 400)
        setCropArea({
          x: (img.width - maxSize) / 2,
          y: (img.height - maxSize) / 2,
          width: maxSize,
          height: maxSize
        })
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - cropArea.x, y: e.clientY - cropArea.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const newX = Math.max(0, Math.min(e.clientX - dragStart.x, imageSize.width - cropArea.width))
    const newY = Math.max(0, Math.min(e.clientY - dragStart.y, imageSize.height - cropArea.height))
    setCropArea({ ...cropArea, x: newX, y: newY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleCrop = () => {
    if (!image) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = cropArea.width
      canvas.height = cropArea.height
      ctx.drawImage(
        img,
        cropArea.x, cropArea.y, cropArea.width, cropArea.height,
        0, 0, cropArea.width, cropArea.height
      )
      
      // 下载裁剪后的图片
      const link = document.createElement('a')
      link.download = 'cropped-image.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    img.src = image
  }

  const handleClear = () => {
    setImage(null)
    setCropArea({ x: 0, y: 0, width: 200, height: 200 })
  }

  const t = {
    zh: { 
      title: '图片裁剪工具', 
      desc: '上传图片并裁剪所需区域',
      upload: '上传图片',
      crop: '裁剪并下载',
      clear: '清空',
      drag: '拖动裁剪区域'
    },
    en: { 
      title: 'Image Cropper', 
      desc: 'Upload and crop your image',
      upload: 'Upload Image',
      crop: 'Crop & Download',
      clear: 'Clear',
      drag: 'Drag to move crop area'
    }
  }[language]

  const bg = isDark ? 'bg-[#000000]' : 'bg-[#f8f8f8]'
  const textMain = isDark ? 'text-white' : 'text-gray-900'
  const textSub = isDark ? 'text-gray-400' : 'text-gray-600'
  const btnPrimary = isDark ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border-cyan-500/30' : 'bg-blue-500 text-white hover:bg-blue-600'
  const btnSecondary = isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'

  return (
    <main className={`min-h-screen ${bg} py-24 px-12`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-3xl font-bold ${textMain} mb-2`}>{t.title}</h1>
        <p className={`text-sm ${textSub} mb-8`}>{t.desc}</p>

        {!image ? (
          <div className={`border-2 border-dashed ${isDark ? 'border-gray-700' : 'border-gray-300'} rounded-xl p-12 text-center`}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className={`cursor-pointer px-6 py-3 rounded-lg border ${btnPrimary}`}>
              {t.upload}
            </label>
          </div>
        ) : (
          <>
            <div className="flex gap-3 mb-4">
              <button onClick={handleCrop} className={`px-4 py-2 rounded-lg border ${btnPrimary}`}>
                {t.crop}
              </button>
              <button onClick={handleClear} className={`px-4 py-2 rounded-lg border ${btnSecondary}`}>
                {t.clear}
              </button>
            </div>

            <div className="relative inline-block overflow-hidden rounded-xl border-2 border-cyan-500">
              <img
                src={image}
                alt="Crop"
                className="max-w-full"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              />
              <div
                className="absolute border-2 border-white bg-black/30"
                style={{
                  left: cropArea.x,
                  top: cropArea.y,
                  width: cropArea.width,
                  height: cropArea.height,
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                }}
              />
            </div>

            <p className={`text-sm ${textSub} mt-4`}>{t.drag}</p>
          </>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </main>
  )
}
