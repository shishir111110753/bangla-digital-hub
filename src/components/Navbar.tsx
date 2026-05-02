import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, LogOut, ShoppingCart, User as UserIcon, Menu } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Navbar = () => {
  const { user, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary shadow-glow group-hover:scale-110 transition-smooth">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            Bazaar<span className="text-gradient">BD</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <Link to="/marketplace" className="text-muted-foreground hover:text-foreground transition-smooth">Marketplace</Link>
          <Link to="/marketplace?type=software" className="text-muted-foreground hover:text-foreground transition-smooth">Software</Link>
          <Link to="/marketplace?type=course" className="text-muted-foreground hover:text-foreground transition-smooth">Courses</Link>
          <Link to="/marketplace?type=subscription" className="text-muted-foreground hover:text-foreground transition-smooth">Subscriptions</Link>
          <a href="/#pricing" className="text-muted-foreground hover:text-foreground transition-smooth">Pricing</a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link to="/cart" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center shadow-glow">
                  {count}
                </span>
              )}
            </Link>
          </Button>

          {user ? (
            <>
              {isAdmin && (
                <Button variant="accent" size="sm" asChild className="hidden sm:inline-flex">
                  <Link to="/admin">Admin</Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link to="/dashboard"><UserIcon className="h-4 w-4" /> Dashboard</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={signOut} className="hidden sm:inline-flex">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button variant="hero" size="sm" asChild className="hidden sm:inline-flex">
                <Link to="/auth?mode=signup">Get started</Link>
              </Button>
            </>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container flex flex-col gap-1 py-4 text-sm">
            <Link to="/marketplace" onClick={() => setOpen(false)} className="px-3 py-2 rounded-md hover:bg-secondary">Marketplace</Link>
            <Link to="/marketplace?type=software" onClick={() => setOpen(false)} className="px-3 py-2 rounded-md hover:bg-secondary">Software</Link>
            <Link to="/marketplace?type=course" onClick={() => setOpen(false)} className="px-3 py-2 rounded-md hover:bg-secondary">Courses</Link>
            <Link to="/marketplace?type=subscription" onClick={() => setOpen(false)} className="px-3 py-2 rounded-md hover:bg-secondary">Subscriptions</Link>
            {user ? (
              <Link to="/dashboard" onClick={() => setOpen(false)} className="px-3 py-2 rounded-md hover:bg-secondary">Dashboard</Link>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="px-3 py-2 rounded-md hover:bg-secondary">Sign in</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
