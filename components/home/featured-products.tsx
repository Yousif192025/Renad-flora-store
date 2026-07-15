"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/products/product-card";
import { ProductCardSkeleton } from "@/components/products/product-card-skeleton";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types";

async function getFeatured(): Promise<Product[]> {
  const supabase = createClient();
  const { data } = await supabase.from("products").select("*, images:product_images(*)").eq("is_featured", true).eq("is_active", true).order("created_at", { ascending: false }).limit(8);
  return (data ?? []) as unknown as Product[];
}

export function FeaturedProducts() {
  const { data: products = [], isLoading } = useQuery({ queryKey: ["products", "featured"], queryFn: getFeatured });
  return (
    <section className="py-16" style={{ background: "linear-gradient(180deg, #ffffff 0%, #fdf2f8 100%)" }}>
      <div className="section-container">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">منتجات <span className="text-flora-gradient">مختارة</span></h2>
            <p className="text-gray-500 mt-1">أبرز ما يميز فلورا ستور</p>
          </div>
          <Link href="/products?filter=featured" className="hidden sm:flex items-center gap-2 text-pink-600 font-medium hover:text-pink-700 transition-colors text-sm border border-pink-200 rounded-full px-4 py-2 hover:bg-pink-50">عرض الكل ←</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.length > 0
              ? products.map((product, i) => (
                  <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                    <ProductCard product={product} />
                  </motion.div>
                ))
              : <div className="col-span-full text-center py-20 text-gray-400"><span className="text-5xl block mb-4">🌸</span><p>لا توجد منتجات مميزة حالياً</p></div>
          }
        </div>
      </div>
    </section>
  );
}
