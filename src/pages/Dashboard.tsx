import { useEffect, useState } from "react";
import { Navigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, ShoppingBag, Download, Repeat, User as UserIcon, KeyRound } from "lucide-react";
import { z } from "zod";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [params] = useSearchParams();
  const [orders, setOrders] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [newPwd, setNewPwd] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase.from("orders").select("*, products(title, image_url, product_type, download_url, course_url)").eq("buyer_id", user.id).order("created_at", { ascending: false }).then(({ data }) => setOrders(data || []));
    supabase.from("subscriptions").select("*, products(title, image_url)").eq("user_id", user.id).order("created_at", { ascending: false }).then(({ data }) => setSubs(data || []));
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => setProfile(data));
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;
  if (!user) return <Navigate to="/auth" replace />;

  const confirmedOrders = orders.filter((o) => o.status === "confirmed");
  const totalSpent = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + Number(o.amount_bdt), 0);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = z.object({ full_name: z.string().trim().max(100) }).safeParse({ full_name: profile?.full_name || "" });
    if (!parsed.success) { toast.error("Invalid name"); return; }
    setSavingProfile(true);
    const { error } = await supabase.from("profiles").update({ full_name: parsed.data.full_name }).eq("id", user.id);
    setSavingProfile(false);
    if (error) toast.error(error.message); else toast.success("Profile updated");
  };

  const changePwd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd.length < 6) { toast.error("At least 6 characters"); return; }
    setSavingPwd(true);
    const { error } = await supabase.auth.updateUser({ password: newPwd });
    setSavingPwd(false);
    if (error) toast.error(error.message);
    else { toast.success("Password updated"); setNewPwd(""); }
  };

  const statusColor = (s: string) => s === "confirmed" ? "text-success bg-success/10" : s === "cancelled" ? "text-destructive bg-destructive/10" : "text-warning bg-warning/10";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-12">
        <h1 className="font-display text-4xl font-bold mb-2">Welcome back 👋</h1>
        <p className="text-muted-foreground mb-10">{user.email}</p>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="p-6 rounded-2xl border border-border bg-card shadow-soft">
            <ShoppingBag className="h-5 w-5 text-accent mb-3" />
            <div className="text-3xl font-bold font-display">{orders.length}</div>
            <div className="text-sm text-muted-foreground">Orders placed</div>
          </div>
          <div className="p-6 rounded-2xl border border-border bg-card shadow-soft">
            <Download className="h-5 w-5 text-accent mb-3" />
            <div className="text-3xl font-bold font-display">{confirmedOrders.length}</div>
            <div className="text-sm text-muted-foreground">Available downloads</div>
          </div>
          <div className="p-6 rounded-2xl border border-border bg-card shadow-soft">
            <Repeat className="h-5 w-5 text-accent mb-3" />
            <div className="text-3xl font-bold font-display">৳{totalSpent.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total spent</div>
          </div>
        </div>

        <Tabs defaultValue={params.get("tab") || "orders"}>
          <TabsList className="mb-6 flex-wrap h-auto">
            <TabsTrigger value="orders">My orders</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
            <TabsTrigger value="subs">Subscriptions</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            {orders.length === 0 ? (
              <Empty msg="You haven't placed any orders yet." cta="Browse marketplace" link="/marketplace" />
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o.id} className="p-5 rounded-xl border border-border bg-card shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="h-14 w-14 rounded-lg overflow-hidden bg-muted shrink-0">
                        {o.products?.image_url ? <img src={o.products.image_url} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full gradient-primary" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold line-clamp-1">{o.products?.title || "Product"}</p>
                        <p className="text-xs text-muted-foreground">#{o.order_number} · {new Date(o.created_at).toLocaleDateString()} · {o.payment_method}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-md capitalize ${statusColor(o.status)}`}>{o.status}</span>
                      <div className="font-bold font-display">৳{Number(o.amount_bdt).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="downloads">
            {confirmedOrders.length === 0 ? (
              <Empty msg="No downloads available yet. Confirmed orders will appear here." cta="Browse marketplace" link="/marketplace" />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {confirmedOrders.map((o) => (
                  <div key={o.id} className="rounded-2xl overflow-hidden border border-border bg-card shadow-soft">
                    <div className="aspect-[4/3] bg-muted">
                      {o.products?.image_url ? <img src={o.products.image_url} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full gradient-primary" />}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold mb-3 line-clamp-1">{o.products?.title}</h3>
                      <Button size="sm" variant="hero" className="w-full" asChild>
                        <a href={o.products?.download_url || o.products?.course_url || "#"} target="_blank" rel="noreferrer">
                          <Download className="h-4 w-4" /> {o.products?.product_type === "course" ? "Open course" : "Download"}
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="subs">
            {subs.length === 0 ? (
              <Empty msg="No active subscriptions." cta="Browse subscriptions" link="/marketplace?type=subscription" />
            ) : (
              <div className="space-y-3">
                {subs.map((s) => (
                  <div key={s.id} className="p-5 rounded-xl border border-border bg-card shadow-soft flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="h-14 w-14 rounded-lg overflow-hidden bg-muted shrink-0">
                        {s.products?.image_url ? <img src={s.products.image_url} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full gradient-primary" />}
                      </div>
                      <div>
                        <p className="font-semibold line-clamp-1">{s.products?.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{s.billing_interval} · Renews {s.current_period_end ? new Date(s.current_period_end).toLocaleDateString() : "—"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-md ${statusColor(s.status)}`}>{s.status}</span>
                      <div className="font-bold font-display mt-1">৳{Number(s.amount_bdt).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile">
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
              <form onSubmit={saveProfile} className="p-6 rounded-2xl border border-border bg-card shadow-soft space-y-4">
                <div className="flex items-center gap-2 mb-2"><UserIcon className="h-5 w-5 text-accent" /><h3 className="font-display font-bold text-lg">Profile</h3></div>
                <div>
                  <Label htmlFor="email-r">Email</Label>
                  <Input id="email-r" value={user.email || ""} disabled className="mt-1.5 h-11" />
                </div>
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" value={profile?.full_name || ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} className="mt-1.5 h-11" />
                </div>
                <Button type="submit" variant="hero" disabled={savingProfile}>
                  {savingProfile && <Loader2 className="h-4 w-4 animate-spin" />} Save profile
                </Button>
              </form>

              <form onSubmit={changePwd} className="p-6 rounded-2xl border border-border bg-card shadow-soft space-y-4">
                <div className="flex items-center gap-2 mb-2"><KeyRound className="h-5 w-5 text-accent" /><h3 className="font-display font-bold text-lg">Change password</h3></div>
                <div>
                  <Label htmlFor="newpwd">New password</Label>
                  <Input id="newpwd" type="password" minLength={6} value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className="mt-1.5 h-11" placeholder="••••••••" />
                </div>
                <Button type="submit" variant="hero" disabled={savingPwd || !newPwd}>
                  {savingPwd && <Loader2 className="h-4 w-4 animate-spin" />} Update password
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

const Empty = ({ msg, cta, link }: { msg: string; cta: string; link: string }) => (
  <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-card">
    <p className="text-muted-foreground mb-4">{msg}</p>
    <Button variant="hero" asChild><Link to={link}>{cta}</Link></Button>
  </div>
);

export default Dashboard;
