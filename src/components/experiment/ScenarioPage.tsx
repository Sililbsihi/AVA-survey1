'use client';

import { useState } from 'react';
import { useExperiment } from '@/contexts/ExperimentContext';

type ViewMode = 'instruction' | 'scenario' | 'decision';

interface ScenarioState {
  mode: ViewMode;
  currentScenarioIndex: number;
  decision: 'yes' | 'no' | null;
  acceptance1: number | null;
  acceptance2: number | null;
  manipulation: string;
}

const SCENARIOS = [
  { id: 'low', name: '低自动驾驶比例', image: '/scenario-low.jpg' },
  { id: 'high', name: '高自动驾驶比例', image: '/scenario-high.jpg' }
];

export default function ScenarioPage() {
  const { setStep } = useExperiment();
  const [state, setState] = useState<ScenarioState>({
    mode: 'instruction',
    currentScenarioIndex: 0,
    decision: null,
    acceptance1: null,
    acceptance2: null,
    manipulation: ''
  });
  const [error, setError] = useState('');

  const getCurrentScenario = () => {
    const orderStr = localStorage.getItem('scenarioOrder') || 'low,high';
    const order = orderStr.split(',');
    const scenarioId = order[state.currentScenarioIndex];
    return SCENARIOS.find(s => s.id === scenarioId) || SCENARIOS[0];
  };

  const handleViewScenario = () => {
    setState(prev => ({ ...prev, mode: 'scenario' }));
  };

  const handleConfirmView = () => {
    setState(prev => ({ ...prev, mode: 'decision' }));
  };

  const handleNextScenario = () => {
    if (state.currentScenarioIndex === 0) {
      const scenarioA = {
        type: getCurrentScenario().id,
        decision: state.decision,
        acceptance1: state.acceptance1,
        acceptance2: state.acceptance2,
        manipulation: state.manipulation
      };
      localStorage.setItem('scenarioA', JSON.stringify(scenarioA));
      
      setState(prev => ({
        ...prev,
        mode: 'instruction',
        currentScenarioIndex: 1,
        decision: null,
        acceptance1: null,
        acceptance2: null,
        manipulation: ''
      }));
    } else {
      const scenarioB = {
        type: getCurrentScenario().id,
        decision: state.decision,
        acceptance1: state.acceptance1,
        acceptance2: state.acceptance2,
        manipulation: state.manipulation
      };
      localStorage.setItem('scenarioB', JSON.stringify(scenarioB));
      setStep('complete');
    }
  };

  const isComplete = state.decision !== null && state.acceptance1 !== null && 
                     state.acceptance2 !== null && state.manipulation !== '';

  const renderContent = () => {
    if (state.mode === 'instruction') {
      const scenario = getCurrentScenario();
      return (
        <div className="glass-card p-6 mb-6 text-center">
          <h3 className="text-xl font-bold text-white mb-4">
            情境 {state.currentScenarioIndex + 1}：{scenario.name}
          </h3>
          <p className="text-white/60 mb-6">
            请仔细阅读以下场景描述
          </p>
          <button 
            onClick={handleViewScenario}
            className="btn-primary ripple"
          >
            查看场景图片
          </button>
        </div>
      );
    }

    if (state.mode === 'scenario') {
      const scenario = getCurrentScenario();
      return (
        <div className="space-y-4">
          <div className="glass-card p-3 overflow-hidden">
            <img 
              src={scenario.image} 
              alt={scenario.name}
              className="w-full h-auto rounded-xl object-contain"
              style={{ maxHeight: '60vh' }}
            />
          </div>
          <button 
            onClick={handleConfirmView}
            className="btn-primary ripple"
          >
            我已阅读完毕，继续作答
          </button>
        </div>
      );
    }

    if (state.mode === 'decision') {
      return (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-4 text-center">
              情境 {state.currentScenarioIndex + 1} 问答
            </h3>
            
            <div className="mb-6">
              <p className="text-white/80 mb-4">
                在该情境下，您是否愿意切换至自动驾驶模式？
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => { setState(prev => ({ ...prev, decision: 'yes' })); setError(''); }}
                  className={`option-btn ${state.decision === 'yes' ? 'selected' : ''}`}
                >
                  是
                </button>
                <button
                  onClick={() => { setState(prev => ({ ...prev, decision: 'no' })); setError(''); }}
                  className={`option-btn ${state.decision === 'no' ? 'selected' : ''}`}
                >
                  否
                </button>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-white/80 mb-4">
                1. 在该情境下，你是否愿意使用自动驾驶汽车？
              </p>
              <div className="flex justify-between items-center gap-1">
                <span className="text-white/40 text-xs">完全不愿意</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      key={val}
                      onClick={() => setState(prev => ({ ...prev, acceptance1: val }))}
                      className={`num-btn ${state.acceptance1 === val ? 'selected' : ''}`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <span className="text-white/40 text-xs">完全愿意</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-white/80 mb-4">
                2. 在该情境下，你是否愿意与其他人一起乘坐自动驾驶的公共交通？
              </p>
              <div className="flex justify-between items-center gap-1">
                <span className="text-white/40 text-xs">完全不愿意</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      key={val}
                      onClick={() => setState(prev => ({ ...prev, acceptance2: val }))}
                      className={`num-btn ${state.acceptance2 === val ? 'selected' : ''}`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <span className="text-white/40 text-xs">完全愿意</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-white/80 mb-4">
                请回忆刚才图片中，道路上自动驾驶汽车的比例是多少？
              </p>
              <select
                value={state.manipulation}
                onChange={(e) => setState(prev => ({ ...prev, manipulation: e.target.value }))}
                className="input-field"
              >
                <option value="">请选择</option>
                <option value="low">较少（约20%）</option>
                <option value="high">较多（约80%）</option>
              </select>
            </div>

            {error && (
              <p className="text-red-300 text-sm mb-4 text-center">{error}</p>
            )}
          </div>

          {isComplete && (
            <button 
              onClick={handleNextScenario}
              className="btn-primary ripple"
            >
              {state.currentScenarioIndex === 0 ? '进入下一个情境' : '完成实验'}
            </button>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="mobile-container">
      <div className="nav-header sticky top-0 z-10 py-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/60 text-sm">自动驾驶接受度研究</span>
          <span className="text-blue-400 font-medium text-sm">
            情境 {state.currentScenarioIndex + 1}/2
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((state.currentScenarioIndex + 1) / 2) * 100}%` }} 
          />
        </div>
      </div>

      <div className="mb-4">
        <span className="tag">情境实验</span>
      </div>

      {renderContent()}
    </div>
  );
}
