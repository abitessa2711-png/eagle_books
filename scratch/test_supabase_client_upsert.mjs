import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://iikxbqzxkybggqlpynow.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_-SmYfz7u1LzIBODbGmI7Hg_RJiYyGll';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  console.log('Testing Supabase Client upsert...');
  const testCust = {
    id: 'cust-12345',
    name: 'Test Customer',
    jewellery_shop: 'Test Shop',
    phone: '9842154321',
    address: 'Sivakasi',
    type: 'typeJewelleryShop',
    notes: 'Test note'
  };

  const upsertRes = await supabase.from('customers').upsert(testCust, { onConflict: 'id' });
  console.log('Upsert res:', upsertRes);

  const selectRes = await supabase.from('customers').select('*');
  console.log('Select res after upsert:', selectRes);
}

run();
