import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ogwxaiilmyhfukjtkbmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nd3hhaWlsbXloZnVranRrYm1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2ODk3MDUsImV4cCI6MjA5MDI2NTcwNX0.BJlGVEJnfCSVB1bqmBHz4hdBW_UIK4XT-AqSHDRAdSg';
const supabase = createClient(supabaseUrl, supabaseKey);

const newProducts = [
  {
    name: 'كالسيد مسمط ربط ايزي جولد',
    category: 'كالسيد',
    origin: 'تركا',
    price: 0,
    discount: null,
    image: ''
  },
  {
    name: 'كالسيد مسمط موف ربط ايزي',
    category: 'كالسيد',
    origin: 'تركا',
    price: 0,
    discount: null,
    image: ''
  },
  {
    name: 'كالسيد تركا شفاف',
    category: 'كالسيد',
    origin: 'تركا',
    price: 0,
    discount: null,
    image: ''
  },
  {
    name: 'ألكالين ph ألكالين استابليزر أخضر',
    category: 'ألكالين',
    origin: 'تركا',
    price: 0,
    discount: null,
    image: ''
  },
  {
    name: 'خزان تركا',
    category: 'خزان',
    origin: 'تركا',
    price: 0,
    discount: null,
    image: ''
  }
];

async function insertProducts() {
  console.log('جاري إضافة المنتجات الجديدة...');
  const { data, error } = await supabase.from('products').insert(newProducts).select();
  
  if (error) {
    console.error('حدث خطأ أثناء الإضافة:', error);
  } else {
    console.log('تمت إضافة المنتجات بنجاح! ✅');
    if (data) console.log('المنتجات المضافة:', data.length);
  }
  process.exit();
}

insertProducts();
