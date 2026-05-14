'use client';

import { useEffect, useState, useRef } from 'react';
import { useExperiment } from '@/contexts/ExperimentContext';

export default function CompletePage() {
  const { experimentData } = useExperiment();
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleRipple = (e: React.MouseEvent<HTMLElement>) => {
    const x = e.clientX;
    const y = e.clientY;
    
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

  useEffect(() => {
    const submitData = async () => {
      const scenarioA = localStorage.getItem('scenarioA');
      const scenarioB = localStorage.getItem('scenarioB');
      const scenarioOrder = localStorage.getItem('scenarioOrder');

      const fullData = {
        ...experimentData,
        scenarioA: scenarioA ? JSON.parse(scenarioA) : null,
        scenarioB: scenarioB ? JSON.parse(scenarioB) : null,
        scenarioOrder: scenarioOrder || 'low,high'
      };

      try {
        const response = await fetch('/api/experiment/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fullData)
        });

        if (response.ok) {
          setIsSubmitted(true);
        } else {
          // 即使提交失败，也允许领取被试费
          console.log('数据提交失败，但允许继续');
          setIsSubmitted(true);
        }
      } catch (err) {
        // 即使网络错误，也允许领取被试费（数据可能已记录）
        console.log('数据提交失败，但允许继续');
        setIsSubmitted(true);
      } finally {
        setIsSubmitting(false);
      }
    };

    submitData();
  }, [experimentData]);

  return (
    <div className="mobile-container" ref={containerRef}>
      <div className="stars-bg" />
      
      <div className="nav-header">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/50 text-xs tracking-wide">自动驾驶接受度研究</span>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-400/30">
            已完成
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '100%' }} />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center py-8">
        {/* 成功图标 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-400/40 mb-6 animate-float">
            <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-3 tracking-wide">
            感谢参与！
          </h1>
          <p className="text-white/60 text-base">
            请点击下方按钮领取被试费
          </p>
        </div>

        {/* 提交状态 */}
        {isSubmitting && (
          <div className="glass-card text-center mb-6">
            <div className="w-10 h-10 mx-auto mb-3 border-3 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
            <p className="text-white/60 text-sm">正在保存您的数据...</p>
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="warning-box mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* 被试费领取按钮 */}
        {isSubmitted && (
          <div className="space-y-5">
            <a
              href="https://www.credamo.com/s/ZNBJBj/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleRipple}
              className="btn-glow ripple-container inline-flex w-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>被试费领取</span>
              <svg className="w-5 h-5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            {/* 领取提示 */}
            <div className="success-box flex items-start gap-3">
              <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p><strong>注意：</strong>必须以支付宝手机号登录领取</p>
            </div>
          </div>
        )}

        {/* 联系主试 */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-white/40 text-sm mb-2">如有疑问，请联系主试</p>
          <p className="text-indigo-400 font-medium">微信：CHEL_7777</p>
        </div>
      </div>
    </div>
  );
}
