import { useState, type FormEvent } from 'react'
import { Hammer, CalendarDays } from 'lucide-react'
import { services } from '@/data/content'
import { Reveal } from '@/components/shared/Reveal'

export function Quote() {
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSent(true)
    window.setTimeout(() => setSent(false), 4000)
    e.currentTarget.reset()
  }

  return (
    <section id="quote" className="relative bg-[#F3F3F2] py-24 md:py-32">
      <div className="mx-auto max-w-[900px] px-5 md:px-10">
        <Reveal>
          <h2 className="font-display text-center text-[clamp(2.5rem,5vw,4rem)] text-foreground">
            Request a Quote
          </h2>
          <p className="mt-4 text-center text-muted italic max-w-2xl mx-auto leading-relaxed">
            Transparent pricing, no hidden surprises! Tell us about your dream project and we’ll
            provide a detailed estimate.
          </p>
          <div className="mx-auto mt-8 h-1 w-24 bg-accent" />
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} className="mt-12 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-secondary">
                  Service Required <span className="text-red-600">*</span>
                </span>
                <div className="relative">
                  <Hammer className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <select
                    required
                    name="service"
                    defaultValue=""
                    className="w-full appearance-none border border-foreground/15 bg-card py-3 pl-10 pr-4 text-sm outline-none transition focus:border-accent"
                  >
                    <option value="" disabled>
                      Choose a service...
                    </option>
                    {services.map((service) => (
                      <option key={service.id} value={service.title}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-secondary">
                  Approx. Budget (USD) <span className="text-red-600">*</span>
                </span>
                <input
                  required
                  name="budget"
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 50000"
                  className="w-full border border-foreground/15 bg-card px-4 py-3 text-sm outline-none transition focus:border-accent"
                />
              </label>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-secondary">
                  Total Square Footage (Optional)
                </span>
                <input
                  name="sqft"
                  type="text"
                  placeholder="e.g. 2,500 sq ft"
                  className="w-full border border-foreground/15 bg-card px-4 py-3 text-sm outline-none transition focus:border-accent"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-secondary">
                  Desired Start Date (Optional)
                </span>
                <div className="relative">
                  <input
                    name="startDate"
                    type="date"
                    className="w-full border border-foreground/15 bg-card px-4 py-3 text-sm outline-none transition focus:border-accent"
                  />
                  <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                </div>
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-secondary">
                Project Description <span className="text-red-600">*</span>
              </span>
              <textarea
                required
                name="description"
                rows={5}
                placeholder="Briefly describe your vision..."
                className="w-full resize-none border border-foreground/15 bg-card px-4 py-3 text-sm outline-none transition focus:border-accent"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-secondary">
                Location / Address <span className="text-red-600">*</span>
              </span>
              <input
                required
                name="location"
                type="text"
                placeholder="Where is the project located?"
                className="w-full border border-foreground/15 bg-card px-4 py-3 text-sm outline-none transition focus:border-accent"
              />
            </label>

            <button
              type="submit"
              className="w-full bg-secondary py-4 text-sm font-semibold uppercase tracking-[0.16em] text-background transition hover:bg-accent hover:text-foreground"
            >
              {sent ? 'Quote Request Sent' : 'Request Detailed Quote'}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
