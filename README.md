# 🌸 Flora Store — فلورا ستور

متجر إلكتروني احترافي — YOUR STYLE, YOUR STORY ✦

## البدء السريع

```bash
npm install
cp .env.example .env.local
# أضف بيانات Supabase في .env.local
npm run dev
```

## إعداد Supabase

1. أنشئ مشروعاً في supabase.com
2. شغّل ملف `supabase/migrations/001_schema.sql` في SQL Editor
3. شغّل ملف `supabase/migrations/002_seed.sql` في SQL Editor
4. أضف المفاتيح في `.env.local`

## متغيرات البيئة

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxx
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxx
NEXT_PUBLIC_APP_URL=https://renad-florastore.vercel.app
```

## الصفحات

- `/` الرئيسية
- `/products` جميع المنتجات
- `/category/[slug]` تصنيف
- `/products/[slug]` منتج
- `/cart` السلة
- `/checkout` الدفع
- `/track` تتبع الطلب
- `/wishlist` المفضلة
- `/admin/dashboard` لوحة الإدارة

## التقنيات

Next.js 15 · React 19 · TypeScript · Tailwind CSS · Supabase · Zustand · TanStack Query
