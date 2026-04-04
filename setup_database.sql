-- 1. إنشاء جدول المنتجات (Products)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(10, 2),
    image TEXT,
    origin TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. إعدادات الحماية وصلاحيات الوصول (Row Level Security - RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.products FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete access" ON public.products FOR DELETE USING (true);


-- 3. إدراج (فرز) المنتجات التي تم قراءتها من الملفات وربطها بالقسم وبلد المنشأ الصحيح
INSERT INTO public.products (name, category, origin, price, discount, image)
VALUES
  -- منتجات الشمعة الأولى مصري 
  ('شمعة أولى 80 جرام', 'شمعه أولى', 'مصري', 0, NULL, ''),
  ('100 جرام رايت ووتر', 'شمعه أولى', 'مصري', 0, NULL, ''),
  ('123 جرام رايت ووتر', 'شمعه أولى', 'مصري', 0, NULL, ''),
  ('140 جرام تركا', 'شمعه أولى', 'مصري', 0, NULL, ''),

  -- منتجات الشمعة الثانية
  ('شمعة ثانية جاكور', 'شمعه ثانية', 'مصري', 0, NULL, ''),
  ('اكوافلتر صيني', 'شمعه ثانية', 'صيني', 0, NULL, ''),
  ('جانتيكس', 'شمعه ثانية', 'فيتنامي', 0, NULL, ''),
  ('هليثي بيور', 'شمعه ثانية', 'فيتنامي', 0, NULL, ''),

  -- منتجات الشمعة الثالثة
  ('شمعة ثالثة جاكور', 'شمعه ثالثة', 'مصري', 0, NULL, ''),
  ('اكوافلتر صيني', 'شمعه ثالثة', 'صيني', 0, NULL, ''),
  ('جانتيكس', 'شمعه ثالثة', 'فيتنامي', 0, NULL, ''),
  ('هليثي بيور', 'شمعه ثالثة', 'فيتنامي', 0, NULL, ''),

  -- منتجات البوست والكالسيد والانفرا (تم توحيدها في قسم واحد)
  ('بوست مصري جاكور', 'بوست وكالسيد', 'مصري', 0, NULL, ''),
  ('بوست عادي', 'بوست وكالسيد', 'مصري', 0, NULL, ''),
  ('بوست اكوافلتر', 'بوست وكالسيد', 'صيني', 0, NULL, ''),
  ('بوست اكوا فتنامي', 'بوست وكالسيد', 'فيتنامي', 0, NULL, ''),
  ('بوست هلثي بيور', 'بوست وكالسيد', 'فيتنامي', 0, NULL, ''),
  ('بوست تركي', 'بوست وكالسيد', 'تركا', 0, NULL, ''),
  
  ('كالسيد مصري جاكور', 'بوست وكالسيد', 'مصري', 0, NULL, ''),
  ('كالسيد عادي', 'بوست وكالسيد', 'مصري', 0, NULL, ''),
  ('كالسيد اكوافلتر', 'بوست وكالسيد', 'صيني', 0, NULL, ''),
  ('كالسيد اكوا فتنامي', 'بوست وكالسيد', 'فيتنامي', 0, NULL, ''),
  ('كالسيد هلثي بيور', 'بوست وكالسيد', 'فيتنامي', 0, NULL, ''),
  ('كالسيد تركي', 'بوست وكالسيد', 'تركا', 0, NULL, ''),
  
  ('انفره بلنك', 'بوست وكالسيد', 'مصري', 0, NULL, ''),
  ('انفره جاكور', 'بوست وكالسيد', 'مصري', 0, NULL, ''),
  ('انفره صيني اكوا فلتر', 'بوست وكالسيد', 'صيني', 0, NULL, ''),
  ('انفره فتنامي اكسبيور', 'بوست وكالسيد', 'فيتنامي', 0, NULL, ''),
  ('الكين اكس بيور', 'بوست وكالسيد', 'هندي', 0, NULL, '');
