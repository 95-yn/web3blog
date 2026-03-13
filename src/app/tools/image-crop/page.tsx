'use client'

import { useState, useRef, useCallback } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import BackLink from '@/components/BackLink'
import Cropper from 'react-easy-crop'
import { createImage } from './utils'

// 宽高比选项
const ASPECT_RATIOS = [
  { value: 0, label: { zh: '自由', en: 'Free' } },
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

export default function ImageCropPage() {
  const { language, theme, mounted } = useLanguage()
  const isDark = mounted ? theme === 'dark' : true

  const [image, setImage] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [aspect, setAspect] = useState(0)
  const [outputSize, setOutputSize] = useState('original')
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [isCropping, setIsCropping] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setRotation(0)
    }
    reader.readAsDataURL(file)
  }

  const getCroppedImg = async () => {
    if (!image || !croppedAreaPixels) return

    setIsCropping(true)
    try {
      const croppedImage = await createImage(image)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) return

      // 计算输出尺寸
      let outputWidth = croppedAreaPixels.width
      let outputHeight = croppedAreaPixels.height

      if (outputSize !== 'original') {
        const [w, h] = outputSize.split('x').map(Number)
        outputWidth = w
        outputHeight = h
      }

      canvas.width = outputWidth
      canvas.height = outputHeight

      // 应用旋转
      ctx.translate(outputWidth / 2, outputHeight / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.translate(-outputWidth / 2, -outputHeight / 2)

      // 绘制裁剪区域
      ctx.drawImage(
        croppedImage,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        outputWidth,
        outputHeight
      )

      // 下载
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
  }

  const handleClear = () => {
    setImage(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
    setAspect(0)
  }

  const t = {
    zh: { 
      title: '图片裁剪工具', 
      desc: '上传图片并裁剪所需区域',
      upload: '上传图片',
      crop: '裁剪并下载',
      clear: '重新上传',
      zoom: '缩放',
      rotation: '旋转',
      aspect: '宽高比',
      outputSize: '输出尺寸',
      aspectFree: '自由',
      aspect1_1: '1:1',
      aspect4_3: '4:3',
      aspect16_9: '16:9',
    },
    en: { 
      title: 'Image Cropper', 
      desc: 'Upload and crop your image',
      upload: 'Upload Image',
      crop: 'Crop & Download',
      clear: 'Re-upload',
      zoom: 'Zoom',
      rotation: 'Rotate',
      aspect: 'Aspect Ratio',
      outputSize: 'Output Size',
      aspectFree: 'Free',
      aspect1_1: '1:1',
      aspect4_3: '4:3',
      aspect16_9: '16:9',
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
      <div className="max-w-4xl mx-auto">
        <BackLink href="/tools" />
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
            {/* 预览区域 */}
            <div className="relative h-[400px] bg-gray-900 rounded-xl overflow-hidden mb-4">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                rotation={rotation}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                style={{
                  containerStyle: { background: isDark ? '#111827' : '#f3f4f6' },
                  mediaStyle: { maxHeight: '100%' }
                }}
              />
            </div>

            {/* 控制面板 */}
            <div className={`${panelBg} rounded-xl p-4 space-y-4 mb-4`}>
              {/* 缩放 */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className={`text-sm ${textSub}`}>{t.zoom}</span>
                  <span className={`text-sm ${textSub}`}>{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* 旋转 */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className={`text-sm ${textSub}`}>{t.rotation}</span>
                  <span className={`text-sm ${textSub}`}>{rotation}°</span>
                </div>
                <input
                  type="range"
                  min={-180}
                  max={180}
                  step={1}
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* 宽高比 */}
              <div>
                <span className={`text-sm ${textSub} block mb-2`}>{t.aspect}</span>
                <div className="flex flex-wrap gap-2">
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      key={ratio.value}
                      onClick={() => setAspect(ratio.value)}
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
            </div>

            {/* 按钮 */}
            <div className="flex gap-3">
              <button 
                onClick={getCroppedImg} 
                disabled={isCropping}
                className={`px-6 py-2.5 rounded-lg border ${btnPrimary} disabled:opacity-50`}
              >
                {isCropping ? '...' : t.crop}
              </button>
              <button onClick={handleClear} className={`px-6 py-2.5 rounded-lg border ${btnSecondary}`}>
                {t.clear}
              </button>
            </div>
          </>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </main>
  )
}
