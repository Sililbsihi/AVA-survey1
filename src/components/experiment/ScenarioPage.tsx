'use client';

import { useState, useEffect } from 'react';
import { useExperiment } from '@/contexts/ExperimentContext';
import { Button } from '@/components/ui/button';

const scaleLabels = ['很不同意', '不同意', '中立', '同意', '很同意'];

export default function ScenarioPage() {
  const { step, setStep, experimentData, updateScenario, updateScenarioOrder } = useExperiment();
  
  const [showScenarioA, setShowScenarioA] = useState(true);
  const [scenarioAAnswered, setScenarioAAnswered] = useState(false);
  const [scenarioBAnswered, setScenarioBAnswered] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<'A' | 'B'>('A');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scenarioOrder = experimentData.scenarioOrder;

  useEffect(() => {
    const order = scenarioOrder.length === 0 
      ? (Math.random() > 0.5 ? ['A', 'B'] : ['B', 'A'])
      : scenarioOrder;
    if (scenarioOrder.length === 0) {
      updateScenarioOrder(order);
    }
    setCurrentScenario(order[0] as 'A' | 'B');
  }, []);

  const handleDecision = (decision: 'A' | 'B') => {
    if (currentScenario === 'A') {
      updateScenario({ scenarioA: { ...experimentData.scenarioA, decision } });
      setScenarioAAnswered(true);
    } else {
      updateScenario({ scenarioB: { ...experimentData.scenarioB, decision } });
      setScenarioBAnswered(true);
    }
    setError('');
  };

  const handleAcceptSelf = (value: number) => {
    if (currentScenario === 'A') {
      updateScenario({ scenarioA: { ...experimentData.scenarioA, acceptSelf: value } });
    } else {
      updateScenario({ scenarioB: { ...experimentData.scenarioB, acceptSelf: value } });
    }
  };

  const handleAcceptPublic = (value: number) => {
    if (currentScenario === 'A') {
      updateScenario({ scenarioA: { ...experimentData.scenarioA, acceptPublic: value } });
    } else {
      updateScenario({ scenarioB: { ...experimentData.scenarioB, acceptPublic: value } });
    }
  };

  const handleManipulation = (value: string) => {
    if (currentScenario === 'A') {
      updateScenario({ scenarioA: { ...experimentData.scenarioA, manipulationCheck: value } });
    } else {
      updateScenario({ scenarioB: { ...experimentData.scenarioB, manipulationCheck: value } });
    }
  };

  const handleNext = () => {
    const scenario = currentScenario === 'A' ? experimentData.scenarioA : experimentData.scenarioB;
    
    if (!scenario.decision) {
      setError('请选择您的决策');
      window.scrollTo(0, 0);
      return;
    }
    if (!scenario.acceptSelf) {
      setError('请评价您的个人接受程度');
      window.scrollTo(0, 0);
      return;
    }
    if (!scenario.acceptPublic) {
      setError('请评价公众接受程度');
      window.scrollTo(0, 0);
      return;
    }
    if (!scenario.manipulationCheck) {
      setError('请回答操纵检验问题');
      window.scrollTo(0, 0);
      return;
    }

    setError('');
    setIsSubmitting(true);
    window.scrollTo(0, 0);

    setTimeout(() => {
      if (currentScenario === 'A' && scenarioOrder[1] === 'B') {
        setCurrentScenario('B');
        setScenarioBAnswered(false);
        setIsSubmitting(false);
      } else if (currentScenario === 'B' && scenarioOrder[1] === 'A') {
        setCurrentScenario('A');
        setScenarioAAnswered(false);
        setIsSubmitting(false);
      } else {
        setStep('complete');
        setIsSubmitting(false);
      }
    }, 300);
  };

  const scenario = currentScenario === 'A' ? experimentData.scenarioA : experimentData.scenarioB;
  const isHighAutomation = (currentScenario === 'A' && scenarioOrder[0] === 'B') || 
                           (currentScenario === 'B' && scenarioOrder[0] === 'B');
  const imageUrl = isHighAutomation ? '/scenario-high.jpg' : '/scenario-low.jpg';

  return (
    <div className="mobile-container">
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold text-white mb-2">
          情境 {currentScenario}
        </h1>
        <p className="text-sm text-slate-400">请仔细阅读场景并作答</p>
      </div>

      <div className="mb-4">
        <div className="w-full bg-slate-700 rounded-full h-1.5">
          <div
            className="bg-primary h-1.5 rounded-full transition-all duration-300"
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <div className="glow-border bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 mb-6">
        <div className="text-center mb-4">
          <img
            src={imageUrl}
            alt="驾驶场景"
            className="w-full rounded-xl mb-4"
          />
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-slate-200 mb-3">
              面对上述情境，您的决策是？<span className="text-red-400">*</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDecision('A')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                  scenario.decision === 'A'
                    ? 'bg-primary text-white'
                    : 'bg-slate-700/50 text-slate-300 border border-slate-600 hover:bg-slate-700'
                }`}
              >
                选择继续使用自动驾驶
              </button>
              <button
                onClick={() => handleDecision('B')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                  scenario.decision === 'B'
                    ? 'bg-primary text-white'
                    : 'bg-slate-700/50 text-slate-300 border border-slate-600 hover:bg-slate-700'
                }`}
              >
                选择手动驾驶
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-200 mb-3">
              您对该情境下自动驾驶技术的个人接受程度：<span className="text-red-400">*</span>
            </p>
            <div className="flex justify-between gap-1 mb-2 px-1">
              {scaleLabels.map((label) => (
                <span key={label} className="text-xs text-slate-400 text-center flex-1">
                  {label}
                </span>
              ))}
            </div>
            <div className="flex justify-between gap-2 px-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleAcceptSelf(value)}
                  className={`w-12 h-12 rounded-full text-sm font-bold transition-all ${
                    scenario.acceptSelf === value
                      ? 'bg-primary text-white scale-110'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-200 mb-3">
              您认为公众对该情境下自动驾驶技术的接受程度：<span className="text-red-400">*</span>
            </p>
            <div className="flex justify-between gap-1 mb-2 px-1">
              {scaleLabels.map((label) => (
                <span key={label} className="text-xs text-slate-400 text-center flex-1">
                  {label}
                </span>
              ))}
            </div>
            <div className="flex justify-between gap-2 px-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleAcceptPublic(value)}
                  className={`w-12 h-12 rounded-full text-sm font-bold transition-all ${
                    scenario.acceptPublic === value
                      ? 'bg-primary text-white scale-110'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-200 mb-3">
              您认为在该情境下，自动驾驶技术接管车辆的时间比例为：<span className="text-red-400">*</span>
            </p>
            <div className="flex gap-3">
              {['20%', '80%'].map((option) => (
                <button
                  key={option}
                  onClick={() => handleManipulation(option)}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                    scenario.manipulationCheck === option
                      ? 'bg-primary text-white'
                      : 'bg-slate-700/50 text-slate-300 border border-slate-600 hover:bg-slate-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center mt-4">{error}</p>
        )}

        <Button
          onClick={handleNext}
          disabled={isSubmitting}
          className="w-full mt-6 bg-primary hover:bg-primary/90 text-white"
        >
          {isSubmitting ? '提交中...' : '下一页'}
        </Button>
      </div>
    </div>
  );
}
