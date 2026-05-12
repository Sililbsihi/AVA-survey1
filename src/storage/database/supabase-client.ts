import { createClient } from '@supabase/supabase-js';

let instance: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (instance) return instance;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Missing Supabase env vars');
  instance = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  return instance;
}
