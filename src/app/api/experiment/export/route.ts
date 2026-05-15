import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

// 题目文本映射
const questionLabels: Record<string, string> = {
  // 筛选问卷
  'q1_screening': 'Q1-我愿意使用自动驾驶',
  'q2_screening': 'Q2-我愿意和其他人一起使用自动驾驶公共交通',
  'q3_screening': 'Q3-如果有新技术，我会想尝试一下',
  'q4_screening': 'Q4-在同龄人中，我通常是最先尝试新技术的人',
  'q5_screening': 'Q5-此题选择"很不同意"（注意力检查）',
  'q6_screening': 'Q6-我非常了解自动驾驶汽车的功能和用途',
  'q7_screening': 'Q7-相比于周围的人，我对自动驾驶技术有更多的了解',
  // 基本信息
  'name': '姓名',
  'gender': '性别',
  'age': '年龄',
  'education': '受教育程度',
  'has_driver_license': '是否有驾照',
  'driving_experience_years': '驾龄（年）',
  'driving_mileage': '驾驶里程（km）',
  'has_assist_driving_exp': '是否有辅助驾驶经验',
  // 社会影响量表
  'q9_social': 'Q9-我很少购买最新的产品，除非我的朋友们都认可它们',
  'q10_social': 'Q10-如果我对某产品缺乏经验，我经常会向朋友询问该产品的情况',
  'q11_social': 'Q11-通过购买其他人购买的相同品牌和产品，我可以获得归属感',
  'q12_social': 'Q12-为了确保买到合适的产品或品牌，我经常观察别人在买什么、用什么',
  'q13_social': 'Q13-我的家人或朋友推荐我使用自动驾驶技术',
  'q14_social': 'Q14-我的同事或领导推荐我使用自动驾驶技术',
  'q15_social': 'Q15-我喜欢的明星推荐我使用自动驾驶技术',
  'q16_social': 'Q16-政府出台的相关政策引导我使用自动驾驶技术',
  'q17_attention': 'Q17-此题请选择"很同意"（注意力检查）',
  // 情境实验
  'scenario_order': '情境呈现顺序',
  'scenario_a_type': '情境A类型',
  'scenario_a_decision': '情境A-行为决策（是否切换自动驾驶）',
  'scenario_a_acceptance1': '情境A-接受度1（是否愿意使用自动驾驶）',
  'scenario_a_acceptance2': '情境A-接受度2（是否愿意与他人乘坐自动驾驶公共交通）',
  'scenario_a_manipulation': '情境A-操纵检验（道路自动驾驶比例）',
  'scenario_b_type': '情境B类型',
  'scenario_b_decision': '情境B-行为决策（是否切换自动驾驶）',
  'scenario_b_acceptance1': '情境B-接受度1（是否愿意使用自动驾驶）',
  'scenario_b_acceptance2': '情境B-接受度2（是否愿意与他人乘坐自动驾驶公共交通）',
  'scenario_b_manipulation': '情境B-操纵检验（道路自动驾驶比例）',
  'submitted_at': '提交时间',
  'id': '编号'
};

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
      console.error('数据库查询错误:', error);
      return NextResponse.json(
        { success: false, error: '数据获取失败' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: '暂无数据' },
        { status: 404 }
      );
    }

    // 处理数据行
    const processedData = data.map((row, index) => {
      const newRow: Record<string, unknown> = { '编号': index + 1 };
      Object.entries(row).forEach(([key, value]) => {
        if (key !== 'id' && key !== 'created_at') {
          // 格式化值
          let displayValue = value;
          if (value === null || value === undefined) {
            displayValue = '';
          } else if (typeof value === 'boolean') {
            displayValue = value ? '是' : '否';
          } else if (key === 'submitted_at' && typeof value === 'string') {
            displayValue = value.replace('T', ' ').substring(0, 19);
          }
          newRow[questionLabels[key] || key] = displayValue;
        }
      });
      return newRow;
    });

    // 创建工作表
    const worksheet = XLSX.utils.json_to_sheet(processedData);
    
    // 设置列宽
    worksheet['!cols'] = Object.keys(processedData[0] || {}).map(() => ({ wch: 25 }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '实验数据');

    const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

    return new Response(new Uint8Array(excelBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="experiment_data_${new Date().toISOString().split('T')[0]}.xlsx"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('导出数据失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
