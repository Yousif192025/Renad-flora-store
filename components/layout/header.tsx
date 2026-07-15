"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, Heart, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { CATEGORIES } from "@/lib/constants";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();
  const cartCount = useCartStore((s) => s.getItemCount());
  const wishCount = useWishlistStore((s) => s.count());

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) { router.push(`/search?q=${encodeURIComponent(search.trim())}`); setSearchOpen(false); setSearch(""); }
  };

  return (
    <>
      <header className={cn("sticky top-0 z-50 w-full transition-all duration-300 border-b border-pink-100", scrolled ? "bg-white/95 backdrop-blur-sm shadow-lg shadow-pink-100/50" : "bg-white")}>
        <div className="section-container">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="shrink-0">
              <span className="text-2xl font-bold text-flora-gradient">Flora</span>
              <span className="text-xs text-pink-400 block leading-none -mt-1">✦ Store ✦</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">الرئيسية</Link>
              <Link href="/products" className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">جميع المنتجات</Link>
              <div className="relative group">
                <button className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">التصنيفات ↓</button>
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-pink-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2">
                  {CATEGORIES.map((cat) => (
                    <Link key={cat.slug} href={`/category/${cat.slug}`} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors">
                      <span>{cat.emoji}</span><span>{cat.nameAr}</span>
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/offers" className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors">العروض 🔥</Link>
            </nav>

            <div className="flex items-center gap-2">
              <button onClick={() => setSearchOpen(true)} className="p-2 rounded-full hover:bg-pink-50 text-gray-600 hover:text-pink-600 transition-colors"><Search className="w-5 h-5" /></button>
              <Link href="/wishlist" className="relative p-2 rounded-full hover:bg-pink-50 text-gray-600 hover:text-pink-600 transition-colors">
                <Heart className="w-5 h-5" />
                {wishCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-pink-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{wishCount}</span>}
              </Link>
              <Link href="/cart" className="relative p-2 rounded-full hover:bg-pink-50 text-gray-600 hover:text-pink-600 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-pink-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{cartCount > 9 ? "9+" : cartCount}</span>}
              </Link>
              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-full hover:bg-pink-50">
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="md:hidden border-t border-pink-100 py-4 space-y-2">
              {[{ href: "/", label: "الرئيسية" }, { href: "/products", label: "جميع المنتجات" }, { href: "/offers", label: "العروض 🔥" }, { href: "/about", label: "من نحن" }, { href: "/contact", label: "اتصل بنا" }].map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-colors">{l.label}</Link>
              ))}
            </div>
          )}
        </div>
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4" onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}>
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <form onSubmit={handleSearch} className="flex items-center gap-3 p-4 border-b border-pink-100">
              <Search className="w-5 h-5 text-pink-400 shrink-0" />
              <input autoFocus type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحثي عن منتج..." className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-base" />
              <button type="button" onClick={() => setSearchOpen(false)} className="p-1.5 rounded-full hover:bg-pink-50 text-gray-400"><X className="w-5 h-5" /></button>
            </form>
            <div className="p-4">
              <p className="text-xs font-medium text-gray-400 mb-3">تصنيفات شائعة</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.slice(0, 6).map((cat) => (
                  <Link key={cat.slug} href={`/category/${cat.slug}`} onClick={() => setSearchOpen(false)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-50 text-pink-700 text-sm font-medium hover:bg-pink-100 transition-colors">
                    <span>{cat.emoji}</span><span>{cat.nameAr}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
