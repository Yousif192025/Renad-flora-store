import Link from "next/link";
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { href: "/admin/dashboard", label: "📊 لوحة التحكم" },
    { href: "/admin/products",  label: "📦 المنتجات" },
    { href: "/admin/orders",    label: "🛍️ الطلبات" },
    { href: "/admin/customers", label: "👥 العملاء" },
    { href: "/admin/coupons",   label: "🏷️ الكوبونات" },
  ];
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-gray-800">
          <Link href="/admin/dashboard"><span className="text-xl font-bold text-flora-gradient">Flora</span><span className="text-xs text-pink-400 block mt-0.5">✦ Admin Panel ✦</span></Link>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-all">{item.label}</Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800"><Link href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">← العودة للمتجر</Link></div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <p className="text-sm font-medium text-gray-600">لوحة إدارة فلورا ستور</p>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold text-sm">م</div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
