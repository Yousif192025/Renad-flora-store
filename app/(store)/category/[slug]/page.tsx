import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductsGrid } from "@/components/products/products-grid";

interface CategoryInfo {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  emoji: string | null;
  color: string | null;
}

const CATEGORIES_META: Record<string, { emoji: string; color: string; description: string }> = {
  "accessories":     { emoji: "💍", color: "#fce7f3", description: "إكسسوارات أنيقة تناسب كل مناسبة" },
  "watches":         { emoji: "⌚", color: "#fef3c7", description: "ساعات عصرية وكلاسيكية لكل ذوق" },
  "medals":          { emoji: "🏅", color: "#fffbeb", description: "ميداليات مميزة للهدايا والتكريم" },
  "lubob":           { emoji: "🧸", color: "#fdf2f8", description: "دمى لبوبو اللطيفة والمحبوبة" },
  "candles":         { emoji: "🕯️", color: "#fef9ee", description: "شموع عطرية فاخرة لأجواء رومانسية" },
  "mugs":            { emoji: "☕", color: "#f0fdf4", description: "مجات بتصاميم حصرية وألوان جميلة" },
  "mirrors":         { emoji: "🪞", color: "#f0f9ff", description: "مرايات أنيقة بإطارات فاخرة" },
  "gift-boxes":      { emoji: "🎁", color: "#fdf2f8", description: "بوكسات هدايا متكاملة لكل المناسبات" },
  "bags":            { emoji: "👜", color: "#fce7f3", description: "شنط عصرية وأنيقة بأفضل الخامات" },
  "home-essentials": { emoji: "🏠", color: "#f0fdf4", description: "أدوات منزلية راقية لبيتك الجميل" },
};

interface Props {
  params: Promise<{ slug: string }>;
}

async function getCategory(slug: string): Promise<CategoryInfo | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("categories")
      .select("id, slug, name_ar, name_en, description_ar, emoji, color")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    return data as CategoryInfo | null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = CATEGORIES_META[slug];
  const category = await getCategory(slug);
  const name = category?.name_ar ?? slug;
  return {
    title: `${name} | فلورا ستور`,
    description: category?.description_ar ?? meta?.description ?? `تسوقي من ${name} في فلورا ستور`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  // Check slug is known
  const meta = CATEGORIES_META[slug];
  if (!meta) notFound();

  // Try to get full info from DB (for name_ar)
  const category = await getCategory(slug);

  const displayName = category?.name_ar ?? slug;
  const displayDesc = category?.description_ar ?? meta.description;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div
        className="py-14 text-center"
        style={{ background: `linear-gradient(135deg, ${meta.color}99, ${meta.color}55)` }}
      >
        <div className="text-6xl mb-3">{meta.emoji}</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{displayName}</h1>
        {displayDesc && (
          <p className="text-gray-600 text-base max-w-md mx-auto">{displayDesc}</p>
        )}
      </div>

      {/* Products — pass slug so ProductsGrid resolves to UUID internally */}
      <div className="section-container py-10">
        <Suspense
          fallback={
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-pink-100">
                  <div className="aspect-square skeleton" />
                  <div className="p-3 space-y-2">
                    <div className="skeleton h-4 rounded-md w-3/4" />
                    <div className="skeleton h-5 rounded-md w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          }
        >
          <ProductsGrid searchParams={{ category: slug }} />
        </Suspense>
      </div>
    </div>
  );
}
