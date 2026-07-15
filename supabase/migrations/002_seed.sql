INSERT INTO public.categories (slug, name_ar, name_en, emoji, color, sort_order, is_active) VALUES
  ('accessories',      'إكسسوارات',     'Accessories',     '💍', '#fce7f3', 1,  TRUE),
  ('watches',          'ساعات',          'Watches',         '⌚', '#fef3c7', 2,  TRUE),
  ('medals',           'ميداليات',       'Medals',          '🏅', '#fffbeb', 3,  TRUE),
  ('lubob',            'لبوبو',          'Lubob',           '🧸', '#fdf2f8', 4,  TRUE),
  ('candles',          'شمع',            'Candles',         '🕯️','#fef9ee', 5,  TRUE),
  ('mugs',             'مجات',           'Mugs',            '☕', '#f0fdf4', 6,  TRUE),
  ('mirrors',          'مرايات',         'Mirrors',         '🪞', '#f0f9ff', 7,  TRUE),
  ('gift-boxes',       'بوكسات هدايا',   'Gift Boxes',      '🎁', '#fdf2f8', 8,  TRUE),
  ('bags',             'شنط',            'Bags',            '👜', '#fce7f3', 9,  TRUE),
  ('home-essentials',  'أدوات منزلية',   'Home Essentials', '🏠', '#f0fdf4', 10, TRUE)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.coupons (code, type, value, min_order_amount, max_uses, is_active) VALUES
  ('FLORA10',   'percentage',   10, 100, 500,  TRUE),
  ('FLORA20',   'percentage',   20, 200, 200,  TRUE),
  ('WELCOME50', 'fixed',        50, 150, 1000, TRUE),
  ('FREESHIP',  'free_shipping', 0, 100, NULL, TRUE)
ON CONFLICT (code) DO NOTHING;
