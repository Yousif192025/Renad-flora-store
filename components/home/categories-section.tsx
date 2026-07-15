"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/constants";

export function CategoriesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="section-container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">تسوّقي حسب <span className="text-flora-gradient">التصنيف</span></h2>
          <p className="text-gray-500">اكتشفي أكثر من 10 تصنيفات مختلفة</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div key={cat.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link href={`/category/${cat.slug}`}>
                <div className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-pink-100 hover:border-pink-300 hover:shadow-lg transition-all duration-200 cursor-pointer" style={{ background: cat.color + "60" }}>
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-200">{cat.emoji}</div>
                  <span className="text-sm font-semibold text-gray-800 text-center">{cat.nameAr}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/products" className="inline-flex items-center gap-2 text-pink-600 font-medium hover:text-pink-700 transition-colors">عرض جميع المنتجات ←</Link>
        </div>
      </div>
    </section>
  );
}
