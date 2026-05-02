import { TrendingUp, ShieldCheck, Wallet, Globe2, Zap, BarChart3 } from "lucide-react";

const features = [
  { icon: Wallet, title: "BDT-Native Payments", desc: "Built for the Bangladeshi market. Sell in Taka with bKash, Nagad, and card support coming soon." },
  { icon: TrendingUp, title: "Marketing Automation", desc: "Email campaigns, funnels, and audience tools that work — no agency required." },
  { icon: ShieldCheck, title: "Bank-Grade Security", desc: "End-to-end encryption, secure auth, and RLS policies protect every transaction." },
  { icon: Globe2, title: "Global Reach, Local Roots", desc: "Sell to Bangladesh and the world. Multi-currency on the roadmap." },
  { icon: Zap, title: "Instant Payouts", desc: "Get paid fast. Withdraw to your local bank or mobile wallet." },
  { icon: BarChart3, title: "Real-Time Analytics", desc: "Track every visitor, conversion, and sale with beautiful dashboards." },
];

export const Features = () => (
  <section id="features" className="container py-24">
    <div className="max-w-2xl mx-auto text-center mb-16">
      <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Why BazaarBD</p>
      <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
        Everything you need to <span className="text-gradient">scale</span>
      </h2>
      <p className="text-lg text-muted-foreground">
        From your first sale to your millionth Taka — we've built the tools so you can focus on creating.
      </p>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map(({ icon: Icon, title, desc }) => (
        <div key={title} className="group relative p-8 rounded-2xl border border-border bg-card shadow-soft hover:shadow-elegant transition-smooth hover:-translate-y-1">
          <div className="absolute inset-0 rounded-2xl gradient-glow opacity-0 group-hover:opacity-100 transition-smooth" />
          <div className="relative">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-soft mb-5">
              <Icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);
