import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductsGrid } from "@/components/products/products-grid";
import { ProductsFilter } from "@/components/products/products-filter";

export const metadata: Metadata = {
  title: "جميع المنتجات",
  description: "تصفحي جميع منتجات فلورا ستور",
};

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="section-container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">جميع <span className="text-flora-gradient">المنتجات</span></h1>
          <p className="text-gray-500">اكتشفي أحدث تشكيلات فلورا ستور</p>
        </div>
        <div className="flex gap-6">
          <aside className="hidden lg:block w-64 shrink-0"><ProductsFilter /></aside>
          <div className="flex-1 min-w-0">
            <Suspense fallback={<div className="text-center py-20 text-gray-400">جاري التحميل...</div>}>
              <ProductsGrid searchParams={params} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
