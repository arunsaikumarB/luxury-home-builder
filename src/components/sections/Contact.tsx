import { useState, type FormEvent } from 'react'
import { MapPin, Clock, Phone, Video, Navigation } from 'lucide-react'
import { siteConfig } from '@/data/content'
import { submitFormspree } from '@/lib/formspree'
import { Reveal } from '@/components/shared/Reveal'
import { cn } from '@/lib/utils'

type ContactTab = 'in-person' | 'virtual'
type FormStatus = 'idle' | 'sending' | 'success' | 'error'

export function Contact() {
  const [tab, setTab] = useState<ContactTab>('in-person')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('sending')
    setMessage('')

    const endpoint =
      tab === 'in-person' ? siteConfig.forms.contactInPerson : siteConfig.forms.contactVirtual

    const data = new FormData(form)
    data.set('contact_mode', tab === 'in-person' ? 'In Person' : 'Virtual')
    data.set('_subject', `Dream Home Builders — ${tab === 'in-person' ? 'In Person' : 'Virtual'} inquiry`)

    const result = await submitFormspree(endpoint, data)
    setStatus(result.ok ? 'success' : 'error')
    setMessage(result.message)
    if (result.ok) form.reset()
  }

  return (
    <section id="contact" className="relative bg-background py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10">
        <Reveal>
          <h2 className="font-display text-center text-[clamp(2.5rem,5vw,4rem)] text-foreground">
            Contact Us
          </h2>
        </Reveal>

        <div className="mt-10 flex items-center justify-center gap-10 border-b border-foreground/10">
          <button
            type="button"
            onClick={() => {
              setTab('in-person')
              setStatus('idle')
              setMessage('')
            }}
            className={cn(
              'relative flex items-center gap-2 pb-4 text-sm font-medium transition-colors',
              tab === 'in-person' ? 'text-secondary' : 'text-muted hover:text-foreground',
            )}
          >
            <MapPin className="h-4 w-4" />
            In Person
            {tab === 'in-person' && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-accent" />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('virtual')
              setStatus('idle')
              setMessage('')
            }}
            className={cn(
              'relative flex items-center gap-2 pb-4 text-sm font-medium transition-colors',
              tab === 'virtual' ? 'text-secondary' : 'text-muted hover:text-foreground',
            )}
          >
            <Video className="h-4 w-4" />
            Virtual
            {tab === 'virtual' && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-accent" />
            )}
          </button>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div>
              <p className="text-muted leading-relaxed max-w-md">
                {tab === 'in-person'
                  ? 'Prefer to chat over coffee? We’d love to host you at our Edison location to discuss your vision.'
                  : 'Prefer a virtual consultation? Share a few details and we’ll schedule a video call to walk through your project.'}
              </p>

              <ul className="mt-8 space-y-5">
                <li className="flex items-start gap-3 text-foreground">
                  <Navigation className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                  <span>{siteConfig.address}</span>
                </li>
                <li className="flex items-start gap-3 text-foreground">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                  <span>{siteConfig.hours}</span>
                </li>
                <li className="flex items-start gap-3 text-foreground">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                  <a href={`tel:${siteConfig.phone}`} className="hover:text-accent transition-colors">
                    {siteConfig.phone}
                  </a>
                </li>
              </ul>

              {tab === 'in-person' && (
                <div className="mt-8 overflow-hidden rounded-xl border border-foreground/10 bg-card shadow-sm">
                  <iframe
                    title="Dream Home Builders office map"
                    src={siteConfig.mapEmbedUrl}
                    className="h-64 w-full border-0 md:h-72"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <a
                    href={siteConfig.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-3 text-sm text-secondary hover:text-accent transition-colors"
                  >
                    View on Google Maps
                  </a>
                </div>
              )}

              {tab === 'virtual' && (
                <div className="mt-8 rounded-xl border border-foreground/10 bg-card p-6">
                  <p className="font-display text-2xl text-foreground">Virtual Studio</p>
                  <p className="mt-3 text-muted leading-relaxed">
                    We’ll send a secure meeting link after you submit the form. Available during
                    business hours — or by appointment.
                  </p>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              <p className="text-muted leading-relaxed max-w-md mb-6">
                We value your time. If you prefer, send us details of your project so we can be
                better prepared for a productive conversation.
              </p>

              <form
                onSubmit={onSubmit}
                className="rounded-xl border border-foreground/10 bg-card p-6 md:p-8 shadow-[0_10px_40px_rgba(17,17,17,0.04)]"
              >
                <label className="block">
                  <span className="sr-only">Full Name</span>
                  <input
                    required
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    className="w-full border border-foreground/15 bg-background px-4 py-3 text-sm outline-none transition focus:border-accent"
                  />
                </label>
                <label className="mt-4 block">
                  <span className="sr-only">Email Address</span>
                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    className="w-full border border-foreground/15 bg-background px-4 py-3 text-sm outline-none transition focus:border-accent"
                  />
                </label>
                <label className="mt-4 block">
                  <span className="sr-only">Project Details</span>
                  <textarea
                    required
                    name="message"
                    rows={5}
                    placeholder="Tell us about your project..."
                    className="w-full resize-none border border-foreground/15 bg-background px-4 py-3 text-sm outline-none transition focus:border-accent"
                  />
                </label>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="mt-5 w-full bg-secondary py-3.5 text-sm font-medium tracking-wide text-background transition hover:bg-accent hover:text-foreground disabled:opacity-60"
                >
                  {status === 'sending'
                    ? 'Sending...'
                    : status === 'success'
                      ? 'Message Sent'
                      : 'Send Message'}
                </button>
                {message && (
                  <p
                    className={cn(
                      'mt-3 text-sm',
                      status === 'error' ? 'text-red-600' : 'text-muted',
                    )}
                  >
                    {message}
                  </p>
                )}
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
