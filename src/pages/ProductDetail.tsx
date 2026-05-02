import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Loader2, Star, ShieldCheck, Download, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from("products").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      setProduct(data);
      setLoading(false);
    });
  }, [id]);

  const handleBuy = async () => {
    if (!user) {
      toast.info("Please sign in to purchase");
      navigate("/auth");
      return;
    }
    setBuying(true);
    const { error } = await supabase.from("orders").insert({
      buyer_id: user.id,
      product_id: product.id,
      amount_bdt: product.price_bdt,
      status: "completed",
    });
    setBuying(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Purchase successful! 🎉 (mock checkout)");
    navigate("/dashboard");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;
  if (!product) return <div className="min-h-screen flex flex-col items-center justify-center gap-4"><p>Product not found.</p><Button asChild><Link to="/marketplace">Back to marketplace</Link></Button></div>;

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
            <span className="inline-block text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-md mb-4">{product.category}</span>
            <h1 className="font-display text-4xl font-bold mb-4">{product.title}</h1>

            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-semibold text-foreground">5.0</span>
              </div>
              <span>·</span><span>Instant delivery</span>
            </div>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {product.description || "Premium digital product crafted by a top BazaarBD creator."}
            </p>

            <div className="rounded-2xl border border-border p-6 bg-card shadow-soft mb-6">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-extrabold font-display">৳{Number(product.price_bdt).toLocaleString()}</span>
                <span className="text-muted-foreground">BDT</span>
              </div>
              <Button variant="hero" size="xl" className="w-full" onClick={handleBuy} disabled={buying}>
                {buying && <Loader2 className="h-4 w-4 animate-spin" />}
                Buy now
              </Button>
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><ShieldCheck className="h-4 w-4 text-success" /> Secure checkout</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Download className="h-4 w-4 text-success" /> Instant access</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
