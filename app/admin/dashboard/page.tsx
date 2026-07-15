"use client";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, ShoppingBag, Users, Package } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUSES } from "@/lib/constants";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface OrderRow { order_number: string; status: string; total: number; created_at: string; shipping_info: { full_name?: string; city?: string } | null; }

async function getStats() {
  const supabase = createClient();
  const [ordersRes, productsRes, usersRes] = await Promise.all([
    supabase.from("orders").select("total, status, created_at, order_number, shipping_info").order("created_at", { ascending: false }).limit(50),
    supabase.from("products").select("id", { count: "exact" }).eq("is_active", true),
    supabase.from("users").select("id", { count: "exact" }).eq("role", "customer"),
  ]);
  const orders = (ordersRes.data ?? []) as unknown as OrderRow[];
  const totalRevenue = orders.reduce((s, o) => s + (o.total ?? 0), 0);
  const now = new Date();
  const revenueByMonth = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const label = d.toLocaleString("ar-SA", { month: "short" });
    const revenue = orders.filter((o) => { const od = new Date(o.created_at); return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear(); }).reduce((s, o) => s + (o.total ?? 0), 0);
    return { month: label, revenue };
  });
  return { totalRevenue, totalOrders: orders.length, totalProducts: productsRes.count ?? 0, totalCustomers: usersRes.count ?? 0, recentOrders: orders.slice(0, 10), revenueByMonth };
}

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({ queryKey: ["admin", "dashboard"], queryFn: getStats });
  const cards = [
    { label: "إجمالي الإيرادات", value: stats ? formatPrice(stats.totalRevenue) : "---", icon: TrendingUp, color: "from-pink-500 to-rose-500" },
    { label: "إجمالي الطلبات",   value: String(stats?.totalOrders ?? "---"),              icon: ShoppingBag, color: "from-violet-500 to-purple-500" },
    { label: "العملاء",           value: String(stats?.totalCustomers ?? "---"),            icon: Users,       color: "from-blue-500 to-cyan-500" },
    { label: "المنتجات النشطة",  value: String(stats?.totalProducts ?? "---"),             icon: Package,     color: "from-amber-500 to-orange-500" },
  ];
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1><p className="text-gray-500 text-sm mt-1">مرحباً بك في لوحة إدارة فلورا ستور</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4`}><card.icon className="w-6 h-6 text-white" /></div>
            <p className="text-2xl font-bold text-gray-900 mb-0.5">{isLoading ? "..." : card.value}</p>
            <p className="text-xs text-gray-500">{card.label}</p>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-5">الإيرادات - آخر 6 أشهر</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats?.revenueByMonth ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => [formatPrice(v), "الإيرادات"]} />
              <Line type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={2.5} dot={{ fill: "#ec4899", strokeWidth: 2, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-5">أحدث الطلبات</h3>
          <div className="space-y-3">
            {isLoading ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-8 rounded-xl" />) :
              stats?.recentOrders.map((order) => (
                <div key={order.order_number} className="flex items-center justify-between text-sm">
                  <div><p className="font-medium text-gray-800 text-xs" dir="ltr">{order.order_number}</p><p className="text-xs text-gray-400">{order.shipping_info?.full_name ?? "—"}</p></div>
                  <div className="text-left"><p className="font-semibold text-pink-600">{formatPrice(order.total)}</p><span className={`text-xs px-2 py-0.5 rounded-full ${order.status === "delivered" ? "bg-green-100 text-green-700" : order.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}>{ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES]?.labelAr}</span></div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
