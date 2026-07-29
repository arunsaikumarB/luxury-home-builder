import { faqs } from '@/data/content'
import { Reveal } from '@/components/shared/Reveal'
import { SplitText } from '@/components/shared/SplitText'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export function FAQ() {
  return (
    <section id="faq" className="relative bg-background py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.3em] text-accent mb-5">FAQ</p>
            </Reveal>
            <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)]">
              <SplitText triggerOnScroll stagger={0.03}>
                Answers before the first conversation.
              </SplitText>
            </h2>
            <Reveal delay={0.15}>
              <p className="mt-6 text-muted leading-relaxed max-w-md">
                Clarity is part of luxury. Here are the questions clients ask most before we begin.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={faq.question} value={`item-${i}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
