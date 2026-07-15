"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { formatDate, formatPrice } from "@/lib/utils";

const schema = z.object({ code: z.string().min(3), type: z.enum(["percentage","fixed","free_shipping"]), value: z.number().min(0), min_order_amount: z.number().optional(), max_uses: z.number().optional(), expires_at: z.string().optional() });
type FormData = z.infer<typeof schema>;
interface CouponRow { id: string; code: string; type: string; value: number; min_order_amount: number | null; max_uses: number | null; used_count: number; expires_at: string | null; is_active: boolean; }

async function getCoupons(): Promise<CouponRow[]> {
  const { data } = await createClient().from("coupons").select("*").order("created_at", { ascending: false });
  return (data ?? []) as unknown as CouponRow[];
}

export default function AdminCouponsPage() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  const { data: coupons = [], isLoading } = useQuery({ queryKey: ["admin","coupons"], queryFn: getCoupons });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { type: "percentage", value: 10 } });

  const createCoupon = useMutation({
    mutationFn: async (formData: FormData) => {
      const row = { code: formData.code.toUpperCase(), type: formData.type, value: formData.value, min_order_amount: formData.min_order_amount ?? null, max_uses: formData.max_uses ?? null, expires_at: formData.expires_at || null, is_active: true, used_count: 0 };
      const { error } = await createClient().from("coupons").insert([row]);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin","coupons"] }); toast.success("تم إنشاء الكوبون"); setShowForm(false); reset(); },
    onError: () => toast.error("حدث خطأ أثناء إنشاء الكوبون"),
  });

  const deleteCoupon = useMutation({
    mutationFn: async (id: string) => { await createClient().from("coupons").delete().eq("id", id); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin","coupons"] }); toast.success("تم حذف الكوبون"); },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-900">إدارة الكوبونات</h1><button onClick={() => setShowForm(!showForm)} className="btn-flora px-5 py-2.5 text-sm gap-2 inline-flex"><Plus className="w-4 h-4" />كوبون جديد</button></div>
      {showForm && (
        <div className="bg-white rounded-2xl border border-pink-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-5">إنشاء كوبون جديد</h2>
          <form onSubmit={handleSubmit((d) => createCoupon.mutate(d))} className="grid sm:grid-cols-2 gap-4">
            <div><label className="text-sm font-medium text-gray-700 block mb-1.5">كود الخصم *</label><input {...register("code")} placeholder="FLORA20" className="input-flora" style={{ textTransform: "uppercase" }} />{errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}</div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1.5">نوع الخصم *</label><select {...register("type")} className="input-flora"><option value="percentage">نسبة مئوية (%)</option><option value="fixed">مبلغ ثابت (ر.س)</option><option value="free_shipping">شحن مجاني</option></select></div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1.5">قيمة الخصم *</label><input {...register("value", { valueAsNumber: true })} type="number" className="input-flora" /></div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1.5">الحد الأدنى للطلب</label><input {...register("min_order_amount", { valueAsNumber: true })} type="number" placeholder="100" className="input-flora" /></div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1.5">الحد الأقصى للاستخدام</label><input {...register("max_uses", { valueAsNumber: true })} type="number" placeholder="500" className="input-flora" /></div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1.5">تاريخ الانتهاء</label><input {...register("expires_at")} type="datetime-local" className="input-flora" /></div>
            <div className="sm:col-span-2 flex gap-3"><button type="submit" disabled={createCoupon.isPending} className="btn-flora px-6 py-2.5 text-sm">{createCoupon.isPending ? "جاري الإنشاء..." : "إنشاء الكوبون"}</button><button type="button" onClick={() => setShowForm(false)} className="btn-outline-flora px-6 py-2.5 text-sm">إلغاء</button></div>
          </form>
        </div>
      )}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 text-gray-500 text-xs border-b border-gray-100"><th className="text-right py-3.5 px-5 font-medium">الكود</th><th className="text-right py-3.5 px-5 font-medium">النوع</th><th className="text-right py-3.5 px-5 font-medium">القيمة</th><th className="text-right py-3.5 px-5 font-medium">الحد الأدنى</th><th className="text-right py-3.5 px-5 font-medium">الاستخدام</th><th className="text-right py-3.5 px-5 font-medium">الحالة</th><th className="text-right py-3.5 px-5 font-medium">إجراءات</th></tr></thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? Array.from({ length: 4 }).map((_, i) => <tr key={i}>{Array.from({ length: 7 }).map((_, j) => <td key={j} className="py-3.5 px-5"><div className="skeleton h-4 rounded w-full" /></td>)}</tr>) :
              coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 px-5"><span className="font-mono font-bold text-pink-600 bg-pink-50 px-2 py-1 rounded-lg text-xs">{coupon.code}</span></td>
                  <td className="py-3.5 px-5 text-gray-600">{coupon.type === "percentage" ? "%" : coupon.type === "fixed" ? "ثابت" : "شحن"}</td>
                  <td className="py-3.5 px-5 font-semibold text-gray-800">{coupon.type === "percentage" ? `${coupon.value}%` : coupon.type === "fixed" ? formatPrice(coupon.value) : "مجاني"}</td>
                  <td className="py-3.5 px-5 text-gray-600">{coupon.min_order_amount ? formatPrice(coupon.min_order_amount) : "—"}</td>
                  <td className="py-3.5 px-5 text-gray-600">{coupon.used_count}{coupon.max_uses ? ` / ${coupon.max_uses}` : ""}</td>
                  <td className="py-3.5 px-5"><span className={`px-2 py-1 rounded-full text-xs font-medium ${coupon.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{coupon.is_active ? "نشط" : "متوقف"}</span></td>
                  <td className="py-3.5 px-5"><button onClick={() => { if (confirm("حذف الكوبون؟")) deleteCoupon.mutate(coupon.id); }} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              ))
            }
          </tbody>
        </table>
        {!isLoading && coupons.length === 0 && <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">🏷️</p><p>لا توجد كوبونات</p></div>}
      </div>
    </div>
  );
}
