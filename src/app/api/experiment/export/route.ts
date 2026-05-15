import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return null;  // 改为返回 null，而不是 throw Error
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

// 题目映射表
const QUESTION_LABELS: Record<string, string> = {
  q1_screening: 'Q1-我愿意使用自动驾驶',
  q2_screening: 'Q2-我愿意和其他人一起使用自动驾驶的公共交通',
  q3_screening: 'Q3-如果有新技术，我会想尝试一下',
  q4_screening: 'Q4-在同龄人中，我通常是最先尝试新技术的人',
  q5_screening: 'Q5-此题选择"很不同意"',
  q6_screening: 'Q6-我非常了解自动驾驶汽车的功能和用途',
  q7_screening: 'Q7-相比于周围的人，我对自动驾驶技术有更多的了解',
  name: '姓名',
  gender: '性别',
  age: '年龄',
  education: '受教育程度',
  has_driver_license: '有无驾照',
  driving_experience_years: '驾龄（年）',
  driving_mileage: '驾驶里程（km）',
  has_assist_driving_exp: '有无辅助驾驶经验',
  q9_social: 'Q9-我很少购买最新的产品，除非我的朋友们都认可它们',
  q10_social: 'Q10-如果我对某产品缺乏经验，我经常会向朋友询问该产品的情况',
  q11_social: 'Q11-通过购买其他人购买的相同品牌和产品，我可以获得归属感',
  q12_social: 'Q12-为了确保买到合适的产品或品牌，我经常观察别人在买什么、用什么',
  q13_social: 'Q13-我的家人或朋友推荐我使用自动驾驶技术',
  q14_social: 'Q14-我的同事或领导推荐我使用自动驾驶技术',
  q15_social: 'Q15-我喜欢的明星推荐我使用自动驾驶技术',
  q16_social: 'Q16-政府出台的相关政策引导我使用自动驾驶技术',
  q17_attention: 'Q17-注意力检查题（选择"很同意"）',
  scenario_order: '场景呈现顺序',
  scenario_a_type: '场景A-类型（low:低自动驾驶/ high:高自动驾驶）',
  scenario_a_decision: '场景A-行为决策（是否愿意切换自动驾驶）',
  scenario_a_acceptance1: '场景A-接受度评分1（愿意使用自动驾驶）',
  scenario_a_acceptance2: '场景A-接受度评分2（愿意与他人乘坐自动驾驶）',
  scenario_a_manipulation: '场景A-操纵检验（道路上自动驾驶比例）',
  scenario_b_type: '场景B-类型（low:低自动驾驶/ high:高自动驾驶）',
  scenario_b_decision: '场景B-行为决策（是否愿意切换自动驾驶）',
  scenario_b_acceptance1: '场景B-接受度评分1（愿意使用自动驾驶）',
  scenario_b_acceptance2: '场景B-接受度评分2（愿意与他人乘坐自动驾驶）',
  scenario_b_manipulation: '场景B-操纵检验（道路上自动驾驶比例）',
  submitted_at: '提交时间'
};

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    

    // 如果 Supabase 未配置，返回错误
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: '数据库未配置' },
        { status: 500 }
      );
    }
   
    const { data, error } = await supabase
      .from('experiment_sessions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('获取数据失败:', error);
      return NextResponse.json({ success: false, error: '获取数据失败' }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ success: false, error: '暂无数据' }, { status: 404 });
    }

    // 转换为工作表格式（中文标题）
    const wsData = data.map((row, index) => {
      const newRow: Record<string, any> = { 序号: index + 1 };
      Object.entries(row).forEach(([key, value]) => {
        const label = QUESTION_LABELS[key] || key;
        if (key === 'submitted_at' && value) {
          newRow[label] = new Date(value as string).toLocaleString('zh-CN');
        } else if (value === null || value === undefined) {
          newRow[label] = '';
        } else {
          newRow[label] = value;
        }
      });
      return newRow;
    });

    // 创建工作簿
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(wsData);
    
    // 设置列宽
    ws['!cols'] = Object.keys(wsData[0] || {}).map(() => ({ wch: 15 }));
    
    XLSX.utils.book_append_sheet(wb, ws, '实验数据');
    
    // 生成 buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="实验数据_${new Date().toISOString().split('T')[0]}.xlsx"`
      }
    });
  } catch (error) {
    console.error('导出数据失败:', error);
    return NextResponse.json({ success: false, error: '导出失败' }, { status: 500 });
  }
}
