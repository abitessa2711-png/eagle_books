import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://iikxbqzxkybggqlpynow.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_-SmYfz7u1LzIBODbGmI7Hg_RJiYyGll';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

/**
 * Check if Supabase connection is healthy
 */
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('silver_rates').select('*').limit(1);
    if (error) {
      // If table does not exist yet, connection is still reached
      return { connected: true, tablesReady: false, error: error.message };
    }
    return { connected: true, tablesReady: true, data };
  } catch (err) {
    return { connected: false, tablesReady: false, error: err.message };
  }
}
