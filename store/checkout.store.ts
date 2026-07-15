import { create } from "zustand";
import type { CheckoutStep, PaymentMethodId, ShippingAddress } from "@/types";

interface CheckoutState {
  step: CheckoutStep;
  customerInfo: { full_name: string; email: string; phone: string };
  shippingAddress: ShippingAddress;
  shippingFee: number;
  deliveryDays: string;
  paymentMethod: PaymentMethodId | null;
  setStep: (step: CheckoutStep) => void;
  setCustomerInfo: (info: CheckoutState["customerInfo"]) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  setShipping: (fee: number, days: string) => void;
  setPaymentMethod: (method: PaymentMethodId) => void;
  reset: () => void;
}

const initial = {
  step: "customer" as CheckoutStep,
  customerInfo: { full_name: "", email: "", phone: "" },
  shippingAddress: { full_name: "", phone: "", country_code: "SA", city: "", district: "", street: "", building: "", notes: "" },
  shippingFee: 0,
  deliveryDays: "2-4",
  paymentMethod: null,
};

export const useCheckoutStore = create<CheckoutState>()((set) => ({
  ...initial,
  setStep: (step) => set({ step }),
  setCustomerInfo: (customerInfo) => set({ customerInfo }),
  setShippingAddress: (shippingAddress) => set({ shippingAddress }),
  setShipping: (shippingFee, deliveryDays) => set({ shippingFee, deliveryDays }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  reset: () => set(initial),
}));
