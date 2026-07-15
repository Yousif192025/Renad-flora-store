"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
const schema = z.object({ full_name: z.string().min(3), email: z.string().email(), phone: z.string().min(10), password: z.string().min(8), confirm_password: z.string() }).refine((d) => d.password === d.confirm_password, { message: "كلمتا المرور غير متطابقتين", path: ["confirm_password"] });
type FormData = z.infer<typeof schema>;
export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const { error } = await createClient().auth.signUp({ email: data.email, password: data.password, options: { data: { full_name: data.full_name, phone: data.phone } } });
      if (error) { toast.error(error.message); return; }
      toast.success("تم إنشاء الحساب! تحققي من بريدك الإلكتروني 🌸");
      router.push("/login");
    } finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, #fce7f3 0%, #fdf2f8 40%, #fffbeb 100%)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8"><Link href="/"><span className="text-4xl font-bold text-flora-gradient">Flora</span><p className="text-pink-400 text-sm mt-1">✦ YOUR STYLE, YOUR STORY ✦</p></Link></div>
        <div className="bg-white rounded-3xl shadow-xl border border-pink-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">إنشاء حساب جديد</h1>
          <p className="text-gray-500 text-sm mb-6">انضمي لعائلة فلورا ستور 🌸</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">الاسم الكامل *</label><input {...register("full_name")} placeholder="مثال: نورة العمري" className="input-flora" />{errors.full_name && <p className="text-red-500 text-xs mt-1">مطلوب</p>}</div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">البريد الإلكتروني *</label><input {...register("email")} type="email" placeholder="example@email.com" className="input-flora" dir="ltr" />{errors.email && <p className="text-red-500 text-xs mt-1">بريد غير صحيح</p>}</div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">رقم الهاتف *</label><input {...register("phone")} placeholder="05xxxxxxxx" className="input-flora" dir="ltr" />{errors.phone && <p className="text-red-500 text-xs mt-1">مطلوب</p>}</div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">كلمة المرور *</label>
              <div className="relative"><input {...register("password")} type={showPass ? "text" : "password"} placeholder="8 أحرف على الأقل" className="input-flora pe-10" dir="ltr" /><button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">تأكيد كلمة المرور *</label><input {...register("confirm_password")} type="password" placeholder="••••••••" className="input-flora" dir="ltr" />{errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>}</div>
            <button type="submit" disabled={loading} className="btn-flora w-full py-4 text-base disabled:opacity-60">{loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}</button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-5">لديك حساب بالفعل؟{" "}<Link href="/login" className="text-pink-600 font-semibold hover:text-pink-700">تسجيل الدخول</Link></p>
        </div>
      </div>
    </div>
  );
}
