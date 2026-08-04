import { useEffect, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

gsap.registerPlugin(ScrollTrigger)

function getSectionHash() {
  const hash = window.location.hash.replace(/^#/, '')
  if (!hash || hash === 'walkthrough' || hash === 'top') return null
  return hash
}

/** Native scroll only — Lenis + normalizeScroll conflicted with pinned video scrub. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    const sectionHash = getSectionHash()
    let resizeTimer = 0

    const refresh = () => ScrollTrigger.refresh()
    const go = () => {
      refresh()
      if (sectionHash) {
        const el = document.getElementById(sectionHash)
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 20
          window.scrollTo(0, Math.max(0, top))
          return
        }
      }
      window.scrollTo(0, 0)
    }

    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(refresh, 180)
    }

    go()
    const t1 = window.setTimeout(go, 150)
    window.addEventListener('load', go)
    window.addEventListener('resize', onResize)

    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(resizeTimer)
      window.removeEventListener('load', go)
      window.removeEventListener('resize', onResize)
    }
  }, [reduced])

  return <>{children}</>
}
