'use client'

import { useEffect, useRef } from 'react'

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 设置画布大小
    const resizeCanvas = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // 粒子类
    class Particle {
      x: number
      y: number
      z: number
      size: number
      speedX: number
      speedY: number
      speedZ: number
      color: string

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth
        this.y = Math.random() * canvasHeight
        this.z = Math.random() * 1000
        this.size = Math.random() * 2 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.speedZ = Math.random() * 2 + 1
        
        const colors = ['#4a9eff', '#6b46c1', '#00d9a3']
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update(canvasWidth: number, canvasHeight: number) {
        this.x += this.speedX
        this.y += this.speedY
        this.z -= this.speedZ

        // 重置粒子
        if (this.z <= 0) {
          this.z = 1000
          this.x = Math.random() * canvasWidth
          this.y = Math.random() * canvasHeight
        }

        // 边界检查
        if (this.x < 0 || this.x > canvasWidth) this.speedX *= -1
        if (this.y < 0 || this.y > canvasHeight) this.speedY *= -1
      }

      draw(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
        const scale = 1000 / (1000 + this.z)
        const x2d = (this.x - canvasWidth / 2) * scale + canvasWidth / 2
        const y2d = (this.y - canvasHeight / 2) * scale + canvasHeight / 2
        const size2d = this.size * scale

        if (size2d > 0.1) {
          ctx.beginPath()
          ctx.fillStyle = this.color
          ctx.arc(x2d, y2d, size2d, 0, Math.PI * 2)
          ctx.fill()

          // 添加发光效果
          const gradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, size2d * 3)
          gradient.addColorStop(0, this.color + '20')
          gradient.addColorStop(1, this.color + '00')
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(x2d, y2d, size2d * 3, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    // 创建粒子
    const particles: Particle[] = []
    const particleCount = 200

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas.width, canvas.height))
    }

    // 连接线
    const drawConnections = (ctx: CanvasRenderingContext2D) => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(74, 158, 255, ${0.08 * (1 - distance / 150)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    // 动画循环
    let animationId: number
    const animate = () => {
      if (!canvas || !ctx) return
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 更新和绘制粒子
      particles.forEach(particle => {
        particle.update(canvas.width, canvas.height)
        particle.draw(ctx, canvas.width, canvas.height)
      })

      // 绘制连接线
      drawConnections(ctx)

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ background: 'linear-gradient(to bottom right, #000000, #0a0a0a, #000000)' }}
    />
  )
}

