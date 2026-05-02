import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

const featured = [
  { img: product1, title: "Complete Digital Marketing Mastery", category: "Course", price: 2499, rating: 4.9, sales: 1200 },
  { img: product2, title: "SEO Playbook for Bangladesh", category: "E-book", price: 799, rating: 4.8, sales: 845 },
  { img: product3, title: "100+ Facebook Ad Templates", category: "Templates", price: 1299, rating: 5.0, sales: 2100 },
  { img: product4, title: "Email Funnel Automation Kit", category: "Toolkit", price: 1899, rating: 4.9, sales: 670 },
];

export const FeaturedProducts = () => (
  <section className="container py-24">
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
      <div>
        <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Trending now</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold">Top picks this week</h2>
      </div>
      <Button variant="outline" asChild>
        <Link to="/marketplace">View all <ArrowRight className="h-4 w-4" /></Link>
      </Button>
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {featured.map((p) => (
        <article key={p.title} className="group rounded-2xl overflow-hidden border border-border bg-card shadow-soft hover:shadow-elegant transition-smooth hover:-translate-y-1">
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            <img src={p.img} alt={p.title} loading="lazy" width={1024} height={768} className="h-full w-full object-cover group-hover:scale-105 transition-smooth duration-500" />
          </div>
          <div className="p-5">
            <span className="inline-block text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-md mb-3">{p.category}</span>
            <h3 className="font-display font-bold text-lg leading-tight mb-2 line-clamp-2">{p.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                <span className="font-semibold text-foreground">{p.rating}</span>
              </div>
              <span>·</span>
              <span>{p.sales.toLocaleString()} sold</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold font-display">৳{p.price.toLocaleString()}</span>
              <Button size="sm" variant="default">Buy</Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>
);
