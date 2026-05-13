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
  age: number | null;
  phone: string;
  education: string;
  hasDriverLicense: string;
  drivingExperienceYears: number | null;
  drivingMileage: number | null;
  hasAssistDrivingExp: string;
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
  q17: number | null;
}

export interface ScenarioData {
  decision: string;
  acceptSelf: number | null;
  acceptPublic: number | null;
  manipulationCheck: string;
}

export interface ExperimentData {
  screening: ScreeningData;
  basicInfo: BasicInfoData;
  socialInfluence: SocialInfluenceData;
  scenarioA: ScenarioData;
  scenarioB: ScenarioData;
  scenarioOrder: string[];
}

export type ExperimentStep =
  | 'screening'
  | 'basic-info'
  | 'social-influence'
  | 'instruction'
  | 'scenario'
  | 'complete'
  | 'disqualified';
