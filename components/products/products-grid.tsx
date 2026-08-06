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

async function getProducts(params: Record<string, string | undefined>): Promise<{ products: Product[]; total: number }> {
  const supabase = createClient();

  try {
    // If a category slug is provided, resolve it to the category UUID first
    if (params.category) {
      try {
        const { data: catData, error: catError } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", params.category)
          .eq("is_active", true)
          .maybeSingle();

        if (catError || !catData) {
          console.error("Category resolution error:", catError);
          return { products: [], total: 0 };
        }

        params = { ...params, category: catData.id };
      } catch (e) {
        console.error("Exception resolving category:", e);
        return { products: [], total: 0 };
      }
    }

    // Build the query - use the nested select for images
    let query = supabase
      .from("products")
      .select(`
        *,
        product_images (*)
      `, { count: "exact" })
      .eq("is_active", true);

    if (params.category) query = query.eq("category_id", params.category);
    if (params.filter === "sale") query = query.eq("is_on_sale", true);
    if (params.filter === "featured") query = query.eq("is_featured", true);
    if (params.filter === "new") query = query.eq("is_new", true);
    if (params.min) query = query.gte("price", Number(params.min));
    if (params.max) query = query.lte("price", Number(params.max));
    if (params.search) query = query.ilike("name_ar", `%${params.search}%`);

    switch (params.sort) {
      case "price_asc": query = query.order("price", { ascending: true }); break;
      case "price_desc": query = query.order("price", { ascending: false }); break;
      case "popular": query = query.order("rating_count", { ascending: false }); break;
      default: query = query.order("created_at", { ascending: false });
    }

    const page = Number(params.page ?? 1);
    const limit = PRODUCTS_PER_PAGE;
    query = query.range((page - 1) * limit, page * limit - 1);

    const { data, count, error } = await query;

    if (error) {
      console.error("Products query error:", error);
      return { products: [], total: 0 };
    }

    // Transform the data to match the Product type with correct image URL field
    const products = (data ?? []).map((item: any) => {
      // Extract images from the nested result
      const images = (item.product_images || []).map((img: any) => ({
        ...img,
        image_url: img.url, // Map 'url' to 'image_url' for compatibility with ProductCard
      }));
      
      // Find primary image or use the first one
      const primaryImage = images.find((img: any) => img.is_primary === true) || images[0];
      
      // Return product with images
      return {
        ...item,
        images: images,
        primary_image: primaryImage?.url || null,
        image: primaryImage?.url || null, // For backward compatibility
      };
    }) as unknown as Product[];

    return { 
      products, 
      total: count ?? 0 
    };
    
  } catch (error) {
    console.error("Unexpected error in getProducts:", error);
    return { products: [], total: 0 };
  }
}

export function ProductsGrid({ searchParams }: Props) {
  const { data, isLoading, error } = useQuery({ 
    queryKey: ["products", searchParams], 
    queryFn: () => getProducts(searchParams),
    retry: 1,
  });

  const sortOptions = [
    { value: "newest", label: "الأحدث" },
    { value: "price_asc", label: "السعر: الأقل" },
    { value: "price_desc", label: "السعر: الأعلى" },
    { value: "popular", label: "الأكثر مبيعاً" },
  ];

  if (error) {
    console.error("ProductsGrid error:", error);
    return (
      <div className="text-center py-10">
        <p className="text-red-500">حدث خطأ في تحميل المنتجات</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-flora text-white rounded-lg"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

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
            url.searchParams.set("so", e.target.value); 
            window.location.href = url.toString(); 
          }}
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))
        ) : data?.products?.length ? (
          data.products.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <div className="col-span-full text-center py-20">
            <span className="text-5xl block mb-4">🔍</span>
            <p className="text-gray-500">لم يتم العثور على منتجات</p>
          </div>
        )}
      </div>
    </div>
  );
}
