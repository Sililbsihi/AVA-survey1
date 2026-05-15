import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json({
        success: true,
        data: [],
        stats: {
          total: 0,
          today: 0,
          trend: [],
          avgAge: null,
          genderRatio: { male: 0, female: 0 }
        }
      });
    }

    // 获取所有数据
    const { data: allData, error: allError } = await supabase
      .from('experiment_sessions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (allError) {
      console.error('获取数据失败:', allError);
      return NextResponse.json({ success: false, error: '获取数据失败' }, { status: 500 });
    }

    // 计算统计数据
    const total = allData?.length || 0;
    
    // 今日数据
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = allData?.filter(d => {
      if (!d.submitted_at) return false;
      const submitDate = new Date(d.submitted_at);
      submitDate.setHours(0, 0, 0, 0);
      return submitDate.getTime() === today.getTime();
    }).length || 0;

    // 每日趋势（累计）
    const dailyMap = new Map<string, number>();
    allData?.forEach(d => {
      if (!d.submitted_at) return;
      const date = new Date(d.submitted_at).toISOString().split('T')[0];
      dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
    });

    const trend = Array.from(dailyMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, count], idx, arr) => {
        const cumulative = arr.slice(0, idx + 1).reduce((sum, [, c]) => sum + c, 0);
        return { date, count, cumulative };
      });

    // 平均年龄
    const ages = allData?.map(d => parseInt(d.age)).filter(a => !isNaN(a)) || [];
    const avgAge = ages.length > 0 ? ages.reduce((a, b) => a + b, 0) / ages.length : null;

    // 性别比例
    const maleCount = allData?.filter(d => d.gender === '男').length || 0;
    const femaleCount = allData?.filter(d => d.gender === '女').length || 0;

    return NextResponse.json({
      success: true,
      data: allData || [],
      stats: {
        total,
        today: todayCount,
        trend,
        avgAge,
        genderRatio: { male: maleCount, female: femaleCount }
      }
    });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    return NextResponse.json({ success: false, error: '服务器错误' }, { status: 500 });
  }
}
