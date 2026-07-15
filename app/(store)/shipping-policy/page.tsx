import type { Metadata } from "next";
import { SHIPPING_COUNTRIES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
export const metadata: Metadata = { title: "سياسة الشحن | فلورا ستور" };
export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="section-container max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">سياسة الشحن 🚚</h1>
        <p className="text-gray-500 mb-10">آخر تحديث: يناير 2025</p>
        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">مناطق الشحن ورسومه</h2>
            <div className="overflow-hidden rounded-2xl border border-gray-100">
              <table className="w-full text-sm">
                <thead><tr className="bg-pink-50 text-gray-700"><th className="text-right py-3 px-5 font-semibold">الدولة</th><th className="text-right py-3 px-5 font-semibold">رسوم الشحن</th><th className="text-right py-3 px-5 font-semibold">شحن مجاني من</th><th className="text-right py-3 px-5 font-semibold">وقت التوصيل</th></tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {SHIPPING_COUNTRIES.map((country) => (
                    <tr key={country.code} className="hover:bg-gray-50">
                      <td className="py-3 px-5">{country.flag} {country.nameAr}</td>
                      <td className="py-3 px-5 font-medium">{formatPrice(country.shippingFee)}</td>
                      <td className="py-3 px-5 text-green-600 font-medium">{formatPrice(country.freeShippingAt)}</td>
                      <td className="py-3 px-5 text-gray-500">{country.deliveryDays} أيام</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <ul className="space-y-2 list-disc list-inside text-gray-600 text-sm">
            <li>أوقات الشحن تُحتسب من أيام العمل (السبت – الخميس)</li>
            <li>سيتم إرسال رقم تتبع الشحنة عبر واتساب بعد شحن الطلب</li>
            <li>نحرص على تغليف المنتجات بعناية لضمان وصولها بأمان</li>
          </ul>
          <div className="bg-pink-50 rounded-2xl p-6 text-center"><h2 className="text-lg font-bold text-gray-900 mb-2">هل لديك استفسار عن شحنتك؟</h2><a href="https://wa.me/966501234567" target="_blank" rel="noopener noreferrer" className="btn-flora inline-flex px-5 py-2.5 text-sm mt-3">تواصلي معنا</a></div>
        </div>
      </div>
    </div>
  );
}
