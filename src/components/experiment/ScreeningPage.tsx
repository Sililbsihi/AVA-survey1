'use client';

import { useState } from 'react';
import { useExperiment } from '@/contexts/ExperimentContext';
import { Button } from '@/components/ui/button';

const questions = [
  {
    key: 'q1',
    text: '自动驾驶技术会让驾驶变得更加安全',
    group: 1,
  },
  {
    key: 'q2',
    text: '我相信自动驾驶技术是可靠的',
    group: 1,
  },
  {
    key: 'q3',
    text: '自动驾驶技术会让出行更加便捷',
    group: 1,
  },
  {
    key: 'q4',
    text: '自动驾驶技术会让交通更加有序',
    group: 1,
  },
  {
    key: 'q5',
    text: '此题请选择"很不同意"',
    group: 2,
  },
  {
    key: 'q6',
    text: '我对新技术持开放态度',
    group: 2,
  },
  {
    key: 'q7',
    text: '我愿意尝试新事物',
    group: 2,
  },
];

const scaleLabels = ['很不同意', '不同意', '中立', '同意', '很同意'];

export default function ScreeningPage() {
  const { step, setStep, experimentData, updateScreening } = useExperiment();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const screening = experimentData.screening;
  const currentQ = questions[currentQuestion];
  const groupLabels = ['自动驾驶技术接受度', '注意力检查'];

  const handleSelect = (value: number) => {
    updateScreening({ [currentQ.key]: value });
    setError('');
    window.scrollTo(0, 0);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 150);
    } else {
      checkEligibility();
    }
  };

  const checkEligibility = () => {
    const g1Avg = (screening.q1 ?? 0) + (screening.q2 ?? 0) + (screening.q3 ?? 0) + (screening.q4 ?? 0);
    const g2Avg = (screening.q6 ?? 0) + (screening.q7 ?? 0);
    const pass =
      g1Avg >= 8 && g1Avg <= 20 &&
      g2Avg >= 4 && g2Avg <= 12 &&
      screening.q5 === 1;

    setIsSubmitting(true);
    setTimeout(() => {
      if (pass) {
        setStep('basic-info');
      } else {
        setStep('disqualified');
      }
      setIsSubmitting(false);
      window.scrollTo(0, 0);
    }, 500);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentGroupIndex = currentQ.group - 1;

  return (
    <div className="mobile-container">
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold text-white mb-2">筛选问卷</h1>
        <p className="text-sm text-slate-400">请根据您的真实想法作答</p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>第 {currentQuestion + 1} / {questions.length} 题</span>
          <span>{groupLabels[currentGroupIndex]}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-1.5">
          <div
            className="bg-primary h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="glow-border bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 mb-6">
        <p className="text-lg text-center mb-8 leading-relaxed">
          {currentQ.text}
        </p>

        <div className="space-y-3">
          {scaleLabels.map((label, index) => {
            const value = index + 1;
            const isSelected = screening[currentQ.key as keyof typeof screening] === value;

            return (
              <button
                key={value}
                onClick={() => handleSelect(value)}
                disabled={isSubmitting}
                className={`w-full py-3.5 px-4 rounded-xl text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-[1.02]'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 active:scale-[0.98]'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="flex items-center justify-between">
                  <span>{label}</span>
                  {isSelected && <span className="text-xs opacity-70">✓</span>}
                </span>
              </button>
            );
          })}
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center mt-4">{error}</p>
        )}
      </div>
    </div>
  );
}
