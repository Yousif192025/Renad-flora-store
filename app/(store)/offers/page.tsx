import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductsGrid } from "@/components/products/products-grid";

export const metadata: Metadata = { title: "العروض والتخفيضات 🔥" };

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-l from-red-500 to-pink-600 text-white py-14 text-center">
        <h1 className="text-4xl font-bold mb-2">🔥 العروض والتخفيضات</h1>
        <p className="text-pink-100 text-lg">وفري أكثر مع أحدث عروض فلورا ستور</p>
      </div>
      <div className="section-container py-10">
        <Suspense fallback={<div>جاري التحميل...</div>}>
          <ProductsGrid searchParams={{ filter: "sale" }} />
        </Suspense>
      </div>
    </div>
  );
}
