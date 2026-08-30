import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://iikxbqzxkybggqlpynow.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_-SmYfz7u1LzIBODbGmI7Hg_RJiYyGll';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  console.log('Testing clean customer upsert...');
  const testCust = {
    id: 'cust-clean-1',
    name: 'Saravanan',
    phone: '9842154321',
    address: 'Sivakasi',
    type: 'typeJewelleryShop'
  };

  const res = await supabase.from('customers').upsert(testCust, { onConflict: 'id' });
  console.log('Clean upsert res:', res);

  const selectRes = await supabase.from('customers').select('*');
  console.log('Select res after clean upsert:', selectRes);
}

run();
