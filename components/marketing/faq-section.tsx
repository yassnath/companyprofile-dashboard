import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/shared/section-heading";
import { faqs } from "@/lib/constants";

export function FaqSection() {
  return (
    <section className="shell-container py-14 sm:py-18">
      <SectionHeading
        title="FAQ"
        subtitle="Jawaban singkat untuk pertanyaan yang paling sering ditanyakan sebelum kickoff proyek."
      />
      <Accordion type="single" collapsible className="mt-7 rounded-2xl border bg-card/65 px-4 sm:px-6">
        {faqs.map((item, index) => (
          <AccordionItem key={item.question} value={`faq-${index}`}>
            <AccordionTrigger className="text-left font-medium">{item.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
