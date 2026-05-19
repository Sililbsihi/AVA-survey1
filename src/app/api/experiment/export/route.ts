import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';

// 强制动态渲染，防止 Vercel 缓存
export const dynamic = 'force-dynamic';

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
  'q1_screening': 'Q1-我愿意使用自动驾驶',
  'q2_screening': 'Q2-我愿意和其他人一起使用自动驾驶公共交通',
  'q3_screening': 'Q3-如果有新技术，我会想尝试一下',
  'q4_screening': 'Q4-在同龄人中，我通常是最先尝试新技术的人',
  'q5_screening': 'Q5-此题选择"很不同意"（注意力检查）',
  'q6_screening': 'Q6-我非常了解自动驾驶汽车的功能和用途',
  'q7_screening': 'Q7-相比于周围的人，我对自动驾驶技术有更多的了解',
  'name': '姓名',
  'gender': '性别',
  'phone': '手机号',
  'age': '年龄',
  'education': '受教育程度',
  'has_driver_license': '是否有驾照',
  'driving_experience_years': '驾龄（年）',
  'driving_mileage': '驾驶里程（km）',
  'has_assist_driving_exp': '是否有辅助驾驶经验',
  'q9_social': 'Q9-我很少购买最新的产品，除非我的朋友们都认可它们',
  'q10_social': 'Q10-如果我对某产品缺乏经验，我经常会向朋友询问该产品的情况',
  'q11_social': 'Q11-通过购买其他人购买的相同品牌和产品，我可以获得归属感',
  'q12_social': 'Q12-为了确保买到合适的产品或品牌，我经常观察别人在买什么、用什么',
  'q13_social': 'Q13-我的家人或朋友推荐我使用自动驾驶技术',
  'q14_social': 'Q14-我的同事或领导推荐我使用自动驾驶技术',
  'q15_social': 'Q15-我喜欢的明星推荐我使用自动驾驶技术',
  'q16_social': 'Q16-政府出台的相关政策引导我使用自动驾驶技术',
  'q17_attention': 'Q17-此题请选择"很同意"（注意力检查）',
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
  'submitted_at': '提交时间'
};

// 定义字段顺序（按问卷结构排列）
const fieldOrder = [
  'q1_screening', 'q2_screening', 'q3_screening', 'q4_screening', 'q5_screening', 'q6_screening', 'q7_screening',
  'name', 'gender', 'phone', 'age', 'education', 'has_driver_license', 'driving_experience_years', 'driving_mileage', 'has_assist_driving_exp',
  'q9_social', 'q10_social', 'q11_social', 'q12_social', 'q13_social', 'q14_social', 'q15_social', 'q16_social', 'q17_attention',
  'scenario_order', 'scenario_a_type', 'scenario_a_decision', 'scenario_a_acceptance1', 'scenario_a_acceptance2', 'scenario_a_manipulation',
  'scenario_b_type', 'scenario_b_decision', 'scenario_b_acceptance1', 'scenario_b_acceptance2', 'scenario_b_manipulation',
  'submitted_at'
];

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return new Response('Database config missing', { status: 500 });
    }
    
    const { data, error } = await supabase
      .from('experiment_sessions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) {
      return new Response('No data available', { status: 404 });
    }

    // 创建表头（按定义顺序）
    const headers = ['编号', ...fieldOrder.map(key => questionLabels[key] || key)];

    // 处理数据行，确保 TypeScript 类型安全
    const processedData = data.map((row, index) => {
      const newRow: Record<string, string | number> = { '编号': index + 1 };
      
      fieldOrder.forEach(key => {
        const value = row[key];
        const label = questionLabels[key] || key;
        let displayValue: string | number = '';
        
        if (value === null || value === undefined) {
          displayValue = '';
        } else if (typeof value === 'boolean') {
          displayValue = value ? '是' : '否';
        } else if (key === 'submitted_at') {
          displayValue = String(value).replace('T', ' ').substring(0, 19);
        } else {
          displayValue = typeof value === 'string' || typeof value === 'number' ? value : String(value);
        }
        
        newRow[label] = displayValue;
      });
      
      return newRow;
    });

    // 创建工作表
    const worksheet = XLSX.utils.json_to_sheet(processedData, { header: headers });
    worksheet['!cols'] = headers.map(() => ({ wch: 22 }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '实验数据');

    // 关键修复：直接在服务端生成原始的二进制数据流，放弃 Base64 JSON 包装
    const excelArray = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const finalBuffer = new Uint8Array(excelArray);
    
    const dateTag = new Date().toISOString().split('T')[0];
    const filename = `实验数据_${dateTag}.xlsx`;

    // 直接返回文件 Response
    return new Response(finalBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
        'Cache-Control': 'no-store, max-age=0'
      },
    });

  } catch (err: any) {
    console.error('导出数据失败:', err);
    return new Response(err.message || 'Server Error', { status: 500 });
  }
}
