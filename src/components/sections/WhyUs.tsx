import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { whyUs } from '@/data/content'
import { Reveal } from '@/components/shared/Reveal'
import { SplitText } from '@/components/shared/SplitText'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

export function WhyUs() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!sectionRef.current || reduced) return

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('.why-panel')

      panels.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        })

        gsap.fromTo(
          panel.querySelector('.why-copy'),
          { opacity: 0, y: 40, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 70%',
            },
          },
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="why-us" ref={sectionRef} className="relative bg-background py-24 md:py-16">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 mb-16 md:mb-20">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent mb-5">Why Us</p>
        </Reveal>
        <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] max-w-3xl">
          <SplitText triggerOnScroll stagger={0.03}>
            The difference is in the unseen details.
          </SplitText>
        </h2>
      </div>

      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="relative hidden lg:block">
            <div className="sticky top-28 h-[70vh] overflow-hidden rounded-sm">
              {whyUs.map((item, i) => (
                <div
                  key={item.title}
                  className={cn(
                    'absolute inset-0 transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)]',
                    active === i ? 'opacity-100 scale-100' : 'opacity-0 scale-105',
                  )}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              ))}
              <div className="absolute bottom-6 left-6 glass-dark rounded-xl px-5 py-3 text-background">
                <p className="text-[10px] uppercase tracking-[0.25em] text-background/55">Feature</p>
                <p className="font-display text-2xl mt-1">0{active + 1}</p>
              </div>
            </div>
          </div>

          <div className="space-y-0">
            {whyUs.map((item, i) => (
              <div
                key={item.title}
                className="why-panel min-h-[55vh] lg:min-h-[70vh] flex flex-col justify-center border-t border-foreground/10 py-16"
              >
                <div className="why-copy">
                  <div className="lg:hidden mb-8 aspect-[16/10] overflow-hidden rounded-sm">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-muted mb-4">
                    0{i + 1} / 0{whyUs.length}
                  </p>
                  <h3 className="font-display text-4xl md:text-5xl leading-tight">{item.title}</h3>
                  <p className="mt-6 text-lg text-muted leading-relaxed max-w-lg">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
