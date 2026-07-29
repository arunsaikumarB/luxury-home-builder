import { SmoothScroll } from '@/components/layout/SmoothScroll'
import { FloatingShapes } from '@/components/layout/CustomCursor'
import { Navbar } from '@/components/layout/Navbar'
import { ScrollIndicator } from '@/components/layout/ScrollIndicator'
import { Footer } from '@/components/layout/Footer'
import { Walkthrough } from '@/components/sections/Walkthrough'
import { About } from '@/components/sections/About'
import { Services } from '@/components/sections/Services'
import { Projects } from '@/components/sections/Projects'
import { WhyUs } from '@/components/sections/WhyUs'
import { Process } from '@/components/sections/Process'
import { Statistics } from '@/components/sections/Statistics'
import { Testimonials } from '@/components/sections/Testimonials'
import { FAQ } from '@/components/sections/FAQ'
import { CTA } from '@/components/sections/CTA'
import { Contact } from '@/components/sections/Contact'
import { Quote } from '@/components/sections/Quote'

export default function App() {
  return (
    <SmoothScroll>
      <FloatingShapes />
      <ScrollIndicator />
      <Navbar />
      <main>
        <Walkthrough />
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
      </main>
      <Footer />
    </SmoothScroll>
  )
}
