'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { ExperimentData, ExperimentStep, ScreeningData, BasicInfoData, SocialInfluenceData, ScenarioData } from '@/types/experiment';

interface ExperimentContextType {
  step: ExperimentStep;
  setStep: (step: ExperimentStep) => void;
  experimentData: ExperimentData;
  updateScreening: (data: Partial<ScreeningData>) => void;
  updateBasicInfo: (data: Partial<BasicInfoData>) => void;
  updateSocialInfluence: (data: Partial<SocialInfluenceData>) => void;
  updateScenario: (data: Partial<ScenarioData>) => void;
  updateScenarioOrder: (order: string[]) => void;
  resetExperiment: () => void;
}

const initialExperimentData: ExperimentData = {
  screening: { q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, q7: null },
  basicInfo: { name: '', gender: '', age: null, phone: '', education: '', hasDriverLicense: '', drivingExperienceYears: null, drivingMileage: null, hasAssistDrivingExp: '' },
  socialInfluence: { q9: null, q10: null, q11: null, q12: null, q13: null, q14: null, q15: null, q16: null, q17: null },
  scenarioA: { decision: '', acceptSelf: null, acceptPublic: null, manipulationCheck: '' },
  scenarioB: { decision: '', acceptSelf: null, acceptPublic: null, manipulationCheck: '' },
  scenarioOrder: [],
};

const ExperimentContext = createContext<ExperimentContextType | undefined>(undefined);

export function ExperimentProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<ExperimentStep>('screening');
  const [experimentData, setExperimentData] = useState<ExperimentData>(initialExperimentData);

  const updateScreening = (data: Partial<ScreeningData>) => {
    setExperimentData(prev => ({ ...prev, screening: { ...prev.screening, ...data } }));
  };

  const updateBasicInfo = (data: Partial<BasicInfoData>) => {
    setExperimentData(prev => ({ ...prev, basicInfo: { ...prev.basicInfo, ...data } }));
  };

  const updateSocialInfluence = (data: Partial<SocialInfluenceData>) => {
    setExperimentData(prev => ({ ...prev, socialInfluence: { ...prev.socialInfluence, ...data } }));
  };

  const updateScenario = (data: Partial<ScenarioData>) => {
    const order = experimentData.scenarioOrder;
    const currentKey = order.length > 0 ? (order[0] === 'A' ? 'scenarioA' : 'scenarioB') : 'scenarioA';
    setExperimentData(prev => ({ ...prev, [currentKey]: { ...prev[currentKey], ...data } }));
  };

  const updateScenarioOrder = (order: string[]) => {
    setExperimentData(prev => ({ ...prev, scenarioOrder: order }));
  };

  const resetExperiment = () => {
    setStep('screening');
    setExperimentData(initialExperimentData);
  };

  return (
    <ExperimentContext.Provider value={{ step, setStep, experimentData, updateScreening, updateBasicInfo, updateSocialInfluence, updateScenario, updateScenarioOrder, resetExperiment }}>
      {children}
    </ExperimentContext.Provider>
  );
}

export function useExperiment() {
  const context = useContext(ExperimentContext);
  if (!context) throw new Error('useExperiment must be used within ExperimentProvider');
  return context;
}
