'use client';

import { useEffect } from 'react';
import { useExperiment } from '@/contexts/ExperimentContext';

export default function DisqualifiedPage() {
  const { resetExperiment } = useExperiment();

  useEffect(() => {
    resetExperiment();
  }, [resetExperiment]);

  return (
    <div className="mobile-container">
      <div className="nav-header sticky top-0 z-10 py-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/60 text-sm">自动驾驶接受度研究</span>
          <span className="text-white/40 font-medium text-sm">结束</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '100%', background: 'rgba(255,255,255,0.2)' }} />
        </div>
      </div>

      <div className="text-center py-16">
        <div className="mb-8">
          <div className="w-28 h-28 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <svg className="w-14 h-14 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6">
          感谢参与
        </h2>
        
        <p className="text-white/60 mb-4">
          您暂时不符合本次实验目标人群
        </p>
        
        <p className="text-white/40">
          下次实验期待您的参与
        </p>

        <div className="mt-12">
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto"></div>
        </div>

        <p className="text-white/30 text-sm mt-8">
          您可以关闭此页面
        </p>
      </div>
    </div>
  );
}
