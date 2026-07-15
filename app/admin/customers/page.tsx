"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";

interface UserRow { id: string; email: string; full_name: string | null; phone: string | null; is_active: boolean; created_at: string; }
async function getCustomers(search: string): Promise<UserRow[]> {
  const supabase = createClient();
  let query = supabase.from("users").select("id, email, full_name, phone, is_active, created_at").eq("role", "customer").order("created_at", { ascending: false }).limit(100);
  if (search) query = query.ilike("email", `%${search}%`);
  const { data } = await query;
  return (data ?? []) as unknown as UserRow[];
}
export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const { data: customers = [], isLoading } = useQuery({ queryKey: ["admin", "customers", search], queryFn: () => getCustomers(search) });
  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-bold text-gray-900">إدارة العملاء</h1><p className="text-sm text-gray-500 mt-0.5">{customers.length} عميل</p></div>
      <div className="bg-white rounded-2xl border border-gray-100 p-4"><div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5"><Search className="w-4 h-4 text-gray-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث بالبريد الإلكتروني..." className="bg-transparent outline-none text-sm flex-1" /></div></div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 text-gray-500 text-xs border-b border-gray-100"><th className="text-right py-3.5 px-5 font-medium">العميل</th><th className="text-right py-3.5 px-5 font-medium">البريد الإلكتروني</th><th className="text-right py-3.5 px-5 font-medium">الهاتف</th><th className="text-right py-3.5 px-5 font-medium">الحالة</th><th className="text-right py-3.5 px-5 font-medium">تاريخ التسجيل</th></tr></thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? Array.from({ length: 8 }).map((_, i) => <tr key={i}>{Array.from({ length: 5 }).map((_, j) => <td key={j} className="py-3.5 px-5"><div className="skeleton h-4 rounded w-full" /></td>)}</tr>) :
              customers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 px-5"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold text-sm shrink-0">{user.full_name?.[0] ?? user.email[0].toUpperCase()}</div><span className="font-medium text-gray-800">{user.full_name ?? "—"}</span></div></td>
                  <td className="py-3.5 px-5 text-gray-600" dir="ltr">{user.email}</td>
                  <td className="py-3.5 px-5 text-gray-600" dir="ltr">{user.phone ?? "—"}</td>
                  <td className="py-3.5 px-5"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>{user.is_active ? "نشط" : "معطّل"}</span></td>
                  <td className="py-3.5 px-5 text-gray-400 text-xs">{formatDate(user.created_at)}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
        {!isLoading && customers.length === 0 && <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">👥</p><p>لا يوجد عملاء</p></div>}
      </div>
    </div>
  );
}
