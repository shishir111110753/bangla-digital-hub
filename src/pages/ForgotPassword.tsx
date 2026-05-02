import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const schema = z.string().trim().email().max(320);

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(email);
    if (!parsed.success) { toast.error("Invalid email"); return; }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setSent(true);
    toast.success("Reset email sent");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-12 justify-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">Bazaar<span className="text-gradient">BD</span></span>
        </Link>

        <div className="p-8 rounded-2xl border border-border bg-card shadow-elegant">
          <h1 className="font-display text-2xl font-bold mb-2">Forgot password?</h1>
          <p className="text-muted-foreground mb-6 text-sm">
            {sent ? "Check your inbox for a reset link." : "Enter your email and we'll send you a reset link."}
          </p>

          {!sent ? (
            <form onSubmit={submit} className="space-y-5">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 h-11" placeholder="you@email.com" />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />} Send reset link
              </Button>
            </form>
          ) : (
            <Button variant="outline" className="w-full" onClick={() => navigate("/auth")}>Back to sign in</Button>
          )}

          <Link to="/auth" className="mt-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
