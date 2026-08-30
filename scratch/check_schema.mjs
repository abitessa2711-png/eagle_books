import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://iikxbqzxkybggqlpynow.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_-SmYfz7u1LzIBODbGmI7Hg_RJiYyGll';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  console.log('Testing column names...');
  // Try inserting basic fields
  const test1 = await supabase.from('customers').insert({ id: 'test-1', name: 'Test' });
  console.log('Insert id+name:', test1);

  const test2 = await supabase.from('customers').select('*');
  console.log('Select rows:', test2);
}

run();
