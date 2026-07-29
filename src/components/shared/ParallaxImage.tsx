import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

interface ParallaxImageProps {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  speed?: number
  zoom?: boolean
  children?: ReactNode
  loading?: 'lazy' | 'eager'
}

export function ParallaxImage({
  src,
  alt,
  className,
  imgClassName,
  speed = 0.2,
  zoom = true,
  children,
  loading = 'lazy',
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!containerRef.current || !imgRef.current || reduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imgRef.current,
        { yPercent: -speed * 50, scale: zoom ? 1.15 : 1 },
        {
          yPercent: speed * 50,
          scale: zoom ? 1 : 1,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    }, containerRef)

    return () => ctx.revert()
  }, [speed, zoom, reduced])

  return (
    <div ref={containerRef} className={cn('relative overflow-hidden', className)}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        className={cn('absolute inset-0 h-full w-full object-cover will-change-transform', imgClassName)}
      />
      {children}
    </div>
  )
}
