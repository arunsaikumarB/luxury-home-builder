import { useState, type FormEvent } from 'react'
import { Hammer, CalendarDays } from 'lucide-react'
import { services, siteConfig } from '@/data/content'
import { submitFormspree } from '@/lib/formspree'
import { Reveal } from '@/components/shared/Reveal'
import { cn } from '@/lib/utils'

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

export function Quote() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('sending')
    setMessage('')

    const data = new FormData(form)
    data.set('_subject', 'Dream Home Builders — Quote Request')

    const result = await submitFormspree(siteConfig.forms.quote, data)
    setStatus(result.ok ? 'success' : 'error')
    setMessage(result.message)
    if (result.ok) form.reset()
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
                  Full Name <span className="text-red-600">*</span>
                </span>
                <input
                  required
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  className="w-full border border-foreground/15 bg-card px-4 py-3 text-sm outline-none transition focus:border-accent"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-secondary">
                  Email Address <span className="text-red-600">*</span>
                </span>
                <input
                  required
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  className="w-full border border-foreground/15 bg-card px-4 py-3 text-sm outline-none transition focus:border-accent"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-secondary">
                Phone <span className="text-red-600">*</span>
              </span>
              <input
                required
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="(908) 555-0123"
                className="w-full border border-foreground/15 bg-card px-4 py-3 text-sm outline-none transition focus:border-accent"
              />
            </label>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-secondary">
                  Service Required <span className="text-red-600">*</span>
                </span>
                <div className="relative">
                  <Hammer className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <select
                    required
                    name="service_required"
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
                  placeholder="e.g. 85000"
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
                  name="square_footage"
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
                    name="start_date"
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
              disabled={status === 'sending'}
              className="w-full bg-secondary py-4 text-sm font-semibold uppercase tracking-[0.16em] text-background transition hover:bg-accent hover:text-foreground disabled:opacity-60"
            >
              {status === 'sending'
                ? 'Sending...'
                : status === 'success'
                  ? 'Quote Request Sent'
                  : 'Request Detailed Quote'}
            </button>
            {message && (
              <p className={cn('text-sm', status === 'error' ? 'text-red-600' : 'text-muted')}>
                {message}
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  )
}
