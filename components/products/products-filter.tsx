"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function ProductsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [priceMin, setPriceMin] = useState(searchParams.get("min") ?? "");
  const [priceMax, setPriceMax] = useState(searchParams.get("max") ?? "");
  const activeCategory = searchParams.get("category");
  const activeFilter = searchParams.get("filter");

  const applyFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  };

  const applyPrice = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (priceMin) params.set("min", priceMin); else params.delete("min");
    if (priceMax) params.set("max", priceMax); else params.delete("max");
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  };

  const hasFilters = activeCategory || activeFilter || priceMin || priceMax;

  return (
    <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-pink-100">
        <div className="flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-pink-500" /><span className="font-semibold text-gray-800 text-sm">الفلاتر</span></div>
        {hasFilters && <button onClick={() => { setPriceMin(""); setPriceMax(""); router.push("/products"); }} className="text-xs text-pink-500 flex items-center gap-1 hover:text-pink-700"><X className="w-3 h-3" />مسح الكل</button>}
      </div>
      <div className="p-4 border-b border-pink-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">عروض خاصة</p>
        {[{ value: "sale", label: "🏷️ تخفيضات" }, { value: "new", label: "✨ جديد" }, { value: "featured", label: "⭐ مميز" }].map((f) => (
          <button key={f.value} onClick={() => applyFilter("filter", activeFilter === f.value ? null : f.value)} className={cn("w-full text-right text-sm px-3 py-2 rounded-xl mb-1 transition-colors", activeFilter === f.value ? "bg-pink-100 text-pink-700 font-medium" : "text-gray-600 hover:bg-pink-50")}>{f.label}</button>
        ))}
      </div>
      <div className="p-4 border-b border-pink-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">التصنيفات</p>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <button key={cat.slug} onClick={() => applyFilter("category", activeCategory === cat.slug ? null : cat.slug)} className={cn("w-full text-right flex items-center gap-2 text-sm px-3 py-2 rounded-xl transition-colors", activeCategory === cat.slug ? "bg-pink-100 text-pink-700 font-medium" : "text-gray-600 hover:bg-pink-50")}>
              <span>{cat.emoji}</span><span>{cat.nameAr}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">نطاق السعر</p>
        <div className="flex items-center gap-2">
          <input type="number" placeholder="من" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} className="w-full input-flora text-sm py-2 px-3" min={0} />
          <span className="text-gray-400">-</span>
          <input type="number" placeholder="إلى" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} className="w-full input-flora text-sm py-2 px-3" min={0} />
        </div>
        <button onClick={applyPrice} className="w-full mt-3 btn-flora text-sm py-2.5">تطبيق</button>
      </div>
    </div>
  );
}
