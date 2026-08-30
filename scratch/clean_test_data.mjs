import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://iikxbqzxkybggqlpynow.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_-SmYfz7u1LzIBODbGmI7Hg_RJiYyGll';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  await supabase.from('transactions').delete().eq('id', 'test-tx-1');
  await supabase.from('customers').delete().eq('id', 'test-1');
  console.log('Cleaned test data.');
}

run();
