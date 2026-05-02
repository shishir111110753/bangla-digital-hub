import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";

const schema = z.object({
  customer_name: z.string().trim().min(2).max(100),
  customer_email: z.string().trim().email().max(255),
  customer_phone: z.string().trim().min(10).max(20),
  payment_method: z.enum(["bkash", "nagad", "rocket", "card", "bank"]),
  notes: z.string().trim().max(500).optional(),
});

const methods = [
  { id: "bkash", name: "bKash", desc: "Mobile wallet" },
  { id: "nagad", name: "Nagad", desc: "Mobile wallet" },
  { id: "rocket", name: "Rocket", desc: "DBBL Mobile" },
  { id: "card", name: "Card", desc: "Visa / Mastercard" },
  { id: "bank", name: "Bank Transfer", desc: "Direct deposit" },
];

const Checkout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { items, total, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    payment_method: "bkash" as const,
    notes: "",
  });

  useEffect(() => {
    if (user?.email) setForm((f) => ({ ...f, customer_email: user.email || "" }));
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;
  if (!user) return <Navigate to="/auth?redirect=/checkout" replace />;
  if (items.length === 0) return <Navigate to="/cart" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    setSubmitting(true);

    const orderRows = items.map((i) => ({
      buyer_id: user.id,
      product_id: i.id,
      amount_bdt: Number(i.price_bdt) * i.qty,
      status: "pending",
      ...parsed.data,
    }));

    const { error } = await supabase.from("orders").insert(orderRows);

    // Create subscription rows for any subscription products
    const subs = items.filter((i) => i.product_type === "subscription").map((i) => ({
      user_id: user.id,
      product_id: i.id,
      status: "active",
      billing_interval: i.billing_interval || "monthly",
      amount_bdt: Number(i.price_bdt),
      current_period_end: new Date(Date.now() + 30 * 86400000).toISOString(),
    }));
    if (subs.length) await supabase.from("subscriptions").insert(subs);

    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Order placed! 🎉 We'll confirm shortly.");
    clear();
    navigate("/dashboard?tab=orders");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-12">
        <h1 className="font-display text-4xl font-bold mb-10">Checkout</h1>
        <form onSubmit={submit} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Customer details */}
            <section className="p-6 rounded-2xl border border-border bg-card shadow-soft">
              <h2 className="font-display font-bold text-xl mb-5">Customer details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" required value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} className="mt-1.5 h-11" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone (BD)</Label>
                  <Input id="phone" required value={form.customer_phone} onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} placeholder="01XXXXXXXXX" className="mt-1.5 h-11" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required value={form.customer_email} onChange={(e) => setForm({ ...form, customer_email: e.target.value })} className="mt-1.5 h-11" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="notes">Order notes (optional)</Label>
                  <Textarea id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="mt-1.5" />
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="p-6 rounded-2xl border border-border bg-card shadow-soft">
              <h2 className="font-display font-bold text-xl mb-5">Payment method</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {methods.map((m) => (
                  <label key={m.id} className={`relative cursor-pointer p-4 rounded-xl border-2 transition-smooth ${form.payment_method === m.id ? "border-accent bg-accent/5 shadow-soft" : "border-border hover:border-accent/50"}`}>
                    <input type="radio" name="pm" value={m.id} checked={form.payment_method === m.id} onChange={() => setForm({ ...form, payment_method: m.id as any })} className="sr-only" />
                    <div className="font-semibold">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.desc}</div>
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4 flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-success" /> Demo mode — no real payment processed. Order will be marked pending for admin review.
              </p>
            </section>
          </div>

          {/* Summary */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-2xl border border-border bg-card shadow-soft">
              <h2 className="font-display font-bold text-xl mb-5">Your order</h2>
              <ul className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                {items.map((i) => (
                  <li key={i.id} className="flex justify-between gap-2 text-sm">
                    <span className="line-clamp-1">{i.title} × {i.qty}</span>
                    <span className="font-semibold shrink-0">৳{(Number(i.price_bdt) * i.qty).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
              <div className="space-y-2 text-sm pt-4 border-t border-border">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>৳{total.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">VAT</span><span>Included</span></div>
                <div className="flex justify-between text-lg font-bold font-display pt-2 border-t border-border"><span>Total</span><span>৳{total.toLocaleString()}</span></div>
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full mt-6" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Place order
              </Button>
            </div>
          </aside>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
