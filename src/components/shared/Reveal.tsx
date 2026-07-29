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
  blur = false,
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
        filter: blur ? 'blur(12px)' : 'blur(0px)',
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.2,
        delay,
        ease: 'power4.out',
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
  }, [delay, y, scale, blur, once, reduced])

  return (
    <div ref={ref} className={cn('will-change-transform', className)}>
      {children}
    </div>
  )
}
