import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PlusIcon } from 'lucide-react'
import { projects } from '@/data/content'
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

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!sectionRef.current || reduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.project-card',
        { y: 80, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.15,
          ease: 'power4.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 78%',
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="projects" ref={sectionRef} className="relative bg-background py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-2xl">
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.3em] text-accent mb-5">Get Inspired</p>
            </Reveal>
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)]">
              <SplitText triggerOnScroll stagger={0.03}>
                Design inspiration for New Jersey homes.
              </SplitText>
            </h2>
          </div>
          <Reveal delay={0.15}>
            <p className="text-muted max-w-sm leading-relaxed">
              Mood, material, and atmosphere studies to help you imagine what’s possible — not a
              claim of completed portfolio projects.
            </p>
          </Reveal>
        </div>

        <div className="projects-grid columns-1 md:columns-2 gap-6 space-y-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className={cn(
                'project-card break-inside-avoid',
                project.tall ? 'aspect-[3/4]' : 'aspect-[4/3]',
              )}
              style={reduced ? undefined : { opacity: 0 }}
            >
              <MorphingDialog transition={dialogTransition}>
                <MorphingDialogTrigger
                  style={{ borderRadius: 4 }}
                  className="group relative h-full w-full overflow-hidden bg-card text-left"
                  data-cursor="hover"
                >
                  <MorphingDialogImage
                    src={project.image}
                    alt={`${project.title} — ${project.location}`}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-90" />

                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
                    <div>
                      <MorphingDialogSubtitle className="text-[10px] uppercase tracking-[0.25em] text-background/60 mb-2">
                        {project.category} · {project.size}
                      </MorphingDialogSubtitle>
                      <MorphingDialogTitle className="font-display text-3xl md:text-4xl text-background">
                        {project.title}
                      </MorphingDialogTitle>
                      <p className="mt-1 text-background/65">{project.location}</p>
                    </div>
                    <span
                      className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-background/30 text-background transition-all duration-700 group-hover:border-accent group-hover:bg-accent group-hover:text-foreground"
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
                      src={project.image}
                      alt={`${project.title} — ${project.location}`}
                      className="h-64 w-full object-cover sm:h-72"
                    />
                    <div className="p-6 md:p-8">
                      <MorphingDialogTitle className="font-display text-3xl text-foreground">
                        {project.title}
                      </MorphingDialogTitle>
                      <MorphingDialogSubtitle className="mt-2 text-sm text-muted">
                        {project.location} · {project.category} · {project.size}
                      </MorphingDialogSubtitle>
                      <MorphingDialogDescription
                        disableLayoutAnimation
                        variants={{
                          initial: { opacity: 0, scale: 0.96, y: 24 },
                          animate: { opacity: 1, scale: 1, y: 0 },
                          exit: { opacity: 0, scale: 0.96, y: 24 },
                        }}
                      >
                        <p className="mt-4 text-muted leading-relaxed">{project.details}</p>
                        <a
                          href="#contact"
                          className="mt-6 inline-flex text-sm uppercase tracking-[0.18em] text-secondary underline decoration-accent/60 underline-offset-4 transition-colors hover:text-accent"
                        >
                          Discuss a similar project
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
