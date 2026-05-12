import { NextResponse } from 'next/server';
import { createClient } from '@/storage/database/supabase-client';

export async function GET() {
  try {
    const supabase = createClient();

    const { count, error } = await supabase
      .from('experiment_sessions')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Stats error:', error);
      return NextResponse.json({ total: 0, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ total: count || 0 });
  } catch (err) {
    console.error('Stats error:', err);
    return NextResponse.json({ total: 0, error: String(err) }, { status: 500 });
  }
}
