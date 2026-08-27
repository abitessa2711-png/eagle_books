import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://iikxbqzxkybggqlpynow.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_-SmYfz7u1LzIBODbGmI7Hg_RJiYyGll';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function test() {
  console.log('Testing Supabase connection...');
  try {
    const { data: cust, error: custErr } = await supabase.from('customers').select('*');
    console.log('Customers query:', { count: cust?.length, error: custErr?.message || custErr });

    const { data: tx, error: txErr } = await supabase.from('transactions').select('*');
    console.log('Transactions query:', { count: tx?.length, error: txErr?.message || txErr });
  } catch (err) {
    console.error('Connection catch:', err.message);
  }
}

test();
