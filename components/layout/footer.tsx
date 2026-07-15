import Link from "next/link";
import { SOCIAL_LINKS, CATEGORIES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-gray-950 text-white mt-16">
      <div className="section-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <span className="text-3xl font-bold text-flora-gradient">Flora</span>
            <p className="text-xs text-pink-400 font-medium mt-1">✦ YOUR STYLE, YOUR STORY ✦</p>
            <p className="text-gray-400 text-sm leading-relaxed mt-4 mb-5">متجر فلورا — وجهتك المفضلة للإكسسوارات الأنيقة والهدايا الفاخرة.</p>
            <div className="flex items-center gap-3">
              {[{ href: SOCIAL_LINKS.instagram, label: "IG" }, { href: SOCIAL_LINKS.tiktok, label: "TK" }, { href: SOCIAL_LINKS.facebook, label: "FB" }, { href: SOCIAL_LINKS.whatsapp, label: "WA" }].map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-colors text-xs font-bold">{s.label}</a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">التصنيفات</h3>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.slug}><Link href={`/category/${cat.slug}`} className="text-gray-400 hover:text-pink-400 transition-colors text-sm flex items-center gap-2"><span>{cat.emoji}</span><span>{cat.nameAr}</span></Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              {[{ href: "/products", label: "جميع المنتجات" }, { href: "/offers", label: "العروض والتخفيضات" }, { href: "/track", label: "تتبع طلبي" }, { href: "/about", label: "من نحن" }, { href: "/contact", label: "اتصل بنا" }, { href: "/faq", label: "الأسئلة الشائعة" }].map((l) => (
                <li key={l.href}><Link href={l.href} className="text-gray-400 hover:text-pink-400 transition-colors text-sm">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">السياسات</h3>
            <ul className="space-y-2 mb-6">
              {[{ href: "/shipping-policy", label: "سياسة الشحن" }, { href: "/return-policy", label: "سياسة الاسترجاع" }].map((l) => (
                <li key={l.href}><Link href={l.href} className="text-gray-400 hover:text-pink-400 transition-colors text-sm">{l.label}</Link></li>
              ))}
            </ul>
            <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-full transition-colors">💬 واتساب</a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="section-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} فلورا ستور. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-2">
            {["مدى", "Visa", "Mastercard", "STC Pay", "Apple Pay"].map((m) => (
              <span key={m} className="text-xs text-gray-600 bg-gray-800 px-2 py-1 rounded-md">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
