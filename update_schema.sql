-- 1. ربط جدول المنتجات بصور متعددة وميزة "نفذت الكمية"
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS is_out_of_stock BOOLEAN DEFAULT false;

-- 2. في حال رغبت بنقل الصور القديمة للمصفوفة تلقائياً (اختياري، يسهل الانتقال)
UPDATE public.products
SET images = jsonb_build_array(image)
WHERE image IS NOT NULL AND image != '';
