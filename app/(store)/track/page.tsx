"use client";
import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDate, formatPrice } from "@/lib/utils";
import { ORDER_STATUSES } from "@/lib/constants";

interface OrderData { id: string; order_number: string; status: string; payment_status: string; total: number; created_at: string; shipping_info: Record<string, string> | null; }

function TrackForm() {
  const searchParams = useSearchParams();
  const [orderNum, setOrderNum] = useState(searchParams.get("order") ?? "");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const doSearch = async (num: string) => {
    if (!num.trim()) return;
    setLoading(true); setError("");
    try {
      const { data } = await createClient().from("orders").select("*").eq("order_number", num.trim().toUpperCase()).single();
      if (!data) { setError("لم يتم العثور على طلب بهذا الرقم"); setOrder(null); }
      else setOrder(data as unknown as OrderData);
    } finally { setLoading(false); }
  };

  useEffect(() => { if (searchParams.get("order")) doSearch(searchParams.get("order")!); }, []);

  const statusSteps = ["pending", "confirmed", "processing", "shipped", "delivered"];
  const currentIdx = order ? statusSteps.indexOf(order.status) : -1;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-10"><h1 className="text-3xl font-bold text-gray-900 mb-2">تتبع طلبك 📦</h1><p className="text-gray-500">أدخلي رقم الطلب لمعرفة حالته</p></div>
        <form onSubmit={(e) => { e.preventDefault(); doSearch(orderNum); }} className="bg-white rounded-2xl p-6 border border-pink-100 mb-6">
          <div className="flex gap-3">
            <input value={orderNum} onChange={(e) => setOrderNum(e.target.value.toUpperCase())} placeholder="FL-XXXXXX-XXXX" className="input-flora flex-1" dir="ltr" />
            <button type="submit" disabled={loading} className="btn-flora px-6 py-3 gap-2"><Search className="w-4 h-4" />{loading ? "..." : "بحث"}</button>
          </div>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </form>
        {order && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-6 border border-pink-100">
              <div className="flex items-center justify-between mb-6">
                <div><p className="text-xs text-gray-400">رقم الطلب</p><p className="font-bold text-gray-900 text-lg" dir="ltr">{order.order_number}</p></div>
                <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${order.status === "delivered" ? "bg-green-100 text-green-700" : order.status === "cancelled" ? "bg-red-100 text-red-600" : "bg-pink-100 text-pink-700"}`}>
                  {ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES]?.labelAr ?? order.status}
                </span>
              </div>
              {order.status !== "cancelled" && order.status !== "refunded" && (
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-4 right-0 left-0 h-0.5 bg-gray-200"><div className="h-full bg-pink-400 transition-all" style={{ width: `${Math.max(0, currentIdx) / (statusSteps.length - 1) * 100}%` }} /></div>
                  {statusSteps.map((s, idx) => (
                    <div key={s} className="flex flex-col items-center gap-1 z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${idx <= currentIdx ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-400"} ${idx === currentIdx ? "ring-4 ring-pink-100" : ""}`}>{idx < currentIdx ? "✓" : idx + 1}</div>
                      <span className={`text-[10px] font-medium ${idx <= currentIdx ? "text-pink-600" : "text-gray-400"}`}>{ORDER_STATUSES[s as keyof typeof ORDER_STATUSES]?.labelAr}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-white rounded-2xl p-5 border border-pink-100 grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-gray-400 text-xs">تاريخ الطلب</p><p className="font-medium">{formatDate(order.created_at)}</p></div>
              <div><p className="text-gray-400 text-xs">إجمالي الطلب</p><p className="font-medium text-pink-600">{formatPrice(order.total)}</p></div>
              <div><p className="text-gray-400 text-xs">حالة الدفع</p><p className="font-medium">{order.payment_status === "paid" ? "✓ مدفوع" : "⏳ معلق"}</p></div>
              <div><p className="text-gray-400 text-xs">المدينة</p><p className="font-medium">{order.shipping_info?.city ?? "—"}</p></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default function TrackPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>}><TrackForm /></Suspense>;
}
