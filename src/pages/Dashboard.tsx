import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Loader2, Package, ShoppingBag, TrendingUp } from "lucide-react";
import { z } from "zod";

const productSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().max(2000).optional(),
  price_bdt: z.number().min(0).max(1000000),
  category: z.string().trim().min(1).max(50),
  image_url: z.string().trim().url().max(500).optional().or(z.literal("")),
});

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", price_bdt: "", category: "Course", image_url: "" });

  useEffect(() => {
    if (!user) return;
    supabase.from("products").select("*").eq("seller_id", user.id).order("created_at", { ascending: false }).then(({ data }) => setProducts(data || []));
    supabase.from("orders").select("*, products(title)").eq("buyer_id", user.id).order("created_at", { ascending: false }).then(({ data }) => setOrders(data || []));
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;
  if (!user) return <Navigate to="/auth" replace />;

  const totalEarnings = products.reduce((sum, p) => sum + Number(p.price_bdt), 0);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = productSchema.safeParse({ ...form, price_bdt: Number(form.price_bdt) });
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    setSubmitting(true);
    const { data, error } = await supabase.from("products").insert({
      title: parsed.data.title,
      description: parsed.data.description,
      price_bdt: parsed.data.price_bdt,
      category: parsed.data.category,
      seller_id: user.id,
      image_url: form.image_url || null,
    }).select().single();
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Product listed!");
    setProducts([data, ...products]);
    setForm({ title: "", description: "", price_bdt: "", category: "Course", image_url: "" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-12">
        <h1 className="font-display text-4xl font-bold mb-2">Welcome back 👋</h1>
        <p className="text-muted-foreground mb-10">{user.email}</p>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="p-6 rounded-2xl border border-border bg-card shadow-soft">
            <Package className="h-5 w-5 text-accent mb-3" />
            <div className="text-3xl font-bold font-display">{products.length}</div>
            <div className="text-sm text-muted-foreground">Products listed</div>
          </div>
          <div className="p-6 rounded-2xl border border-border bg-card shadow-soft">
            <ShoppingBag className="h-5 w-5 text-accent mb-3" />
            <div className="text-3xl font-bold font-display">{orders.length}</div>
            <div className="text-sm text-muted-foreground">Purchases</div>
          </div>
          <div className="p-6 rounded-2xl border border-border bg-card shadow-soft">
            <TrendingUp className="h-5 w-5 text-accent mb-3" />
            <div className="text-3xl font-bold font-display">৳{totalEarnings.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Catalog value</div>
          </div>
        </div>

        <Tabs defaultValue="sell">
          <TabsList className="mb-6">
            <TabsTrigger value="sell">My products</TabsTrigger>
            <TabsTrigger value="new">List new</TabsTrigger>
            <TabsTrigger value="orders">My purchases</TabsTrigger>
          </TabsList>

          <TabsContent value="sell">
            {products.length === 0 ? (
              <div className="text-center py-16 rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground mb-4">No products listed yet.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
                    <div className="aspect-[4/3] bg-muted">
                      {p.image_url ? <img src={p.image_url} alt={p.title} className="h-full w-full object-cover" /> : <div className="h-full w-full gradient-primary" />}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold mb-1 line-clamp-1">{p.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{p.category}</p>
                      <div className="text-xl font-bold font-display">৳{Number(p.price_bdt).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="new">
            <form onSubmit={submit} className="max-w-2xl space-y-5 p-8 rounded-2xl border border-border bg-card shadow-soft">
              <div>
                <Label htmlFor="title">Product title</Label>
                <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1.5 h-11" required />
              </div>
              <div>
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="mt-1.5" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (BDT)</Label>
                  <Input id="price" type="number" min="0" value={form.price_bdt} onChange={(e) => setForm({ ...form, price_bdt: e.target.value })} className="mt-1.5 h-11" required />
                </div>
                <div>
                  <Label htmlFor="cat">Category</Label>
                  <select id="cat" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm">
                    <option>Course</option><option>E-book</option><option>Template</option><option>Toolkit</option><option>Service</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="img">Image URL (optional)</Label>
                <Input id="img" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="mt-1.5 h-11" />
              </div>
              <Button type="submit" variant="hero" size="lg" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                List product
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="orders">
            {orders.length === 0 ? (
              <div className="text-center py-16 rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground">No purchases yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between p-5 rounded-xl border border-border bg-card shadow-soft">
                    <div>
                      <p className="font-semibold">{o.products?.title || "Product"}</p>
                      <p className="text-sm text-muted-foreground">{new Date(o.created_at).toLocaleDateString()} · {o.status}</p>
                    </div>
                    <div className="font-bold font-display">৳{Number(o.amount_bdt).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
