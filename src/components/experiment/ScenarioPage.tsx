'use client';

import { useState, useEffect, useRef } from 'react';
import { useExperiment } from '@/contexts/ExperimentContext';

type ViewMode = 'scenario' | 'decision' | 'complete';

interface ScenarioState {
  mode: ViewMode;
  currentScenarioIndex: number;
  decision: 'yes' | 'no' | null;
  acceptance1: number | null;
  acceptance2: number | null;
  manipulation: string;
}

const SCENARIOS = [
  { id: 'low', image: '/scenario-low.jpg' },
  { id: 'high', image: '/scenario-high.jpg' }
];

export default function ScenarioPage() {
  const { setStep } = useExperiment();
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<ScenarioState>({
    mode: 'scenario',
    currentScenarioIndex: 0,
    decision: null,
    acceptance1: null,
    acceptance2: null,
    manipulation: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const order = Math.random() < 0.5 ? ['low', 'high'] : ['high', 'low'];
    const orderStr = order.join(',');
    localStorage.setItem('scenarioOrder', orderStr);
  }, []);

  const handleRipple = (e: React.MouseEvent<HTMLElement>) => {
    const x = e.clientX;
    const y = e.clientY;
    
    // 涟漪效果 - 使用fixed定位+CSS居中
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    
    const randomAngles = Array.from({ length: 6 }, (_, i) => (Math.PI * 2 / 6) * i + Math.random() * 0.5);
    const randomDistances = Array.from({ length: 6 }, () => 20 + Math.random() * 15);
    
    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('span');
      particle.className = 'particle';
      particle.style.position = 'fixed';
      const angle = randomAngles[i];
      const distance = randomDistances[i];
      particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
      particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.background = ['#f472b6', '#a78bfa', '#60a5fa', '#34d399'][i % 4];
      particle.style.zIndex = '9999';
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 700);
    }
  };

  const getCurrentScenario = () => {
    const orderStr = localStorage.getItem('scenarioOrder') || 'low,high';
    const order = orderStr.split(',');
    const scenarioId = order[state.currentScenarioIndex];
    return SCENARIOS.find(s => s.id === scenarioId) || SCENARIOS[0];
  };

  const handleConfirmView = () => {
    setState(prev => ({ ...prev, mode: 'decision' }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextScenario = () => {
    if (state.decision === null || state.acceptance1 === null || state.acceptance2 === null || state.manipulation === '') {
      setError('请回答所有问题');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setError('');

    if (state.currentScenarioIndex === 0) {
      const scenario = getCurrentScenario();
      const scenarioA = {
        type: scenario.id,
        decision: state.decision,
        acceptance1: state.acceptance1,
        acceptance2: state.acceptance2,
        manipulation: state.manipulation
      };
      localStorage.setItem('scenarioA', JSON.stringify(scenarioA));
      
      setState(prev => ({
        ...prev,
        mode: 'scenario',
        currentScenarioIndex: 1,
        decision: null,
        acceptance1: null,
        acceptance2: null,
        manipulation: ''
      }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const scenario = getCurrentScenario();
      const scenarioB = {
        type: scenario.id,
        decision: state.decision,
        acceptance1: state.acceptance1,
        acceptance2: state.acceptance2,
        manipulation: state.manipulation
      };
      localStorage.setItem('scenarioB', JSON.stringify(scenarioB));
      setStep('complete');
    }
  };

  // 图片查看模式 - 直接显示图片，无任何文字
  if (state.mode === 'scenario') {
    const scenario = getCurrentScenario();
    return (
      <div className="mobile-container" ref={containerRef}>
        <div className="stars-bg" />
        
        {/* 图片区域 - 占满除按钮外的所有空间 */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <img 
            src={scenario.image} 
            alt="驾驶场景"
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* 确认按钮 - 固定在底部 */}
        <div className="flex-shrink-0 py-4 px-4">
          <button 
            onClick={(e) => { handleRipple(e); handleConfirmView(); }}
            className="btn-glow w-full"
          >
            <span>我已阅读完毕</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // 决策模式
  return (
    <div className="mobile-container" ref={containerRef}>
      <div className="stars-bg" />
      
      <div className="nav-header">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/50 text-xs tracking-wide">自动驾驶接受度研究</span>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            情境 {state.currentScenarioIndex + 1}/2
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${((state.currentScenarioIndex + 1) / 2) * 100}%` }} />
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {/* 行为决策 */}
        <div className="question-card">
          <span className="question-label">行为决策</span>
          <p className="question-text">
            在该情境下，您是否愿意切换至自动驾驶模式？
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={(e) => { e.stopPropagation(); handleRipple(e); setState(prev => ({ ...prev, decision: 'yes' })); setError(''); }}
              className={`option-btn flex-1 max-w-[140px] ${state.decision === 'yes' ? 'selected' : ''}`}
            >
              <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              是
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleRipple(e); setState(prev => ({ ...prev, decision: 'no' })); setError(''); }}
              className={`option-btn flex-1 max-w-[140px] ${state.decision === 'no' ? 'selected' : ''}`}
            >
              <svg className="w-5 h-5 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              否
            </button>
          </div>
        </div>

        {/* 接受度评分1 - 添加 overflow-x-auto */}
        <div className="question-card">
          <span className="question-label">接受度评分</span>
          <p className="question-text">
            在该情境下，你是否愿意使用自动驾驶汽车？
          </p>
          <div className="flex items-center justify-between gap-1 overflow-x-auto">
            <span className="text-white/40 text-xs whitespace-nowrap flex-shrink-0">完全不愿意</span>
            <div className="flex gap-1 sm:gap-1.5 flex-shrink-0">
              {[1, 2, 3, 4, 5].map(val => (
                <button
                  key={val}
                  onClick={(e) => { e.stopPropagation(); handleRipple(e); setState(prev => ({ ...prev, acceptance1: val })); }}
                  className={`num-option ${state.acceptance1 === val ? 'selected' : ''}`}
                >
                  <span style={{ position: 'relative', zIndex: 2 }}>{val}</span>
                </button>
              ))}
            </div>
            <span className="text-white/40 text-xs whitespace-nowrap flex-shrink-0">完全愿意</span>
          </div>
        </div>

        {/* 接受度评分2 - 添加 overflow-x-auto */}
        <div className="question-card">
          <span className="question-label">接受度评分</span>
          <p className="question-text">
            在该情境下，你是否愿意与其他人一起乘坐自动驾驶的公共交通？
          </p>
          <div className="flex items-center justify-between gap-1 overflow-x-auto">
            <span className="text-white/40 text-xs whitespace-nowrap flex-shrink-0">完全不愿意</span>
            <div className="flex gap-1 sm:gap-1.5 flex-shrink-0">
              {[1, 2, 3, 4, 5].map(val => (
                <button
                  key={val}
                  onClick={(e) => { e.stopPropagation(); handleRipple(e); setState(prev => ({ ...prev, acceptance2: val })); }}
                  className={`num-option ${state.acceptance2 === val ? 'selected' : ''}`}
                >
                  <span style={{ position: 'relative', zIndex: 2 }}>{val}</span>
                </button>
              ))}
            </div>
            <span className="text-white/40 text-xs whitespace-nowrap flex-shrink-0">完全愿意</span>
          </div>
        </div>

        {/* 操纵检验 */}
        <div className="question-card">
          <span className="question-label">操纵检验</span>
          <p className="question-text">
            请回忆刚才图片中，道路上自动驾驶汽车的比例是多少？
          </p>
          <div className="grid grid-cols-5 gap-2 mt-3">
            {['10%', '20%', '60%', '80%', '90%'].map(val => (
              <button
                key={val}
                onClick={(e) => { e.stopPropagation(); handleRipple(e); setState(prev => ({ ...prev, manipulation: val.replace('%', '') })); setError(''); }}
                className={`num-option-compact py-3 ${state.manipulation === val.replace('%', '') ? 'selected' : ''}`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="error-text">{error}</div>}
      </div>

      <div className="pt-4 pb-8">
        <button onClick={(e) => { handleRipple(e); handleNextScenario(); }} className="btn-glow">
          <span>{state.currentScenarioIndex === 0 ? '进入下一情境' : '完成实验'}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
