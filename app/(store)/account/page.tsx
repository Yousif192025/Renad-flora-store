"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Package, MapPin, Heart, LogOut, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDate, formatPrice } from "@/lib/utils";
import { ORDER_STATUSES } from "@/lib/constants";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
}

interface OrderRow {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
}

type Tab = "profile" | "orders" | "addresses";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser]       = useState<UserProfile | null>(null);
  const [orders, setOrders]   = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState<Tab>("profile");
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("users")
        .select("id, email, full_name, phone")
        .eq("id", session.user.id)
        .single();

      if (profile) setUser(profile as UserProfile);

      const { data: orderData } = await supabase
        .from("orders")
        .select("id, order_number, status, total, created_at")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (orderData) setOrders(orderData as unknown as OrderRow[]);

      setLoading(false);
    };

    init();
  }, [router]);

  const handleSignOut = async () => {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("تم تسجيل الخروج");
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  if (!user) return null;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile",   label: "الملف الشخصي", icon: <User className="w-4 h-4" />     },
    { id: "orders",    label: "طلباتي",        icon: <Package className="w-4 h-4" />  },
    { id: "addresses", label: "عناويني",       icon: <MapPin className="w-4 h-4" />   },
  ];

  const STATUS_COLORS: Record<string, string> = {
    pending:    "bg-yellow-100 text-yellow-700",
    confirmed:  "bg-blue-100 text-blue-700",
    processing: "bg-purple-100 text-purple-700",
    shipped:    "bg-indigo-100 text-indigo-700",
    delivered:  "bg-green-100 text-green-700",
    cancelled:  "bg-red-100 text-red-700",
    refunded:   "bg-gray-100 text-gray-600",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="section-container max-w-4xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold text-xl">
              {user.full_name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {user.full_name ?? "عميلتنا العزيزة"}
              </h1>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors disabled:opacity-60"
          >
            {signingOut
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <LogOut className="w-4 h-4" />
            }
            تسجيل الخروج
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1.5 border border-pink-100 w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === t.id
                  ? "bg-pink-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-pink-600 hover:bg-pink-50"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === "profile" && (
          <div className="bg-white rounded-2xl border border-pink-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-5">معلوماتي الشخصية</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">الاسم الكامل</label>
                <p className="text-gray-800 font-medium">{user.full_name ?? "—"}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">البريد الإلكتروني</label>
                <p className="text-gray-800 font-medium" dir="ltr">{user.email}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">رقم الهاتف</label>
                <p className="text-gray-800 font-medium" dir="ltr">{user.phone ?? "—"}</p>
              </div>
            </div>

            {/* Quick links */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">روابط سريعة</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { href: "/wishlist",       icon: <Heart className="w-5 h-5" />,   label: "المفضلة"    },
                  { href: "/track",          icon: <Package className="w-5 h-5" />, label: "تتبع طلب"   },
                  { href: "/cart",           icon: <Package className="w-5 h-5" />, label: "السلة"      },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 p-3 bg-pink-50 hover:bg-pink-100 rounded-xl text-sm font-medium text-pink-700 transition-colors"
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === "orders" && (
          <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">طلباتي ({orders.length})</h2>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-14 h-14 mx-auto text-gray-200 mb-4" />
                <p className="text-gray-500 font-medium">لا توجد طلبات بعد</p>
                <p className="text-gray-400 text-sm mt-1">ابدئي التسوق وستظهر طلباتك هنا</p>
                <Link href="/products" className="btn-flora inline-flex mt-4 px-6 py-2.5 text-sm">
                  تسوقي الآن
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {orders.map((order) => {
                  const statusLabel = ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES]?.labelAr ?? order.status;
                  return (
                    <div key={order.id} className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                          <Package className="w-5 h-5 text-pink-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm" dir="ltr">
                            {order.order_number}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                          {statusLabel}
                        </span>
                        <span className="font-bold text-pink-600 text-sm">
                          {formatPrice(order.total)}
                        </span>
                        <Link
                          href={`/track?order=${order.order_number}`}
                          className="text-xs text-pink-500 hover:text-pink-700 transition-colors"
                        >
                          تتبع ←
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Addresses Tab */}
        {tab === "addresses" && (
          <div className="bg-white rounded-2xl border border-pink-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-5">عناويني المحفوظة</h2>
            <div className="text-center py-12">
              <MapPin className="w-14 h-14 mx-auto text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">لا توجد عناوين محفوظة</p>
              <p className="text-gray-400 text-sm mt-1">
                العناوين تُحفظ تلقائياً عند إتمام طلبك
              </p>
              <Link href="/products" className="btn-flora inline-flex mt-4 px-6 py-2.5 text-sm">
                تسوقي الآن
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
