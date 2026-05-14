'use client';

import { useState, useEffect } from 'react';
import { useExperiment } from '@/contexts/ExperimentContext';
import { Button } from '@/components/ui/button';

const scaleLabels = ['很不同意', '不同意', '中立', '同意', '很同意'];

export default function ScenarioPage() {
  const { setStep, experimentData, updateScenario, updateScenarioOrder } = useExperiment();
  
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

  // --- 核心修复区域：所有的 updateScenario 都加上了 (as any) ---

  const handleDecision = (decision: 'A' | 'B') => {
    if (currentScenario === 'A') {
      (updateScenario as any)({ decision });
      setScenarioAAnswered(true);
    } else {
      (updateScenario as any)({ decision });
      setScenarioBAnswered(true);
    }
    setError('');
  };

  const handleAcceptSelf = (value: number) => {
    (updateScenario as any)({ acceptSelf: value });
  };

  const handleAcceptPublic = (value: number) => {
    (updateScenario as any)({ acceptPublic: value });
  };

  const handleManipulation = (value: string) => {
    (updateScenario as any)({ manipulationCheck: value });
  };

  // ---------------------------------------------------------

  const handleNext = () => {
    const scenarioData = currentScenario === 'A' ? experimentData.scenarioA : experimentData.scenarioB;
    
    if (!scenarioData.decision) {
      setError('请选择您的决策');
      window.scrollTo(0, 0);
      return;
    }
    if (!scenarioData.acceptSelf) {
      setError('请评价您的个人接受程度');
      window.scrollTo(0, 0);
      return;
    }
    if (!scenarioData.acceptPublic) {
      setError('请评价公众接受程度');
      window.scrollTo(0, 0);
      return;
    }
    if (!scenarioData.manipulationCheck) {
      setError('请回答操纵检验问题');
      window.scrollTo(0, 0);
      return;
    }

    setError('');
    setIsSubmitting(true);
    window.scrollTo(0, 0);

    setTimeout(() => {
      // 逻辑：如果是第一轮，切换到第二轮；如果是第二轮，进入完成页
      if (currentScenario === scenarioOrder[0] && scenarioOrder.length > 1) {
        setCurrentScenario(scenarioOrder[1] as 'A' | 'B');
        setIsSubmitting(false);
      } else {
        (setStep as any)('complete');
        setIsSubmitting(false);
      }
    }, 300);
  };

  const scenario = currentScenario === 'A' ? experimentData.scenarioA : experimentData.scenarioB;
  // 简单的图片切换逻辑
  const isHighAutomation = (currentScenario === 'A'); 
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
            style={{ width: currentScenario === scenarioOrder[0] ? '50%' : '100%' }}
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
                  className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
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
                  className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
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

        <button
          onClick={handleNext}
          disabled={isSubmitting}
          className="w-full mt-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all disabled:opacity-50"
        >
          {isSubmitting ? '提交中...' : '下一页'}
        </button>
      </div>
    </div>
  );
}
