'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { ExperimentData, ExperimentStep, ScreeningData, BasicInfoData, SocialInfluenceData, ScenarioResult } from '@/types/experiment';

interface ExperimentContextType {
  step: ExperimentStep;
  setStep: (step: ExperimentStep) => void;
  experimentData: ExperimentData;
  updateScreening: (data: Partial<ScreeningData>) => void;
  updateBasicInfo: (data: Partial<BasicInfoData>) => void;
  updateSocialInfluence: (data: Partial<SocialInfluenceData>) => void;
  updateScenario: (data: { scenarioA?: ScenarioResult; scenarioB?: ScenarioResult }) => void;
  updateScenarioOrder: (order: string) => void;
  resetExperiment: () => void;
}

const initialScreeningData: ScreeningData = {
  q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, q7: null,
};

const initialBasicInfo: BasicInfoData = {
  name: '',
  gender: '',
  phone: '',
  age: '',
  education: '',
  hasLicense: '',
  drivingYears: '',
  drivingMileage: '',
  hasAssistDriving: '',
};

const initialSocialInfluence: SocialInfluenceData = {
  q9: null, q10: null, q11: null, q12: null,
  q13: null, q14: null, q15: null, q16: null,
  attentionCheck: null,
};

const createInitialData = (): ExperimentData => ({
  screening: { ...initialScreeningData },
  basicInfo: { ...initialBasicInfo },
  socialInfluence: { ...initialSocialInfluence },
  scenarioA: null,
  scenarioB: null,
  scenarioOrder: '',
});

const ExperimentContext = createContext<ExperimentContextType | undefined>(undefined);

export function ExperimentProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<ExperimentStep>('screening');
  const [experimentData, setExperimentData] = useState<ExperimentData>(createInitialData());

  const updateScreening = (data: Partial<ScreeningData>) => {
    setExperimentData(prev => ({
      ...prev,
      screening: { ...prev.screening, ...data },
    }));
  };

  const updateBasicInfo = (data: Partial<BasicInfoData>) => {
    setExperimentData(prev => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, ...data },
    }));
  };

  const updateSocialInfluence = (data: Partial<SocialInfluenceData>) => {
    setExperimentData(prev => ({
      ...prev,
      socialInfluence: { ...prev.socialInfluence, ...data },
    }));
  };

  const updateScenario = (data: { scenarioA?: ScenarioResult; scenarioB?: ScenarioResult }) => {
    setExperimentData(prev => ({
      ...prev,
      scenarioA: data.scenarioA ?? prev.scenarioA,
      scenarioB: data.scenarioB ?? prev.scenarioB,
    }));
  };

  const updateScenarioOrder = (order: string) => {
    setExperimentData(prev => ({
      ...prev,
      scenarioOrder: order,
    }));
  };

  const resetExperiment = () => {
    setStep('screening');
    setExperimentData(createInitialData());
  };

  return (
    <ExperimentContext.Provider
      value={{
        step,
        setStep,
        experimentData,
        updateScreening,
        updateBasicInfo,
        updateSocialInfluence,
        updateScenario,
        updateScenarioOrder,
        resetExperiment,
      }}
    >
      {children}
    </ExperimentContext.Provider>
  );
}

export function useExperiment() {
  const context = useContext(ExperimentContext);
  if (!context) {
    throw new Error('useExperiment must be used within ExperimentProvider');
  }
  return context;
}
