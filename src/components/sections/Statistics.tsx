import { stats } from '@/data/content'
import { Reveal } from '@/components/shared/Reveal'
import { useCountUp } from '@/hooks/useCountUp'

function StatItem({
  value,
  suffix,
  label,
}: {
  value: number
  suffix: string
  label: string
}) {
  const { value: count, ref } = useCountUp({ end: value, duration: 2200 })

  return (
    <div ref={ref as never} className="text-center md:text-left">
      <p className="font-display text-[clamp(3.5rem,8vw,7rem)] leading-none tracking-tight">
        {count}
        <span className="text-accent">{suffix}</span>
      </p>
      <p className="mt-3 text-[11px] uppercase tracking-[0.28em] text-muted">{label}</p>
    </div>
  )
}

export function Statistics() {
  return (
    <section className="relative overflow-hidden bg-secondary text-background py-24 md:py-32">
      <div className="absolute inset-0 opacity-30">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=65"
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-secondary/85" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent mb-12 md:mb-16">
            By The Numbers
          </p>
        </Reveal>
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.12}>
              <StatItem value={stat.value} suffix={stat.suffix} label={stat.label} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
