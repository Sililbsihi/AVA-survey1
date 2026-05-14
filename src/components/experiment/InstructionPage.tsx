'use client';

import { useExperiment } from '@/contexts/ExperimentContext';
import { Button } from '@/components/ui/button';

export default function InstructionPage() {
  const { setStep } = useExperiment();

  return (
    <div className="mobile-container">
      <div className="text-center mb-6">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center">
          <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">情境实验即将开始</h1>
      </div>

      <div className="glow-border bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 mb-6">
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <p>欢迎参与本次自动驾驶接受度情境实验。</p>
          <p>接下来您将看到两个驾驶场景，每个场景描述后，请根据您的真实想法做出决策和评价。</p>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <p className="text-amber-400 font-medium mb-2">请注意：</p>
            <ul className="space-y-1 text-amber-300/80">
              <li>每个场景只能查看一次</li>
              <li>请仔细阅读场景描述</li>
              <li>根据您的真实想法作答</li>
            </ul>
          </div>
          <p>实验流程：</p>
          <div className="space-y-2 pl-4">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">1</span>
              <span>阅读场景描述</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">2</span>
              <span>做出决策选择</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">3</span>
              <span>评价接受程度</span>
            </div>
          </div>
        </div>
      </div>

      <Button onClick={() => setStep('scenario')} className="w-full bg-primary hover:bg-primary/90 text-lg py-6">
        开始实验
        <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </Button>
    </div>
  );
}
