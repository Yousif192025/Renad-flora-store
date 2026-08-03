"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart.store";
import { useCheckoutStore } from "@/store/checkout.store";
import { formatPrice, generateOrderNumber } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { SHIPPING_COUNTRIES, PAYMENT_METHODS, INSTALLMENT_PROVIDERS } from "@/lib/constants";
import type { ShippingCountry } from "@/lib/constants";
import type { PaymentMethodId } from "@/types";

const customerSchema = z.object({
  full_name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10),
});

const shippingSchema = z.object({
  country_code: z.string().min(2),
  city: z.string().min(2),
  district: z.string().optional(),
  street: z.string().min(5),
  building: z.string().optional(),
  notes: z.string().optional(),
});

type CustomerForm = z.infer<typeof customerSchema>;
type ShippingForm = z.infer<typeof shippingSchema>;

const STEPS = ["customer", "shipping", "payment", "review"] as const;
const STEP_LABELS = { customer: "معلوماتك", shipping: "الشحن", payment: "الدفع", review: "مراجعة" };

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, subtotal, discount, shipping, vat, coupon, clearCart, setShippingFee } = useCartStore();
  const { step, customerInfo, shippingAddress, paymentMethod, setStep, setCustomerInfo, setShippingAddress, setShipping, setPaymentMethod, reset } = useCheckoutStore();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodId | null>(paymentMethod);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<ShippingCountry>(SHIPPING_COUNTRIES[0]);

  const customerForm = useForm<CustomerForm>({ resolver: zodResolver(customerSchema), defaultValues: customerInfo });
  const shippingForm = useForm<ShippingForm>({ resolver: zodResolver(shippingSchema), defaultValues: { country_code: "SA", city: "", street: "", district: "", building: "", notes: "" } });

  if (items.length === 0) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-xl font-bold text-gray-800 mb-3">السلة فارغة</h2>
        <Link href="/products" className="btn-flora inline-flex px-8 py-3">تسوقي الآن</Link>
      </div>
    </div>
  );

  const currentIdx = STEPS.indexOf(step as typeof STEPS[number]);

  const onCustomerSubmit = (data: CustomerForm) => {
    setCustomerInfo({ full_name: data.full_name ?? "", email: data.email ?? "", phone: data.phone ?? "" });
    setStep("shipping");
  };

  const onShippingSubmit = (data: ShippingForm) => {
    const country = SHIPPING_COUNTRIES.find((c) => c.code === data.country_code) ?? SHIPPING_COUNTRIES[0];
    const fee = subtotal >= country.freeShippingAt ? 0 : country.shippingFee;

    setShippingAddress({
      full_name: customerInfo.full_name,
      phone: customerInfo.phone,
      country_code: data.country_code,
      city: data.city,
      district: data.district ?? "",
      street: data.street,
      building: data.building ?? "",
      notes: data.notes ?? "",
    });

    setShipping(fee, country.deliveryDays);
    setShippingFee(fee);
    setStep("payment");
  };

  const handlePlaceOrder = async () => {
    if (!selectedPayment) { toast.error("اختاري طريقة الدفع"); return; }
    setPlacingOrder(true);
    try {
      const supabase = createClient();
      const { data: order, error } = await supabase.from("orders").insert([{
        order_number: generateOrderNumber(),
        status: "pending",
        payment_status: "pending",
        payment_method: selectedPayment,
        subtotal,
        discount,
        shipping_fee: shipping,
        vat,
        total,
        coupon_code: coupon?.code ?? null,
        shipping_info: {
          full_name: shippingAddress.full_name,
          phone: shippingAddress.phone,
          country_code: shippingAddress.country_code,
          city: shippingAddress.city,
          district: shippingAddress.district ?? null,
          street: shippingAddress.street,
          building: shippingAddress.building ?? null,
          notes: shippingAddress.notes ?? null,
        },
      }]).select().single();

      if (error) throw error;
      const o = order as { id: string; order_number: string };

      await supabase.from("order_items").insert(
        items.map((item) => ({
          order_id: o.id,
          product_id: item.product.id,
          product_name_ar: item.product.name_ar,
          product_name_en: item.product.name_en,
          price: item.price,
          quantity: item.quantity,
        }))
      );

      clearCart();
      reset();
      router.push(`/track?order=${o.order_number}`);
    } catch {
      toast.error("حدث خطأ. يرجى المحاولة مجدداً.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="section-container max-w-4xl">
        <div className="text-center mb-8">
          <span className="text-2xl font-bold text-flora-gradient">Flora</span>
          <p className="text-xs text-pink-400">✦ Checkout ✦</p>
        </div>

        <div className="flex items-center justify-center gap-0 mb-8">
          {STEPS.map((s, idx) => (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    idx < currentIdx ? "bg-pink-500 text-white" : idx === currentIdx ? "bg-pink-50 border border-pink-200 text-pink-600" : "bg-white text-gray-500"
                  }`}
                >
                  {idx + 1}
                </div>
                <span className={`text-xs mt-1.5 font-medium ${idx === currentIdx ? "text-pink-600" : idx < currentIdx ? "text-pink-400" : "text-gray-400"}`}>{STEP_LABELS[s]}</span>
              </div>
              {idx < STEPS.length - 1 && <div className={`w-16 sm:w-24 h-0.5 mx-2 mb-5 ${idx < currentIdx ? "bg-pink-400" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-pink-100 p-6">
            {step === "customer" && (
              <form onSubmit={customerForm.handleSubmit(onCustomerSubmit)} className="space-y-5">
                <h2 className="text-xl font-bold text-gray-900">معلوماتك الشخصية</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">الاسم الكامل *</label>
                  <input {...customerForm.register("full_name")} placeholder="مثال: نور الهدى" className="input-flora w-full" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">البريد الإلكتروني *</label>
                  <input {...customerForm.register("email")} type="email" placeholder="example@domain.com" className="input-flora w-full" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">رقم الهاتف *</label>
                  <input {...customerForm.register("phone")} placeholder="05xxxxxxxx" className="input-flora w-full" />
                </div>

                <button type="submit" className="btn-flora w-full py-4 text-base">التالي: عنوان الشحن ←</button>
              </form>
            )}

            {step === "shipping" && (
              <form onSubmit={shippingForm.handleSubmit(onShippingSubmit)} className="space-y-5">
                <h2 className="text-xl font-bold text-gray-900">عنوان الشحن</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الدولة *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SHIPPING_COUNTRIES.map((country) => {
                      const fee = subtotal >= country.freeShippingAt ? 0 : country.shippingFee;
                      return (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(country);
                            shippingForm.setValue("country_code", country.code);
                            shippingForm.setValue("city", "");
                          }}
                          className={`p-3 rounded-xl border text-sm text-right transition-all ${
                            selectedCountry.code === country.code
                              ? "border-pink-400 bg-pink-50 text-pink-700"
                              : "bg-white border-gray-100 text-gray-700"
                          }`}
                        >
                          <span className="block font-semibold">{country.flag} {country.nameAr}</span>
                          <span className="text-xs text-gray-400">{fee === 0 ? "شحن مجاني" : formatPrice(fee)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">المدينة *</label>
                  <select {...shippingForm.register("city")} className="input-flora w-full">
                    <option value="">اختر المدينة</option>
                    {selectedCountry.cities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">الشارع والعنوان *</label>
                  <input {...shippingForm.register("street")} placeholder="اسم الشارع ورقم المبنى" className="input-flora w-full" />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">الحي</label>
                    <input {...shippingForm.register("district")} placeholder="اسم الحي" className="input-flora w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">ملاحظات</label>
                    <input {...shippingForm.register("notes")} placeholder="أي تعليمات خاصة" className="input-flora w-full" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep("customer")} className="btn-outline-flora flex-1 py-3.5">→ السابق</button>
                  <button type="submit" className="btn-flora flex-1 py-3.5">التالي: الدفع ←</button>
                </div>
              </form>
            )}

            {step === "payment" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">طريقة الدفع</h2>

                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-3">💳 بطاقات الدفع</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {PAYMENT_METHODS.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedPayment(m.id as PaymentMethodId)}
                        className={`p-4 rounded-2xl border-2 text-center transition-all ${selectedPayment === m.id ? "border-pink-400 bg-pink-50" : "border-gray-100"}`}
                      >
                        <p className="font-semibold text-gray-800 text-sm">{m.nameAr}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {total >= 100 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-3">🏦 التقسيط بدون فوائد</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {INSTALLMENT_PROVIDERS.filter((p) => total >= p.minAmount && total <= p.maxAmount).map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSelectedPayment(p.id as PaymentMethodId)}
                          className={`p-4 rounded-2xl border-2 text-right transition-all ${selectedPayment === p.id ? "border-pink-400 bg-pink-50" : "border-gray-100"}`}
                        >
                          <p className="font-bold text-gray-800 mb-1">{p.nameAr}</p>
                          <p className="text-pink-600 font-bold">{formatPrice(Math.ceil(total / p.months))} / شهر</p>
                          <p className="text-xs text-gray-400">{p.months} دفعات بدون فوائد</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep("shipping")} className="btn-outline-flora flex-1 py-3.5">→ السابق</button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedPayment) { toast.error("اختاري طريقة الدفع"); return; }
                      setPaymentMethod(selectedPayment);
                      setStep("review");
                    }}
                    className="btn-flora flex-1 py-3.5"
                  >
                    التالي: مراجعة ←
                  </button>
                </div>
              </div>
            )}

            {step === "review" && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-gray-900">مراجعة الطلب</h2>

                <div className="bg-pink-50 rounded-2xl p-4 space-y-1">
                  <p className="font-semibold text-gray-800 mb-2">معلومات العميل</p>
                  <p className="text-sm text-gray-600">{customerInfo.full_name} — {customerInfo.email} — {customerInfo.phone}</p>
                </div>

                <div className="bg-pink-50 rounded-2xl p-4">
                  <p className="font-semibold text-gray-800 mb-1">عنوان الشحن</p>
                  <p className="text-sm text-gray-600">{shippingAddress.city}، {shippingAddress.street} {shippingAddress.building ? `، ${shippingAddress.building}` : ""}</p>
                </div>

                <div className="bg-pink-50 rounded-2xl p-4">
                  <p className="font-semibold text-gray-800 mb-1">طريقة الدفع</p>
                  <p className="text-sm text-gray-600">{PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.nameAr ?? "—"}</p>
                </div>

                <div className="bg-gradient-to-l from-pink-50 to-rose-50 rounded-2xl p-4 border border-pink-100 space-y-2 text-sm">
                  {discount > 0 && <div className="flex justify-between text-green-600"><span>الخصم</span><span>- {formatPrice(discount)}</span></div>}
                  <div className="flex justify-between text-gray-600"><span>الشحن</span><span>{formatPrice(shipping)}</span></div>
                  <div className="flex justify-between text-gray-600"><span>ضريبة 15%</span><span>{formatPrice(vat)}</span></div>
                  <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-pink-200"><span>إجمالي الطلب</span><span className="text-pink-600 text-lg">{formatPrice(total)}</span></div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep("payment")} className="btn-outline-flora flex-1 py-3.5">→ السابق</button>
                  <button type="button" onClick={handlePlaceOrder} disabled={placingOrder} className="btn-flora flex-1 py-4 text-base disabled:opacity-70">
                    {placingOrder ? "جاري تقديم الطلب..." : "تأكيد وطلب"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-pink-100 p-5 h-fit sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">ملخص الطلب</h3>

            <div className="space-y-3 mb-5 max-h-60 overflow-y-auto no-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-pink-50 shrink-0 flex items-center justify-center text-2xl">{item.product.images?.[0] ? "📦" : "🌸"}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 line-clamp-2">{item.product.name_ar}</p>
                    <p className="text-xs text-gray-400">× {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-800 shrink-0">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600"><span>المجموع</span><span>{formatPrice(subtotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>الخصم</span><span>- {formatPrice(discount)}</span></div>}
              <div className="flex justify-between text-gray-600"><span>الشحن</span><span>{shipping === 0 ? "مجاني 🎉" : formatPrice(shipping)}</span></div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-2.5 border-t border-gray-100"><span>الإجمالي</span><span className="text-pink-600 text-lg">{formatPrice(total)}</span></div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-xl py-2.5">🔒 دفع آمن ومشفر بـ SSL</div>
          </div>
        </div>
      </div>
    </div>
  );
}

