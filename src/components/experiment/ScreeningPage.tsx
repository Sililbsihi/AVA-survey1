'use client';

import { useState } from 'react';
import { useExperiment } from '@/contexts/ExperimentContext';

const questions = [
  { key: 'q1', text: '我愿意使用自动驾驶' },
  { key: 'q2', text: '我愿意和其他人一起使用自动驾驶的公共交通' },
  { key: 'q3', text: '如果有新技术，我会想尝试一下' },
  { key: 'q4', text: '在同龄人中，我通常是最先尝试新技术的人' },
  { key: 'q5', text: '此题选择"很不同意"', attention: true },
  { key: 'q6', text: '我非常了解自动驾驶汽车的功能和用途' },
  { key: 'q7', text: '相比于周围的人，我对自动驾驶技术有更多的了解' },
];

const scaleLabels = ['很不同意', '不同意', '中立', '同意', '很同意'];

export default function ScreeningPage() {
  const { setStep, experimentData, updateScreening } = useExperiment();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const screening = experimentData.screening;
  const currentQ = questions[currentQuestion];

  const handleSelect = (value: number) => {
    updateScreening({ [currentQ.key]: value });
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        window.scrollTo(0, 0);
      }, 150);
    } else {
      setTimeout(checkEligibility, 300);
    }
  };

  const checkEligibility = () => {
    const g1 = (screening.q1 ?? 0) + (screening.q2 ?? 0) + (screening.q3 ?? 0) + (screening.q4 ?? 0);
    const g2 = (screening.q6 ?? 0) + (screening.q7 ?? 0);
    const pass = g1 >= 8 && g1 <= 20 && g2 >= 4 && g2 <= 12 && screening.q5 === 1;
    setIsSubmitting(true);
    setTimeout(() => {
      setStep(pass ? 'basic-info' : 'disqualified');
      window.scrollTo(0, 0);
    }, 300);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="mobile-container">
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold text-white mb-2">筛选问卷</h1>
        <p className="text-sm text-slate-400">请根据您的真实想法作答</p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>第 {currentQuestion + 1} / {questions.length} 题</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-1.5">
          <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="glow-border bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 mb-6">
        <p className="text-lg text-center mb-8 leading-relaxed">{currentQ.text}</p>

        <div className="space-y-3">
          {scaleLabels.map((label, index) => {
            const value = index + 1;
            const isSelected = screening[currentQ.key as keyof typeof screening] === value;
            return (
              <button
                key={value}
                onClick={() => !isSubmitting && handleSelect(value)}
                disabled={isSubmitting}
                className={`w-full py-3.5 px-4 rounded-xl text-sm font-medium transition-all ${
                  isSelected ? 'bg-primary text-white shadow-lg' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="flex items-center justify-between">
                  <span>{label}</span>
                  {isSelected && <span>✓</span>}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
