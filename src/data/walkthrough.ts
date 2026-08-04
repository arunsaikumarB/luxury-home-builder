export type WalkthroughCta = {
  label: string
  href: string
}

export type WalkthroughSection = {
  id: string
  /** Optional legacy per-clip src — prefer walkthroughVideoSrc for the continuous film */
  src?: string
  label: string
  title: string
  headline?: string
  description: string
  features?: string[]
  cta?: WalkthroughCta
  secondaryCta?: WalkthroughCta
  variant: 'hero' | 'features' | 'editorial' | 'cards' | 'list' | 'experience' | 'finale'
}

/** Single continuous hero film — scroll scrubs this one file end-to-end */
export const walkthroughVideoSrc = '/videos/hero-walkthrough.mp4?v=3'

/**
 * Chapter overlays timed evenly across the film.
 * Story arc: vacant lot → foundation → framing → finished elevation →
 * interiors (foyer / suite / bath / kitchen) → dusk arrival.
 */
export const walkthroughSections: WalkthroughSection[] = [
  {
    id: 'vision',
    label: '01 — The Land',
    title: 'The Land',
    headline: 'Every Dream Home Starts Here',
    description:
      'A quiet New Jersey lot — open sky, mature trees, and the first mark of a custom residence yet to rise.',
    cta: { label: 'Start Your Vision', href: '#contact' },
    secondaryCta: { label: 'Our Process', href: '#process' },
    variant: 'hero',
  },
  {
    id: 'foundation',
    label: '02 — Foundation',
    title: 'Foundation',
    description:
      'Crews, steel, and block set the geometry of the home — engineered precision before the first wall goes up.',
    features: ['Site preparation', 'Structural block', 'Rebar & pours', 'On-site craftsmanship'],
    variant: 'features',
  },
  {
    id: 'framing',
    label: '03 — Framing',
    title: 'Framing',
    description:
      'The silhouette takes shape — roof lines, volumes, and openings that will define light and living for decades.',
    features: ['Multi-story volumes', 'Complex rooflines', 'Glazing openings'],
    variant: 'editorial',
  },
  {
    id: 'elevation',
    label: '04 — Elevation',
    title: 'Elevation',
    description:
      'Stone, brick, timber, and charcoal cladding resolve into a finished facade — architecture that belongs to the land.',
    features: ['Natural stone', 'Warm timber', 'Black-framed glass', 'Landscaped arrival'],
    variant: 'cards',
  },
  {
    id: 'interiors',
    label: '05 — Interiors',
    title: 'Interiors',
    headline: 'Step Inside',
    description:
      'Double-height foyers, floating stairs, and a continuous material language from threshold to living room.',
    features: [
      'Grand foyer',
      'Floating stair',
      'Exposed beams',
      'Open living',
      'Forest views',
    ],
    variant: 'list',
  },
  {
    id: 'private-suites',
    label: '06 — Private Suites',
    title: 'Private Suites',
    description:
      'Primary bedrooms and spa baths composed for quiet — stone, soft light, and floor-to-ceiling greenery beyond the glass.',
    features: ['Master retreat', 'Spa soaking tub', 'Forest outlook'],
    variant: 'experience',
  },
  {
    id: 'culinary-arrival',
    label: '07 — Culinary & Arrival',
    title: 'Culinary & Arrival',
    headline: 'Where the Journey Opens Home',
    description:
      'A chef-grade kitchen for gathering — then dusk lights the finished elevation. Built end to end by Dream Home Builders.',
    cta: { label: 'Request a Consultation', href: '#contact' },
    variant: 'finale',
  },
]
