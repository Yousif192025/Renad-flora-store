import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/types";

interface WishlistState {
  items: Product[];
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  count: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (product) => set((state) => ({
        items: state.items.some((p) => p.id === product.id)
          ? state.items.filter((p) => p.id !== product.id)
          : [...state.items, product],
      })),
      isInWishlist: (productId) => get().items.some((p) => p.id === productId),
      count: () => get().items.length,
    }),
    { name: "flora-wishlist", storage: createJSONStorage(() => localStorage) }
  )
);
