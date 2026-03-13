'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import BackLink from '@/components/BackLink'
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { createImage } from './utils'

// 宽高比选项
const ASPECT_RATIOS = [
  { value: undefined, label: { zh: '自由', en: 'Free' } },
  { value: 1, label: { zh: '1:1', en: '1:1' } },
  { value: 4/3, label: { zh: '4:3', en: '4:3' } },
  { value: 16/9, label: { zh: '16:9', en: '16:9' } },
  { value: 2/3, label: { zh: '2:3', en: '2:3' } },
  { value: 9/16, label: { zh: '9:16', en: '9:16' } },
]

// 输出尺寸选项
const OUTPUT_SIZES = [
  { value: 'original', label: { zh: '原始尺寸', en: 'Original' } },
  { value: '1920x1080', label: { zh: '1920×1080', en: '1920×1080' } },
  { value: '1280x720', label: { zh: '1280×720', en: '1280×720' } },
  { value: '1080x1920', label: { zh: '1080×1920', en: '1080×1920' } },
  { value: '720x1280', label: { zh: '720×1280', en: '720×1280' } },
  { value: '1024x1024', label: { zh: '1024×1024', en: '1024×1024' } },
  { value: '512x512', label: { zh: '512×512', en: '512×512' } },
]

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 80,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  )
}

export default function ImageCropPage() {
  const { language, theme, mounted } = useLanguage()
  const isDark = mounted ? theme === 'dark' : true

  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [src, setSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [aspect, setAspect] = useState<number | undefined>(undefined)
  const [outputSize, setOutputSize] = useState('original')
  const [isCropping, setIsCropping] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, aspect || 16 / 9))
  }, [aspect])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      const img = await createImage(event.target?.result as string)
      setSrc(event.target?.result as string)
      setImage(img)
      setCrop(undefined)
    }
    reader.readAsDataURL(file)
  }

  const getCroppedImg = useCallback(async () => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) return

    setIsCropping(true)
    try {
      const image = imgRef.current
      const canvas = canvasRef.current
      const crop = completedCrop

      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height

      // 计算输出尺寸
      let outputWidth = crop.width * scaleX
      let outputHeight = crop.height * scaleY

      if (outputSize !== 'original') {
        const [w, h] = outputSize.split('x').map(Number)
        outputWidth = w
        outputHeight = h
      }

      canvas.width = outputWidth
      canvas.height = outputHeight

      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        outputWidth,
        outputHeight
      )

      canvas.toBlob((blob) => {
        if (!blob) return
        const link = document.createElement('a')
        link.download = `cropped-image-${Date.now()}.png`
        link.href = URL.createObjectURL(blob)
        link.click()
        URL.revokeObjectURL(link.href)
        setIsCropping(false)
      }, 'image/png')
    } catch (e) {
      console.error(e)
      setIsCropping(false)
    }
  }, [completedCrop, outputSize])

  const handleClear = () => {
    setImage(null)
    setSrc(null)
    setCrop(undefined)
    setCompletedCrop(undefined)
  }

  const t = {
    zh: { 
      title: '图片裁剪工具', 
      desc: '上传图片并裁剪所需区域',
      upload: '上传图片',
      crop: '裁剪并下载',
      clear: '重新上传',
      aspect: '宽高比',
      outputSize: '输出尺寸',
      tip: '拖动裁剪框调整区域',
    },
    en: { 
      title: 'Image Cropper', 
      desc: 'Upload and crop your image',
      upload: 'Upload Image',
      crop: 'Crop & Download',
      clear: 'Re-upload',
      aspect: 'Aspect Ratio',
      outputSize: 'Output Size',
      tip: 'Drag crop box to adjust area',
    }
  }[language]

  const bg = isDark ? 'bg-[#000000]' : 'bg-[#f8f8f8]'
  const textMain = isDark ? 'text-white' : 'text-gray-900'
  const textSub = isDark ? 'text-gray-400' : 'text-gray-600'
  const btnPrimary = isDark ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border-cyan-500/30' : 'bg-blue-500 text-white hover:bg-blue-600'
  const btnSecondary = isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
  const panelBg = isDark ? 'bg-gray-900' : 'bg-white'
  const inputBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'

  return (
    <main className={`min-h-screen ${bg} py-20 px-4 md:px-6`}>
      <div className="max-w-6xl mx-auto">
        <BackLink href="/tools" />
        <h1 className={`text-3xl font-bold ${textMain} mb-2`}>{t.title}</h1>
        <p className={`text-sm ${textSub} mb-8`}>{t.desc}</p>

        {!src ? (
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：裁剪预览区域 */}
            <div className="lg:col-span-2">
              <div 
                className="relative rounded-xl overflow-hidden flex items-center justify-center"
                style={{ background: isDark ? '#111827' : '#f3f4f6', minHeight: '400px', maxHeight: '600px' }}
              >
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspect}
                  style={{
                    maxHeight: '600px',
                  }}
                >
                  <img
                    ref={imgRef}
                    src={src}
                    alt="Crop"
                    onLoad={onImageLoad}
                    className="max-w-full max-h-[600px] object-contain"
                    style={{ 
                      maxHeight: '600px',
                    }}
                  />
                </ReactCrop>
              </div>
              <p className={`text-sm ${textSub} mt-2 text-center`}>{t.tip}</p>
            </div>

            {/* 右侧：控制面板 */}
            <div className={`${panelBg} rounded-xl p-5 space-y-5`}>
              {/* 宽高比 */}
              <div>
                <span className={`text-sm ${textSub} block mb-2`}>{t.aspect}</span>
                <div className="flex flex-wrap gap-2">
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      key={ratio.label.zh}
                      onClick={() => {
                        setAspect(ratio.value)
                        if (imgRef.current && ratio.value) {
                          setCrop(centerAspectCrop(imgRef.current.width, imgRef.current.height, ratio.value))
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                        aspect === ratio.value ? btnPrimary : btnSecondary
                      }`}
                    >
                      {ratio.label[language]}
                    </button>
                  ))}
                </div>
              </div>

              {/* 输出尺寸 */}
              <div>
                <span className={`text-sm ${textSub} block mb-2`}>{t.outputSize}</span>
                <select
                  value={outputSize}
                  onChange={(e) => setOutputSize(e.target.value)}
                  className={`w-full p-2 rounded-lg border ${inputBg} ${textMain} text-sm`}
                >
                  {OUTPUT_SIZES.map((size) => (
                    <option key={size.value} value={size.value}>
                      {size.label[language]}
                    </option>
                  ))}
                </select>
              </div>

              {/* 按钮 */}
              <div className="flex flex-col gap-3 pt-2">
                <button 
                  onClick={getCroppedImg}
                  disabled={isCropping || !completedCrop}
                  className={`w-full px-4 py-2.5 rounded-lg border ${btnPrimary} disabled:opacity-50`}
                >
                  {isCropping ? '...' : t.crop}
                </button>
                <button 
                  onClick={handleClear}
                  className={`w-full px-4 py-2.5 rounded-lg border ${btnSecondary}`}
                >
                  {t.clear}
                </button>
              </div>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </main>
  )
}
