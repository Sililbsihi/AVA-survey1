import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    const { count, error } = await supabase
      .from('experiment_sessions')
      .select('*', { count: 'exact', head: true });
    if (error) return NextResponse.json({ total: 0, error: error.message }, { status: 500 });
    return NextResponse.json({ total: count || 0 });
  } catch (err) {
    return NextResponse.json({ total: 0, error: String(err) }, { status: 500 });
  }
}
