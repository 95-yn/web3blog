'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollManager() {
  const pathname = usePathname()
  const scrollPositions = useRef<Record<string, number>>({})
  const [isReady, setIsReady] = useState(false)

  // 页面加载完成后恢复滚动位置
  useEffect(() => {
    setIsReady(true)
  }, [])

  // 导航时保存滚动位置
  useEffect(() => {
    // 保存当前页面的滚动位置
    const handleBeforeUnload = () => {
      scrollPositions.current[pathname] = window.scrollY
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      // 保存当前滚动位置
      scrollPositions.current[pathname] = window.scrollY
    }
  }, [pathname])

  // 恢复上一个页面的滚动位置
  useEffect(() => {
    if (isReady && scrollPositions.current[pathname] !== undefined) {
      // 延迟一下确保页面渲染完成
      setTimeout(() => {
        window.scrollTo(0, scrollPositions.current[pathname])
      }, 100)
    }
  }, [pathname, isReady])

  return null
}
