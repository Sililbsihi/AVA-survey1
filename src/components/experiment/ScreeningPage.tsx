'use client';

import { useState, useRef } from 'react';
import { useExperiment } from '@/contexts/ExperimentContext';
import Progress from '@/components/ui/progress';

const questions = [
  { id: 'q1', text: '我愿意使用自动驾驶' },
  { id: 'q2', text: '我愿意和其他人一起使用自动驾驶的公共交通' },
  { id: 'q3', text: '如果有新技术，我会想尝试一下' },
  { id: 'q4', text: '在同龄人中，我通常是最先尝试新技术的人' },
  { id: 'q5', text: '此题选择"很不同意"' },
  { id: 'q6', text: '我非常了解自动驾驶汽车的功能和用途' },
  { id: 'q7', text: '相比于周围的人，我对自动驾驶技术有更多的了解' },
];

export default function ScreeningPage() {
  const { updateScreening, setStep } = useExperiment();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [error, setError] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // 果汁溅开效果
  const handleRipple = (e: React.MouseEvent<HTMLElement>) => {
    const x = e.clientX;
    const y = e.clientY;
    
    // 创建涟漪 - 使用fixed定位+CSS居中
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    
    // 创建粒子 - 使用fixed定位
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
      particle.style.position = 'fixed';
      particle.style.background = ['#f472b6', '#a78bfa', '#60a5fa', '#34d399'][i % 4];
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 700);
    }
  };

  const handleSelect = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setError('');
  };

  const handleSubmit = () => {
    for (const q of questions) {
      if (answers[q.id] === undefined) {
        setError('请回答所有题目');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    updateScreening(answers);

    const q1 = answers.q1 || 0;
    const q2 = answers.q2 || 0;
    const q3 = answers.q3 || 0;
    const q4 = answers.q4 || 0;
    const q5 = answers.q5 || 0;
    const q6 = answers.q6 || 0;
    const q7 = answers.q7 || 0;

    const avg12 = (q1 + q2) / 2;
    const avg34 = (q3 + q4) / 2;
    const avg67 = (q6 + q7) / 2;
    const q5Correct = q5 === 1;

    if (avg12 >= 2 && avg12 <= 4 && avg34 >= 2 && avg34 <= 4 && avg67 >= 2 && avg67 <= 4 && q5Correct) {
      setStep('basicInfo');
    } else {
      setStep('disqualified');
    }
  };

  const progress = (Object.keys(answers).length / questions.length) * 100;

  return (
    <div className="mobile-container" ref={containerRef}>
      {/* 星空背景 */}
      <div className="stars-bg" />
      
      {/* 导航头部 */}
      <div className="nav-header">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/50 text-xs tracking-wide">自动驾驶接受度研究</span>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            筛选问卷
          </span>
        </div>
        <Progress value={progress} />
      </div>

      {/* 标题区 */}
      <div className="text-center pt-8 pb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 mb-4">
          <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2 tracking-wide">欢迎参与实验</h1>
        <p className="text-white/50 text-sm">请仔细阅读并回答以下问题</p>
      </div>

      {/* 问题列表 */}
      <div className="flex-1 space-y-4">
        {questions.map((q, index) => (
          <div key={q.id} className="question-card">
            <span className="question-label">第 {index + 1} 题</span>
            <p className="question-text">{q.text}</p>
            
            {/* 选项区域 - 添加 overflow-x-auto */}
            <div className="flex items-center justify-between gap-1 overflow-x-auto">
              <span className="text-white/40 text-xs whitespace-nowrap flex-shrink-0">很不同意</span>
              <div className="flex gap-1 sm:gap-1.5 flex-shrink-0">
                {[1, 2, 3, 4, 5].map(val => (
                  <button
                    key={val}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRipple(e);
                      handleSelect(q.id, val);
                    }}
                    className={`num-option ${answers[q.id] === val ? 'selected' : ''}`}
                  >
                    <span style={{ position: 'relative', zIndex: 2 }}>{val}</span>
                  </button>
                ))}
              </div>
              <span className="text-white/40 text-xs whitespace-nowrap flex-shrink-0">很同意</span>
            </div>
          </div>
        ))}
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="error-text">{error}</div>
      )}

      {/* 提交按钮 */}
      <div className="pt-4 pb-8">
        <button 
          onClick={(e) => {
            handleRipple(e);
            handleSubmit();
          }} 
          className="btn-glow"
        >
          <span>提交答案</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
