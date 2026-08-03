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

const customerSchema = z.object({ full_name: z.string().min(3), email: z.string().email(), phone: z.string().min(10) });
const shippingSchema = z.object({ country_code: z.string().min(2), city: z.string().min(2), district: z.string().optional(), street: z.string().min(5), building: z.string().optional(), notes: z.string().optional() });
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

  const onCustomerSubmit = (data: CustomerForm) => { setCustomerInfo({ full_name: data.full_name ?? "", email: data.email ?? "", phone: data.phone ?? "" }); setStep("shipping"); };
  const onShippingSubmit = (data: ShippingForm) => {
    const country = SHIPPING_COUNTRIES.find((c) => c.code === data.country_code) ?? SHIPPING_COUNTRIES[0];
    const fee = subtotal >= country.freeShippingAt ? 0 : country.shippingFee;
    setShippingAddress({ full_name: customerInfo.full_name, phone: customerInfo.phone, country_code: data.country_code, city: data.city, district: data.district ?? "", street: data.street, building: data.building ?? "", notes: data.notes ?? "" });
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
        order_number: generateOrderNumber(), status: "pending", payment_status: "pending",
        payment_method: selectedPayment, subtotal, discount, shipping_fee: shipping, vat, total,
        coupon_code: coupon?.code ?? null,
        shipping_info: { full_name: shippingAddress.full_name, phone: shippingAddress.phone, country_code: shippingAddress.country_code, city: shippingAddress.city, district: shippingAddress.district ?? null, street: shippingAddress.street, building: shippingAddress.building ?? null, notes: shippingAddress.notes ?? null }
      }]).select().single();
      if (error) throw error;
      const o = order as { id: string; order_number: string };
      await supabase.from("order_items").insert(items.map((item) => ({ order_id: o.id, product_id: item.product.id, product_name_ar: item.product.name_ar, product_name_en: item.product.name_en, price: item.price, quantity: item.quantity })));
      clearCart(); reset();
      router.push(`/track?order=${o.order_number}`);
    } catch { toast.error("حدث خطأ. يرجى المحاولة مجدداً."); }
    finally { setPlacingOrder(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="section-container max-w-4xl">
        <div className="text-center mb-8"><span className="text-2xl font-bold text-flora-gradient">Flora</span><p className="text-xs text-pink-400">✦ Checkout ✦</p></div>
        <div className="flex items-center justify-center gap-0 mb-8">
          {STEPS.map((s, idx) => (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${idx < currentIdx ? "bg-pink-500 text-white" : idx === currentIdx ? "bg-pin[...]`