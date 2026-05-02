import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="border-t border-border/50 bg-secondary/30 mt-24">
    <div className="container py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">Bazaar<span className="text-gradient">BD</span></span>
          </Link>
          <p className="text-sm text-muted-foreground max-w-sm">
            Bangladesh's premium marketplace for digital marketing tools, courses, and templates.
            <span className="block mt-1 font-bangla text-base">বাংলাদেশের ডিজিটাল মার্কেটপ্লেস</span>
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/marketplace" className="hover:text-foreground">Marketplace</Link></li>
            <li><a href="/#features" className="hover:text-foreground">Features</a></li>
            <li><a href="/#pricing" className="hover:text-foreground">Pricing</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground">About</a></li>
            <li><a href="#" className="hover:text-foreground">Contact</a></li>
            <li><a href="#" className="hover:text-foreground">Privacy</a></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <p>© 2026 BazaarBD. Made with ❤️ in Dhaka, Bangladesh.</p>
        <p>All transactions in BDT (৳)</p>
      </div>
    </div>
  </footer>
);
