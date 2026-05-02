import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

const schema = z.string().trim().email().max(320);

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(email);
    if (!parsed.success) { toast.error("Please enter a valid email"); return; }
    setLoading(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: parsed.data });
    setLoading(false);
    if (error && !error.message.includes("duplicate")) {
      toast.error(error.message);
      return;
    }
    toast.success("You're in! Welcome to BazaarBD.");
    setEmail("");
  };

  return (
    <section className="container py-12">
      <div className="rounded-3xl border border-border bg-card p-8 md:p-12 shadow-soft flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-4 max-w-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shrink-0">
            <Mail className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display text-xl md:text-2xl font-bold mb-1">Get weekly drops</h3>
            <p className="text-sm text-muted-foreground">New products, deals, and BD market insights — every Friday.</p>
          </div>
        </div>
        <form onSubmit={submit} className="flex w-full md:w-auto gap-2">
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="h-12 md:w-72" />
          <Button type="submit" variant="hero" size="lg" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
};
