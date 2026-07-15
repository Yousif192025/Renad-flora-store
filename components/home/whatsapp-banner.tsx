"use client";
import { motion } from "framer-motion";
import { SOCIAL_LINKS } from "@/lib/constants";

export function WhatsAppBanner() {
  return (
    <section className="py-14 bg-gradient-to-br from-pink-50 to-rose-50">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-xl mx-auto">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">هل تحتاجين مساعدة في الاختيار؟</h2>
          <p className="text-gray-600 mb-6">تواصلي معنا مباشرة عبر واتساب وسيسعدنا مساعدتك</p>
          <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 shadow-lg shadow-green-200">
            💬 تواصلي عبر واتساب
          </a>
        </motion.div>
      </div>
    </section>
  );
}
