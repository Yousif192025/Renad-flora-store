export const APP_NAME = "Flora Store";
export const APP_NAME_AR = "فلورا ستور";
export const WHATSAPP_NUMBER = "249129352444";
export const CURRENCY = "SAR";
export const VAT_RATE = 0.15;
export const FREE_SHIPPING_THRESHOLD = 300;
export const PRODUCTS_PER_PAGE = 12;

export const SOCIAL_LINKS = {
  whatsapp:      "https://wa.me/249129352444",
  whatsappGroup: "https://chat.whatsapp.com/DkS6LUMRu12KywzsZUwZ1r",
  instagram:     "https://www.instagram.com/flor.astore123",
  tiktok:        "https://www.tiktok.com/@florastore04",
  facebook:      "https://www.facebook.com/share/1639sCDaVN/",
} as const;

export const CATEGORIES = [
  { slug: "accessories",     nameAr: "إكسسوارات",   nameEn: "Accessories",    emoji: "💍", color: "#fce7f3", description: "إكسسوارات أنيقة تناسب كل مناسبة" },
  { slug: "watches",         nameAr: "ساعات",         nameEn: "Watches",        emoji: "⌚", color: "#fef3c7", description: "ساعات عصرية وكلاسيكية لكل ذوق" },
  { slug: "medals",          nameAr: "ميداليات",      nameEn: "Medals",         emoji: "🏅", color: "#fffbeb", description: "ميداليات مميزة للهدايا والتكريم" },
  { slug: "lubob",           nameAr: "لبوبو",         nameEn: "Lubob",          emoji: "🧸", color: "#fdf2f8", description: "دمى لبوبو اللطيفة والمحبوبة" },
  { slug: "candles",         nameAr: "شمع",           nameEn: "Candles",        emoji: "🕯️", color: "#fef9ee", description: "شموع عطرية فاخرة لأجواء رومانسية" },
  { slug: "mugs",            nameAr: "مجات",          nameEn: "Mugs",           emoji: "☕", color: "#f0fdf4", description: "مجات بتصاميم حصرية وألوان جميلة" },
  { slug: "mirrors",         nameAr: "مرايات",        nameEn: "Mirrors",        emoji: "🪞", color: "#f0f9ff", description: "مرايات أنيقة بإطارات فاخرة" },
  { slug: "gift-boxes",      nameAr: "بوكسات هدايا", nameEn: "Gift Boxes",     emoji: "🎁", color: "#fdf2f8", description: "بوكسات هدايا متكاملة لكل المناسبات" },
  { slug: "bags",            nameAr: "شنط",           nameEn: "Bags",           emoji: "👜", color: "#fce7f3", description: "شنط عصرية وأنيقة بأفضل الخامات" },
  { slug: "home-essentials", nameAr: "أدوات منزلية", nameEn: "Home Essentials", emoji: "🏠", color: "#f0fdf4", description: "أدوات منزلية راقية لبيتك الجميل" },
] as const;

export const SHIPPING_COUNTRIES = [
  { code: "SA", nameAr: "المملكة العربية السعودية", flag: "🇸🇦", shippingFee: 25, freeShippingAt: 300, deliveryDays: "2-4", cities: ["الرياض","جدة","مكة المكرمة","المدينة المنورة","الدمام"] },
  { code: "KW", nameAr: "الكويت",                   flag: "🇰🇼", shippingFee: 35, freeShippingAt: 400, deliveryDays: "3-6", cities: ["الكويت","الفروانية","حولي","العارضية"] },
  { code: "QA", nameAr: "قطر",                      flag: "🇶🇦", shippingFee: 35, freeShippingAt: 400, deliveryDays: "3-6", cities: ["الدوحة","الوكرة","الريان"] },
  { code: "OM", nameAr: "سلطنة عُمان",              flag: "🇴🇲", shippingFee: 40, freeShippingAt: 450, deliveryDays: "4-7", cities: ["مسقط","صلالة","نزوى"] },
  { code: "BH", nameAr: "البحرين",                  flag: "🇧🇭", shippingFee: 35, freeShippingAt: 400, deliveryDays: "3-5", cities: ["المنامة","المحرق","الرفاع"] },
  { code: "AE", nameAr: "الإمارات",                 flag: "🇦🇪", shippingFee: 35, freeShippingAt: 400, deliveryDays: "3-5", cities: ["دبي","أبوظبي","الشارقة","عجمان"] },
] as const;

export const PAYMENT_METHODS = [
  { id: "mada",       nameAr: "مدى",        available: true },
  { id: "visa",       nameAr: "فيزا",       available: true },
  { id: "mastercard", nameAr: "ماستركارد",  available: true },
  { id: "applepay",   nameAr: "Apple Pay",  available: true },
  { id: "googlepay",  nameAr: "Google Pay", available: true },
  { id: "stcpay",     nameAr: "STC Pay",    available: true },
  { id: "paypal",     nameAr: "PayPal",     available: true },
] as const;

export const INSTALLMENT_PROVIDERS = [
  { id: "tabby",  nameAr: "تابي",  months: 4, minAmount: 200, maxAmount: 5000, description: "قسّم على 4 دفعات بدون فوائد" },
  { id: "tamara", nameAr: "تمارا", months: 3, minAmount: 100, maxAmount: 3000, description: "ادفع على 3 أشهر بدون فوائد" },
] as const;

export const ORDER_STATUSES = {
  pending:    { labelAr: "قيد الانتظار", color: "yellow" },
  confirmed:  { labelAr: "مؤكد",         color: "blue"   },
  processing: { labelAr: "جاري التجهيز", color: "purple" },
  shipped:    { labelAr: "تم الشحن",     color: "indigo" },
  delivered:  { labelAr: "تم التوصيل",   color: "green"  },
  cancelled:  { labelAr: "ملغي",         color: "red"    },
  refunded:   { labelAr: "مسترد",        color: "gray"   },
} as const;

// Reusable type for a shipping country (union of all entries in the SHIPPING_COUNTRIES array)
export type ShippingCountry = (typeof SHIPPING_COUNTRIES)[number];

// Reusable type for a payment method
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

// Reusable type for an installment provider
export type InstallmentProvider = (typeof INSTALLMENT_PROVIDERS)[number];
