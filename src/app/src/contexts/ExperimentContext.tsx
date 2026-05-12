'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export type ExperimentStep = 0 | 1 | 2 | 3 | 4;

interface ExperimentData {
  // 筛选问卷
  q1?: number;
  q2?: number;
  q3?: number;
  q4?: number;
  q5?: number;
  q6?: number;
  q7?: number;
  // 基本信息
  name?: string;
  gender?: string;
  age?: string;
  phone?: string;
  education?: string;
  hasLicense?: string;
  drivingYears?: string;
  drivingKm?: string;
  hasAssistDrive?: string;
  // 社会影响量表
  q9?: number;
  q10?: number;
  q11?: number;
  q12?: number;
  q13?: number;
  q14?: number;
  q15?: number;
  q16?: number;
  // 注意力题
  q17?: number;
  // 情境实验
  scenarioOrder?: string[];
  scenarioA?: {
    decision?: string;
    acceptSelf?: number;
    acceptPublic?: number;
    manipulationCheck?: string;
  };
  scenarioB?: {
    decision?: string;
    acceptSelf?: number;
    acceptPublic?: number;
    manipulationCheck?: string;
  };
}

interface ExperimentContextType {
  step: ExperimentStep;
  setStep: (step: ExperimentStep) => void;
  disqualified: boolean;
  setDisqualified: (value: boolean) => void;
  data: ExperimentData;
  updateData: (updates: Partial<ExperimentData>) => void;
  reset: () => void;
}

const initialData: ExperimentData = {
  scenarioOrder: [],
  scenarioA: {},
  scenarioB: {},
};

const ExperimentContext = createContext<ExperimentContextType | undefined>(undefined);

export function ExperimentProvider({ children }: { children: React.ReactNode }) {
  const [step, setStepState] = useState<ExperimentStep>(0);
  const [disqualified, setDisqualified] = useState(false);
  const [data, setData] = useState<ExperimentData>(initialData);

  const setStep = useCallback((newStep: ExperimentStep) => {
    setStepState(newStep);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const updateData = useCallback((updates: Partial<ExperimentData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const reset = useCallback(() => {
    setStepState(0);
    setDisqualified(false);
    setData(initialData);
  }, []);

  return (
    <ExperimentContext.Provider value={{ step, setStep, disqualified, setDisqualified, data, updateData, reset }}>
      {children}
    </ExperimentContext.Provider>
  );
}

export function useExperiment() {
  const context = useContext(ExperimentContext);
  if (context === undefined) {
    throw new Error('useExperiment must be used within an ExperimentProvider');
  }
  return context;
}
