'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { ExperimentData, ExperimentStep, ScreeningData, BasicInfoData, SocialInfluenceData } from '@/types/experiment';

interface ExperimentContextType {
  step: ExperimentStep;
  setStep: (step: ExperimentStep) => void;
  experimentData: ExperimentData;
  updateScreening: (data: Partial<ScreeningData>) => void;
  updateBasicInfo: (data: Partial<BasicInfoData>) => void;
  updateSocialInfluence: (data: Partial<SocialInfluenceData>) => void;
  resetExperiment: () => void;
}

const ExperimentContext = createContext<ExperimentContextType | undefined>(undefined);

const initialData: ExperimentData = {
  screening: {},
  basicInfo: {},
  socialInfluence: {},
};

export function ExperimentProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<ExperimentStep>('screening');
  const [experimentData, setExperimentData] = useState<ExperimentData>(initialData);

  const updateScreening = (data: Partial<ScreeningData>) => {
    setExperimentData(prev => ({
      ...prev,
      screening: { ...prev.screening, ...data }
    }));
  };

  const updateBasicInfo = (data: Partial<BasicInfoData>) => {
    setExperimentData(prev => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, ...data }
    }));
  };

  const updateSocialInfluence = (data: Partial<SocialInfluenceData>) => {
    setExperimentData(prev => ({
      ...prev,
      socialInfluence: { ...prev.socialInfluence, ...data }
    }));
  };

  const resetExperiment = () => {
    setExperimentData(initialData);
    setStep('screening');
    localStorage.clear();
  };

  return (
    <ExperimentContext.Provider value={{
      step,
      setStep,
      experimentData,
      updateScreening,
      updateBasicInfo,
      updateSocialInfluence,
      resetExperiment,
    }}>
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
