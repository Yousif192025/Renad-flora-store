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

    // Build the query
    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
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

    // If we have products, try to fetch their images
    let productsWithImages: Product[] = (data ?? []) as unknown as Product[];
    
    if (data && data.length > 0) {
      try {
        const productIds = data.map((p: any) => p.id);
        
        // Try different possible column names for the foreign key
        // First try: product_id
        let imagesData: any[] = [];
        let imagesError: any = null;
        
        // Check if product_images table exists and has data
        const { data: testData, error: testError } = await supabase
          .from("product_images")
          .select("*")
          .limit(1);
        
        if (testError) {
          console.warn("product_images table might not exist or is inaccessible:", testError);
        } else {
          // Check what column names exist
          const sampleRow = testData?.[0];
          const possibleColumns = ['product_id', 'productId', 'product_uuid', 'product'];
          
          let foundColumn = null;
          if (sampleRow) {
            for (const col of possibleColumns) {
              if (sampleRow[col] !== undefined) {
                foundColumn = col;
                break;
              }
            }
          }
          
          if (foundColumn) {
            // Use the found column name
            const { data: images, error: err } = await supabase
              .from("product_images")
              .select("*")
              .in(foundColumn, productIds);
            
            imagesData = images || [];
            imagesError = err;
          } else {
            // Try the most common column name
            const { data: images, error: err } = await supabase
              .from("product_images")
              .select("*")
              .in("product_id", productIds);
            
            imagesData = images || [];
            imagesError = err;
          }
        }

        if (!imagesError && imagesData.length > 0) {
          // Group images by product_id (or the correct column name)
          const imagesByProduct = imagesData.reduce((acc: any, img: any) => {
            // Find which column has the product ID
            const productIdKey = ['product_id', 'productId', 'product_uuid', 'product'].find(key => img[key] !== undefined);
            const productId = productIdKey ? img[productIdKey] : img.product_id;
            
            if (productId) {
              if (!acc[productId]) acc[productId] = [];
              acc[productId].push(img);
            }
            return acc;
          }, {});

          // Attach images to products
          productsWithImages = (data as any[]).map((product) => ({
            ...product,
            images: imagesByProduct[product.id] || [],
          })) as unknown as Product[];
        } else {
          // No images found, just return products without images
          console.log("No images found for products");
        }
      } catch (imgError) {
        console.warn("Error fetching images (continuing without images):", imgError);
        // Continue without images
      }
    }

    return { 
      products: productsWithImages, 
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
