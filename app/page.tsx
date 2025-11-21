import Hero from "@/components/Hero";
import CategoryShowcase from "@/components/CategoryShowcase";
import FeaturedProducts from "@/components/FeaturedProducts";
import FeatureSection from "@/components/ShoppingHighlights";
import AllProductsPreview from "@/components/AllProductsPreview";
import Testimonials from "@/components/Testimonials";

export default function HomePage() {
  return (
    <div className="pb-20">
      <Hero />
      <CategoryShowcase />
      <FeaturedProducts />
      <AllProductsPreview />
      <FeatureSection />
      <Testimonials />
    </div>
  );
}
