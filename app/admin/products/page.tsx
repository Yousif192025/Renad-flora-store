"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, getImageUrl } from "@/lib/utils";

interface ProductRow { id: string; name_ar: string; sku: string; price: number; compare_price: number | null; stock: number; is_active: boolean; is_featured: boolean; is_on_sale: boolean; images: { url: string; is_primary: boolean }[]; category: { name_ar: string } | null; }

async function getProducts(search: string): Promise<ProductRow[]> {
  const supabase = createClient();
  let query = supabase.from("products").select("id, name_ar, sku, price, compare_price, stock, is_active, is_featured, is_on_sale, images:product_images(url,is_primary), category:categories(name_ar)").order("created_at", { ascending: false }).limit(50);
  if (search) query = query.ilike("name_ar", `%${search}%`);
  const { data } = await query;
  return (data ?? []) as unknown as ProductRow[];
}

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const { data: products = [], isLoading } = useQuery({ queryKey: ["admin", "products", search], queryFn: () => getProducts(search) });
  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => { await createClient().from("products").update({ is_active }).eq("id", id); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin", "products"] }); toast.success("تم تحديث حالة المنتج"); },
  });
  const deleteProduct = useMutation({
    mutationFn: async (id: string) => { await createClient().from("products").delete().eq("id", id); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin", "products"] }); toast.success("تم حذف المنتج"); },
  });
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900">إدارة المنتجات</h1><p className="text-sm text-gray-500 mt-0.5">{products.length} منتج</p></div></div>
      <div className="bg-white rounded-2xl border border-gray-100 p-4"><div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5"><Search className="w-4 h-4 text-gray-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث بالاسم..." className="bg-transparent outline-none text-sm flex-1" /></div></div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 text-gray-500 text-xs border-b border-gray-100"><th className="text-right py-3.5 px-5 font-medium">المنتج</th><th className="text-right py-3.5 px-5 font-medium">التصنيف</th><th className="text-right py-3.5 px-5 font-medium">السعر</th><th className="text-right py-3.5 px-5 font-medium">المخزون</th><th className="text-right py-3.5 px-5 font-medium">الحالة</th><th className="text-right py-3.5 px-5 font-medium">إجراءات</th></tr></thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? Array.from({ length: 8 }).map((_, i) => <tr key={i}>{Array.from({ length: 6 }).map((_, j) => <td key={j} className="py-3.5 px-5"><div className="skeleton h-4 rounded w-full" /></td>)}</tr>) :
              products.map((product) => {
                const img = product.images?.find((i) => i.is_primary) ?? product.images?.[0];
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-5"><div className="flex items-center gap-3"><div className="relative w-10 h-10 rounded-xl overflow-hidden bg-pink-50 shrink-0"><Image src={getImageUrl(img?.url)} alt={product.name_ar} fill className="object-cover" /></div><div><p className="font-medium text-gray-800 line-clamp-1">{product.name_ar}</p><p className="text-xs text-gray-400 font-mono" dir="ltr">{product.sku}</p></div></div></td>
                    <td className="py-3.5 px-5 text-gray-600">{product.category?.name_ar ?? "—"}</td>
                    <td className="py-3.5 px-5"><p className="font-semibold text-pink-600">{formatPrice(product.price)}</p>{product.compare_price && <p className="text-xs text-gray-400 line-through">{formatPrice(product.compare_price)}</p>}</td>
                    <td className="py-3.5 px-5"><span className={`font-medium ${product.stock === 0 ? "text-red-500" : product.stock <= 5 ? "text-orange-500" : "text-green-600"}`}>{product.stock}</span></td>
                    <td className="py-3.5 px-5"><div className="flex flex-wrap gap-1"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${product.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{product.is_active ? "نشط" : "مخفي"}</span>{product.is_on_sale && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">تخفيض</span>}</div></td>
                    <td className="py-3.5 px-5"><div className="flex items-center gap-1">
                      <button onClick={() => toggleActive.mutate({ id: product.id, is_active: !product.is_active })} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors text-xs">{product.is_active ? "إخفاء" : "إظهار"}</button>
                      <button onClick={() => { if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) deleteProduct.mutate(product.id); }} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div></td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
        {!isLoading && products.length === 0 && <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">📦</p><p>لا توجد منتجات</p></div>}
      </div>
    </div>
  );
}
