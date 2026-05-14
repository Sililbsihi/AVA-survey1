'use client';

import { useEffect, useState } from 'react';
import { useExperiment } from '@/contexts/ExperimentContext';

export default function CompletePage() {
  const { experimentData } = useExperiment();
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

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
          throw new Error('提交失败');
        }
      } catch (err) {
        console.error('提交失败:', err);
        setError('数据提交失败，请联系主试');
      } finally {
        setIsSubmitting(false);
      }
    };

    submitData();
  }, [experimentData]);

  return (
    <div className="mobile-container">
      <div className="nav-header sticky top-0 z-10 py-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/60 text-sm">自动驾驶接受度研究</span>
          <span className="text-blue-400 font-medium text-sm">已完成</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '100%' }} />
        </div>
      </div>

      <div className="text-center py-8">
        <div className="mb-8">
          <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-2 border-green-400/50 flex items-center justify-center shadow-lg shadow-green-500/20">
            <svg className="w-14 h-14 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">
          感谢参与！
        </h2>
        
        <p className="text-white/60 mb-8">
          请点击下方按钮领取被试费
        </p>

        {isSubmitting && (
          <div className="mb-4 text-white/60">
            <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-2 animate-spin"></div>
            <p className="text-sm">正在保存您的数据...</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {isSubmitted && (
          <>
            <a
              href="https://www.credamo.com/s/ZNBJBj/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary ripple inline-block mb-4 max-w-xs mx-auto"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                被试费领取
              </span>
            </a>

            <div className="glass-card p-4 max-w-xs mx-auto">
              <p className="text-amber-300 text-sm">
                <strong>注意</strong>：必须以支付宝手机号登录领取
              </p>
            </div>
          </>
        )}

        <div className="mt-12 text-white/40 text-sm">
          <p>如有疑问，请联系主试</p>
          <p className="text-white/60 mt-1">微信：CHEL_7777</p>
        </div>
      </div>
    </div>
  );
}
