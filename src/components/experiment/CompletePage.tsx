'use client';

import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useExperiment } from '@/contexts/ExperimentContext';

const CONFETTI_COLORS = ['#3b82f6', '#a855f7', '#22c55e', '#f59e0b', '#ec4899'];

function generateConfetti() {
  return Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    color: CONFETTI_COLORS[Math.floor(Math.random() * 5)],
  }));
}

export default function CompletePage() {
  const { experimentData } = useExperiment();
  const [showConfetti, setShowConfetti] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const confettiParticles = useMemo(() => generateConfetti(), []);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (submitted) return;
    setSubmitting(true);
    fetch('/api/experiment/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(experimentData),
    })
      .then(r => r.json())
      .then(() => { setSubmitted(true); setSubmitting(false); })
      .catch(() => { setSubmitting(false); });
  }, [experimentData, submitted]);

  return (
    <div className="mobile-container">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {confettiParticles.map((p) => (
            <div key={p.id} className="absolute animate-bounce" style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`, top: '-20px' }}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
            </div>
          ))}
        </div>
      )}

      <div className="text-center pt-8">
        <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
          <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-100 mb-4">感谢参与！</h1>
        <p className="text-slate-400 mb-8">{submitting ? '提交中...' : submitted ? '提交成功！' : '请等待...'}</p>
      </div>

      <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/30 flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-100">被试费领取</h3>
            <p className="text-sm text-slate-400">点击下方按钮领取</p>
          </div>
        </div>
        <a href="https://www.credamo.com/s/ZNBJBj/" target="_blank" rel="noopener noreferrer" className="block">
          <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">被试费领取</Button>
        </a>
        <p className="text-center text-amber-400 text-sm mt-3">点击填写信息，一周内发放</p>
        <div className="mt-4 text-center text-slate-400 text-sm">
          <p>有疑问可联系主试</p>
          <p className="text-amber-400">Wechat: CHEL_7777</p>
        </div>
      </div>

      <div className="text-center text-slate-500 text-sm">
        <p>您的回答对自动驾驶技术的研究具有重要价值</p>
        <p className="mt-2">再次感谢您的参与！</p>
      </div>
    </div>
  );
}
