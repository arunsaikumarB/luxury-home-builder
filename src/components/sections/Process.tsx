import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { processSteps } from '@/data/content'
import { Reveal } from '@/components/shared/Reveal'
import { SplitText } from '@/components/shared/SplitText'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

gsap.registerPlugin(ScrollTrigger)

export function Process() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!sectionRef.current || reduced) return

    const ctx = gsap.context(() => {
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.process-timeline',
              start: 'top 60%',
              end: 'bottom 40%',
              scrub: true,
            },
          },
        )
      }

      gsap.fromTo(
        '.process-step',
        { opacity: 0, x: -30, filter: 'blur(6px)' },
        {
          opacity: 1,
          x: 0,
          filter: 'blur(0px)',
          duration: 1.1,
          ease: 'power4.out',
          stagger: 0.2,
          scrollTrigger: {
            trigger: '.process-timeline',
            start: 'top 70%',
          },
        },
      )

      gsap.fromTo(
        '.process-icon',
        { scale: 0.6, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.2,
          scrollTrigger: {
            trigger: '.process-timeline',
            start: 'top 70%',
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="process" ref={sectionRef} className="relative bg-background py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="mb-16 md:mb-24 max-w-3xl">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.3em] text-accent mb-5">Our Process</p>
          </Reveal>
          <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)]">
            <SplitText triggerOnScroll stagger={0.03}>
              A clear path from vision to home.
            </SplitText>
          </h2>
        </div>

        <div className="process-timeline relative max-w-3xl mx-auto">
          <div className="absolute left-[19px] md:left-[27px] top-3 bottom-3 w-px bg-foreground/10 origin-top overflow-hidden">
            <div
              ref={lineRef}
              className="h-full w-full bg-accent origin-top"
              style={{ transform: 'scaleY(0)' }}
            />
          </div>

          <div className="space-y-16 md:space-y-24">
            {processSteps.map((step) => (
              <div
                key={step.step}
                className="process-step relative flex gap-6 md:gap-10"
                style={reduced ? undefined : { opacity: 0 }}
              >
                <div className="process-icon relative z-10 flex h-10 w-10 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-background text-accent font-display text-sm md:text-lg">
                  {step.step}
                </div>
                <div className="pt-1 md:pt-2">
                  <h3 className="font-display text-3xl md:text-4xl">{step.title}</h3>
                  <p className="mt-4 text-muted leading-relaxed max-w-lg">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
