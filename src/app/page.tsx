'use client';

import { useExperiment } from '@/contexts/ExperimentContext';
import { Progress } from '@/components/ui/progress';
import ScreeningPage from '@/components/experiment/ScreeningPage';
import BasicInfoPage from '@/components/experiment/BasicInfoPage';
import InstructionPage from '@/components/experiment/InstructionPage';
import ScenarioPage from '@/components/experiment/ScenarioPage';
import CompletePage from '@/components/experiment/CompletePage';
import DisqualifiedPage from '@/components/experiment/DisqualifiedPage';

export default function HomePage() {
  const { step } = useExperiment();

  const getProgress = () => {
    switch (step) {
      case 'screening': return 10;
      case 'basic-info': return 30;
      case 'social-influence': return 50;
      case 'instruction': return 65;
      case 'scenario': return 80;
      case 'complete': return 100;
      default: return 0;
    }
  };

  const showProgress = step !== 'disqualified';

  return (
    <main className="min-h-screen flex flex-col">
      {showProgress && (
        <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50">
          <div className="mobile-container py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-slate-300">自动驾驶实验</span>
              </div>
            </div>
            <Progress value={getProgress()} className="h-1.5" />
          </div>
        </header>
      )}

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
