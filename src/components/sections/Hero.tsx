import { useEffect, useRef, type MouseEvent } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { stats } from '@/data/content'
import { MagneticButton } from '@/components/shared/MagneticButton'
import { SplitText } from '@/components/shared/SplitText'
import { useCountUp } from '@/hooks/useCountUp'
import { useIsTouch, usePrefersReducedMotion } from '@/hooks/useMediaQuery'

gsap.registerPlugin(ScrollTrigger)

function StatCard({
  value,
  suffix,
  label,
  delay,
}: {
  value: number
  suffix: string
  label: string
  delay: number
}) {
  const { value: count, ref } = useCountUp({ end: value, duration: 2000 })

  return (
    <motion.div
      ref={ref as never}
      className="glass-dark rounded-2xl px-5 py-4 text-background min-w-[110px]"
      initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ delay, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.03 }}
      data-cursor="hover"
    >
      <p className="font-display text-3xl md:text-4xl leading-none">
        {count}
        {suffix}
      </p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-background/60">{label}</p>
    </motion.div>
  )
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isTouch = useIsTouch()
  const reduced = usePrefersReducedMotion()

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const springX = useSpring(mx, { stiffness: 60, damping: 20 })
  const springY = useSpring(my, { stiffness: 60, damping: 20 })
  const textX = useTransform(springX, (v) => v * 0.35)
  const textY = useTransform(springY, (v) => v * 0.35)
  const bgX = useTransform(springX, (v) => v * -0.15)
  const bgY = useTransform(springY, (v) => v * -0.15)

  useEffect(() => {
    if (!sectionRef.current || !bgRef.current || reduced) return

    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        scale: 1.18,
        duration: 18,
        ease: 'none',
        repeat: -1,
        yoyo: true,
      })

      gsap.to(contentRef.current, {
        yPercent: 28,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.to(bgRef.current, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced])

  const onMove = (e: MouseEvent) => {
    if (isTouch || reduced) return
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 40
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 30
    mx.set(x)
    my.set(y)
  }

  return (
    <section
      id="top"
      ref={sectionRef}
      onMouseMove={onMove}
      className="relative h-svh min-h-[700px] overflow-hidden"
    >
      <motion.div ref={bgRef} className="absolute inset-0 scale-110 will-change-transform" style={{ x: bgX, y: bgY }}>
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=85"
          alt="Luxury custom home exterior in New Jersey"
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />
      </motion.div>

      <div
        ref={contentRef}
        className="relative z-10 flex h-full flex-col justify-end pb-16 md:pb-24 px-5 md:px-10 max-w-[1600px] mx-auto"
      >
        <motion.div style={{ x: textX, y: textY }} className="max-w-4xl">
          <motion.p
            className="mb-6 text-[11px] uppercase tracking-[0.35em] text-background/70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            Dream Home Builder · New Jersey
          </motion.p>

          <h1 className="font-display text-[clamp(3rem,9vw,7.5rem)] text-background leading-[0.95]">
            <SplitText delay={0.45} stagger={0.035}>
              Building Dream Homes
            </SplitText>
            <br />
            <span className="text-background/85">
              <SplitText delay={0.85} stagger={0.035}>
                Across New Jersey
              </SplitText>
            </span>
          </h1>

          <motion.p
            className="mt-7 max-w-xl text-base md:text-lg text-background/70 leading-relaxed"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Custom estates crafted with architectural precision — where every detail elevates how
            you live.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.45, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <MagneticButton as="a" href="#contact" strength={0.45}>
              <span className="inline-flex h-14 items-center bg-accent px-8 text-[12px] uppercase tracking-[0.22em] text-foreground transition-all duration-500 hover:bg-background">
                Start Your Vision
              </span>
            </MagneticButton>
            <MagneticButton as="a" href="#projects" strength={0.4}>
              <span className="inline-flex h-14 items-center border border-background/35 px-8 text-[12px] uppercase tracking-[0.22em] text-background transition-all duration-500 hover:border-accent hover:text-accent">
                View Residences
              </span>
            </MagneticButton>
          </motion.div>
        </motion.div>

        <div className="mt-12 md:mt-16 flex flex-wrap gap-3 md:gap-4">
          {stats.map((stat, i) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={1.6 + i * 0.12}
            />
          ))}
        </div>
      </div>

      <motion.a
        href="#about"
        className="absolute bottom-8 right-5 md:right-10 z-10 flex flex-col items-center gap-2 text-background/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        data-cursor="hover"
        aria-label="Scroll to about"
      >
        <span className="text-[10px] uppercase tracking-[0.25em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="h-4 w-4" />
        </motion.span>
      </motion.a>
    </section>
  )
}
