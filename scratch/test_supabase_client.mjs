import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://iikxbqzxkybggqlpynow.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_-SmYfz7u1LzIBODbGmI7Hg_RJiYyGll';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  console.log('Testing Supabase Client connection...');
  try {
    const custRes = await supabase.from('customers').select('*');
    console.log('Customers query:', custRes);

    const txRes = await supabase.from('transactions').select('*');
    console.log('Transactions query:', txRes);

    const ratesRes = await supabase.from('silver_rates').select('*');
    console.log('Rates query:', ratesRes);
  } catch (err) {
    console.error('Catch error:', err);
  }
}

run();
