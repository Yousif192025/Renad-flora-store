import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { code, orderTotal } = await request.json();
  if (!code) return NextResponse.json({ error: "كود مطلوب" }, { status: 400 });
  const supabase = await createClient();
  const { data } = await supabase.from("coupons").select("*").eq("code", code.toUpperCase()).eq("is_active", true).single();
  if (!data) return NextResponse.json({ error: "الكود غير صحيح" }, { status: 404 });
  const coupon = data as { expires_at: string | null; max_uses: number | null; used_count: number; min_order_amount: number | null };
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) return NextResponse.json({ error: "انتهت صلاحية الكود" }, { status: 400 });
  if (coupon.max_uses && coupon.used_count >= coupon.max_uses) return NextResponse.json({ error: "تم استخدام الكود الحد الأقصى" }, { status: 400 });
  if (coupon.min_order_amount && orderTotal < coupon.min_order_amount) return NextResponse.json({ error: `الحد الأدنى للطلب هو ${coupon.min_order_amount} ر.س` }, { status: 400 });
  return NextResponse.json({ coupon: data });
}
