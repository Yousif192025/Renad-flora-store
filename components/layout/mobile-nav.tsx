"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, ShoppingCart, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";

const navItems = [
  { href: "/",         icon: Home,         label: "الرئيسية" },
  { href: "/products", icon: Grid3X3,      label: "المنتجات" },
  { href: "/cart",     icon: ShoppingCart, label: "السلة",   cart: true },
  { href: "/wishlist", icon: Heart,        label: "المفضلة", wish: true },
  { href: "/account",  icon: User,         label: "حسابي" },
];

export function MobileNav() {
  const pathname   = usePathname();
  const cartCount  = useCartStore((s) => s.getItemCount());
  const wishCount  = useWishlistStore((s) => s.count());
  if (pathname.startsWith("/admin")) return null;
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-pink-100">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const count = item.cart ? cartCount : item.wish ? wishCount : 0;
          return (
            <Link key={item.href} href={item.href} className={cn("relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors", isActive ? "text-pink-600" : "text-gray-500")}>
              <div className="relative">
                <item.icon className={cn("w-5 h-5", isActive && "stroke-[2.5]")} />
                {count > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-pink-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">{count > 9 ? "9+" : count}</span>}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
