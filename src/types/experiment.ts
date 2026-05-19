// 实验数据类型定义

export interface ScreeningData {
  q1: number | null;
  q2: number | null;
  q3: number | null;
  q4: number | null;
  q5: number | null;
  q6: number | null;
  q7: number | null;
}

export interface BasicInfoData {
  name: string;
  gender: string;
  phone: string;
  age: string;
  education: string;
  hasLicense: string;
  drivingYears: string;
  drivingMileage: string;
  hasAssistDriving: string;
}

export interface SocialInfluenceData {
  q9: number | null;
  q10: number | null;
  q11: number | null;
  q12: number | null;
  q13: number | null;
  q14: number | null;
  q15: number | null;
  q16: number | null;
  attentionCheck: number | null;
}

export interface ScenarioResult {
  decision: number | null;
  acceptability1: number | null;
  acceptability2: number | null;
  manipulation: number | null;
}

export interface ExperimentData {
  screening: ScreeningData;
  basicInfo: BasicInfoData;
  socialInfluence: SocialInfluenceData;
  scenarioA: ScenarioResult | null;
  scenarioB: ScenarioResult | null;
  scenarioOrder: string;
}

export type ExperimentStep = 
  | 'screening'
  | 'basicInfo'
  | 'socialInfluence'
  | 'instruction'
  | 'scenario'
  | 'complete'
  | 'disqualified';
