import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { testimonials } from '@/data/content'
import { Reveal } from '@/components/shared/Reveal'
import { SplitText } from '@/components/shared/SplitText'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

gsap.registerPlugin(ScrollTrigger)

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current || reduced) return

    const track = trackRef.current
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.testimonial-card',
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'power4.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
          },
        },
      )

      // Measure half the duplicated track for a seamless loop
      const totalWidth = track.scrollWidth
      const loopWidth = totalWidth / 2

      gsap.set(track, { x: 0 })

      tweenRef.current = gsap.to(track, {
        x: -loopWidth,
        duration: Math.max(loopWidth / 60, 28),
        ease: 'none',
        repeat: -1,
      })
    }, sectionRef)

    const trackEl = trackRef.current
    const pause = () => tweenRef.current?.pause()
    const play = () => tweenRef.current?.play()

    trackEl.addEventListener('mouseenter', pause)
    trackEl.addEventListener('mouseleave', play)
    trackEl.addEventListener('touchstart', pause, { passive: true })
    trackEl.addEventListener('touchend', play)

    return () => {
      trackEl.removeEventListener('mouseenter', pause)
      trackEl.removeEventListener('mouseleave', play)
      trackEl.removeEventListener('touchstart', pause)
      trackEl.removeEventListener('touchend', play)
      tweenRef.current?.kill()
      ctx.revert()
    }
  }, [reduced])

  // Duplicate for seamless infinite loop
  const loop = [...testimonials, ...testimonials]

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-background py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 mb-16">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent mb-5">Testimonials</p>
        </Reveal>
        <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] max-w-3xl">
          <SplitText triggerOnScroll stagger={0.03}>
            Trusted by families who expect excellence.
          </SplitText>
        </h2>
      </div>

      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-6 px-5 md:px-10 w-max will-change-transform"
          style={{ transform: 'translate3d(0,0,0)' }}
        >
          {loop.map((item, i) => (
            <article
              key={`${item.name}-${i}`}
              className="testimonial-card glass group w-[min(85vw,420px)] shrink-0 rounded-2xl p-8 md:p-10"
              style={reduced ? undefined : { opacity: 0 }}
            >
              <p className="font-display text-2xl md:text-3xl leading-snug text-foreground/90">
                “{item.quote}”
              </p>
              <div className="mt-8 pt-6 border-t border-foreground/10">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted mt-1">{item.location}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
