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

function getSectionHash() {
  const hash = window.location.hash.replace(/^#/, '')
  if (!hash || hash === 'walkthrough' || hash === 'top') return null
  return hash
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    const sectionHash = getSectionHash()

    if (reduced) {
      if (sectionHash) {
        window.requestAnimationFrame(() => {
          document.getElementById(sectionHash)?.scrollIntoView()
        })
      } else {
        window.scrollTo(0, 0)
      }
      return
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.2,
    })

    window.__lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)

    const ticker = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)

    const bootId = window.setTimeout(() => {
      ScrollTrigger.refresh()
      if (sectionHash) {
        const el = document.getElementById(sectionHash)
        if (el) lenis.scrollTo(el, { offset: -20, immediate: true })
      } else {
        lenis.scrollTo(0, { immediate: true })
      }
    }, 80)

    return () => {
      window.clearTimeout(bootId)
      window.removeEventListener('resize', onResize)
      gsap.ticker.remove(ticker)
      if (window.__lenis === lenis) delete window.__lenis
      lenis.destroy()
    }
  }, [reduced])

  return <>{children}</>
}
