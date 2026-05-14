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

  const renderPage = () => {
    switch (step) {
      case 'screening':
        return <ScreeningPage />;
      case 'basicInfo':
        return <BasicInfoPage />;
      case 'socialInfluence':
        return <BasicInfoPage variant="socialInfluence" />;
      case 'instruction':
        return <InstructionPage />;
      case 'scenario':
        return <ScenarioPage />;
      case 'complete':
        return <CompletePage />;
      case 'disqualified':
        return <DisqualifiedPage />;
      default:
        return <ScreeningPage />;
    }
  };

  return (
    <main className="min-h-screen">
      {renderPage()}
    </main>
  );
}
