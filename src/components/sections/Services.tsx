import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PlusIcon } from 'lucide-react'
import { services } from '@/data/content'
import { Reveal } from '@/components/shared/Reveal'
import { SplitText } from '@/components/shared/SplitText'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogDescription,
  MorphingDialogImage,
  MorphingDialogSubtitle,
  MorphingDialogTitle,
  MorphingDialogTrigger,
} from '@/components/core/morphing-dialog'

gsap.registerPlugin(ScrollTrigger)

const dialogTransition = {
  type: 'spring' as const,
  bounce: 0.05,
  duration: 0.25,
}

export function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!sectionRef.current || reduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.service-card',
        { y: 80, opacity: 0, rotateX: 8 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.2,
          ease: 'power4.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 80%',
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="services" ref={sectionRef} className="relative bg-background py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="mb-16 md:mb-20 max-w-3xl">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.3em] text-accent mb-5">Capabilities</p>
          </Reveal>
          <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)]">
            <SplitText triggerOnScroll stagger={0.03}>
              Services shaped for exceptional homes.
            </SplitText>
          </h2>
        </div>

        <div className="services-grid grid gap-6 md:grid-cols-2 perspective-[1200px]">
          {services.map((service, i) => (
            <div
              key={service.id}
              className={cn('service-card will-change-transform', i % 2 === 1 && 'md:mt-12')}
              style={reduced ? undefined : { opacity: 0 }}
            >
              <MorphingDialog transition={dialogTransition}>
                <MorphingDialogTrigger
                  style={{ borderRadius: 4 }}
                  className="group flex w-full flex-col overflow-hidden bg-card text-left"
                  data-cursor="hover"
                >
                  <MorphingDialogImage
                    src={service.image}
                    alt={service.title}
                    className="aspect-[16/11] h-auto w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                  />
                  <div className="relative flex grow flex-row items-end justify-between gap-4 p-7 md:p-9">
                    <div>
                      <MorphingDialogSubtitle className="text-[10px] uppercase tracking-[0.25em] text-muted mb-3">
                        0{i + 1} · {service.subtitle}
                      </MorphingDialogSubtitle>
                      <MorphingDialogTitle className="font-display text-3xl md:text-4xl text-foreground">
                        {service.title}
                      </MorphingDialogTitle>
                      <p className="mt-5 text-muted leading-relaxed max-w-md">{service.description}</p>
                      <div className="mt-6 h-px w-0 bg-accent transition-all duration-700 group-hover:w-full" />
                    </div>
                    <span
                      className="relative mb-1 flex h-11 w-11 shrink-0 items-center justify-center border border-foreground/10 text-foreground transition-all duration-700 group-hover:border-accent group-hover:bg-accent"
                      aria-hidden
                    >
                      <PlusIcon size={16} />
                    </span>
                  </div>
                </MorphingDialogTrigger>

                <MorphingDialogContainer>
                  <MorphingDialogContent
                    style={{ borderRadius: 16 }}
                    className="pointer-events-auto relative flex h-auto w-full max-h-[min(90vh,880px)] flex-col overflow-y-auto border border-foreground/10 bg-background sm:w-[520px]"
                  >
                    <MorphingDialogImage
                      src={service.image}
                      alt={service.title}
                      className="h-56 w-full object-cover sm:h-64"
                    />
                    <div className="p-6 md:p-8">
                      <MorphingDialogTitle className="font-display text-3xl text-foreground">
                        {service.title}
                      </MorphingDialogTitle>
                      <MorphingDialogSubtitle className="mt-2 text-sm text-muted">
                        {service.subtitle}
                      </MorphingDialogSubtitle>
                      <MorphingDialogDescription
                        disableLayoutAnimation
                        variants={{
                          initial: { opacity: 0, scale: 0.96, y: 24 },
                          animate: { opacity: 1, scale: 1, y: 0 },
                          exit: { opacity: 0, scale: 0.96, y: 24 },
                        }}
                      >
                        <p className="mt-4 text-muted leading-relaxed">{service.description}</p>
                        <p className="mt-3 text-muted leading-relaxed">{service.details}</p>
                        <a
                          href="#quote"
                          className="mt-6 inline-flex text-sm uppercase tracking-[0.18em] text-secondary underline decoration-accent/60 underline-offset-4 transition-colors hover:text-accent"
                        >
                          Request a quote
                        </a>
                      </MorphingDialogDescription>
                    </div>
                    <MorphingDialogClose className="rounded-full bg-background/80 p-2 text-foreground shadow-sm backdrop-blur-sm hover:bg-accent hover:text-foreground" />
                  </MorphingDialogContent>
                </MorphingDialogContainer>
              </MorphingDialog>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
