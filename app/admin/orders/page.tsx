"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUSES } from "@/lib/constants";

interface ShippingData { full_name?: string; phone?: string; city?: string }
interface OrderRow { id: string; order_number: string; status: string; payment_status: string; total: number; created_at: string; shipping_info: ShippingData | null; items_count?: number; }

async function getOrders(status: string, search: string): Promise<OrderRow[]> {
  const supabase = createClient();
  let query = supabase.from("orders").select("id, order_number, status, payment_status, total, created_at, shipping_info").order("created_at", { ascending: false }).limit(100);
  if (status !== "all") query = query.eq("status", status);
  if (search) query = query.ilike("order_number", `%${search}%`);
  const { data } = await query;
  return (data ?? []) as unknown as OrderRow[];
}

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();
  const { data: orders = [], isLoading } = useQuery({ queryKey: ["admin", "orders", statusFilter, search], queryFn: () => getOrders(statusFilter, search) });
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => { await createClient().from("orders").update({ status }).eq("id", id); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin", "orders"] }); toast.success("تم تحديث حالة الطلب"); },
  });
  const STATUS_COLORS: Record<string, string> = { pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-blue-100 text-blue-700", processing: "bg-purple-100 text-purple-700", shipped: "bg-indigo-100 text-indigo-700", delivered: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700", refunded: "bg-gray-100 text-gray-600" };
  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-bold text-gray-900">إدارة الطلبات</h1><p className="text-sm text-gray-500 mt-0.5">{orders.length} طلب</p></div>
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2 flex-1 min-w-52"><Search className="w-4 h-4 text-gray-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث برقم الطلب..." className="bg-transparent outline-none text-sm flex-1" dir="ltr" /></div>
        <div className="flex items-center gap-2 flex-wrap">
          {["all", ...Object.keys(ORDER_STATUSES)].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${statusFilter === s ? "bg-pink-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {s === "all" ? "الكل" : ORDER_STATUSES[s as keyof typeof ORDER_STATUSES].labelAr}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 text-gray-500 text-xs border-b border-gray-100">
            <th className="text-right py-3.5 px-5 font-medium">رقم الطلب</th>
            <th className="text-right py-3.5 px-5 font-medium">العميل</th>
            <th className="text-right py-3.5 px-5 font-medium">المدينة</th>
            <th className="text-right py-3.5 px-5 font-medium">الإجمالي</th>
            <th className="text-right py-3.5 px-5 font-medium">الحالة</th>
            <th className="text-right py-3.5 px-5 font-medium">الدفع</th>
            <th className="text-right py-3.5 px-5 font-medium">التاريخ</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? Array.from({ length: 8 }).map((_, i) => <tr key={i}>{Array.from({ length: 7 }).map((_, j) => <td key={j} className="py-3.5 px-5"><div className="skeleton h-4 rounded w-full" /></td>)}</tr>) :
              orders.map((order) => {
                const info = order.shipping_info;
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-5 font-mono text-xs text-pink-600 font-semibold" dir="ltr">{order.order_number}</td>
                    <td className="py-3.5 px-5"><p className="font-medium text-gray-800">{info?.full_name ?? "—"}</p><p className="text-xs text-gray-400" dir="ltr">{info?.phone ?? ""}</p></td>
                    <td className="py-3.5 px-5 text-gray-600">{info?.city ?? "—"}</td>
                    <td className="py-3.5 px-5 font-semibold text-gray-800">{formatPrice(order.total)}</td>
                    <td className="py-3.5 px-5">
                      <select value={order.status} onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value })} className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 outline-none cursor-pointer ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {Object.entries(ORDER_STATUSES).map(([k, v]) => <option key={k} value={k}>{v.labelAr}</option>)}
                      </select>
                    </td>
                    <td className="py-3.5 px-5"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${order.payment_status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{order.payment_status === "paid" ? "مدفوع" : "معلق"}</span></td>
                    <td className="py-3.5 px-5 text-gray-400 text-xs">{formatDate(order.created_at)}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
        {!isLoading && orders.length === 0 && <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">📦</p><p>لا توجد طلبات</p></div>}
      </div>
    </div>
  );
}
