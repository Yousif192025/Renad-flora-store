import type { Metadata } from "next";
export const metadata: Metadata = { title: "الأسئلة الشائعة | فلورا ستور" };
const faqs = [
  { q: "ما هي مناطق الشحن المتاحة؟", a: "نشحن لجميع مناطق المملكة العربية السعودية، الكويت، قطر، الإمارات، البحرين، وسلطنة عُمان." },
  { q: "كم يستغرق وقت التوصيل؟", a: "داخل المملكة 2-4 أيام عمل، ودول الخليج 3-7 أيام عمل." },
  { q: "هل الشحن مجاني؟", a: "نعم! الشحن مجاني داخل المملكة للطلبات فوق 300 ر.س." },
  { q: "كيف أتتبع طلبي؟", a: "يمكنك تتبع طلبك من خلال صفحة تتبع الطلب باستخدام رقم الطلب." },
  { q: "هل يمكنني إرجاع المنتج؟", a: "نعم، نقبل الإرجاع خلال 14 يوماً من تاريخ الاستلام للمنتجات غير المستخدمة." },
  { q: "ما طرق الدفع المتاحة؟", a: "نقبل مدى، فيزا، ماستركارد، Apple Pay، Google Pay، STC Pay، PayPal، وكذلك التقسيط عبر تابي وتمارا." },
  { q: "هل يمكن تخصيص بعض المنتجات؟", a: "نعم، بعض منتجاتنا تقبل التخصيص بالاسم أو التاريخ. تواصلي معنا عبر واتساب." },
  { q: "كيف أستخدم كود الخصم؟", a: "أضيفي المنتجات للسلة ثم اكتبي الكود في خانة كود الخصم وانقري تطبيق." },
];
export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="section-container max-w-2xl">
        <div className="text-center mb-10"><h1 className="text-3xl font-bold text-gray-900 mb-2">الأسئلة الشائعة ❓</h1><p className="text-gray-500">إجابات على أكثر الأسئلة شيوعاً</p></div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-white border border-pink-100 rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-800 hover:text-pink-600 transition-colors list-none">
                <span>{faq.q}</span><span className="text-pink-400 group-open:rotate-180 transition-transform text-xl shrink-0 mr-3">↓</span>
              </summary>
              <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-pink-50 pt-4">{faq.a}</div>
            </details>
          ))}
        </div>
        <div className="mt-10 text-center bg-pink-50 rounded-2xl p-8">
          <p className="font-semibold text-gray-800 mb-2">لم تجدي إجابتك؟</p>
          <p className="text-gray-500 text-sm mb-4">تواصلي معنا عبر واتساب وسنجيبك في أقرب وقت</p>
          <a href="https://wa.me/966501234567" target="_blank" rel="noopener noreferrer" className="btn-flora inline-flex px-6 py-3 text-sm">تواصلي معنا عبر واتساب</a>
        </div>
      </div>
    </div>
  );
}
