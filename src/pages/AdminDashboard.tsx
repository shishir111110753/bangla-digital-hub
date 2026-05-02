import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Package, ShoppingBag, Users, CheckCircle2, XCircle } from "lucide-react";

interface Order {
  id: string;
  order_number: string | null;
  amount_bdt: number;
  status: string;
  customer_name: string | null;
  customer_email: string | null;
  payment_method: string | null;
  payment_reference: string | null;
  created_at: string;
  product_id: string;
}

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ orders: 0, products: 0, users: 0, revenue: 0 });

  const load = async () => {
    setLoading(true);
    const [{ data: o }, { count: pCount }, { count: uCount }] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
    ]);
    const list = (o as Order[]) || [];
    setOrders(list);
    const revenue = list.filter(x => x.status === "confirmed").reduce((s, x) => s + Number(x.amount_bdt), 0);
    setStats({ orders: list.length, products: pCount || 0, users: uCount || 0, revenue });
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: "confirmed" | "cancelled") => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Order ${status}`);
    load();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage orders, products and users.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <ShoppingBag className="h-5 w-5 text-accent mb-2" />
            <div className="text-2xl font-bold">{stats.orders}</div>
            <div className="text-sm text-muted-foreground">Orders</div>
          </Card>
          <Card className="p-6">
            <Package className="h-5 w-5 text-accent mb-2" />
            <div className="text-2xl font-bold">{stats.products}</div>
            <div className="text-sm text-muted-foreground">Products</div>
          </Card>
          <Card className="p-6">
            <Users className="h-5 w-5 text-accent mb-2" />
            <div className="text-2xl font-bold">{stats.users}</div>
            <div className="text-sm text-muted-foreground">Users</div>
          </Card>
          <Card className="p-6">
            <div className="text-2xl font-bold">৳{stats.revenue.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Revenue</div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="font-display text-xl font-bold mb-4">All Orders</h2>
          {loading ? (
            <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : orders.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border bg-card">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-semibold">{o.order_number || o.id.slice(0, 8)}</span>
                      <Badge variant={o.status === "confirmed" ? "default" : o.status === "cancelled" ? "destructive" : "secondary"}>
                        {o.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {o.customer_name} · {o.customer_email} · {o.payment_method} {o.payment_reference && `(${o.payment_reference})`}
                    </div>
                  </div>
                  <div className="font-bold whitespace-nowrap">৳{Number(o.amount_bdt).toLocaleString()}</div>
                  {o.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateStatus(o.id, "confirmed")}>
                        <CheckCircle2 className="h-4 w-4" /> Confirm
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(o.id, "cancelled")}>
                        <XCircle className="h-4 w-4" /> Cancel
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
