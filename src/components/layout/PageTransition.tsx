'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState, ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [transitionStage, setTransitionStage] = useState<'enter' | 'exit'>('enter')

  useEffect(() => {
    if (children !== displayChildren) {
      setTransitionStage('exit')
    }
  }, [children])

  useEffect(() => {
    if (transitionStage === 'exit') {
      const timer = setTimeout(() => {
        setDisplayChildren(children)
        setTransitionStage('enter')
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [transitionStage, children])

  return (
    <div
      className={`transition-all duration-200 ease-out ${
        transitionStage === 'enter'
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-2'
      }`}
    >
      {displayChildren}
    </div>
  )
}
