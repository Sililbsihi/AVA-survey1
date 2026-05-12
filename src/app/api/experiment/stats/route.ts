import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { createClient } = await import('@/storage/database/supabase-client');
    const supabase = createClient();

    const { count, error } = await supabase
      .from('experiment_sessions')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return NextResponse.json({ error: '查询失败' }, { status: 500 });
    }

    return NextResponse.json({ total: count || 0, today: 0 });
  } catch (err) {
    console.error('Stats error:', err);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
