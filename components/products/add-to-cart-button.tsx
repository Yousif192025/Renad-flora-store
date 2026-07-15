"use client";
import { useState } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import type { Product } from "@/types";

export function AddToCartButton({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const addItem      = useCartStore((s) => s.addItem);
  const toggleItem   = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.isInWishlist(product.id));
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">الكمية:</span>
        <div className="flex items-center border border-pink-200 rounded-xl overflow-hidden">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-pink-50 transition-colors text-lg font-bold text-gray-600">−</button>
          <span className="w-12 text-center font-semibold text-gray-800">{qty}</span>
          <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-pink-50 transition-colors text-lg font-bold text-gray-600">+</button>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={() => { addItem(product, qty); toast.success("تمت الإضافة إلى السلة 🛒"); }} className="flex-1 btn-flora py-4 text-base gap-2"><ShoppingCart className="w-5 h-5" />أضف إلى السلة</button>
        <button onClick={() => { toggleItem(product); toast.success(isWishlisted ? "حذف من المفضلة" : "أضيف للمفضلة"); }} className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${isWishlisted ? "border-pink-400 bg-pink-50" : "border-gray-200 hover:border-pink-300"}`}>
          <Heart className={`w-6 h-6 ${isWishlisted ? "fill-pink-500 text-pink-500" : "text-gray-400"}`} />
        </button>
      </div>
    </div>
  );
}
