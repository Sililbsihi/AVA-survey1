'use client';

import { useExperiment } from '@/contexts/ExperimentContext';
import ScreeningPage from '@/components/experiment/ScreeningPage';
import BasicInfoPage from '@/components/experiment/BasicInfoPage';
import InstructionPage from '@/components/experiment/InstructionPage';
import ScenarioPage from '@/components/experiment/ScenarioPage';
import CompletePage from '@/components/experiment/CompletePage';
import DisqualifiedPage from '@/components/experiment/DisqualifiedPage';

export default function HomePage() {
  const { step } = useExperiment();

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1">
        {step === 'screening' && <ScreeningPage />}
        {step === 'basic-info' && <BasicInfoPage />}
        {step === 'social-influence' && <BasicInfoPage />}
        {step === 'instruction' && <InstructionPage />}
        {step === 'scenario' && <ScenarioPage />}
        {step === 'complete' && <CompletePage />}
        {step === 'disqualified' && <DisqualifiedPage />}
      </div>
    </main>
  );
}
