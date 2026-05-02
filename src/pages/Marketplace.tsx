import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Star, Loader2 } from "lucide-react";

type Product = {
  id: string;
  title: string;
  description: string | null;
  price_bdt: number;
  category: string;
  image_url: string | null;
};

const categories = ["All", "Course", "E-book", "Template", "Toolkit", "Service"];

const Marketplace = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    supabase.from("products").select("*").eq("is_published", true).order("created_at", { ascending: false }).then(({ data }) => {
      setProducts(data || []);
      setLoading(false);
    });
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category.toLowerCase() === category.toLowerCase();
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-12">
        <div className="max-w-3xl mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Marketplace</h1>
          <p className="text-lg text-muted-foreground">Discover digital products built by Bangladesh's top creators.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="pl-11 h-12" />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((c) => (
              <button key={c} onClick={() => setCategory(c)} className={`px-4 h-12 rounded-lg font-medium text-sm whitespace-nowrap transition-smooth border ${category === c ? "gradient-primary text-primary-foreground border-transparent shadow-soft" : "bg-card border-border hover:border-accent"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-dashed border-border bg-card">
            <p className="text-muted-foreground mb-4">No products yet. Be the first to list one!</p>
            <Button variant="hero" asChild><Link to="/dashboard">Sell a product</Link></Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="group rounded-2xl overflow-hidden border border-border bg-card shadow-soft hover:shadow-elegant transition-smooth hover:-translate-y-1">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-smooth duration-500" />
                  ) : (
                    <div className="h-full w-full gradient-primary opacity-80" />
                  )}
                </div>
                <div className="p-5">
                  <span className="inline-block text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-md mb-3">{p.category}</span>
                  <h3 className="font-display font-bold text-lg leading-tight mb-2 line-clamp-2">{p.title}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                    <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                    <span className="font-semibold text-foreground">5.0</span>
                    <span>· New</span>
                  </div>
                  <div className="text-2xl font-bold font-display">৳{Number(p.price_bdt).toLocaleString()}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Marketplace;
