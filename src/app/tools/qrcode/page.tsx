'use client'

import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/context/LanguageContext'

export default function QrCodePage() {
  const { language, theme, mounted } = useLanguage()
  const isDark = mounted ? theme === 'dark' : true
  const [text, setText] = useState('')
  const [qrColor, setQrColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [dotStyle, setDotStyle] = useState<'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded'>('square')
  const [cornerStyle, setCornerStyle] = useState<'square' | 'dot' | 'extra-rounded'>('square')
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M')
  const [size, setSize] = useState(300)
  const [logo, setLogo] = useState<string | undefined>()
  const [logoSize, setLogoSize] = useState(0.4)
  const [margin, setMargin] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)
  const qrCode = useRef<any>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return
    
    const QRCode = require('qr-code-styling')
    qrCode.current = new QRCode({
      width: size,
      height: size,
      data: text || 'https://example.com',
      image: '',
      dotsOptions: {
        color: qrColor,
        type: dotStyle
      },
      backgroundOptions: {
        color: bgColor
      },
      cornersSquareOptions: {
        color: qrColor,
        type: cornerStyle
      },
      cornersDotOptions: {
        color: qrColor
      },
      qrOptions: {
        errorCorrectionLevel: errorLevel
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 10
      }
    })

    return () => {
      if (qrCode.current && qrRef.current) {
        qrRef.current.innerHTML = ''
      }
    }
  }, [isClient])

  useEffect(() => {
    if (!qrCode.current || !isClient) return
    
    qrCode.current.update({
      width: size,
      height: size,
      data: text || 'https://example.com',
      image: logo,
      dotsOptions: {
        color: qrColor,
        type: dotStyle
      },
      backgroundOptions: {
        color: bgColor
      },
      cornersSquareOptions: {
        color: qrColor,
        type: cornerStyle
      },
      cornersDotOptions: {
        color: qrColor
      },
      qrOptions: {
        errorCorrectionLevel: errorLevel
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 10,
        imageSize: logoSize
      }
    })
  }, [text, qrColor, bgColor, dotStyle, cornerStyle, errorLevel, size, logo, logoSize, isClient])

  useEffect(() => {
    if (qrCode.current && qrRef.current && isClient) {
      qrRef.current.innerHTML = ''
      qrCode.current.append(qrRef.current)
    }
  }, [isClient])

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setLogo(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const downloadQr = (format: 'png' | 'jpeg' | 'svg') => {
    if (!qrCode.current) return
    qrCode.current.download({
      extension: format,
      name: 'qrcode'
    })
  }

  const resetAll = () => {
    setText('')
    setQrColor('#000000')
    setBgColor('#ffffff')
    setDotStyle('square')
    setCornerStyle('square')
    setErrorLevel('M')
    setSize(300)
    setLogo(undefined)
    setLogoSize(0.4)
    setMargin(0)
  }

  const t = {
    zh: {
      title: '二维码生成器',
      desc: '生成自定义二维码',
      inputPlaceholder: '输入文本或网址...',
      color: '二维码颜色',
      bgColor: '背景颜色',
      dotStyle: '码点样式',
      cornerStyle: '定位点样式',
      errorLevel: '纠错级别',
      size: '尺寸',
      logo: 'Logo 图片',
      logoSize: 'Logo 大小',
      margin: '边距',
      download: '下载',
      downloadPng: 'PNG',
      downloadJpeg: 'JPEG',
      downloadSvg: 'SVG',
      reset: '重置',
      square: '方形',
      dots: '圆点',
      rounded: '圆角',
      extraRounded: '大圆角',
      classy: '优雅',
      classyRounded: '优雅圆角',
      cornerSquare: '方块',
      cornerDot: '圆点',
      cornerExtraRounded: '大圆角',
      levelL: '低 (7%)',
      levelM: '中 (15%)',
      levelQ: '较高 (25%)',
      levelH: '高 (30%)',
      uploadLogo: '上传 Logo',
      clearLogo: '清除 Logo'
    },
    en: {
      title: 'QR Code Generator',
      desc: 'Generate custom QR codes',
      inputPlaceholder: 'Enter text or URL...',
      color: 'QR Color',
      bgColor: 'Background',
      dotStyle: 'Dot Style',
      cornerStyle: 'Corner Style',
      errorLevel: 'Error Level',
      size: 'Size',
      logo: 'Logo Image',
      logoSize: 'Logo Size',
      margin: 'Margin',
      download: 'Download',
      downloadPng: 'PNG',
      downloadJpeg: 'JPEG',
      downloadSvg: 'SVG',
      reset: 'Reset',
      square: 'Square',
      dots: 'Dots',
      rounded: 'Rounded',
      extraRounded: 'Extra Rounded',
      classy: 'Classy',
      classyRounded: 'Classy Rounded',
      cornerSquare: 'Square',
      cornerDot: 'Dot',
      cornerExtraRounded: 'Extra Rounded',
      levelL: 'Low (7%)',
      levelM: 'Medium (15%)',
      levelQ: 'Quartile (25%)',
      levelH: 'High (30%)',
      uploadLogo: 'Upload Logo',
      clearLogo: 'Clear Logo'
    }
  }[language]

  const bg = isDark ? 'bg-[#000000]' : 'bg-[#f8f8f8]'
  const inputBg = isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
  const textMain = isDark ? 'text-white' : 'text-gray-900'
  const textSub = isDark ? 'text-gray-400' : 'text-gray-600'
  const hoverColor = isDark ? 'hover:text-cyan-400' : 'hover:text-blue-600'
  const btnPrimary = isDark ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border-cyan-500/30' : 'bg-blue-500 text-white hover:bg-blue-600'
  const btnSecondary = isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
  const labelClass = `text-sm ${textSub} mb-1 block`

  if (!isClient) {
    return (
      <main className={`min-h-screen ${bg} py-20 px-4 md:px-8`}>
        <div className="max-w-6xl mx-auto">
          <div className={`animate-pulse`}>
            <div className={`h-8 w-32 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} rounded mb-4`}></div>
            <div className={`h-10 w-64 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} rounded mb-2`}></div>
            <div className={`h-6 w-48 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} rounded mb-8`}></div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={`min-h-screen ${bg} py-20 px-4 md:px-8`}>
      <div className="max-w-6xl mx-auto">
        <a href="/tools" className={`inline-flex items-center gap-1 text-sm ${textSub} ${hoverColor} mb-4`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {language === 'zh' ? '返回工具列表' : 'Back to Tools'}
        </a>
        <h1 className={`text-3xl font-bold ${textMain} mb-2`}>{t.title}</h1>
        <p className={`text-sm ${textSub} mb-8`}>{t.desc}</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Settings */}
          <div className={`space-y-6`}>
            {/* Text Input */}
            <div>
              <label className={labelClass}>{language === 'zh' ? '内容' : 'Content'}</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t.inputPlaceholder}
                className={`w-full p-3 rounded-xl border ${inputBg} ${textMain}`}
              />
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t.color}</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className={`flex-1 p-2 rounded-lg border ${inputBg} ${textMain} text-sm`}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>{t.bgColor}</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className={`flex-1 p-2 rounded-lg border ${inputBg} ${textMain} text-sm`}
                  />
                </div>
              </div>
            </div>

            {/* Dot Style */}
            <div>
              <label className={labelClass}>{t.dotStyle}</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'square', label: t.square },
                  { value: 'dots', label: t.dots },
                  { value: 'rounded', label: t.rounded },
                  { value: 'extra-rounded', label: t.extraRounded },
                  { value: 'classy', label: t.classy },
                  { value: 'classy-rounded', label: t.classyRounded }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setDotStyle(item.value as any)}
                    className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                      dotStyle === item.value ? btnPrimary : btnSecondary
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Corner Style */}
            <div>
              <label className={labelClass}>{t.cornerStyle}</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'square', label: t.cornerSquare },
                  { value: 'dot', label: t.cornerDot },
                  { value: 'extra-rounded', label: t.cornerExtraRounded }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setCornerStyle(item.value as any)}
                    className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                      cornerStyle === item.value ? btnPrimary : btnSecondary
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Level */}
            <div>
              <label className={labelClass}>{t.errorLevel}</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'L', label: t.levelL },
                  { value: 'M', label: t.levelM },
                  { value: 'Q', label: t.levelQ },
                  { value: 'H', label: t.levelH }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setErrorLevel(item.value as any)}
                    className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                      errorLevel === item.value ? btnPrimary : btnSecondary
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <label className={labelClass}>{t.size}: {size}px</label>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Logo */}
            <div>
              <label className={labelClass}>{t.logo}</label>
              <div className="flex gap-2 items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-input"
                />
                <label htmlFor="logo-input" className={`px-4 py-2 rounded-lg border cursor-pointer ${btnSecondary}`}>
                  {t.uploadLogo}
                </label>
                {logo && (
                  <button onClick={() => setLogo(undefined)} className={`px-4 py-2 rounded-lg border ${btnSecondary}`}>
                    {t.clearLogo}
                  </button>
                )}
              </div>
            </div>

            {/* Logo Size */}
            {logo && (
              <div>
                <label className={labelClass}>{t.logoSize}: {Math.round(logoSize * 100)}%</label>
                <input
                  type="range"
                  min="0.1"
                  max="0.5"
                  step="0.05"
                  value={logoSize}
                  onChange={(e) => setLogoSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            {/* Margin */}
            <div>
              <label className={labelClass}>{t.margin}: {margin}px</label>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Reset */}
            <button onClick={resetAll} className={`px-4 py-2 rounded-lg border ${btnSecondary}`}>
              {t.reset}
            </button>
          </div>

          {/* Right Panel - Preview */}
          <div className={`flex flex-col items-center`}>
            <div className={`p-8 rounded-xl border ${inputBg} mb-6`}>
              <div ref={qrRef} />
            </div>

            <div className="flex gap-2">
              <button onClick={() => downloadQr('png')} className={`px-4 py-2 rounded-lg border ${btnPrimary}`}>
                {t.downloadPng}
              </button>
              <button onClick={() => downloadQr('jpeg')} className={`px-4 py-2 rounded-lg border ${btnPrimary}`}>
                {t.downloadJpeg}
              </button>
              <button onClick={() => downloadQr('svg')} className={`px-4 py-2 rounded-lg border ${btnPrimary}`}>
                {t.downloadSvg}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
