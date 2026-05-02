import heroBg from "@/assets/hero-bg.jpg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

export const Hero = () => (
  <section className="relative overflow-hidden">
    <div
      className="absolute inset-0 -z-10 opacity-90"
      style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
    />
    <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/95 via-primary/80 to-background" />
    <div className="absolute inset-0 -z-10 gradient-glow opacity-60" />

    <div className="container relative pt-24 pb-32 md:pt-32 md:pb-40">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground/90 text-xs font-medium backdrop-blur mb-8 animate-fade-up">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          Bangladesh's #1 Digital Marketing Marketplace
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight text-primary-foreground mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Sell digital products.
          <br />
          <span className="bg-gradient-to-r from-accent via-primary-foreground to-accent bg-clip-text text-transparent">
            Grow your business.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          The all-in-one platform for Bangladeshi creators and marketers. Launch courses, sell templates, and run campaigns — with payments in <span className="font-semibold text-accent">৳ BDT</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <Button variant="accent" size="xl" asChild>
            <Link to="/auth?mode=signup">
              Start selling free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="xl" className="bg-primary-foreground/5 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" asChild>
            <Link to="/marketplace">
              <Zap className="h-4 w-4" /> Browse marketplace
            </Link>
          </Button>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-primary-foreground/70 text-sm animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <div><span className="text-2xl font-bold text-primary-foreground">10K+</span> creators</div>
          <div className="h-4 w-px bg-primary-foreground/20 hidden sm:block" />
          <div><span className="text-2xl font-bold text-primary-foreground">৳2Cr+</span> in sales</div>
          <div className="h-4 w-px bg-primary-foreground/20 hidden sm:block" />
          <div><span className="text-2xl font-bold text-primary-foreground">4.9★</span> rated</div>
        </div>
      </div>
    </div>
  </section>
);
