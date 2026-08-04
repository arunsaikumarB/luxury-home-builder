import { siteConfig, footerQuickLinks, footerContactLinks } from '@/data/content'

export function Footer() {
  return (
    <footer className="relative z-10 bg-secondary text-background">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-3 md:gap-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl leading-none">
              Dream Home
              <span className="text-accent"> Builders</span>
            </h2>
            <p className="mt-4 text-background/70">{siteConfig.tagline}</p>
          </div>

          <div>
            <p className="mb-5 font-medium">Quick Links</p>
            <ul className="space-y-3">
              {footerQuickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-background/70 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-5 font-medium">Contact Info</p>
            <ul className="space-y-3">
              {footerContactLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-background/70 transition-colors hover:text-accent"
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-background/15 pt-8 text-center text-sm text-background/50">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
