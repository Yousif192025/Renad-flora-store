import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import type { Product } from "@/types";
import { formatPrice, getImageUrl, calculateInstallment, getWhatsAppUrl } from "@/lib/utils";
import { INSTALLMENT_PROVIDERS, WHATSAPP_NUMBER } from "@/lib/constants";
import { AddToCartButton } from "@/components/products/add-to-cart-button";

interface Props { params: Promise<{ slug: string }> }

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("*, images:product_images(*), category:categories(id,name_ar,slug)").eq("slug", slug).eq("is_active", true).single();
  return data as unknown as Product | null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "المنتج غير موجود" };
  return { title: product.name_ar, description: product.description_ar ?? undefined };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const primaryImage = product.images?.find((img) => img.is_primary) ?? product.images?.[0];
  const hasDiscount = product.compare_price && product.compare_price > product.price;

  return (
    <div className="min-h-screen bg-white">
      <div className="section-container py-8">
        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          <div className="space-y-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-pink-50">
              <Image src={getImageUrl(primaryImage?.url)} alt={product.name_ar} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {product.images.map((img) => (
                  <div key={img.id} className="w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 border-pink-200">
                    <Image src={getImageUrl(img.url)} alt={img.alt_ar ?? product.name_ar} width={64} height={64} className="object-cover w-full h-full" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-6">
            {product.category && <span className="text-xs text-pink-600 bg-pink-50 px-3 py-1 rounded-full font-medium">{product.category.name_ar}</span>}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">{product.name_ar}</h1>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-pink-600">{formatPrice(product.price)}</span>
              {hasDiscount && <><span className="text-lg text-gray-400 line-through mb-0.5">{formatPrice(product.compare_price!)}</span><span className="text-sm bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full mb-0.5">وفري {product.discount_percentage}%</span></>}
            </div>
            <div className="bg-gradient-to-l from-pink-50 to-rose-50 rounded-2xl p-4 border border-pink-100">
              <p className="text-sm font-semibold text-gray-700 mb-3">💳 التقسيط بدون فوائد</p>
              <div className="grid grid-cols-2 gap-3">
                {INSTALLMENT_PROVIDERS.map((p) => (
                  <div key={p.id} className="bg-white rounded-xl p-3 text-center border border-pink-100">
                    <p className="text-xs text-gray-500 mb-1">{p.nameAr}</p>
                    <p className="font-bold text-pink-600 text-base">{formatPrice(calculateInstallment(product.price, p.months))}</p>
                    <p className="text-xs text-gray-400">× {p.months} دفعات</p>
                  </div>
                ))}
              </div>
            </div>
            <div>{product.stock > 0 ? <div className="flex items-center gap-2 text-sm text-green-600"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />{product.stock <= 5 ? `متبقي ${product.stock} قطع فقط!` : "متوفر في المخزون"}</div> : <div className="flex items-center gap-2 text-sm text-red-500"><span className="w-2 h-2 bg-red-500 rounded-full" />نفد من المخزون</div>}</div>
            {product.stock > 0 && <AddToCartButton product={product} />}
            <a href={getWhatsAppUrl(WHATSAPP_NUMBER, `مرحباً، أريد الاستفسار عن: ${product.name_ar}`)} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 border-2 border-green-400 text-green-700 font-semibold py-3.5 rounded-2xl hover:bg-green-50 transition-colors">💬 اطلب عبر واتساب</a>
            {product.description_ar && <div className="pt-4 border-t border-gray-100"><h3 className="font-semibold text-gray-800 mb-2">وصف المنتج</h3><p className="text-gray-600 text-sm leading-relaxed">{product.description_ar}</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
