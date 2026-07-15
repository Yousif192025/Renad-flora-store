"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import { cn, formatPrice, getImageUrl } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import type { Product } from "@/types";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const addItem      = useCartStore((s) => s.addItem);
  const toggleItem   = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.isInWishlist(product.id));
  const primaryImage = product.images?.find((img) => img.is_primary) ?? product.images?.[0];
  const hasDiscount  = product.compare_price && product.compare_price > product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    addItem(product);
    toast.success("تمت الإضافة إلى السلة 🛒", { description: product.name_ar });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    toggleItem(product);
    toast.success(isWishlisted ? "تم الحذف من المفضلة" : "تمت الإضافة للمفضلة");
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <div className={cn("product-card group", className)}>
        <div className="relative aspect-square overflow-hidden bg-pink-50">
          <Image src={getImageUrl(primaryImage?.url)} alt={primaryImage?.alt_ar ?? product.name_ar} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 50vw, 25vw" />
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {product.is_new && <span className="flora-badge-new text-[10px] px-2 py-0.5">جديد</span>}
            {hasDiscount && product.discount_percentage && <span className="flora-badge-sale text-[10px] px-2 py-0.5">-{product.discount_percentage}%</span>}
            {product.is_featured && <span className="flora-badge-featured text-[10px] px-2 py-0.5">مميز ✦</span>}
          </div>
          <button onClick={handleWishlist} className={cn("absolute top-2 left-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110", isWishlisted && "opacity-100")}>
            <Heart className={cn("w-4 h-4 transition-colors", isWishlisted ? "fill-pink-500 text-pink-500" : "text-gray-400")} />
          </button>
          <div className="absolute bottom-0 inset-x-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button onClick={handleAddToCart} disabled={product.stock === 0} className="w-full flex items-center justify-center gap-2 bg-white/95 backdrop-blur-sm text-pink-600 font-semibold text-sm py-2.5 rounded-xl hover:bg-pink-600 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">
              <ShoppingCart className="w-4 h-4" />
              {product.stock === 0 ? "نفد المخزون" : "أضف للسلة"}
            </button>
          </div>
        </div>
        <div className="p-3">
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-pink-600 transition-colors">{product.name_ar}</h3>
          {product.rating_count > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-500">{product.rating_avg.toFixed(1)} ({product.rating_count})</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="font-bold text-pink-600 text-base">{formatPrice(product.price)}</span>
            {hasDiscount && <span className="text-gray-400 line-through text-xs">{formatPrice(product.compare_price!)}</span>}
          </div>
          {product.stock > 0 && product.stock <= 5 && <p className="text-xs text-orange-500 mt-1 font-medium">متبقي {product.stock} فقط!</p>}
        </div>
      </div>
    </Link>
  );
}
