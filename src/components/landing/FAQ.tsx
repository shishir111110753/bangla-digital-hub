import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How do payouts work in Bangladesh?", a: "We support payouts to all major Bangladeshi banks, bKash, Nagad, and Rocket. Standard payouts process within 1-3 business days." },
  { q: "Do I need a business license to sell?", a: "No. Individual creators can start selling immediately. For higher volumes, a Trade License is recommended for tax purposes." },
  { q: "What types of products can I sell?", a: "Digital products of all kinds: online courses, e-books, templates, design assets, software licenses, marketing services, and consulting packages." },
  { q: "Is there a free trial?", a: "Yes — the Starter plan is completely free forever. You only pay a small transaction fee per sale. Upgrade anytime." },
  { q: "Can I sell internationally?", a: "Absolutely. Your products are visible globally and we're rolling out multi-currency checkout. International payouts coming Q3 2026." },
];

export const FAQ = () => (
  <section id="faq" className="container py-24">
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">FAQ</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold">Questions? Answered.</h2>
      </div>
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-xl px-6 bg-card shadow-soft">
            <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);
