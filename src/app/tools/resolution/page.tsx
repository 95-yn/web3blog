'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'

function getScreenSize(width: number): string {
  if (width >= 2560) return '4K / Ultra Wide'
  if (width >= 1920) return 'Full HD+'
  if (width >= 1440) return '2K / QHD'
  if (width >= 1280) return 'HD / Full HD'
  if (width >= 1024) return 'Large Tablet'
  if (width >= 768) return 'Tablet / Laptop'
  if (width >= 480) return 'Large Mobile'
  return 'Mobile'
}

export default function ResolutionPage() {
  const { language, theme, mounted } = useLanguage()
  const isDark = mounted ? theme === 'dark' : true

  const [resolution, setResolution] = useState({ width: 0, height: 0 })
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [screenSize, setScreenSize] = useState('')
  const [orientation, setOrientation] = useState('')
  const [touchSupport, setTouchSupport] = useState(false)
  const [colorDepth, setColorDepth] = useState(0)
  const [pixelDepth, setPixelDepth] = useState(0)

  useEffect(() => {
    const updateResolution = () => {
      setResolution({
        width: window.screen.width,
        height: window.screen.height
      })
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
      setScreenSize(getScreenSize(window.screen.width))
      setOrientation(window.screen.width > window.screen.height ? 'Landscape / 横屏' : 'Portrait / 竖屏')
      setTouchSupport(('ontouchstart' in window) || (navigator.maxTouchPoints > 0))
      setColorDepth(window.screen.colorDepth)
      setPixelDepth(window.screen.pixelDepth)
    }

    updateResolution()
    window.addEventListener('resize', updateResolution)
    return () => window.removeEventListener('resize', updateResolution)
  }, [])

  const t = {
    zh: { 
      title: '屏幕分辨率检测', 
      desc: '实时显示您的屏幕分辨率信息',
      screenResolution: '屏幕分辨率',
      windowSize: '窗口大小',
      screenType: '设备类型',
      orientation: '屏幕方向',
      pixelRatio: '设备像素比',
      availSize: '可用区域',
      colorDepth: '色彩深度',
      pixelDepth: '像素位深',
      touchSupport: '触控支持'
    },
    en: { 
      title: 'Screen Resolution', 
      desc: 'Display your screen resolution in real-time',
      screenResolution: 'Screen Resolution',
      windowSize: 'Window Size',
      screenType: 'Device Type',
      orientation: 'Orientation',
      pixelRatio: 'Pixel Ratio',
      availSize: 'Available',
      colorDepth: 'Color Depth',
      pixelDepth: 'Pixel Depth',
      touchSupport: 'Touch Support'
    }
  }[language]

  const bg = isDark ? 'bg-[#000000]' : 'bg-[#f8f8f8]'
  const cardBg = isDark ? 'bg-black/30 border-cyan-500/10' : 'bg-white/60 border-gray-200'
  const textMain = isDark ? 'text-white' : 'text-gray-900'
  const textSub = isDark ? 'text-gray-400' : 'text-gray-600'

  return (
    <main className={`min-h-screen ${bg} py-24 px-12`}>
      <div className="max-w-3xl mx-auto">
        <h1 className={`text-3xl font-bold ${textMain} mb-2`}>{t.title}</h1>
        <p className={`text-sm ${textSub} mb-8`}>{t.desc}</p>

        <div className="grid grid-cols-2 gap-4">
          <div className={`p-5 rounded-xl border ${cardBg} backdrop-blur-sm col-span-2`}>
            <p className={`text-sm ${textSub} mb-1`}>{t.screenResolution}</p>
            <p className={`text-3xl font-bold ${textMain}`}>{resolution.width} × {resolution.height}</p>
          </div>
          
          <div className={`p-5 rounded-xl border ${cardBg} backdrop-blur-sm`}>
            <p className={`text-sm ${textSub} mb-1`}>{t.windowSize}</p>
            <p className={`text-2xl font-bold ${textMain}`}>{windowSize.width} × {windowSize.height}</p>
          </div>
          
          <div className={`p-5 rounded-xl border ${cardBg} backdrop-blur-sm`}>
            <p className={`text-sm ${textSub} mb-1`}>{t.screenType}</p>
            <p className={`text-xl font-bold ${textMain}`}>{screenSize}</p>
          </div>
          
          <div className={`p-5 rounded-xl border ${cardBg} backdrop-blur-sm`}>
            <p className={`text-sm ${textSub} mb-1`}>{t.pixelRatio}</p>
            <p className={`text-2xl font-bold ${textMain}`}>{window.devicePixelRatio}x</p>
          </div>
          
          <div className={`p-5 rounded-xl border ${cardBg} backdrop-blur-sm`}>
            <p className={`text-sm ${textSub} mb-1`}>{t.orientation}</p>
            <p className={`text-lg font-bold ${textMain}`}>{orientation}</p>
          </div>
          
          <div className={`p-5 rounded-xl border ${cardBg} backdrop-blur-sm`}>
            <p className={`text-sm ${textSub} mb-1`}>{t.availSize}</p>
            <p className={`text-xl font-bold ${textMain}`}>{window.screen.availWidth} × {window.screen.availHeight}</p>
          </div>
          
          <div className={`p-5 rounded-xl border ${cardBg} backdrop-blur-sm`}>
            <p className={`text-sm ${textSub} mb-1`}>{t.colorDepth}</p>
            <p className={`text-2xl font-bold ${textMain}`}>{colorDepth}-bit</p>
          </div>

          <div className={`p-5 rounded-xl border ${cardBg} backdrop-blur-sm`}>
            <p className={`text-sm ${textSub} mb-1`}>{t.touchSupport}</p>
            <p className={`text-xl font-bold ${textMain}`}>{touchSupport ? '✓ Yes' : '✗ No'}</p>
          </div>
        </div>
      </div>
    </main>
  )
}
