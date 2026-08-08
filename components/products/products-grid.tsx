"use client";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "./product-card";
import { ProductCardSkeleton } from "./product-card-skeleton";
import { createClient } from "@/lib/supabase/client";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";
import type { Product } from "@/types";

interface Props {
  searchParams: Record<string, string | undefined>;
}

async function getProducts(
  params: Record<string, string | undefined>
): Promise<{ products: Product[]; total: number }> {
  const supabase = createClient();
  let categoryId = params.category;

  // Resolve category slug → UUID if needed
  if (categoryId) {
    const { data: catData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categoryId)
      .eq("is_active", true)
      .maybeSingle();

    if (!catData) return { products: [], total: 0 };
    categoryId = (catData as { id: string }).id;
  }

  let query = supabase
    .from("products")
    .select("*, images:product_images(*)", { count: "exact" })
    .eq("is_active", true);

  if (categoryId)                   query = query.eq("category_id", categoryId);
  if (params.filter === "sale")     query = query.eq("is_on_sale", true);
  if (params.filter === "featured") query = query.eq("is_featured", true);
  if (params.filter === "new")      query = query.eq("is_new", true);
  if (params.min)                   query = query.gte("price", Number(params.min));
  if (params.max)                   query = query.lte("price", Number(params.max));
  if (params.search)                query = query.ilike("name_ar", `%${params.search}%`);

  switch (params.sort) {
    case "price_asc":  query = query.order("price", { ascending: true });  break;
    case "price_desc": query = query.order("price", { ascending: false }); break;
    case "popular":    query = query.order("rating_count", { ascending: false }); break;
    default:           query = query.order("created_at", { ascending: false });
  }

  const page  = Number(params.page ?? 1);
  const limit = PRODUCTS_PER_PAGE;
  query = query.range((page - 1) * limit, page * limit - 1);

  const { data, count, error } = await query;
  if (error) return { products: [], total: 0 };

  return {
    products: (data ?? []) as unknown as Product[],
    total:    count ?? 0,
  };
}

export function ProductsGrid({ searchParams }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["products", searchParams],
    queryFn:  () => getProducts(searchParams),
  });

  const sortOptions = [
    { value: "newest",     label: "الأحدث"        },
    { value: "price_asc",  label: "السعر: الأقل"  },
    { value: "price_desc", label: "السعر: الأعلى" },
    { value: "popular",    label: "الأكثر مبيعاً" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <p className="text-sm text-gray-500">
          {isLoading ? "..." : `${data?.total ?? 0} منتج`}
        </p>
        <select
          className="input-flora w-auto text-sm py-2 px-3"
          defaultValue={searchParams.sort ?? "newest"}
          onChange={(e) => {
            const url = new URL(window.location.href);
            url.searchParams.set("sort", e.target.value);
            window.location.href = url.toString();
          }}
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : data?.products.length
            ? data.products.map((p) => <ProductCard key={p.id} product={p} />)
            : (
              <div className="col-span-full text-center py-20">
                <span className="text-5xl block mb-4">🔍</span>
                <p className="text-gray-500">لم يتم العثور على منتجات</p>
              </div>
            )
        }
      </div>
    </div>
  );
}
