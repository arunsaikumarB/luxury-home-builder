import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

gsap.registerPlugin(ScrollTrigger)

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    // Hard refresh / first paint: always begin at the top of the page
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    if (reduced) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.2,
    })

    window.__lenis = lenis
    lenis.scrollTo(0, { immediate: true })
    lenis.on('scroll', ScrollTrigger.update)

    const ticker = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)

    // After layout + ScrollTrigger init, pin scroll at the start again
    const resetId = window.setTimeout(() => {
      lenis.scrollTo(0, { immediate: true })
      ScrollTrigger.refresh()
    }, 50)

    return () => {
      window.clearTimeout(resetId)
      window.removeEventListener('resize', onResize)
      gsap.ticker.remove(ticker)
      if (window.__lenis === lenis) delete window.__lenis
      lenis.destroy()
    }
  }, [reduced])

  return <>{children}</>
}
