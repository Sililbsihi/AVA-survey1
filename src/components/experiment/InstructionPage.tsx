'use client';

import { useRef } from 'react';
import { useExperiment } from '@/contexts/ExperimentContext';

export default function InstructionPage() {
  const { setStep } = useExperiment();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleRipple = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = '60px';
    ripple.style.height = '60px';
    ripple.style.marginLeft = '-30px';
    ripple.style.marginTop = '-30px';
    target.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    
    const randomAngles = Array.from({ length: 6 }, (_, i) => (Math.PI * 2 / 6) * i + Math.random() * 0.5);
    const randomDistances = Array.from({ length: 6 }, () => 20 + Math.random() * 15);
    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('span');
      particle.className = 'particle';
      const angle = randomAngles[i];
      const distance = randomDistances[i];
      particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
      particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.background = ['#f472b6', '#a78bfa', '#60a5fa', '#34d399'][i % 4];
      target.appendChild(particle);
      setTimeout(() => particle.remove(), 700);
    }
  };

  return (
    <div className="mobile-container" ref={containerRef}>
      <div className="stars-bg" />
      
      <div className="nav-header">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/50 text-xs tracking-wide">自动驾驶接受度研究</span>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-400/30">
            情境实验
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '100%' }} />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-400/30 mb-6 animate-float">
            <svg className="w-10 h-10 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-3 tracking-wide">
            实验说明
          </h1>
        </div>

        <div className="glass-card mb-6">
          <div className="space-y-5">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                <span className="text-indigo-400 font-bold text-sm">1</span>
              </div>
              <p className="text-white/90 text-sm leading-relaxed pt-1">
                接下来的实验中，请您设想自己正处于图片所描述的真实驾驶场景中，并根据您的真实感受作答。
              </p>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
                <span className="text-amber-400 font-bold text-sm">2</span>
              </div>
              <div className="warning-box !p-0 !bg-transparent !border-0">
                <p className="text-amber-300 text-sm leading-relaxed">
                  <strong>注意：</strong>若因不认真阅读导致填答错误，可能会扣除部分被试费
                </p>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={(e) => { handleRipple(e); setStep('scenario'); }}
          className="btn-glow ripple-container"
        >
          <span>开始实验</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
