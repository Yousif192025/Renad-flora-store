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
const schema = z.object({ email: z.string().email("البريد الإلكتروني غير صحيح"), password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل") });
type FormData = z.infer<typeof schema>;
export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const { error } = await createClient().auth.signInWithPassword({ email: data.email, password: data.password });
      if (error) { toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة"); return; }
      toast.success("تم تسجيل الدخول بنجاح 🌸");
      router.push("/"); router.refresh();
    } finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, #fce7f3 0%, #fdf2f8 40%, #fffbeb 100%)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8"><Link href="/"><span className="text-4xl font-bold text-flora-gradient">Flora</span><p className="text-pink-400 text-sm mt-1">✦ YOUR STYLE, YOUR STORY ✦</p></Link></div>
        <div className="bg-white rounded-3xl shadow-xl border border-pink-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">تسجيل الدخول</h1>
          <p className="text-gray-500 text-sm mb-6">أهلاً بعودتك 💕</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">البريد الإلكتروني</label><input {...register("email")} type="email" placeholder="example@email.com" className="input-flora" dir="ltr" />{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}</div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">كلمة المرور</label>
              <div className="relative"><input {...register("password")} type={showPass ? "text" : "password"} placeholder="••••••••" className="input-flora pe-10" dir="ltr" /><button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-flora w-full py-4 text-base disabled:opacity-60">{loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}</button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-5">ليس لديك حساب؟{" "}<Link href="/register" className="text-pink-600 font-semibold hover:text-pink-700">إنشاء حساب جديد</Link></p>
        </div>
      </div>
    </div>
  );
}
