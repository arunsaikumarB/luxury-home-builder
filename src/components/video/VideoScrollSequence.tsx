import { useEffect, useRef, useState, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronsDown } from 'lucide-react'
import { MagneticButton } from '@/components/shared/MagneticButton'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { walkthroughVideoSrc, type WalkthroughSection } from '@/data/walkthrough'

gsap.registerPlugin(ScrollTrigger)

const HERO_POSTER = '/videos/hero-poster.jpg?v=2'

function hasDeepLinkHash() {
  const hash = window.location.hash.replace(/^#/, '')
  return Boolean(hash) && hash !== 'walkthrough' && hash !== 'top'
}

export type VideoScrollSequenceProps = {
  videos: WalkthroughSection[]
  videoSrc?: string
  scrollVhPerSection?: number
  objectFit?: 'cover' | 'contain'
  className?: string
  onReady?: () => void
  onSectionChange?: (index: number) => void
}

function OverlayContent({
  section,
  fadeRef,
}: {
  section: WalkthroughSection
  fadeRef: RefObject<HTMLDivElement | null>
}) {
  return (
    <div
      ref={fadeRef}
      className="pointer-events-none absolute inset-0 z-10 flex items-end md:items-center will-change-[opacity]"
      style={{ opacity: 1 }}
    >
      <div className="pointer-events-auto mx-auto w-full max-w-[1600px] px-5 md:px-10 pb-20 md:pb-0">
        {section.variant === 'hero' && (
          <div className="max-w-4xl">
            <p className="mb-5 text-[11px] uppercase tracking-[0.35em] text-background/65">
              {section.label}
            </p>
            <p className="font-display text-[clamp(2.8rem,8vw,6.5rem)] leading-[0.95] text-background text-balance">
              {section.headline}
            </p>
            <p className="mt-7 max-w-xl text-base md:text-lg text-background/70 leading-relaxed">
              {section.description}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              {section.cta && (
                <MagneticButton as="a" href={section.cta.href} strength={0.45}>
                  <span className="inline-flex h-14 items-center bg-accent px-8 text-[12px] uppercase tracking-[0.22em] text-foreground transition-colors duration-500 hover:bg-background">
                    {section.cta.label}
                  </span>
                </MagneticButton>
              )}
              {section.secondaryCta && (
                <MagneticButton as="a" href={section.secondaryCta.href} strength={0.4}>
                  <span className="inline-flex h-14 items-center border border-background/35 px-8 text-[12px] uppercase tracking-[0.22em] text-background transition-colors duration-500 hover:border-accent hover:text-accent">
                    {section.secondaryCta.label}
                  </span>
                </MagneticButton>
              )}
            </div>
          </div>
        )}

        {section.variant === 'features' && (
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="max-w-2xl">
              <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-accent">{section.label}</p>
              <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] text-background leading-[1.02]">
                {section.title}
              </h2>
              <p className="mt-6 text-lg text-background/70 leading-relaxed max-w-xl">
                {section.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {section.features?.map((feature) => (
                <div key={feature} className="glass-dark rounded-2xl px-5 py-4 text-background">
                  <p className="text-sm md:text-base leading-snug">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {section.variant === 'editorial' && (
          <div className="max-w-3xl ml-auto text-right">
            <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-accent">{section.label}</p>
            <h2 className="font-display text-[clamp(2.8rem,7vw,5.5rem)] text-background leading-[1.02]">
              {section.title}
            </h2>
            <p className="mt-6 text-lg text-background/70 leading-relaxed ml-auto max-w-lg">
              {section.description}
            </p>
            <div className="mt-8 flex flex-wrap justify-end gap-3">
              {section.features?.map((feature) => (
                <span
                  key={feature}
                  className="glass-dark rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-background/85"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {section.variant === 'cards' && (
          <div className="w-full max-w-6xl">
            <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-accent">{section.label}</p>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] text-background mb-8">
              {section.title}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
              {section.features?.map((feature, i) => (
                <div
                  key={feature}
                  className="glass-dark flex h-full min-h-[140px] flex-col justify-between rounded-2xl p-5 text-background"
                >
                  <p className="text-[10px] uppercase tracking-[0.25em] text-background/45">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <p className="font-display text-xl md:text-2xl leading-tight mt-6">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {section.variant === 'list' && (
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-accent">{section.label}</p>
              <h2 className="font-display text-[clamp(2.8rem,7vw,5.5rem)] text-background leading-[1.02]">
                {section.headline ?? section.title}
              </h2>
              <p className="mt-6 text-lg text-background/70 leading-relaxed max-w-lg">
                {section.description}
              </p>
            </div>
            <ul className="space-y-0 border-t border-background/15">
              {section.features?.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center justify-between border-b border-background/15 py-4 text-background"
                >
                  <span className="font-display text-2xl md:text-3xl">{feature}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                </li>
              ))}
            </ul>
          </div>
        )}

        {section.variant === 'experience' && (
          <div className="max-w-2xl">
            <div className="glass-dark rounded-3xl p-8 md:p-10 text-background">
              <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-accent">{section.label}</p>
              <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02]">
                {section.title}
              </h2>
              <p className="mt-6 text-background/70 leading-relaxed">{section.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {section.features?.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full border border-background/20 px-4 py-2 text-[11px] uppercase tracking-[0.16em]"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {section.variant === 'finale' && (
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-5 text-[11px] uppercase tracking-[0.35em] text-accent">{section.label}</p>
            <h2 className="font-display text-[clamp(2.8rem,7vw,5.5rem)] text-background leading-[1.02] text-balance">
              {section.headline ?? section.title}
            </h2>
            <p className="mt-7 text-lg text-background/70 leading-relaxed mx-auto max-w-xl">
              {section.description}
            </p>
            {section.cta && (
              <div className="mt-10 flex justify-center">
                <MagneticButton as="a" href={section.cta.href} strength={0.45}>
                  <span className="inline-flex h-14 items-center bg-accent px-10 text-[12px] uppercase tracking-[0.22em] text-foreground transition-colors duration-500 hover:bg-background">
                    {section.cta.label}
                  </span>
                </MagneticButton>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function LoadingScreen({ progress, visible }: { progress: number; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0c0c0c] text-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }}
        >
          <p className="font-display text-3xl md:text-5xl tracking-tight">Dream Home Builders</p>
          <p className="mt-3 text-[11px] uppercase tracking-[0.35em] text-background/50">
            Preparing cinematic walkthrough
          </p>
          <div className="mt-12 h-px w-48 overflow-hidden bg-background/15">
            <div
              className="h-full origin-left bg-accent transition-transform duration-300 ease-out"
              style={{ transform: `scaleX(${Math.max(0.04, progress)})` }}
            />
          </div>
          <p className="mt-4 text-[11px] tracking-[0.2em] text-background/40">
            {Math.round(progress * 100)}%
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function applyOverlayFade(el: HTMLDivElement | null, local: number) {
  if (!el) return
  let opacity = 1
  if (local < 0.06) opacity = 0.55 + (local / 0.06) * 0.45
  else if (local > 0.9) opacity = Math.max(0.4, (1 - local) / 0.1)
  el.style.opacity = String(opacity)
}

function safeTime(duration: number, progress: number) {
  if (!Number.isFinite(duration) || duration <= 0) return 0.001
  const max = Math.max(duration - 0.05, 0.001)
  return Math.min(Math.max(progress, 0), 1) * max
}

async function unlockVideo(video: HTMLVideoElement) {
  video.muted = true
  video.playsInline = true
  try {
    await video.play()
  } catch {
    /* muted autoplay */
  }
  video.pause()
  try {
    if (!video.seeking) video.currentTime = 0.001
  } catch {
    /* ignore */
  }
  await new Promise<void>((resolve) => {
    if (video.readyState >= 2) {
      resolve()
      return
    }
    const done = () => resolve()
    video.addEventListener('loadeddata', done, { once: true })
    video.addEventListener('seeked', done, { once: true })
    window.setTimeout(done, 2500)
  })
}

function seekVideo(video: HTMLVideoElement, time: number, minDelta = 0.05) {
  if (!Number.isFinite(video.duration) || video.duration <= 0) return
  if (video.seeking || video.readyState < 2) return
  const desired = Math.min(Math.max(time, 0.001), Math.max(video.duration - 0.05, 0.001))
  if (Math.abs(video.currentTime - desired) < minDelta) return
  try {
    video.currentTime = desired
  } catch {
    /* ignore */
  }
}

export function VideoScrollSequence({
  videos,
  videoSrc = walkthroughVideoSrc,
  scrollVhPerSection = 220,
  objectFit = 'cover',
  className,
  onReady,
  onSectionChange,
}: VideoScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const fadeRef = useRef<HTMLDivElement | null>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)

  const smoothProgressRef = useRef(0)
  const activeIndexRef = useRef(0)
  const readyRef = useRef(false)
  const contentVisibleRef = useRef(false)
  const lastUiIndexRef = useRef(-1)
  const lastSeekMsRef = useRef(0)
  const lastSeekTimeRef = useRef(-1)

  const [ready, setReady] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [contentVisible, setContentVisible] = useState(false)

  const reduced = usePrefersReducedMotion()
  const chapterCount = videos.length

  const applyProgress = (progressRaw: number, force = false) => {
    const progress = Math.min(Math.max(progressRaw, 0), 1)
    smoothProgressRef.current = progress

    const unit = progress * chapterCount
    const index = Math.min(Math.floor(unit), chapterCount - 1)
    const local = unit - index

    if (index !== activeIndexRef.current || lastUiIndexRef.current !== index) {
      activeIndexRef.current = index
      lastUiIndexRef.current = index
      setActiveIndex(index)
      onSectionChange?.(index)
    }

    const video = videoRef.current
    const now = performance.now()
    // Throttle seeks; denser keyframes allow slightly more frequent updates
    if (video && (force || now - lastSeekMsRef.current > 70)) {
      const t = safeTime(video.duration || 1, progress)
      // Skip tiny seeks that browsers can't resolve smoothly
      if (force || Math.abs(t - lastSeekTimeRef.current) >= 0.08) {
        lastSeekMsRef.current = now
        lastSeekTimeRef.current = t
        seekVideo(video, t, force ? 0.02 : 0.1)
      }
    }

    applyOverlayFade(fadeRef.current, local)

    if (progressBarRef.current) progressBarRef.current.style.width = `${progress * 100}%`
    if (counterRef.current) {
      counterRef.current.textContent = `Scroll to explore · ${String(index + 1).padStart(2, '0')} / ${String(chapterCount).padStart(2, '0')}`
    }

    const show = progress > 0.01
    if (contentVisibleRef.current !== show) {
      contentVisibleRef.current = show
      setContentVisible(show)
    }
  }

  const skipWalkthrough = () => {
    applyProgress(1, true)
    const about = document.getElementById('about')
    if (about) {
      about.scrollIntoView({ behavior: 'smooth' })
      return
    }
    const st = triggerRef.current
    if (st) window.scrollTo({ top: st.end + 40, behavior: 'smooth' })
  }

  // Preload single film
  useEffect(() => {
    let cancelled = false
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.playsInline = true
    video.preload = 'auto'
    video.pause()

    const markReady = () => {
      if (cancelled || readyRef.current) return
      readyRef.current = true
      setReady(true)
      setLoadProgress(1)
      onReady?.()
    }

    const boot = async () => {
      setLoadProgress(0.12)

      // Fail fast if Azure/SWA returns HTML fallback instead of video/mp4
      try {
        const probe = await fetch(videoSrc, { method: 'HEAD', cache: 'no-store' })
        const type = (probe.headers.get('content-type') || '').toLowerCase()
        if (!probe.ok || type.includes('text/html')) {
          console.error('[walkthrough] Video asset missing or mis-served', {
            status: probe.status,
            type,
            src: videoSrc,
          })
          // Still show poster + UI rather than infinite loader
          markReady()
          return
        }
      } catch {
        /* continue — HEAD may be blocked; rely on video element events */
      }

      if (cancelled) return
      setLoadProgress(0.28)

      await new Promise<void>((resolve) => {
        if (video.readyState >= 2 && Number.isFinite(video.duration) && video.duration > 0) {
          resolve()
          return
        }
        const done = () => resolve()
        video.addEventListener('loadeddata', done, { once: true })
        video.addEventListener('canplay', done, { once: true })
        video.addEventListener('error', done, { once: true })
        window.setTimeout(done, 12000)
      })
      if (cancelled) return

      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        console.error('[walkthrough] Video failed to decode', videoSrc)
        markReady()
        return
      }

      setLoadProgress(0.6)
      await unlockVideo(video)
      if (cancelled) return
      setLoadProgress(0.9)

      // Paint first frame for browsers that stay blank until seeked
      try {
        video.currentTime = 0.05
        await new Promise<void>((resolve) => {
          const done = () => resolve()
          video.addEventListener('seeked', done, { once: true })
          window.setTimeout(done, 800)
        })
      } catch {
        /* ignore */
      }

      smoothProgressRef.current = 0
      activeIndexRef.current = 0
      lastUiIndexRef.current = 0
      contentVisibleRef.current = false
      setContentVisible(false)
      setActiveIndex(0)

      if (!hasDeepLinkHash()) {
        window.scrollTo(0, 0)
      }

      markReady()
    }

    void boot()

    const timeout = window.setTimeout(() => {
      markReady()
    }, 14000)

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [videoSrc, onReady])

  // Native ScrollTrigger — one film, progress 0→1
  useEffect(() => {
    if (!ready || !containerRef.current || !pinRef.current || reduced) return

    smoothProgressRef.current = 0
    contentVisibleRef.current = false
    setContentVisible(false)
    setActiveIndex(0)
    if (!hasDeepLinkHash()) {
      window.scrollTo(0, 0)
    }

    const onScrollProgress = (progress: number, forceSnap = false) => {
      if (forceSnap) {
        smoothProgressRef.current = progress
        applyProgress(progress, true)
        return
      }
      // Light lerp so scrub doesn't stutter on trackpad bursts
      smoothProgressRef.current += (progress - smoothProgressRef.current) * 0.42
      applyProgress(smoothProgressRef.current)
    }

    const ctx = gsap.context(() => {
      triggerRef.current = ScrollTrigger.create({
        id: 'walkthrough-sequence',
        trigger: containerRef.current,
        pin: pinRef.current,
        scrub: true,
        pinSpacing: true,
        start: 'top top',
        end: () =>
          `+=${Math.round(chapterCount * window.innerHeight * (scrollVhPerSection / 100))}`,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        onUpdate: (self) => {
          onScrollProgress(self.progress)
        },
        onEnterBack: (self) => {
          onScrollProgress(self.progress, true)
        },
        onEnter: (self) => {
          onScrollProgress(self.progress, true)
        },
        onRefresh: (self) => {
          onScrollProgress(self.progress, true)
        },
      })
    }, containerRef)

    const refreshId = window.setTimeout(() => {
      if (!hasDeepLinkHash()) {
        window.scrollTo(0, 0)
        smoothProgressRef.current = 0
      }
      ScrollTrigger.refresh()
    }, 100)

    const lateRefreshIds = [300, 900, 1800].map((ms) =>
      window.setTimeout(() => ScrollTrigger.refresh(), ms),
    )

    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)

    return () => {
      window.clearTimeout(refreshId)
      lateRefreshIds.forEach((id) => window.clearTimeout(id))
      window.removeEventListener('load', onLoad)
      triggerRef.current = null
      ctx.revert()
    }
    // applyProgress closes over chapterCount / refs — intentional
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, chapterCount, scrollVhPerSection, reduced, onSectionChange])

  useEffect(() => {
    if (!reduced || !ready) return
    contentVisibleRef.current = true
    setContentVisible(true)
    applyOverlayFade(fadeRef.current, 0.5)
  }, [reduced, ready])

  useEffect(() => {
    if (!ready || !contentVisible) return
    const id = window.requestAnimationFrame(() => applyOverlayFade(fadeRef.current, 0.35))
    return () => window.cancelAnimationFrame(id)
  }, [activeIndex, ready, contentVisible])

  return (
    <>
      <LoadingScreen progress={loadProgress} visible={!ready} />

      <section
        ref={containerRef}
        id="walkthrough"
        className={cn('relative bg-[#0c0c0c]', className)}
        aria-label="Cinematic home walkthrough"
      >
        <h1 className="sr-only">
          Dream Home Builders — custom home construction across New Jersey
        </h1>
        <div ref={pinRef} className="relative h-screen w-full overflow-hidden bg-[#0c0c0c]">
          <div className="absolute inset-0 bg-[#121212]">
            <video
              ref={videoRef}
              src={videoSrc}
              poster={HERO_POSTER}
              className="absolute inset-0 h-full w-full"
              style={{
                objectFit,
                opacity: 1,
                zIndex: 2,
                transform: 'translateZ(0)',
                backgroundColor: '#121212',
              }}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              controls={false}
              tabIndex={-1}
              aria-hidden
            />
            <div className="pointer-events-none absolute inset-0 z-[4] bg-gradient-to-b from-black/35 via-black/10 to-black/45" />
            <div className="pointer-events-none absolute inset-0 z-[4] bg-gradient-to-r from-black/25 via-transparent to-black/15" />
          </div>

          <AnimatePresence mode="wait">
            {contentVisible && videos[activeIndex] && (
              <motion.div
                key={videos[activeIndex].id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 z-10"
              >
                <OverlayContent section={videos[activeIndex]} fadeRef={fadeRef} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-0 left-0 right-0 z-20 h-[2px] bg-background/10">
            <div ref={progressBarRef} className="h-full w-0 bg-accent" />
          </div>

          <div className="absolute bottom-5 left-0 right-0 z-20 flex items-center justify-between gap-4 px-5 md:px-10">
            <div
              ref={counterRef}
              className="text-[10px] uppercase tracking-[0.28em] text-background/45"
            >
              Scroll to explore · 01 / {String(chapterCount).padStart(2, '0')}
            </div>

            <button
              type="button"
              onClick={skipWalkthrough}
              className="group inline-flex items-center gap-2 border border-background/25 bg-background/10 px-4 py-2.5 text-[10px] uppercase tracking-[0.22em] text-background/85 backdrop-blur-md transition-all duration-500 hover:border-accent hover:bg-accent hover:text-foreground cursor-pointer"
            >
              Skip Scroll
              <ChevronsDown className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-y-0.5" />
            </button>
          </div>
        </div>

        {reduced && (
          <div className="relative z-10 bg-background px-5 py-24 md:px-10">
            {videos.map((section) => (
              <div key={section.id} className="mb-16 max-w-3xl">
                <p className="text-accent text-[11px] uppercase tracking-[0.3em] mb-3">{section.label}</p>
                <h2 className="font-display text-4xl">{section.title}</h2>
                <p className="mt-4 text-muted">{section.description}</p>
              </div>
            ))}
            <button
              type="button"
              onClick={skipWalkthrough}
              className="mt-4 text-sm uppercase tracking-[0.2em] text-accent"
            >
              Continue to site
            </button>
          </div>
        )}
      </section>
    </>
  )
}
