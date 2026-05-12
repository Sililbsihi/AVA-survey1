export interface ExperimentSession {
  id?: number;
  created_at?: string;
  
  // 筛选问卷
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  
  // 基本信息
  name: string;
  gender: string;
  age: string;
  phone: string;
  education: string;
  has_license: string;
  driving_years?: string;
  driving_km?: string;
  has_assist_drive?: string;
  
  // 社会影响量表
  q9: number;
  q10: number;
  q11: number;
  q12: number;
  q13: number;
  q14: number;
  q15: number;
  q16: number;
  
  // 注意力题
  q17: number;
  
  // 情境实验
  scenario_order: string;
  scenario_a_decision: string;
  scenario_a_accept_self: number;
  scenario_a_accept_public: number;
  scenario_a_manipulation: string;
  scenario_b_decision: string;
  scenario_b_accept_self: number;
  scenario_b_accept_public: number;
  scenario_b_manipulation: string;
}

export interface BasicQuestion {
  id: string;
  type: 'input' | 'radio' | 'select' | 'conditional';
  label: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  condition?: {
    questionId: string;
    value: string;
  };
}

export interface SocialQuestion {
  id: string;
  text: string;
  scale: number;
  labels?: string[];
}
