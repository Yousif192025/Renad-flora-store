import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, Product, Coupon } from "@/types";
import { VAT_RATE } from "@/lib/constants";

interface CartState {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  vat: number;
  total: number;
  coupon: Coupon | null;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  setShippingFee: (fee: number) => void;
  getItemCount: () => number;
  isInCart: (productId: string) => boolean;
}

function calcTotals(items: CartItem[], coupon: Coupon | null, shipping: number) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  let discount = 0;
  if (coupon) {
    if (coupon.type === "percentage") discount = (subtotal * coupon.value) / 100;
    else if (coupon.type === "fixed") discount = Math.min(coupon.value, subtotal);
    else if (coupon.type === "free_shipping") shipping = 0;
  }
  const vat = (subtotal - discount) * VAT_RATE;
  const total = subtotal - discount + vat + shipping;
  return { subtotal, discount, shipping, vat, total };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [], subtotal: 0, discount: 0, shipping: 0, vat: 0, total: 0, coupon: null,
      addItem: (product, quantity = 1) => set((state) => {
        const idx = state.items.findIndex((i) => i.product.id === product.id);
        const items = idx >= 0
          ? state.items.map((i, n) => n === idx ? { ...i, quantity: i.quantity + quantity } : i)
          : [...state.items, { id: `${product.id}-${Date.now()}`, product, quantity, price: product.price }];
        return { items, ...calcTotals(items, state.coupon, state.shipping) };
      }),
      removeItem: (itemId) => set((state) => {
        const items = state.items.filter((i) => i.id !== itemId);
        return { items, ...calcTotals(items, state.coupon, state.shipping) };
      }),
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) { get().removeItem(itemId); return; }
        set((state) => {
          const items = state.items.map((i) => i.id === itemId ? { ...i, quantity } : i);
          return { items, ...calcTotals(items, state.coupon, state.shipping) };
        });
      },
      clearCart: () => set({ items: [], subtotal: 0, discount: 0, shipping: 0, vat: 0, total: 0, coupon: null }),
      applyCoupon: (coupon) => set((state) => ({ coupon, ...calcTotals(state.items, coupon, state.shipping) })),
      removeCoupon: () => set((state) => ({ coupon: null, ...calcTotals(state.items, null, state.shipping) })),
      setShippingFee: (fee) => set((state) => ({ ...calcTotals(state.items, state.coupon, fee) })),
      getItemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
      isInCart: (productId) => get().items.some((i) => i.product.id === productId),
    }),
    { name: "flora-cart", storage: createJSONStorage(() => localStorage) }
  )
);
