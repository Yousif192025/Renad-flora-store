"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center" style={{ background: "linear-gradient(135deg, #fce7f3 0%, #fdf2f8 40%, #fffbeb 100%)" }}>
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-yellow-200/30 rounded-full blur-3xl" />
      <div className="section-container py-20 grid lg:grid-cols-2 gap-12 items-center w-full">
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="text-center lg:text-right order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 bg-white/80 border border-pink-200 rounded-full px-4 py-2 mb-6">
            <span className="text-sm font-medium text-pink-700">✦ الوصول للذوق الرفيع ✦</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
            <span className="block">أناقتك</span>
            <span className="block text-flora-gradient">قصتك</span>
            <span className="block text-3xl font-light text-gray-500 mt-2">YOUR STYLE, YOUR STORY</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">اكتشفي أجمل الإكسسوارات، الهدايا الفاخرة، ودمى لبوبو المحبوبة في متجر فلورا.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/products" className="btn-flora text-base px-8 py-4 gap-2"><span>تسوقي الآن</span><ArrowLeft className="w-5 h-5" /></Link>
            <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-outline-flora text-base px-8 py-4">تواصلي معنا</a>
          </div>
          <div className="flex items-center gap-8 justify-center lg:justify-start mt-10 pt-8 border-t border-pink-100">
            {[{ value: "+500", label: "منتج متاح" }, { value: "+2K", label: "عميلة سعيدة" }, { value: "6", label: "دول خليجية" }].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-flora-gradient">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="order-1 lg:order-2 flex justify-center">
          <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-br from-pink-200 via-rose-100 to-yellow-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-4 animate-float">🌸</div>
              <p className="text-pink-600 font-bold text-xl">Flora Store</p>
              <p className="text-pink-400 text-sm">✦ YOUR STYLE ✦</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
