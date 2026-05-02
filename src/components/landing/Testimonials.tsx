import { Star } from "lucide-react";

const testimonials = [
  { name: "Rashed Ahmed", role: "Course Creator, Dhaka", text: "I made my first ৳50,000 in two weeks. BazaarBD made selling courses in Bangladesh actually possible.", rating: 5 },
  { name: "Nusrat Jahan", role: "Marketing Consultant", text: "The analytics alone are worth the Pro plan. I finally understand what's working in my funnel.", rating: 5 },
  { name: "Tanvir Hossain", role: "Agency Owner, Chittagong", text: "We moved our entire client deliverables to BazaarBD. Clean, fast, and our clients love the experience.", rating: 5 },
];

export const Testimonials = () => (
  <section className="bg-secondary/40 py-24 border-y border-border/50">
    <div className="container">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Loved by creators</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold">10,000+ Bangladeshi creators trust us</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {testimonials.map((t) => (
          <div key={t.name} className="p-8 rounded-2xl bg-card border border-border shadow-soft">
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-warning text-warning" />
              ))}
            </div>
            <p className="text-foreground/90 mb-6 leading-relaxed">"{t.text}"</p>
            <div>
              <p className="font-semibold">{t.name}</p>
              <p className="text-sm text-muted-foreground">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
