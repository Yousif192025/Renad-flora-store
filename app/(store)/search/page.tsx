import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductsGrid } from "@/components/products/products-grid";

interface Props { searchParams: Promise<Record<string, string | undefined>> }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `نتائج البحث عن: ${q}` : "البحث" };
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="section-container">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">{params.q ? <>نتائج البحث عن: <em>&ldquo;{params.q}&rdquo;</em></> : "البحث"}</h1>
        {params.q ? (
          <Suspense fallback={<div>جاري البحث...</div>}>
            <ProductsGrid searchParams={{ search: params.q }} />
          </Suspense>
        ) : (
          <div className="text-center py-20"><span className="text-5xl block mb-4">🔍</span><p className="text-gray-500">اكتبي ما تبحثين عنه في شريط البحث</p></div>
        )}
      </div>
    </div>
  );
}
