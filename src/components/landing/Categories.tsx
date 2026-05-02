import { Code2, GraduationCap, Repeat, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

const cats = [
  { type: "software", name: "Software", desc: "One-time purchase tools", icon: Code2, color: "from-blue-500 to-cyan-500" },
  { type: "course", name: "Courses", desc: "Learn from BD's top creators", icon: GraduationCap, color: "from-purple-500 to-pink-500" },
  { type: "subscription", name: "Subscriptions", desc: "SaaS apps, monthly billing", icon: Repeat, color: "from-emerald-500 to-teal-500" },
  { type: "tool", name: "Tools & Templates", desc: "Marketing assets ready to use", icon: Wrench, color: "from-amber-500 to-orange-500" },
];

export const Categories = () => (
  <section className="container py-24">
    <div className="max-w-2xl mx-auto text-center mb-16">
      <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Browse by category</p>
      <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Find what fits your <span className="text-gradient">business</span></h2>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cats.map(({ type, name, desc, icon: Icon, color }) => (
        <Link key={type} to={`/marketplace?type=${type}`} className="group relative p-8 rounded-2xl border border-border bg-card shadow-soft hover:shadow-elegant transition-smooth hover:-translate-y-1 overflow-hidden">
          <div className={`absolute -top-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br ${color} opacity-10 group-hover:opacity-30 transition-smooth blur-xl`} />
          <div className={`relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-soft mb-5`}>
            <Icon className="h-7 w-7 text-white" />
          </div>
          <h3 className="font-display text-xl font-bold mb-2">{name}</h3>
          <p className="text-muted-foreground text-sm">{desc}</p>
        </Link>
      ))}
    </div>
  </section>
);
