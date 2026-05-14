'use client';

import { useExperiment } from '@/contexts/ExperimentContext';

export default function DisqualifiedPage() {
  const { resetExperiment } = useExperiment();

  return (
    <div className="mobile-container">
      <div className="text-center pt-8">
        <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center">
          <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-100 mb-4">抱歉</h1>
        <p className="text-slate-400 mb-8">您不符合本次实验的参与条件。感谢您的关注！</p>
      </div>

      <div className="glow-border bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 mb-6">
        <p className="text-slate-300 text-sm text-center leading-relaxed">
          本次实验对被试有特定的筛选条件要求，主要是确保样本的同质性。
        </p>
        <p className="text-slate-400 text-sm text-center mt-4">
          如有疑问，请联系主试了解更多信息。
        </p>
      </div>

      <button onClick={resetExperiment} className="w-full py-3 bg-slate-700/50 border border-slate-600 text-slate-200 hover:bg-slate-600/50 rounded-xl">
        返回首页
      </button>
    </div>
  );
}
