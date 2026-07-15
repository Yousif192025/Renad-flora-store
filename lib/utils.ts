import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export function formatPrice(price: number, currency = "SAR"): string {
  return new Intl.NumberFormat("ar-SA", { style: "currency", currency, minimumFractionDigits: 0 }).format(price);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("ar-SA", { year: "numeric", month: "long", day: "numeric" }).format(new Date(date));
}

export function getImageUrl(path?: string | null): string {
  if (!path) return "/images/placeholder.webp";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/flora-products/${path}`;
}

export function calculateInstallment(price: number, months = 4): number {
  return Math.ceil(price / months);
}

export function generateOrderNumber(): string {
  return `FL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2,6).toUpperCase()}`;
}

export function getWhatsAppUrl(phone: string, message = ""): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
