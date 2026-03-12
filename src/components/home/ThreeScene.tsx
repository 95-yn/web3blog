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
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)

    // Particle system
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = isDark ? 6000 : 2000
    const posArray = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

    const particleColor = isDark ? 0x00ffff : 0x1a1a1a
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: isDark ? 0.05 : 0.15,
      color: particleColor,
      transparent: true,
      opacity: isDark ? 0.8 : 0.5,
      blending: THREE.AdditiveBlending
    })

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)

    // Geometric shapes
    const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
    const material = new THREE.MeshBasicMaterial({
      color: particleColor,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.3 : 0.25
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
