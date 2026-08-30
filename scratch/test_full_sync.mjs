import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://iikxbqzxkybggqlpynow.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_-SmYfz7u1LzIBODbGmI7Hg_RJiYyGll';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  console.log('Testing full cross-device simulation...');

  // 1. Device A creates customer
  const cust = {
    id: `cust-sim-${Date.now()}`,
    name: 'Madasamy',
    phone: '9842154321',
    address: 'Sivakasi Police Station Rd',
    type: 'typeJewelleryShop',
    updated_at: new Date().toISOString()
  };

  const custRes = await supabase.from('customers').upsert(cust);
  console.log('Device A created customer:', custRes);

  // 2. Device A creates transaction
  const tx = {
    id: `tx-sim-${Date.now()}`,
    customer_id: cust.id,
    date: '2026-08-30',
    type: 'NEW_SALE',
    item_name: 'Silver Chain (கொலுசு)',
    weight: 250,
    touch_percent: 78,
    wastage_percent: 0,
    direction: 'GIVE'
  };

  const txRes = await supabase.from('transactions').upsert(tx);
  console.log('Device A created transaction:', txRes);

  // 3. Device B queries cloud
  const fetchCust = await supabase.from('customers').select('*');
  const fetchTx = await supabase.from('transactions').select('*');

  console.log('Device B fetched customers count:', fetchCust.data?.length);
  console.log('Device B fetched transactions count:', fetchTx.data?.length);

  // Clean up
  await supabase.from('transactions').delete().eq('id', tx.id);
  await supabase.from('customers').delete().eq('id', cust.id);
  console.log('Cleaned simulation data.');
}

run();
