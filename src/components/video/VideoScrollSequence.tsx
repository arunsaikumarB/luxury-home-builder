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

const HERO_POSTER = '/videos/hero-poster.jpg?v=5'

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
            Loading cinematic walkthrough
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
  const max = Math.max(duration - 0.04, 0.001)
  return Math.min(Math.max(progress, 0), 1) * max
}

function quantizeTime(time: number, step = 1 / 12) {
  return Math.round(time / step) * step
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

async function prefetchVideoBlob(
  url: string,
  onProgress: (ratio: number) => void,
  signal?: AbortSignal,
): Promise<Blob> {
  const res = await fetch(url, { signal, cache: 'force-cache' })
  if (!res.ok) throw new Error(`Video fetch failed (${res.status})`)
  const type = (res.headers.get('content-type') || '').toLowerCase()
  if (type.includes('text/html')) throw new Error('Video returned HTML fallback')

  const total = Number(res.headers.get('content-length') || 0)
  if (!res.body) {
    onProgress(1)
    return res.blob()
  }

  const reader = res.body.getReader()
  const chunks: BlobPart[] = []
  let received = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    received += value.byteLength
    if (total > 0) onProgress(Math.min(received / total, 0.99))
    else onProgress(Math.min(0.15 + received / (32 * 1024 * 1024), 0.95))
  }

  onProgress(1)
  return new Blob(chunks, { type: type.includes('video') ? type : 'video/mp4' })
}

export function VideoScrollSequence({
  videos,
  videoSrc = walkthroughVideoSrc,
  scrollVhPerSection = 260,
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
  const blobUrlRef = useRef<string | null>(null)

  const targetProgressRef = useRef(0)
  const renderProgressRef = useRef(0)
  const activeIndexRef = useRef(0)
  const readyRef = useRef(false)
  const contentVisibleRef = useRef(false)
  const lastUiIndexRef = useRef(-1)
  const seekBusyRef = useRef(false)
  const pendingTimeRef = useRef(0)
  const lastAppliedTimeRef = useRef(-1)
  const rafRef = useRef(0)
  const wakeScrubRef = useRef<(() => void) | null>(null)

  const [ready, setReady] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [contentVisible, setContentVisible] = useState(false)
  const [playbackSrc, setPlaybackSrc] = useState<string | undefined>(undefined)

  const reduced = usePrefersReducedMotion()
  const chapterCount = videos.length

  const flushSeek = () => {
    const video = videoRef.current
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return
    if (seekBusyRef.current || video.readyState < 2) return

    const desired = Math.min(
      Math.max(quantizeTime(pendingTimeRef.current), 0.001),
      Math.max(video.duration - 0.04, 0.001),
    )
    if (Math.abs(desired - lastAppliedTimeRef.current) < 0.04) return
    if (Math.abs(video.currentTime - desired) < 0.035) {
      lastAppliedTimeRef.current = desired
      return
    }

    seekBusyRef.current = true
    lastAppliedTimeRef.current = desired
    try {
      video.currentTime = desired
    } catch {
      seekBusyRef.current = false
    }
  }

  const updateUi = (progress: number) => {
    const unit = progress * chapterCount
    const index = Math.min(Math.floor(unit), Math.max(chapterCount - 1, 0))
    const local = unit - index

    if (index !== activeIndexRef.current || lastUiIndexRef.current !== index) {
      activeIndexRef.current = index
      lastUiIndexRef.current = index
      setActiveIndex(index)
      onSectionChange?.(index)
    }

    applyOverlayFade(fadeRef.current, local)

    if (progressBarRef.current) progressBarRef.current.style.width = `${progress * 100}%`
    if (counterRef.current) {
      counterRef.current.textContent = `Scroll to explore · ${String(index + 1).padStart(2, '0')} / ${String(chapterCount).padStart(2, '0')}`
    }

    const show = progress > 0.008
    if (contentVisibleRef.current !== show) {
      contentVisibleRef.current = show
      setContentVisible(show)
    }
  }

  const skipWalkthrough = () => {
    targetProgressRef.current = 1
    renderProgressRef.current = 1
    pendingTimeRef.current = safeTime(videoRef.current?.duration || 1, 1)
    flushSeek()
    updateUi(1)

    const about = document.getElementById('about')
    if (about) {
      about.scrollIntoView({ behavior: 'smooth' })
      return
    }
    const st = triggerRef.current
    if (st) window.scrollTo({ top: st.end + 40, behavior: 'smooth' })
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onSeeked = () => {
      seekBusyRef.current = false
      flushSeek()
    }
    const onSeeking = () => {
      seekBusyRef.current = true
    }

    video.addEventListener('seeked', onSeeked)
    video.addEventListener('seeking', onSeeking)
    return () => {
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('seeking', onSeeking)
    }
  }, [ready, playbackSrc])

  useEffect(() => {
    let cancelled = false
    const abort = new AbortController()
    readyRef.current = false
    setReady(false)
    setPlaybackSrc(undefined)
    setLoadProgress(0.02)

    const boot = async () => {
      try {
        const blob = await prefetchVideoBlob(
          videoSrc,
          (ratio) => {
            if (!cancelled) setLoadProgress(0.05 + ratio * 0.78)
          },
          abort.signal,
        )
        if (cancelled) return

        if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
        const objectUrl = URL.createObjectURL(blob)
        blobUrlRef.current = objectUrl
        setPlaybackSrc(objectUrl)
        setLoadProgress(0.88)
      } catch (err) {
        if (cancelled || (err instanceof DOMException && err.name === 'AbortError')) return
        console.error('[walkthrough] Prefetch failed, falling back to direct src', err)
        setPlaybackSrc(videoSrc)
      }
    }

    void boot()

    const timeout = window.setTimeout(() => {
      if (!readyRef.current && !cancelled) {
        setPlaybackSrc((prev) => prev ?? videoSrc)
      }
    }, 20000)

    return () => {
      cancelled = true
      abort.abort()
      window.clearTimeout(timeout)
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = null
      }
    }
  }, [videoSrc, onReady])

  useEffect(() => {
    if (!playbackSrc) return
    let cancelled = false
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.playsInline = true
    video.preload = 'auto'

    const finish = async () => {
      if (cancelled || readyRef.current) return
      setLoadProgress(0.92)
      await unlockVideo(video)
      if (cancelled) return

      try {
        video.currentTime = 0.04
        await new Promise<void>((resolve) => {
          const done = () => resolve()
          video.addEventListener('seeked', done, { once: true })
          window.setTimeout(done, 900)
        })
      } catch {
        /* ignore */
      }
      if (cancelled) return

      targetProgressRef.current = 0
      renderProgressRef.current = 0
      pendingTimeRef.current = 0.04
      lastAppliedTimeRef.current = -1
      activeIndexRef.current = 0
      lastUiIndexRef.current = 0
      contentVisibleRef.current = false
      setContentVisible(false)
      setActiveIndex(0)

      if (!hasDeepLinkHash()) window.scrollTo(0, 0)

      readyRef.current = true
      setReady(true)
      setLoadProgress(1)
      onReady?.()
    }

    const onReadyData = () => {
      void finish()
    }

    if (video.readyState >= 2) {
      void finish()
    } else {
      video.addEventListener('loadeddata', onReadyData, { once: true })
      video.addEventListener('error', onReadyData, { once: true })
      window.setTimeout(onReadyData, 10000)
    }

    return () => {
      cancelled = true
      video.removeEventListener('loadeddata', onReadyData)
      video.removeEventListener('error', onReadyData)
    }
  }, [playbackSrc, onReady])

  useEffect(() => {
    if (!ready || reduced) return

    let running = true
    let idleFrames = 0

    const tick = () => {
      if (!running) return

      const target = targetProgressRef.current
      let current = renderProgressRef.current
      const delta = target - current
      const settled = Math.abs(delta) < 0.0005

      if (settled) {
        current = target
        renderProgressRef.current = current
        idleFrames += 1
      } else {
        idleFrames = 0
        const alpha = Math.abs(delta) > 0.12 ? 0.48 : 0.16
        current += delta * alpha
        if (Math.abs(target - current) < 0.0005) current = target
        renderProgressRef.current = current
      }

      const video = videoRef.current
      pendingTimeRef.current = safeTime(video?.duration || 1, current)

      // Keep seeking while catching up; skip decoder work once fully settled
      if (!settled || seekBusyRef.current || idleFrames < 2) {
        flushSeek()
      }
      updateUi(current)

      // Sleep the loop when scroll is idle to free CPU on Azure
      if (settled && !seekBusyRef.current && idleFrames > 8) {
        rafRef.current = 0
        return
      }

      rafRef.current = window.requestAnimationFrame(tick)
    }

    const wake = () => {
      if (rafRef.current) return
      idleFrames = 0
      rafRef.current = window.requestAnimationFrame(tick)
    }
    wakeScrubRef.current = wake

    const onScrollWake = () => wake()
    window.addEventListener('scroll', onScrollWake, { passive: true })
    rafRef.current = window.requestAnimationFrame(tick)

    return () => {
      running = false
      wakeScrubRef.current = null
      window.removeEventListener('scroll', onScrollWake)
      window.cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, reduced, chapterCount, onSectionChange])

  useEffect(() => {
    if (!ready || !containerRef.current || !pinRef.current || reduced) return

    targetProgressRef.current = 0
    renderProgressRef.current = 0
    contentVisibleRef.current = false
    setContentVisible(false)
    setActiveIndex(0)
    if (!hasDeepLinkHash()) window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      triggerRef.current = ScrollTrigger.create({
        id: 'walkthrough-sequence',
        trigger: containerRef.current,
        pin: pinRef.current,
        scrub: 0.55,
        pinSpacing: true,
        start: 'top top',
        end: () =>
          `+=${Math.round(chapterCount * window.innerHeight * (scrollVhPerSection / 100))}`,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        onUpdate: (self) => {
          targetProgressRef.current = self.progress
          wakeScrubRef.current?.()
        },
        onEnterBack: (self) => {
          targetProgressRef.current = self.progress
          renderProgressRef.current = self.progress
          wakeScrubRef.current?.()
        },
        onEnter: (self) => {
          targetProgressRef.current = self.progress
          renderProgressRef.current = self.progress
          wakeScrubRef.current?.()
        },
        onRefresh: (self) => {
          targetProgressRef.current = self.progress
          renderProgressRef.current = self.progress
          wakeScrubRef.current?.()
        },
      })
    }, containerRef)

    const refreshId = window.setTimeout(() => {
      if (!hasDeepLinkHash()) {
        window.scrollTo(0, 0)
        targetProgressRef.current = 0
        renderProgressRef.current = 0
      }
      ScrollTrigger.refresh()
    }, 120)

    const lateRefreshId = window.setTimeout(() => ScrollTrigger.refresh(), 700)

    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)

    return () => {
      window.clearTimeout(refreshId)
      window.clearTimeout(lateRefreshId)
      window.removeEventListener('load', onLoad)
      triggerRef.current = null
      ctx.revert()
    }
  }, [ready, chapterCount, scrollVhPerSection, reduced])

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
              src={playbackSrc}
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

          <AnimatePresence mode="sync">
            {contentVisible && videos[activeIndex] && (
              <motion.div
                key={videos[activeIndex].id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
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
              className="group inline-flex items-center gap-2 border border-background/25 bg-background/20 px-4 py-2.5 text-[10px] uppercase tracking-[0.22em] text-background/85 transition-colors duration-500 hover:border-accent hover:bg-accent hover:text-foreground cursor-pointer"
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
