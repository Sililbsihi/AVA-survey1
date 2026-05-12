'use client';

import { ExperimentProvider } from '@/contexts/ExperimentContext';
import ScreeningPage from '@/components/experiment/ScreeningPage';
import BasicInfoPage from '@/components/experiment/BasicInfoPage';
import InstructionPage from '@/components/experiment/InstructionPage';
import ScenarioPage from '@/components/experiment/ScenarioPage';
import CompletePage from '@/components/experiment/CompletePage';
import DisqualifiedPage from '@/components/experiment/DisqualifiedPage';
import { useExperiment } from '@/contexts/ExperimentContext';

function ExperimentContent() {
  const { step, disqualified } = useExperiment();
  
  if (disqualified) return <DisqualifiedPage />;
  
  switch (step) {
    case 0: return <ScreeningPage />;
    case 1: return <BasicInfoPage />;
    case 2: return <InstructionPage />;
    case 3: return <ScenarioPage />;
    case 4: return <CompletePage />;
    default: return <ScreeningPage />;
  }
}

export default function Home() {
  return (
    <ExperimentProvider>
      <ExperimentContent />
    </ExperimentProvider>
  );
}
