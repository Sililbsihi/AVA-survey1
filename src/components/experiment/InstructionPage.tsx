'use client';

import { useExperiment } from '@/contexts/ExperimentContext';

export default function InstructionPage() {
  const { setStep } = useExperiment();

  return (
    <div className="mobile-container">
      <div className="nav-header sticky top-0 z-10 py-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-400 text-sm">自动驾驶接受度研究</span>
          <span className="text-primary font-medium text-sm">情境实验</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '100%' }} />
        </div>
      </div>

      <div className="mb-4">
        <span className="tag">实验说明</span>
      </div>

      <div className="card-glow p-6 mb-6">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          情境实验
        </h2>
        
        <div className="space-y-4 text-slate-300">
          <p className="leading-relaxed">
            接下来的实验中，请您设想自己正处于图片所描述的真实驾驶场景中，并根据您的真实感受作答。
          </p>
          
          <div className="warning-box">
            <p>
              <strong>注意：</strong>若因不认真阅读导致填答错误，可能会扣除部分被试费。
            </p>
          </div>
          
          <p className="leading-relaxed mt-4">
            实验将向您展示两种不同的自动驾驶驾驶场景。请仔细阅读每种场景的描述，然后根据场景内容回答相应的问题。
          </p>
          
          <div className="mt-4 space-y-2">
            <p className="text-slate-400 text-sm"><strong className="text-white">实验要求：</strong></p>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-400">
              <li>请认真阅读每个场景的描述</li>
              <li>根据您的真实想法作答</li>
              <li>每个场景后都有若干问题需要回答</li>
              <li>若未仔细阅读导致回答错误可能扣除部分被试费</li>
            </ul>
          </div>
          
          <p className="text-slate-500 text-sm mt-6">
            实验预计需要 3-5 分钟完成。
          </p>
        </div>
      </div>

      <button 
        onClick={() => setStep('scenario')} 
        className="btn-primary"
      >
        开始实验
      </button>
    </div>
  );
}
