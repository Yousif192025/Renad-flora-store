import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductsGrid } from "@/components/products/products-grid";
import { CATEGORIES } from "@/lib/constants";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  return { title: cat ? `${cat.nameAr} | فلورا ستور` : "التصنيف" };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) notFound();

  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("id").eq("slug", slug).single();
  const row = data as { id: string } | null;
  if (!row) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-14 text-center" style={{ background: `linear-gradient(135deg, ${cat.color}80, ${cat.color}40)` }}>
        <div className="text-6xl mb-3">{cat.emoji}</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{cat.nameAr}</h1>
        <p className="text-gray-600">{cat.description}</p>
      </div>
      <div className="section-container py-10">
        <Suspense fallback={<div className="text-center py-20 text-gray-400">جاري التحميل...</div>}>
          <ProductsGrid searchParams={{ category: row.id }} />
        </Suspense>
      </div>
    </div>
  );
}
