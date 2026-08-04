import { useEffect, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIsTouch, usePrefersReducedMotion } from '@/hooks/useMediaQuery'

gsap.registerPlugin(ScrollTrigger)

function getSectionHash() {
  const hash = window.location.hash.replace(/^#/, '')
  if (!hash || hash === 'walkthrough' || hash === 'top') return null
  return hash
}

/** Native scroll only — Lenis + pinned video scrub stuck the Azure deploy. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion()
  const isTouch = useIsTouch()

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    const sectionHash = getSectionHash()

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

    go()
    const t1 = window.setTimeout(go, 120)
    const t2 = window.setTimeout(refresh, 600)
    window.addEventListener('load', go)
    window.addEventListener('resize', refresh)

    if (!reduced && isTouch) {
      ScrollTrigger.normalizeScroll(true)
    }

    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.removeEventListener('load', go)
      window.removeEventListener('resize', refresh)
      ScrollTrigger.normalizeScroll(false)
    }
  }, [reduced, isTouch])

  return <>{children}</>
}
