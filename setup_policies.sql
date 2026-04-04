-- 1. تمكين الصلاحيات لجدول عن الشركة (About Us)
ALTER TABLE about_us_content DISABLE ROW LEVEL SECURITY; -- تعطيل الـ RLS مؤقتاً لضمان العمل الفوري
-- أو يمكنك تفعيلها وإضافة القوانين التالية:
-- ALTER TABLE about_us_content ENABLE ROW LEVEL SECURITY;

-- السماح للعامة بالمشاهدة
CREATE POLICY "Allow public read About Us" 
ON about_us_content FOR SELECT TO anon USING (true);

-- السماح للمدير بالتحكم الكامل (بما أننا نستخدم anon حالياً)
CREATE POLICY "Allow anon all About Us" 
ON about_us_content FOR ALL TO anon USING (true);

-- 2. صلاحيات التخزين (Storage) لرفع الصور والفيديوهات
-- تأكد من إنشاء Bucket باسم 'product-images' كما فعلنا مسبقاً

-- السماح لأي شخص بمشاهدة الملفات
CREATE POLICY "Public Read Access" 
ON storage.objects FOR SELECT TO anon USING (bucket_id = 'product-images');

-- السماح للمدير (anon) بالرفع والحذف
CREATE POLICY "Anon Full Access" 
ON storage.objects FOR ALL TO anon USING (bucket_id = 'product-images');
