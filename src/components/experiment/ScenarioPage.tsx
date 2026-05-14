'use client';

import { useState, useEffect } from 'react';
import { useExperiment } from '@/contexts/ExperimentContext';
import { Button } from '@/components/ui/button';

const scaleLabels = ['很不同意', '不同意', '中立', '同意', '很同意'];

export default function ScenarioPage() {
  const { step, setStep, experimentData, updateScenario, updateScenarioOrder } = useExperiment();
  const [showScenarioA, setShowScenarioA] = useState(true);
  const [currentScenario, setCurrentScenario] = useState<'A' | 'B'>('A');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scenarioOrder = experimentData.scenarioOrder;

  useEffect(() => {
    if (scenarioOrder.length === 0) {
      const order = Math.random() > 0.5 ? ['A', 'B'] : ['B', 'A'];
      updateScenarioOrder(order);
      setCurrentScenario(order[0] as 'A' | 'B');
    } else {
      setCurrentScenario(scenarioOrder[0] as 'A' | 'B');
    }
  }, []);

  const currentData = currentScenario === 'A' ? experimentData.scenarioA : experimentData.scenarioB;
  const isHighAutomation = (scenarioOrder[0] === 'B' && currentScenario === 'A') || (scenarioOrder[0] === 'A' && currentScenario === 'B');
  const imageUrl = isHighAutomation ? '/scenario-high.jpg' : '/scenario-low.jpg';

  const handleDecision = (decision: 'A' | 'B') => {
    updateScenario({ decision });
    setError('');
  };

  const handleAcceptSelf = (value: number) => updateScenario({ acceptSelf: value });
  const handleAcceptPublic = (value: number) => updateScenario({ acceptPublic: value });
  const handleManipulation = (value: string) => updateScenario({ manipulationCheck: value });

  const handleNext = () => {
    if (!currentData.decision) { setError('请选择您的决策'); window.scrollTo(0, 0); return; }
    if (!currentData.acceptSelf) { setError('请评价个人接受程度'); window.scrollTo(0, 0); return; }
    if (!currentData.acceptPublic) { setError('请评价公众接受程度'); window.scrollTo(0, 0); return; }
    if (!currentData.manipulationCheck) { setError('请回答操纵检验问题'); window.scrollTo(0, 0); return; }
    setError('');
    setIsSubmitting(true);
    window.scrollTo(0, 0);

    setTimeout(() => {
      if (scenarioOrder[0] === 'A' && currentScenario === 'A') {
        setCurrentScenario('B');
        setIsSubmitting(false);
      } else if (scenarioOrder[0] === 'B' && currentScenario === 'B') {
        setCurrentScenario('A');
        setIsSubmitting(false);
      } else {
        setStep('complete');
        setIsSubmitting(false);
      }
    }, 300);
  };

  return (
    <div className="mobile-container">
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold text-white mb-2">情境实验</h1>
        <p className="text-sm text-slate-400">情境 {currentScenario}</p>
      </div>

      <div className="glow-border bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 mb-6">
        <img src={imageUrl} alt="驾驶场景" className="w-full rounded-xl mb-4" />

        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-slate-200 mb-3">面对上述情境，您的决策是？<span className="text-red-400">*</span></p>
            <div className="flex gap-3">
              <button onClick={() => handleDecision('A')} className={`flex-1 py-3 rounded-xl text-sm ${currentData.decision === 'A' ? 'bg-primary text-white' : 'bg-slate-700/50 text-slate-300 border border-slate-600'}`}>继续使用自动驾驶</button>
              <button onClick={() => handleDecision('B')} className={`flex-1 py-3 rounded-xl text-sm ${currentData.decision === 'B' ? 'bg-primary text-white' : 'bg-slate-700/50 text-slate-300 border border-slate-600'}`}>手动驾驶</button>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-200 mb-3">您对该情境下自动驾驶技术的个人接受程度：<span className="text-red-400">*</span></p>
            <div className="space-y-3">
              {scaleLabels.map((label, index) => {
                const value = index + 1;
                return (
                  <button key={value} onClick={() => handleAcceptSelf(value)} className={`w-full py-3 px-4 rounded-xl text-sm ${currentData.acceptSelf === value ? 'bg-primary text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'}`}>
                    <span className="flex items-center justify-between"><span>{label}</span>{currentData.acceptSelf === value && <span>✓</span>}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-200 mb-3">您认为公众对该情境下自动驾驶技术的接受程度：<span className="text-red-400">*</span></p>
            <div className="space-y-3">
              {scaleLabels.map((label, index) => {
                const value = index + 1;
                return (
                  <button key={value} onClick={() => handleAcceptPublic(value)} className={`w-full py-3 px-4 rounded-xl text-sm ${currentData.acceptPublic === value ? 'bg-primary text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'}`}>
                    <span className="flex items-center justify-between"><span>{label}</span>{currentData.acceptPublic === value && <span>✓</span>}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-200 mb-3">您认为在该情境下，自动驾驶技术接管车辆的时间比例为：<span className="text-red-400">*</span></p>
            <div className="flex gap-3">
              {['20%', '80%'].map(opt => (
                <button key={opt} onClick={() => handleManipulation(opt)} className={`flex-1 py-3 rounded-xl text-sm ${currentData.manipulationCheck === opt ? 'bg-primary text-white' : 'bg-slate-700/50 text-slate-300 border border-slate-600'}`}>{opt}</button>
              ))}
            </div>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}
        <Button onClick={handleNext} disabled={isSubmitting} className="w-full mt-6 bg-primary hover:bg-primary/90">{isSubmitting ? '提交中...' : '下一页'}</Button>
      </div>
    </div>
  );
}
