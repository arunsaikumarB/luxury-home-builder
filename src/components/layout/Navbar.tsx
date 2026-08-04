import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { navLinks, siteConfig } from '@/data/content'
import { MagneticButton } from '@/components/shared/MagneticButton'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
          scrolled ? 'py-3' : 'py-6',
        )}
      >
        <div
          className={cn(
            'mx-auto flex max-w-[1600px] items-center justify-between px-5 md:px-10 transition-all duration-700',
            scrolled &&
              'mx-4 md:mx-8 rounded-full glass px-6 py-3 shadow-[0_10px_40px_rgba(17,17,17,0.06)]',
          )}
        >
          <a
            href="#walkthrough"
            className={cn(
              'font-display text-xl md:text-2xl tracking-tight transition-all duration-700',
              scrolled ? 'scale-95 text-foreground' : 'text-background',
            )}
          >
            {siteConfig.name}
            <span className="text-accent">.</span>
          </a>

          <nav className="hidden lg:flex items-center gap-10" aria-label="Primary">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  'group relative text-[13px] uppercase tracking-[0.18em] transition-colors duration-500',
                  scrolled
                    ? 'text-foreground/70 hover:text-foreground'
                    : 'text-background/80 hover:text-background',
                )}
                data-cursor="hover"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="hidden lg:block">
            <MagneticButton as="a" href="#quote" strength={0.4}>
              <span
                className={cn(
                  'inline-flex h-11 items-center px-6 text-[12px] uppercase tracking-[0.2em] transition-colors duration-500',
                  scrolled
                    ? 'bg-foreground text-background hover:bg-accent hover:text-foreground'
                    : 'bg-accent text-foreground hover:bg-background',
                )}
              >
                Request Quote
              </span>
            </MagneticButton>
          </div>

          <button
            type="button"
            className={cn(
              'lg:hidden inline-flex h-11 w-11 items-center justify-center',
              scrolled ? 'text-foreground' : 'text-background',
            )}
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            data-cursor="hover"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] bg-foreground text-background"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex h-full flex-col px-6 py-6 md:px-10">
              <div className="flex items-center justify-between">
                <span className="font-display text-3xl">
                  {siteConfig.name}<span className="text-accent">.</span>
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  data-cursor="hover"
                  className="h-11 w-11 inline-flex items-center justify-center"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-16 flex flex-col gap-6" aria-label="Mobile">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-5xl md:text-6xl"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    data-cursor="hover"
                  >
                    {link.label}
                  </motion.a>
                ))}
                <motion.a
                  href="#quote"
                  onClick={() => setOpen(false)}
                  className="mt-4 inline-flex w-fit bg-accent px-6 py-3 text-[12px] uppercase tracking-[0.2em] text-foreground"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + navLinks.length * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  data-cursor="hover"
                >
                  Request Quote
                </motion.a>
              </nav>

              <div className="mt-auto pb-8 text-sm text-background/60">
                <p>{siteConfig.email}</p>
                <p className="mt-1">{siteConfig.phone}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
