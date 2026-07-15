import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const q = new URL(request.url).searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json({ products: [], categories: [] });
  const supabase = await createClient();
  const [productsRes, categoriesRes] = await Promise.all([
    supabase.from("products").select("id, slug, name_ar, price, images:product_images(url, is_primary)").eq("is_active", true).ilike("name_ar", `%${q}%`).limit(8),
    supabase.from("categories").select("id, slug, name_ar, emoji").eq("is_active", true).ilike("name_ar", `%${q}%`).limit(4),
  ]);
  return NextResponse.json({ products: productsRes.data ?? [], categories: categoriesRes.data ?? [] });
}
