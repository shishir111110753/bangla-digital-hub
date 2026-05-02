import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const CTA = () => (
  <section className="container py-24">
    <div className="relative overflow-hidden rounded-3xl gradient-hero p-12 md:p-20 text-center shadow-elegant">
      <div className="absolute inset-0 grid-bg opacity-10" />
      <div className="absolute top-0 right-0 w-96 h-96 gradient-glow" />
      <div className="relative max-w-2xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
          Ready to launch your<br />digital empire?
        </h2>
        <p className="text-lg text-primary-foreground/80 mb-8">
          Join thousands of Bangladeshi creators selling smarter. Free forever plan, no credit card required.
        </p>
        <Button variant="accent" size="xl" asChild>
          <Link to="/auth?mode=signup">Start free <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </div>
    </div>
  </section>
);
