import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS } from "@/data/faqs";

const FaqColumn = ({ start, end }: { start: number; end: number }) => (
  <Accordion type="multiple" className="w-full">
    {FAQS.slice(start, end).map((faq, offset) => {
      const index = start + offset + 1;
      return (
        <AccordionItem id={`faq-${index}`} key={faq.question} value={`faq-${index}`} className="scroll-mt-28">
          <AccordionTrigger className="text-left text-base leading-snug">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      );
    })}
  </Accordion>
);

const FaqSection = () => (
  <section id="faqs" className="section-padding border-t bg-muted/30" aria-labelledby="faq-heading">
    <div className="container">
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">Helpful answers</p>
        <h2 id="faq-heading" className="text-3xl font-semibold tracking-tight">Frequently Asked Questions</h2>
        <p className="mt-3 text-muted-foreground">Twenty concise answers about browsing, contact, privacy, safety, and listing updates.</p>
      </div>
      <div className="grid gap-x-10 lg:grid-cols-2">
        <FaqColumn start={0} end={10} />
        <FaqColumn start={10} end={20} />
      </div>
    </div>
  </section>
);

export default FaqSection;

