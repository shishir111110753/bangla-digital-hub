import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const schema = z.object({
  email: z.string().trim().email({ message: "Invalid email" }).max(255),
  password: z.string().min(6, { message: "At least 6 characters" }).max(72),
  full_name: z.string().trim().max(100).optional(),
});

const Auth = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(params.get("mode") === "signup" ? "signup" : "signin");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", full_name: "" });
  const redirect = params.get("redirect") || "/dashboard";

  useEffect(() => { if (user) navigate(redirect); }, [user, navigate, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: form.email, password: form.password,
          options: { emailRedirectTo: `${window.location.origin}/`, data: { full_name: form.full_name } },
        });
        if (error) throw error;
        toast.success("Account created! Welcome aboard.");
        navigate(redirect);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate(redirect);
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    setGoogleLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { toast.error("Google sign-in failed"); setGoogleLoading(false); return; }
    if (result.redirected) return;
    navigate(redirect);
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md mx-auto">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">Bazaar<span className="text-gradient">BD</span></span>
          </Link>

          <h1 className="font-display text-3xl font-bold mb-2">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {mode === "signup" ? "Start selling in 60 seconds." : "Sign in to your dashboard."}
          </p>

          <Button type="button" variant="outline" size="lg" className="w-full mb-4" onClick={googleSignIn} disabled={googleLoading}>
            {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            )}
            Continue with Google
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-3 text-muted-foreground">or</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "signup" && (
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Rashed Ahmed" className="mt-1.5 h-11" />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="you@email.com" className="mt-1.5 h-11" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {mode === "signin" && (
                  <Link to="/forgot-password" className="text-xs text-accent hover:underline">Forgot?</Link>
                )}
              </div>
              <Input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} placeholder="••••••••" className="mt-1.5 h-11" />
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signup" ? "Create account" : "Sign in"}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-8">
            {mode === "signup" ? "Already have an account?" : "New to BazaarBD?"}{" "}
            <button onClick={() => setMode(mode === "signup" ? "signin" : "signup")} className="font-semibold text-accent hover:underline">
              {mode === "signup" ? "Sign in" : "Create one"}
            </button>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="absolute inset-0 gradient-glow" />
        <div className="relative flex flex-col justify-center px-16 text-primary-foreground">
          <h2 className="font-display text-5xl font-bold mb-6 leading-tight">
            Your digital storefront,<br />in your pocket.
          </h2>
          <p className="text-xl text-primary-foreground/80 max-w-md mb-8">
            Join thousands of creators in Bangladesh turning ideas into income.
          </p>
          <div className="flex gap-8 text-primary-foreground/90">
            <div><div className="text-3xl font-bold">10K+</div><div className="text-sm text-primary-foreground/70">Sellers</div></div>
            <div><div className="text-3xl font-bold">৳2Cr+</div><div className="text-sm text-primary-foreground/70">Sold</div></div>
            <div><div className="text-3xl font-bold">4.9★</div><div className="text-sm text-primary-foreground/70">Rated</div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
