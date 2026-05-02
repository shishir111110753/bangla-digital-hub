import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const tiers = [
  { name: "Starter", price: 0, desc: "Perfect for first-time creators.", features: ["List up to 3 products", "10% transaction fee", "Basic analytics", "Email support"], cta: "Start free", variant: "outline" as const },
  { name: "Pro", price: 999, desc: "For serious marketers ready to scale.", features: ["Unlimited products", "5% transaction fee", "Advanced analytics", "Priority support", "Custom domain", "Email automation"], cta: "Go Pro", variant: "hero" as const, featured: true },
  { name: "Business", price: 2999, desc: "For agencies and high-volume sellers.", features: ["Everything in Pro", "2% transaction fee", "Team accounts", "API access", "Dedicated manager", "White-label options"], cta: "Contact us", variant: "default" as const },
];

export const Pricing = () => (
  <section id="pricing" className="container py-24">
    <div className="max-w-2xl mx-auto text-center mb-16">
      <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Pricing</p>
      <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h2>
      <p className="text-lg text-muted-foreground">No hidden fees. Start free, upgrade when you grow.</p>
    </div>

    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {tiers.map((t) => (
        <div key={t.name} className={`relative p-8 rounded-2xl border ${t.featured ? "border-accent shadow-elegant gradient-card scale-[1.02]" : "border-border bg-card shadow-soft"} transition-smooth hover:-translate-y-1`}>
          {t.featured && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-primary text-primary-foreground text-xs font-bold uppercase tracking-wide shadow-glow">
              Most popular
            </div>
          )}
          <h3 className="font-display text-xl font-bold mb-2">{t.name}</h3>
          <p className="text-muted-foreground text-sm mb-6">{t.desc}</p>
          <div className="mb-6">
            <span className="text-5xl font-extrabold font-display">৳{t.price.toLocaleString()}</span>
            <span className="text-muted-foreground ml-2">/month</span>
          </div>
          <Button variant={t.variant} className="w-full mb-8" size="lg" asChild>
            <Link to="/auth?mode=signup">{t.cta}</Link>
          </Button>
          <ul className="space-y-3">
            {t.features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 shrink-0">
                  <Check className="h-3 w-3 text-accent" strokeWidth={3} />
                </div>
                {f}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </section>
);
