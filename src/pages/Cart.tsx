import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";

const Cart = () => {
  const { items, remove, updateQty, total } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-12">
        <h1 className="font-display text-4xl font-bold mb-2">Your cart</h1>
        <p className="text-muted-foreground mb-10">{items.length === 0 ? "Empty for now." : `${items.length} item${items.length > 1 ? "s" : ""}`}</p>

        {items.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-dashed border-border bg-card">
            <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-6">Your cart is empty.</p>
            <Button variant="hero" asChild><Link to="/marketplace">Browse marketplace</Link></Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              {items.map((it) => (
                <div key={it.id} className="flex gap-4 p-4 rounded-2xl border border-border bg-card shadow-soft">
                  <div className="h-24 w-24 rounded-lg overflow-hidden bg-muted shrink-0">
                    {it.image_url ? <img src={it.image_url} alt={it.title} className="h-full w-full object-cover" /> : <div className="h-full w-full gradient-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-md mb-1">{it.category}</span>
                    <h3 className="font-bold line-clamp-1">{it.title}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{it.product_type}{it.billing_interval ? ` · ${it.billing_interval}` : ""}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 border border-border rounded-lg">
                        <button onClick={() => updateQty(it.id, it.qty - 1)} className="h-8 w-8 flex items-center justify-center hover:bg-secondary"><Minus className="h-3 w-3" /></button>
                        <span className="w-8 text-center text-sm font-semibold">{it.qty}</span>
                        <button onClick={() => updateQty(it.id, it.qty + 1)} className="h-8 w-8 flex items-center justify-center hover:bg-secondary"><Plus className="h-3 w-3" /></button>
                      </div>
                      <div className="font-bold font-display">৳{(Number(it.price_bdt) * it.qty).toLocaleString()}</div>
                    </div>
                  </div>
                  <button onClick={() => remove(it.id)} className="text-muted-foreground hover:text-destructive transition-smooth" aria-label="Remove">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 rounded-2xl border border-border bg-card shadow-soft">
                <h2 className="font-display font-bold text-xl mb-4">Order summary</h2>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>৳{total.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Processing fee</span><span className="text-success">Free</span></div>
                  <div className="h-px bg-border" />
                  <div className="flex justify-between text-lg font-bold font-display"><span>Total</span><span>৳{total.toLocaleString()}</span></div>
                </div>
                <Button variant="hero" size="lg" className="w-full" asChild>
                  <Link to="/checkout">Checkout <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
