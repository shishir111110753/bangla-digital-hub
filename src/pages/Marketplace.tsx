import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Star, Loader2 } from "lucide-react";

type Product = {
  id: string; title: string; description: string | null; short_description: string | null;
  price_bdt: number; category: string; image_url: string | null; product_type: string;
  billing_interval: string | null; created_at: string;
};

const productTypes = [
  { id: "all", name: "All" },
  { id: "software", name: "Software" },
  { id: "course", name: "Courses" },
  { id: "subscription", name: "Subscriptions" },
  { id: "tool", name: "Tools" },
];

const sorts = [
  { id: "newest", name: "Newest" },
  { id: "price_asc", name: "Price: Low to High" },
  { id: "price_desc", name: "Price: High to Low" },
  { id: "popular", name: "Most popular" },
];

const Marketplace = () => {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState(params.get("type") || "all");
  const [sort, setSort] = useState("newest");
  const [priceMax, setPriceMax] = useState(10000);

  useEffect(() => {
    supabase.from("products").select("*").eq("is_published", true).then(({ data }) => {
      setProducts((data as Product[]) || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const t = params.get("type") || "all";
    setType(t);
  }, [params]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || (p.short_description || "").toLowerCase().includes(search.toLowerCase());
      const matchType = type === "all" || p.product_type === type;
      const matchPrice = Number(p.price_bdt) <= priceMax;
      return matchSearch && matchType && matchPrice;
    });
    if (sort === "price_asc") list = [...list].sort((a, b) => Number(a.price_bdt) - Number(b.price_bdt));
    else if (sort === "price_desc") list = [...list].sort((a, b) => Number(b.price_bdt) - Number(a.price_bdt));
    else if (sort === "newest") list = [...list].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return list;
  }, [products, search, type, sort, priceMax]);

  const setTypeParam = (t: string) => {
    if (t === "all") params.delete("type"); else params.set("type", t);
    setParams(params, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-12">
        <div className="max-w-3xl mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Marketplace</h1>
          <p className="text-lg text-muted-foreground">Discover digital products built by Bangladesh's top creators.</p>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          {/* Sidebar filters */}
          <aside className="space-y-6">
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Type</h3>
              <div className="space-y-1">
                {productTypes.map((t) => (
                  <button key={t.id} onClick={() => setTypeParam(t.id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-smooth ${type === t.id ? "bg-accent/10 text-accent" : "hover:bg-secondary text-foreground"}`}>
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Max price</h3>
              <input type="range" min={500} max={10000} step={500} value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))} className="w-full accent-[hsl(var(--accent))]" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>৳500</span><span className="font-semibold text-foreground">৳{priceMax.toLocaleString()}</span>
              </div>
            </div>
          </aside>

          <div>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="pl-11 h-11" />
              </div>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-11 px-4 rounded-lg border border-input bg-background text-sm font-medium">
                {sorts.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 rounded-2xl border border-dashed border-border bg-card">
                <p className="text-muted-foreground mb-4">No products match your filters.</p>
                <Button variant="outline" onClick={() => { setSearch(""); setTypeParam("all"); setPriceMax(10000); }}>Reset filters</Button>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</p>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map((p) => (
                    <Link key={p.id} to={`/product/${p.id}`} className="group rounded-2xl overflow-hidden border border-border bg-card shadow-soft hover:shadow-elegant transition-smooth hover:-translate-y-1">
                      <div className="aspect-[4/3] overflow-hidden bg-muted">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-smooth duration-500" />
                        ) : (
                          <div className="h-full w-full gradient-primary" />
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex gap-2 mb-3">
                          <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-md">{p.category}</span>
                          <span className="text-xs font-semibold text-muted-foreground capitalize">{p.product_type}</span>
                        </div>
                        <h3 className="font-display font-bold text-lg leading-tight mb-2 line-clamp-2">{p.title}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                          <span className="font-semibold text-foreground">5.0</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold font-display">৳{Number(p.price_bdt).toLocaleString()}</span>
                          {p.product_type === "subscription" && <span className="text-xs text-muted-foreground">/{p.billing_interval || "mo"}</span>}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Marketplace;
