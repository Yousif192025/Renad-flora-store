"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MessageCircle } from "lucide-react";
import { SOCIAL_LINKS, WHATSAPP_NUMBER } from "@/lib/constants";

const schema = z.object({ full_name: z.string().min(3), email: z.string().email(), phone: z.string().min(10), subject: z.string().min(5), message: z.string().min(20) });
type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const onSubmit = async (_data: FormData) => {
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("تم إرسال رسالتك! سنتواصل معك قريباً 🌸");
    reset();
  };
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="section-container max-w-4xl">
        <div className="text-center mb-10"><h1 className="text-3xl font-bold text-gray-900 mb-2">اتصلي بنا 📞</h1><p className="text-gray-500">يسعدنا مساعدتك في أي وقت</p></div>
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl p-5 border border-pink-100">
              <h3 className="font-semibold text-gray-800 mb-4">طرق التواصل</h3>
              <div className="space-y-4">
                <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center"><MessageCircle className="w-5 h-5 text-white" /></div>
                  <div><p className="font-semibold text-gray-800 text-sm">واتساب</p><p className="text-xs text-gray-500" dir="ltr">+{WHATSAPP_NUMBER}</p></div>
                </a>
                <a href="mailto:hello@florastore.com" className="flex items-center gap-3 p-3 rounded-xl bg-pink-50 hover:bg-pink-100 transition-colors">
                  <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center"><Mail className="w-5 h-5 text-white" /></div>
                  <div><p className="font-semibold text-gray-800 text-sm">البريد الإلكتروني</p><p className="text-xs text-gray-500">hello@florastore.com</p></div>
                </a>
              </div>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-5 text-white">
              <p className="font-bold text-lg mb-2">ساعات العمل</p>
              <p className="text-pink-100 text-sm">السبت – الخميس</p>
              <p className="text-white font-semibold">9:00 ص – 11:00 م</p>
              <p className="text-pink-100 text-sm mt-3">واتساب متاح 24/7</p>
            </div>
          </div>
          <div className="lg:col-span-3 bg-white rounded-2xl border border-pink-100 p-6">
            <h3 className="font-semibold text-gray-800 mb-5">أرسلي رسالة</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">الاسم *</label><input {...register("full_name")} placeholder="اسمك الكامل" className="input-flora" />{errors.full_name && <p className="text-red-500 text-xs mt-1">مطلوب</p>}</div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">الهاتف *</label><input {...register("phone")} placeholder="05xxxxxxxx" className="input-flora" dir="ltr" />{errors.phone && <p className="text-red-500 text-xs mt-1">مطلوب</p>}</div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">البريد الإلكتروني *</label><input {...register("email")} type="email" placeholder="example@email.com" className="input-flora" dir="ltr" />{errors.email && <p className="text-red-500 text-xs mt-1">بريد غير صحيح</p>}</div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">الموضوع *</label><input {...register("subject")} placeholder="بخصوص..." className="input-flora" />{errors.subject && <p className="text-red-500 text-xs mt-1">مطلوب</p>}</div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">الرسالة *</label><textarea {...register("message")} rows={5} placeholder="اكتبي رسالتك هنا..." className="input-flora resize-none" />{errors.message && <p className="text-red-500 text-xs mt-1">الرسالة قصيرة جداً</p>}</div>
              <button type="submit" disabled={isSubmitting} className="btn-flora w-full py-4 text-base">{isSubmitting ? "جاري الإرسال..." : "إرسال الرسالة 💌"}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
