export interface ScreeningData {
  q1?: number;
  q2?: number;
  q3?: number;
  q4?: number;
  q5?: number;
  q6?: number;
  q7?: number;
}

export interface BasicInfoData {
  name?: string;
  gender?: string;
  age?: string;
  phone?: string;
  education?: string;
  hasLicense?: string;
  drivingYears?: string;
  drivingMileage?: string;
  hasAssistDriving?: string;
}

export interface SocialInfluenceData {
  q9?: number;
  q10?: number;
  q11?: number;
  q12?: number;
  q13?: number;
  q14?: number;
  q15?: number;
  q16?: number;
  attention?: number;
}

export interface ScenarioResult {
  type?: string;
  decision?: 'yes' | 'no';
  acceptance1?: number;
  acceptance2?: number;
  manipulation?: string;
}

export interface ExperimentData {
  screening: ScreeningData;
  basicInfo: BasicInfoData;
  socialInfluence: SocialInfluenceData;
  scenarioA?: ScenarioResult;
  scenarioB?: ScenarioResult;
  scenarioOrder?: string;
}

export type ExperimentStep = 
  | 'screening' 
  | 'basicInfo' 
  | 'socialInfluence' 
  | 'instruction' 
  | 'scenario' 
  | 'complete' 
  | 'disqualified';
