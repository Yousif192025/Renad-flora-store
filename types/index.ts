export interface Product {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  price: number;
  compare_price: number | null;
  discount_percentage: number | null;
  sku: string;
  stock: number;
  category_id: string;
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  is_on_sale: boolean;
  rating_avg: number;
  rating_count: number;
  images: ProductImage[];
  category?: { id: string; name_ar: string; slug: string };
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_ar: string | null;
  sort_order: number;
  is_primary: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  image_url: string | null;
  emoji: string | null;
  color: string | null;
  is_active: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  full_name: string;
  phone: string;
  country_code: string;
  city: string;
  district: string;
  street: string;
  building: string;
  notes: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number;
  min_order_amount: number | null;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
}

export type CheckoutStep = "customer" | "shipping" | "payment" | "review";

export type PaymentMethodId = "mada" | "visa" | "mastercard" | "applepay" | "googlepay" | "stcpay" | "paypal" | "tabby" | "tamara";

export interface ShippingInfo {
  full_name: string;
  phone: string;
  country_code: string;
  city: string;
  district: string;
  street: string;
  building: string;
  notes: string;
}
