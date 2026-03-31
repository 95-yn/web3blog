'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface TextScrambleProps {
  text: string
  className?: string
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'

export default function TextScramble({ text, className = '' }: TextScrambleProps) {
  const [displayed, setDisplayed] = useState(text)
  const rafRef = useRef<number>(0)
  const isAnimating = useRef(false)

  useEffect(() => {
    setDisplayed(text)
  }, [text])

  const scramble = useCallback(() => {
    if (isAnimating.current) return
    isAnimating.current = true
    let iteration = 0
    const totalIterations = text.length * 2

    const animate = () => {
      setDisplayed(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' '
            if (i < iteration / 2) return text[i]
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join('')
      )
      iteration++
      if (iteration < totalIterations) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setDisplayed(text)
        isAnimating.current = false
      }
    }
    rafRef.current = requestAnimationFrame(animate)
  }, [text])

  const unscramble = useCallback(() => {
    if (isAnimating.current) {
      cancelAnimationFrame(rafRef.current)
      isAnimating.current = false
    }
    setDisplayed(text)
  }, [text])

  return (
    <span
      className={className}
      onMouseEnter={scramble}
      onMouseLeave={unscramble}
      style={{ fontFamily: 'inherit' }}
    >
      {displayed}
    </span>
  )
}
