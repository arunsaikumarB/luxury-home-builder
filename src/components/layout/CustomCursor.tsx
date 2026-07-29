import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useIsTouch } from '@/hooks/useMediaQuery'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const isTouch = useIsTouch()
  const pos = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const hovering = useRef(false)

  useEffect(() => {
    if (isTouch) return

    let raf = 0

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
      }
    }

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      hovering.current = Boolean(
        target.closest('a, button, [data-cursor="hover"], input, textarea'),
      )
      ringRef.current?.classList.toggle('is-hover', hovering.current)
    }

    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.18
      ring.current.y += (pos.current.y - ring.current.y) * 0.18
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(raf)
    }
  }, [isTouch])

  if (isTouch) return null

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}

export function FloatingShapes() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute -left-24 top-1/4 h-72 w-72 rounded-full border border-accent/10"
        animate={{ y: [0, 40, 0], x: [0, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-10 top-1/3 h-40 w-40 rounded-full bg-accent/5 blur-2xl"
        animate={{ y: [0, -50, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/2 h-64 w-64 -translate-x-1/2 rotate-12 border border-foreground/5"
        animate={{ rotate: [12, 24, 12], y: [0, 30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
