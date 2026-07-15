"use client";
import { useWishlistStore } from "@/store/wishlist.store";
import { ProductCard } from "@/components/products/product-card";
import { Heart } from "lucide-react";
import Link from "next/link";
export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="section-container">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">المفضلة ❤️</h1>
        <p className="text-gray-500 mb-8">{items.length} منتج في قائمة أمنياتك</p>
        {items.length === 0 ? (
          <div className="text-center py-20"><Heart className="w-20 h-20 mx-auto text-pink-200 mb-5" /><h2 className="text-xl font-bold text-gray-700 mb-3">قائمة الأمنيات فارغة</h2><p className="text-gray-400 mb-6">أضيفي المنتجات التي تعجبك هنا</p><Link href="/products" className="btn-flora inline-flex px-8 py-3">تصفحي المنتجات</Link></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </div>
    </div>
  );
}
