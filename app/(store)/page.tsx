import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { WhatsAppBanner } from "@/components/home/whatsapp-banner";

export const metadata: Metadata = {
  title: "فلورا ستور | إكسسوارات وهدايا فاخرة",
  description: "اكتشفي أجمل الإكسسوارات والهدايا الفاخرة في متجر فلورا",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <WhatsAppBanner />
    </>
  );
}
