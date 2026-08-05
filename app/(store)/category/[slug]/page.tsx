import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductsGrid } from "@/components/products/products-grid";
import { CATEGORIES } from "@/lib/constants";

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
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, slug, name_ar, name_en, description_ar, emoji, color")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (data) return data as CategoryInfo;

    // If there was an error or no data, attempt to gracefully fall back to in-repo constants
    if (error) {
      // Log server-side for diagnostics (won't expose to client)
      // eslint-disable-next-line no-console
      console.error("Supabase error fetching category:", error.message ?? error);
    }

  } catch (e) {
    // Query failed (network or misconfig). Log and continue to fallback.
    // eslint-disable-next-line no-console
    console.error("Exception while fetching category:", e);
  }

  // Fallback: match slug against local CATEGORIES constant so route still resolves (prevents 404 when DB is unreachable)
  const local = CATEGORIES.find((c) => c.slug === slug);
  if (local) {
    return {
      id: local.slug,
      slug: local.slug,
      name_ar: (local as any).nameAr ?? local.slug,
      name_en: (local as any).nameEn ?? local.slug,
      description_ar: (local as any).description ?? null,
      emoji: (local as any).emoji ?? null,
      color: (local as any).color ?? null,
    } as CategoryInfo;
  }

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return { title: "التصنيف غير موجود" };
  return {
    title: `${category.name_ar} | فلورا ستور`,
    description: category.description_ar ?? `تسوقي من ${category.name_ar} في فلورا ستور`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) notFound();

  const meta = CATEGORIES_META[slug] ?? {
    emoji:       category.emoji ?? "🌸",
    color:       category.color ?? "#fdf2f8",
    description: category.description_ar ?? "",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div
        className="py-14 text-center"
        style={{
          background: `linear-gradient(135deg, ${meta.color}99, ${meta.color}55)`,
        }}
      >
        <div className="text-6xl mb-3">{meta.emoji}</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name_ar}</h1>
        {meta.description && (
          <p className="text-gray-600 text-base max-w-md mx-auto">{meta.description}</p>
        )}
      </div>

      {/* Products */}
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
          <ProductsGrid searchParams={{ category: category.id }} />
        </Suspense>
      </div>
    </div>
  );
}
