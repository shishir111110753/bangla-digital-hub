import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/landing/Hero";
import { Categories } from "@/components/landing/Categories";
import { Features } from "@/components/landing/Features";
import { FeaturedProducts } from "@/components/landing/FeaturedProducts";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { Newsletter } from "@/components/landing/Newsletter";
import { CTA } from "@/components/landing/CTA";

const Index = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      <Hero />
      <Categories />
      <Features />
      <FeaturedProducts />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Newsletter />
      <CTA />
    </main>
    <Footer />
  </div>
);

export default Index;
