import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ogwxaiilmyhfukjtkbmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nd3hhaWlsbXloZnVranRrYm1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2ODk3MDUsImV4cCI6MjA5MDI2NTcwNX0.BJlGVEJnfCSVB1bqmBHz4hdBW_UIK4XT-AqSHDRAdSg';
const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanDuplicates() {
  console.log('جاري البحث عن المنتجات المكررة...');
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true }); // الاحتفاظ بالأقدم

  if (error) {
    console.error('حدث خطأ أثناء جلب المنتجات:', error);
    return;
  }

  console.log(`تم العثور على إجمالي ${products.length} منتج.`);
  
  const productGroups = {};
  
  for (const product of products) {
    const key = product.name.trim().toLowerCase();
    if (!productGroups[key]) {
      productGroups[key] = [];
    }
    productGroups[key].push(product);
  }

  const idsToDelete = [];
  let duplicateCount = 0;

  for (const [name, items] of Object.entries(productGroups)) {
    if (items.length > 1) {
      console.log(`تم العثور على تكرار للاسم "${name}": عدد مرات التواجد = ${items.length}`);
      // نحتفظ بالأول (الأقدم) ونحذف الباقي
      for (let i = 1; i < items.length; i++) {
        idsToDelete.push(items[i].id);
        duplicateCount++;
      }
    }
  }

  if (idsToDelete.length === 0) {
    console.log('لا يوجد أي منتجات مكررة! القاعدة نظيفة.');
    return;
  }

  console.log(`جاري مسح ${duplicateCount} منتج مكرر...`);
  
  // تنفيذ المسح كدفعات (Batches)
  for (let i = 0; i < idsToDelete.length; i += 50) {
    const batch = idsToDelete.slice(i, i + 50);
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .in('id', batch);
      
    if (deleteError) {
      console.error('خطأ أثناء المسح:', deleteError);
    } else {
      console.log(`تم مسح دفعة من ${batch.length} منتج.`);
    }
  }

  console.log('تم تنظيف قاعدة البيانات بنجاح 😎!');
}

cleanDuplicates();
