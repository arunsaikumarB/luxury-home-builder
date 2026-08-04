import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MagneticButton } from '@/components/shared/MagneticButton'
import { SplitText } from '@/components/shared/SplitText'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

gsap.registerPlugin(ScrollTrigger)

export function CTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!sectionRef.current || !bgRef.current || reduced) return

    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: 15,
        scale: 1.1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[90vh] overflow-hidden flex items-center justify-center"
    >
      <div ref={bgRef} className="absolute inset-0 scale-110 will-change-transform">
        <img
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=85"
          alt="Luxury estate at dusk"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-5 text-center text-background py-32">
        <p className="text-[11px] uppercase tracking-[0.35em] text-background/60 mb-6">
          Begin the Conversation
        </p>
        <h2 className="font-display text-[clamp(2.8rem,7vw,6rem)] leading-[0.98]">
          <SplitText triggerOnScroll stagger={0.03}>
            Ready to build your dream home?
          </SplitText>
        </h2>
        <p className="mt-8 text-lg text-background/70 max-w-xl mx-auto leading-relaxed">
          Schedule a private consultation. We’ll explore your vision, your site, and the path to a
          residence worthy of New Jersey’s finest neighborhoods.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton as="a" href="#contact" strength={0.45}>
            <span className="inline-flex h-14 items-center bg-accent px-10 text-[12px] uppercase tracking-[0.22em] text-foreground transition-colors duration-500 hover:bg-background">
              Contact Us
            </span>
          </MagneticButton>
          <MagneticButton as="a" href="#quote" strength={0.4}>
            <span className="inline-flex h-14 items-center border border-background/40 px-10 text-[12px] uppercase tracking-[0.22em] text-background transition-all duration-500 hover:border-accent hover:text-accent">
              Request a Quote
            </span>
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}
