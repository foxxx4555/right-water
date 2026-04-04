import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanup() {
  console.log('Cleaning up products table...');
  const { error } = await supabase.from('products').delete().neq('id', 0); // Delete all
  
  if (error) {
    console.error('Error cleaning up:', error.message);
  } else {
    console.log('Successfully cleared products table. ✅');
  }
}

cleanup();
