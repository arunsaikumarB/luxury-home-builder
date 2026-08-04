import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  scale?: number
  blur?: boolean
  once?: boolean
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 48,
  scale = 1,
  blur: _blur = false,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!ref.current || reduced) return

    const tween = gsap.fromTo(
      ref.current,
      {
        opacity: 0,
        y,
        scale: scale === 1 ? 1 : scale,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.05,
        delay,
        ease: 'power4.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 88%',
          toggleActions: once ? 'play none none none' : 'play reverse play reverse',
        },
      },
    )

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [delay, y, scale, once, reduced])

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}
