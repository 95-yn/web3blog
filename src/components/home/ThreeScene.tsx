'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface ThreeSceneProps {
  isDark?: boolean
}

export default function ThreeScene({ isDark = true }: ThreeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Clean up previous canvas
    containerRef.current.innerHTML = ''

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    // Particle system
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 3000
    const posArray = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 100
      posArray[i + 1] = (Math.random() - 0.5) * 100
      posArray[i + 2] = (Math.random() - 0.5) * 60 + 20
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

    // 在浅色模式下使用更亮的颜色和普通混合模式，保证在浅色背景上也清晰可见
    const particleColor = isDark ? 0x00ffff : 0x3b82f6 // dark: 青色, light: 柔和蓝色

    const particlesMaterial = new THREE.PointsMaterial({
      size: isDark ? 0.1 : 0.08,
      color: particleColor,
      transparent: true,
      opacity: isDark ? 0.8 : 0.7,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false
    })

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)

    // Geometric shapes
    const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
    const material = new THREE.MeshBasicMaterial({
      color: particleColor,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.3 : 0.35
    })
    const torus = new THREE.Mesh(geometry, material)
    scene.add(torus)

    camera.position.z = 30

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)

      particlesMesh.rotation.y += 0.001
      torus.rotation.x += 0.005
      torus.rotation.y += 0.005

      renderer.render(scene, camera)
    }
    animate()

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [isDark])

  return <div ref={containerRef} className="fixed inset-0 -z-10" />
}
