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

    const insertData = {
      q1_screening: screening?.q1,
      q2_screening: screening?.q2,
      q3_screening: screening?.q3,
      q4_screening: screening?.q4,
      q5_screening: screening?.q5,
      q6_screening: screening?.q6,
      q7_screening: screening?.q7,
      name: basicInfo?.name,
      gender: basicInfo?.gender,
      age: basicInfo?.age,
      phone: basicInfo?.phone,
      education: basicInfo?.education,
      has_driver_license: basicInfo?.hasLicense,
      driving_experience_years: basicInfo?.drivingYears || null,
      driving_mileage: basicInfo?.drivingMileage || null,
      has_assist_driving_exp: basicInfo?.hasAssistDriving || null,
      q9_social: socialInfluence?.q9,
      q10_social: socialInfluence?.q10,
      q11_social: socialInfluence?.q11,
      q12_social: socialInfluence?.q12,
      q13_social: socialInfluence?.q13,
      q14_social: socialInfluence?.q14,
      q15_social: socialInfluence?.q15,
      q16_social: socialInfluence?.q16,
      q17_attention: socialInfluence?.attention,
      scenario_order: scenarioOrder || 'low,high',
      scenario_a_type: scenarioA?.type || null,
      scenario_a_decision: scenarioA?.decision || null,
      scenario_a_acceptance1: scenarioA?.acceptance1 || null,
      scenario_a_acceptance2: scenarioA?.acceptance2 || null,
      scenario_a_manipulation: scenarioA?.manipulation || null,
      scenario_b_type: scenarioB?.type || null,
      scenario_b_decision: scenarioB?.decision || null,
      scenario_b_acceptance1: scenarioB?.acceptance1 || null,
      scenario_b_acceptance2: scenarioB?.acceptance2 || null,
      scenario_b_manipulation: scenarioB?.manipulation || null,
      submitted_at: new Date().toISOString()
    };

    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('experiment_sessions')
      .insert([insertData]);

    if (error) {
      console.error('数据库插入错误:', error);
      return NextResponse.json(
        { success: false, error: '数据保存失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('提交数据失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
