-- إنشاء جدول المصادقة للمدير
CREATE TABLE IF NOT EXISTS public.admin_auth (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- تفعيل الحماية على مستوى الصف
ALTER TABLE public.admin_auth ENABLE ROW LEVEL SECURITY;

-- إضافة صلاحية القراءة للجميع (anon) للتحقق من بيانات الدخول
-- ملاحظة: في بيئة إنتاجية حقيقية، يفضل استخدام Supabase Auth
-- ولكن بناءً على الكود الحالي، سنستخدم هذا الجدول
CREATE POLICY "Allow anon read access" ON public.admin_auth FOR SELECT USING (true);

-- إضافة بيانات الدخول الافتراضية إذا لم تكن موجودة
INSERT INTO public.admin_auth (username, password)
VALUES ('admin', 'admin')
ON CONFLICT (username) DO NOTHING;
