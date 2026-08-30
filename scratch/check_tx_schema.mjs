import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://iikxbqzxkybggqlpynow.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_-SmYfz7u1LzIBODbGmI7Hg_RJiYyGll';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  console.log('Testing transactions column names...');
  const testTxPayload = {
    id: 'test-tx-1',
    customer_id: 'test-1',
    date: '2026-08-30',
    type: 'NEW_SALE',
    item_name: 'Anklet',
    weight: 10,
    touch_percent: 78,
    wastage_percent: 0,
    cash_amount: null,
    rate_per_gram: 95,
    converted_grams: null,
    is_touch_adjusted: false,
    direction: 'GIVE',
    notes: 'test'
  };

  const res = await supabase.from('transactions').insert(testTxPayload);
  console.log('Insert tx result:', res);

  const selectRes = await supabase.from('transactions').select('*');
  console.log('Select tx rows:', selectRes);
}

run();
