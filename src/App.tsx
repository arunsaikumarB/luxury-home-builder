import { lazy, Suspense } from 'react'
import { SmoothScroll } from '@/components/layout/SmoothScroll'
import { FloatingShapes } from '@/components/layout/CustomCursor'
import { Navbar } from '@/components/layout/Navbar'
import { ScrollIndicator } from '@/components/layout/ScrollIndicator'
import { Footer } from '@/components/layout/Footer'
import { Walkthrough } from '@/components/sections/Walkthrough'

const About = lazy(() =>
  import('@/components/sections/About').then((m) => ({ default: m.About })),
)
const Services = lazy(() =>
  import('@/components/sections/Services').then((m) => ({ default: m.Services })),
)
const Projects = lazy(() =>
  import('@/components/sections/Projects').then((m) => ({ default: m.Projects })),
)
const WhyUs = lazy(() =>
  import('@/components/sections/WhyUs').then((m) => ({ default: m.WhyUs })),
)
const Process = lazy(() =>
  import('@/components/sections/Process').then((m) => ({ default: m.Process })),
)
const Statistics = lazy(() =>
  import('@/components/sections/Statistics').then((m) => ({ default: m.Statistics })),
)
const Testimonials = lazy(() =>
  import('@/components/sections/Testimonials').then((m) => ({ default: m.Testimonials })),
)
const FAQ = lazy(() => import('@/components/sections/FAQ').then((m) => ({ default: m.FAQ })))
const CTA = lazy(() => import('@/components/sections/CTA').then((m) => ({ default: m.CTA })))
const Contact = lazy(() =>
  import('@/components/sections/Contact').then((m) => ({ default: m.Contact })),
)
const Quote = lazy(() =>
  import('@/components/sections/Quote').then((m) => ({ default: m.Quote })),
)

function SectionFallback() {
  return <div className="min-h-[40vh] bg-background" aria-hidden />
}

export default function App() {
  return (
    <SmoothScroll>
      <FloatingShapes />
      <ScrollIndicator />
      <Navbar />
      <main>
        <Walkthrough />
        <Suspense fallback={<SectionFallback />}>
          <About />
          <Services />
          <Projects />
          <WhyUs />
          <Process />
          <Statistics />
          <Testimonials />
          <FAQ />
          <CTA />
          <Contact />
          <Quote />
        </Suspense>
      </main>
      <Footer />
    </SmoothScroll>
  )
}
