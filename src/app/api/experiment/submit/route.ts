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

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const {
      screening,
      basicInfo,
      socialInfluence,
      scenarioOrder,
      scenarioA,
      scenarioB
    } = data;

    // 辅助函数：转换布尔值
    const parseBoolean = (val: unknown): boolean | null => {
      if (val === true || val === 'true' || val === '有' || val === '是') return true;
      if (val === false || val === 'false' || val === '无' || val === '否') return false;
      return null;
    };
    
    // 辅助函数：安全解析数字
    const parseNumber = (val: unknown): number | null => {
      if (val === null || val === undefined || val === '') return null;
      const num = parseInt(String(val));
      return isNaN(num) ? null : num;
    };

    const insertData = {
      q1_screening: parseNumber(screening?.q1),
      q2_screening: parseNumber(screening?.q2),
      q3_screening: parseNumber(screening?.q3),
      q4_screening: parseNumber(screening?.q4),
      q5_screening: String(screening?.q5 || ''),
      q6_screening: parseNumber(screening?.q6),
      q7_screening: parseNumber(screening?.q7),
      name: basicInfo?.name || null,
      gender: basicInfo?.gender || null,
      phone: basicInfo?.phone || null,
      age: basicInfo?.age || null,
      education: basicInfo?.education || null,
      has_driver_license: parseBoolean(basicInfo?.hasLicense),
      driving_experience_years: parseNumber(basicInfo?.drivingYears),
      driving_mileage: parseNumber(basicInfo?.drivingMileage),
      has_assist_driving_exp: parseBoolean(basicInfo?.hasAssistDriving),
      q9_social: parseNumber(socialInfluence?.q9),
      q10_social: parseNumber(socialInfluence?.q10),
      q11_social: parseNumber(socialInfluence?.q11),
      q12_social: parseNumber(socialInfluence?.q12),
      q13_social: parseNumber(socialInfluence?.q13),
      q14_social: parseNumber(socialInfluence?.q14),
      q15_social: parseNumber(socialInfluence?.q15),
      q16_social: parseNumber(socialInfluence?.q16),
      q17_attention: String(socialInfluence?.attentionCheck || ''),
      scenario_order: scenarioOrder || 'low,high',
      scenario_a_type: scenarioA?.type || null,
      scenario_a_decision: scenarioA?.decision || null,
      scenario_a_acceptance1: parseNumber(scenarioA?.acceptance1),
      scenario_a_acceptance2: parseNumber(scenarioA?.acceptance2),
      scenario_a_manipulation: parseNumber(scenarioA?.manipulation),
      scenario_b_type: scenarioB?.type || null,
      scenario_b_decision: scenarioB?.decision || null,
      scenario_b_acceptance1: parseNumber(scenarioB?.acceptance1),
      scenario_b_acceptance2: parseNumber(scenarioB?.acceptance2),
      scenario_b_manipulation: parseNumber(scenarioB?.manipulation),
      submitted_at: new Date().toISOString()
    };

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    
    const supabase = getSupabaseClient();
    
    // 如果 Supabase 未配置，返回成功但记录警告
    if (!supabase) {
      console.warn('Supabase 未配置，数据未保存到数据库');
      console.log('提交的数据:', JSON.stringify(insertData, null, 2));
      return NextResponse.json({ 
        success: true, 
        warning: '数据库未配置，数据仅打印到日志'
      });
    }

    console.log('准备插入数据:', JSON.stringify(insertData, null, 2));
    console.log('Supabase URL:', supabaseUrl ? '已配置' : '未配置');
    
    const { data: insertResult, error } = await supabase
      .from('experiment_sessions')
      .insert([insertData])
      .select();

    if (error) {
      console.error('数据库插入错误:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { success: false, error: '数据保存失败', details: error.message },
        { status: 500 }
      );
    }
    
    console.log('数据插入成功:', insertResult);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('提交数据失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
