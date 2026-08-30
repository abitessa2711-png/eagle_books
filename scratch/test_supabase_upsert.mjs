import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zuhndkldedgttzmxuphr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1aG5ka2xkZWRndHR6bXh1cGhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwMzQ0MzYsImV4cCI6MjA1NTYxMDQzNn0.7gD50lV6w0v_qQkPshY6zY_77592z180631244';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  console.log('Testing Supabase upsert...');
  const testCust = {
    id: 'test-cust-1',
    name: 'Test Customer',
    jewellery_shop: 'Test Shop',
    phone: '9842154321',
    address: 'Sivakasi',
    type: 'typeJewelleryShop'
  };

  const res = await supabase.from('customers').upsert(testCust, { onConflict: 'id' });
  console.log('Upsert result:', res);

  const selectRes = await supabase.from('customers').select('*');
  console.log('Select after upsert:', selectRes);
}

run();
