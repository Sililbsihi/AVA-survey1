import { NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

function getSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration is missing');
  }
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');

    if (password !== 'admin123') {
      return NextResponse.json(
        { success: false, error: '权限验证失败' },
        { status: 401 }
      );
    }

    const supabase = getSupabaseClient();
    const { count: total } = await supabase
      .from('experiment_sessions')
      .select('*', { count: 'exact', head: true });

    const today = new Date().toISOString().split('T')[0];
    const { count: todayCount } = await supabase
      .from('experiment_sessions')
      .select('*', { count: 'exact', head: true })
      .gte('submitted_at', `${today}T00:00:00`);

    return NextResponse.json({
      success: true,
      data: {
        total: total || 0,
        today: todayCount || 0
      }
    });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
