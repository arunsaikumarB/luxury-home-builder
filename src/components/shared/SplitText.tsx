import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

interface SplitTextProps {
  children: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  delay?: number
  stagger?: number
  triggerOnScroll?: boolean
}

export function SplitText({
  children,
  className,
  as: Tag = 'span',
  delay = 0,
  stagger = 0.04,
  triggerOnScroll = false,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const words = children.split(' ')

  useEffect(() => {
    if (!ref.current || reduced) return
    const chars = ref.current.querySelectorAll('.split-char')

    const tween = gsap.fromTo(
      chars,
      { yPercent: 110, opacity: 0, rotateX: -40 },
      {
        yPercent: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger,
        delay,
        ...(triggerOnScroll
          ? {
              scrollTrigger: {
                trigger: ref.current,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          : {}),
      },
    )

    return () => {
      tween.kill()
    }
  }, [children, delay, stagger, triggerOnScroll, reduced])

  return (
    <Tag ref={ref as never} className={cn('inline-block', className)} aria-label={children}>
      {words.map((word, wi) => (
        <span key={`${word}-${wi}`} className="inline-block overflow-hidden mr-[0.28em] align-top">
          {word.split('').map((char, ci) => (
            <span
              key={`${char}-${ci}`}
              className="split-char inline-block will-change-transform"
              style={reduced ? undefined : { opacity: 0 }}
              aria-hidden="true"
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  )
}
