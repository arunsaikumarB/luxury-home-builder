import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { aboutHighlights } from '@/data/content'
import { Reveal } from '@/components/shared/Reveal'
import { SplitText } from '@/components/shared/SplitText'
import { ParallaxImage } from '@/components/shared/ParallaxImage'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

gsap.registerPlugin(ScrollTrigger)

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!sectionRef.current || reduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-mask',
        { clipPath: 'inset(12% 12% 12% 12%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'top 20%',
            scrub: 1,
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-10 -mt-8 rounded-t-[2.5rem] md:rounded-t-[3.5rem] bg-background pt-28 md:pt-36 pb-24 md:pb-36"
    >
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-center">
          <div>
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.3em] text-accent mb-5">
                Who We Are
              </p>
            </Reveal>
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05]">
              <SplitText triggerOnScroll stagger={0.03}>
                Architecture that lives beyond the blueprint.
              </SplitText>
            </h2>
            <Reveal delay={0.15}>
              <p className="mt-8 text-lg text-muted leading-relaxed max-w-xl">
                Dream Home Builder is a luxury construction atelier specializing in custom
                residences that feel cinematic yet deeply personal. We unite architects, artisans,
                and project directors around one standard: every home should feel inevitable.
              </p>
            </Reveal>

            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-foreground/10 pt-8">
              {aboutHighlights.map((item, i) => (
                <Reveal key={item.label} delay={0.1 * i}>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted">{item.label}</p>
                  <p className="mt-2 font-display text-2xl md:text-3xl">{item.value}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="about-mask relative aspect-[4/5] overflow-hidden rounded-sm">
            <ParallaxImage
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80"
              alt="Luxury living room interior"
              className="absolute inset-0 h-full w-full"
              speed={0.15}
            />
            <div className="absolute bottom-6 left-6 right-6 glass rounded-xl p-5 md:p-6">
              <p className="font-display text-2xl md:text-3xl leading-tight">
                Quiet luxury.
                <br />
                Uncompromising craft.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
