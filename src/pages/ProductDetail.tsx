import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Loader2, Star, ShieldCheck, Download, ArrowLeft, ShoppingCart, Check } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const { add, items } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase.from("products").select("*").eq("id", id).maybeSingle().then(async ({ data }) => {
      setProduct(data);
      setLoading(false);
      if (data) {
        const { data: rel } = await supabase.from("products").select("*").eq("category", data.category).neq("id", data.id).eq("is_published", true).limit(4);
        setRelated(rel || []);
      }
    });
  }, [id]);

  const inCart = product && items.some((i) => i.id === product.id);

  const handleAdd = () => {
    if (!product) return;
    add({ id: product.id, title: product.title, price_bdt: product.price_bdt, image_url: product.image_url, product_type: product.product_type, category: product.category, billing_interval: product.billing_interval });
    toast.success("Added to cart");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;
  if (!product) return <div className="min-h-screen flex flex-col items-center justify-center gap-4"><p>Product not found.</p><Button asChild><Link to="/marketplace">Back to marketplace</Link></Button></div>;

  const isSubscription = product.product_type === "subscription";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-12">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link to="/marketplace"><ArrowLeft className="h-4 w-4" /> Marketplace</Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted shadow-elegant">
            {product.image_url ? (
              <img src={product.image_url} alt={product.title} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full gradient-primary" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-md">{product.category}</span>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md capitalize">{product.product_type}</span>
              {isSubscription && <span className="text-xs font-semibold text-success bg-success/10 px-2 py-1 rounded-md">Recurring</span>}
            </div>
            <h1 className="font-display text-4xl font-bold mb-4">{product.title}</h1>

            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-semibold text-foreground">5.0</span>
              </div>
              <span>·</span><span>Instant delivery</span>
            </div>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {product.description || product.short_description || "Premium digital product crafted by a top BazaarBD creator."}
            </p>

            <div className="rounded-2xl border border-border p-6 bg-card shadow-soft mb-6">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-extrabold font-display">৳{Number(product.price_bdt).toLocaleString()}</span>
                <span className="text-muted-foreground">{isSubscription ? `/ ${product.billing_interval || "month"}` : "BDT"}</span>
              </div>
              {inCart ? (
                <Button variant="outline" size="xl" className="w-full" asChild>
                  <Link to="/cart"><Check className="h-4 w-4" /> In cart — view</Link>
                </Button>
              ) : (
                <Button variant="hero" size="xl" className="w-full" onClick={handleAdd}>
                  <ShoppingCart className="h-4 w-4" /> {isSubscription ? "Subscribe" : "Add to cart"}
                </Button>
              )}
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><ShieldCheck className="h-4 w-4 text-success" /> Secure checkout</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Download className="h-4 w-4 text-success" /> Instant access</div>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl font-bold mb-6">You might also like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`} className="group rounded-2xl overflow-hidden border border-border bg-card shadow-soft hover:shadow-elegant transition-smooth hover:-translate-y-1">
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    {p.image_url ? <img src={p.image_url} alt={p.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-smooth" /> : <div className="h-full w-full gradient-primary" />}
                  </div>
                  <div className="p-5">
                    <span className="inline-block text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-md mb-2">{p.category}</span>
                    <h3 className="font-bold text-base leading-tight mb-2 line-clamp-2">{p.title}</h3>
                    <div className="text-xl font-bold font-display">৳{Number(p.price_bdt).toLocaleString()}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
