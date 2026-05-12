import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/storage/database/supabase-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createClient();

    const rowData = {
      q1: body.q1,
      q2: body.q2,
      q3: body.q3,
      q4: body.q4,
      q5: body.q5,
      q6: body.q6,
      q7: body.q7,
      name: body.name,
      gender: body.gender,
      age: body.age,
      phone: body.phone,
      education: body.education,
      has_license: body.hasLicense,
      driving_years: body.drivingYears || null,
      driving_km: body.drivingKm || null,
      has_assist_drive: body.hasAssistDrive || null,
      q9: body.q9,
      q10: body.q10,
      q11: body.q11,
      q12: body.q12,
      q13: body.q13,
      q14: body.q14,
      q15: body.q15,
      q16: body.q16,
      q17: body.q17,
      scenario_order: body.scenarioOrder?.join(',') || '',
      scenario_a_decision: body.scenarioA?.decision || '',
      scenario_a_accept_self: body.scenarioA?.acceptSelf || 0,
      scenario_a_accept_public: body.scenarioA?.acceptPublic || 0,
      scenario_a_manipulation: body.scenarioA?.manipulationCheck || '',
      scenario_b_decision: body.scenarioB?.decision || '',
      scenario_b_accept_self: body.scenarioB?.acceptSelf || 0,
      scenario_b_accept_public: body.scenarioB?.acceptPublic || 0,
      scenario_b_manipulation: body.scenarioB?.manipulationCheck || '',
    };

    const { error } = await supabase.from('experiment_sessions').insert(rowData);

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: '保存失败', detail: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Submit error:', err);
    return NextResponse.json({ error: '服务器错误', detail: String(err) }, { status: 500 });
  }
}
