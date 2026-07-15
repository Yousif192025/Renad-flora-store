import type { Metadata } from "next";
import { SOCIAL_LINKS } from "@/lib/constants";
export const metadata: Metadata = { title: "من نحن | فلورا ستور" };
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="py-20 text-center" style={{ background: "linear-gradient(135deg, #fce7f3 0%, #fdf2f8 40%, #fffbeb 100%)" }}>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">من <span className="text-flora-gradient">نحن</span></h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">قصتنا، رؤيتنا، وشغفنا بتقديم أفضل تجربة تسوق</p>
      </div>
      <div className="section-container py-16 max-w-3xl">
        <div className="mb-12"><h2 className="text-2xl font-bold text-gray-900 mb-4">✨ قصة فلورا</h2><p className="text-gray-600 leading-relaxed mb-4">انطلق متجر فلورا ستور من فكرة بسيطة: تقديم إكسسوارات وهدايا أنيقة تعكس شخصية كل امرأة. نؤمن بأن كل تفصيلة صغيرة تحكي قصة.</p><p className="text-gray-600 leading-relaxed">بدأنا بتشكيلة صغيرة من الإكسسوارات وكبرنا لنضم أكثر من 10 تصنيفات تشمل الساعات، الميداليات، دمى لبوبو، الشموع العطرية، المجات، المرايات، وبوكسات الهدايا.</p></div>
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {[{ emoji: "🌸", title: "الجودة أولاً", text: "نختار كل منتج بعناية لنضمن تجربة لا مثيل لها" }, { emoji: "💝", title: "حب التفاصيل", text: "تغليف هدايا مميز يجعل كل طلب هدية بحد ذاتها" }, { emoji: "🚀", title: "شحن سريع", text: "نوصل طلباتك لجميع مدن السعودية والخليج بسرعة" }].map((v) => (
            <div key={v.title} className="text-center p-6 bg-pink-50 rounded-2xl"><span className="text-4xl block mb-3">{v.emoji}</span><h3 className="font-bold text-gray-800 mb-2">{v.title}</h3><p className="text-gray-500 text-sm">{v.text}</p></div>
          ))}
        </div>
        <div className="text-center bg-gradient-to-l from-pink-600 to-rose-500 rounded-3xl p-10 text-white">
          <h2 className="text-2xl font-bold mb-2">تابعينا على السوشيال ميديا 🌟</h2>
          <p className="text-pink-100 mb-6">@flor.astore123 على إنستجرام | @florastore04 على تيك توك</p>
          <div className="flex justify-center gap-4">
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full font-medium transition-colors">إنستجرام</a>
            <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full font-medium transition-colors">تيك توك</a>
            <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="bg-white text-pink-600 px-6 py-3 rounded-full font-bold hover:bg-pink-50 transition-colors">واتساب</a>
          </div>
        </div>
      </div>
    </div>
  );
}
