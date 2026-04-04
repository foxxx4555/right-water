import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ogwxaiilmyhfukjtkbmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nd3hhaWlsbXloZnVranRrYm1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2ODk3MDUsImV4cCI6MjA5MDI2NTcwNX0.BJlGVEJnfCSVB1bqmBHz4hdBW_UIK4XT-AqSHDRAdSg';
const supabase = createClient(supabaseUrl, supabaseKey);

const newProducts = [
  // كواع
  { name: 'كوع هاوزنج ممبرين', category: 'كوع', origin: 'صيني', price: 0, image: '' },
  { name: 'كوع مضخه', category: 'كوع', origin: 'صيني', price: 0, image: '' },
  { name: 'كوع ربع ايزي', category: 'كوع', origin: 'صيني', price: 0, image: '' },
  { name: 'كوع ربع ايزي × ايزي', category: 'كوع', origin: 'صيني', price: 0, image: '' },
  { name: 'كوع شيك بلف', category: 'كوع', origin: 'صيني', price: 0, image: '' },
  // شاسيهات
  { name: 'شاسيه خماسي ابيض', category: 'شاسيه بلاستيك', origin: 'مصري', price: 0, image: '' },
  { name: 'شاسيه خماسي اسود', category: 'شاسيه بلاستيك', origin: 'مصري', price: 0, image: '' },
  { name: 'شاسيه ABS', category: 'شاسيه بلاستيك', origin: 'مصري', price: 0, image: '' },
  // ترانسات
  { name: 'ترانس الكتروني', category: 'ترانسات', origin: 'صيني', price: 0, image: '' },
  { name: 'ترانس عادي', category: 'ترانسات', origin: 'صيني', price: 0, image: '' },
  // مواتير
  { name: 'مضخه هندي 75 جالون', category: 'مواتير', origin: 'هندي', price: 0, image: '' },
  { name: 'مضخه هندي 100 جالون', category: 'مواتير', origin: 'هندي', price: 0, image: '' },
  { name: 'مضخه صيني', category: 'مواتير', origin: 'صيني', price: 0, image: '' },
  // محابس
  { name: 'محبس مستقيم ممبرين', category: 'محابس', origin: 'صيني', price: 0, image: '' },
  { name: 'محبس خزان صيني', category: 'محابس', origin: 'صيني', price: 0, image: '' },
  { name: 'محبس دخول معدن', category: 'محابس', origin: 'صيني', price: 0, image: '' },
  { name: 'محبس دخول بلاستيك', category: 'محابس', origin: 'صيني', price: 0, image: '' },
  // صباع صرف
  { name: 'صباع صرف تايواني', category: 'صباع صرف', origin: 'تايواني', price: 0, image: '' },
  { name: 'صباع صرف صيني', category: 'صباع صرف', origin: 'صيني', price: 0, image: '' },
  // نتره وأدوات إضافية
  { name: 'نتره فص معدن', category: 'نتره', origin: 'صيني', price: 0, image: '' },
  { name: 'نتره فص بلاستيك', category: 'نتره', origin: 'صيني', price: 0, image: '' },
  { name: 'الن 1.5 4/1 معدن', category: 'أدوات إضافية', origin: 'مصري', price: 0, image: '' },
  // مفتاح هاوزنج
  { name: 'مفتاح هاوزنج جاكور', category: 'مفتاح هاوزنج', origin: 'مصري', price: 0, image: '' },
  { name: 'مفتاح هاوزنج رايت ووتر', category: 'مفتاح هاوزنج', origin: 'مصري', price: 0, image: '' }
];

async function insertBulk() {
  console.log(`جاري إضافة ${newProducts.length} منتجاً لـ Supabase...`);
  const { data, error } = await supabase.from('products').insert(newProducts).select();

  if (error) {
    console.error('حدث خطأ أثناء الإضافة:', error);
  } else {
    console.log('تمت إضافة جميع المنتجات بنجاح! ✅');
    if (data) console.log('عدد المنتجات المضافة:', data.length);
  }
  process.exit();
}

insertBulk();
