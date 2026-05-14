'use client';

import { useExperiment } from '@/contexts/ExperimentContext';

export default function InstructionPage() {
  const { setStep } = useExperiment();

  return (
    <div className="mobile-container">
      <div className="nav-header sticky top-0 z-10 py-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/60 text-sm">自动驾驶接受度研究</span>
          <span className="text-blue-400 font-medium text-sm">情境实验</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '100%' }} />
        </div>
      </div>

      <div className="glass-card p-8 mb-6">
        <h2 className="text-2xl font-bold text-white mb-8 text-center text-gradient">
          实验说明
        </h2>
        
        <p className="text-white/90 text-base leading-relaxed mb-6">
          接下来的实验中，请您设想自己正处于图片所描述的真实驾驶场景中，并根据您的真实感受作答。
        </p>
        
        <div className="warning-box">
          <p>
            <strong>注意：</strong>若因不认真阅读导致填答错误，可能会扣除部分被试费。
          </p>
        </div>
      </div>

      <button 
        onClick={() => setStep('scenario')} 
        className="btn-primary ripple"
      >
        开始实验
      </button>
    </div>
  );
}
