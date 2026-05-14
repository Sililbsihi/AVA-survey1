'use client';

import { useState, useEffect } from 'react';
import { useExperiment } from '@/contexts/ExperimentContext';
import Progress from '@/components/ui/progress';

const questions = [
  { id: 'q1', text: '1. 我愿意使用自动驾驶' },
  { id: 'q2', text: '2. 我愿意和其他人一起使用自动驾驶的公共交通' },
  { id: 'q3', text: '3. 如果有新技术，我会想尝试一下' },
  { id: 'q4', text: '4. 在同龄人中，我通常是最先尝试新技术的人' },
  { id: 'q5', text: '5. 此题选择"很不同意"' },
  { id: 'q6', text: '6. 我非常了解自动驾驶汽车的功能和用途' },
  { id: 'q7', text: '7. 相比于周围的人，我对自动驾驶技术有更多的了解' },
];

export default function ScreeningPage() {
  const { updateScreening, setStep } = useExperiment();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [error, setError] = useState('');

  const handleSelect = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setError('');
  };

  const handleSubmit = () => {
    // 验证所有题目是否已回答
    for (const q of questions) {
      if (answers[q.id] === undefined) {
        setError('请回答所有题目');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    // 更新 Context
    updateScreening(answers);

    // 筛选条件判断
    const q1 = answers.q1 || 0;
    const q2 = answers.q2 || 0;
    const q3 = answers.q3 || 0;
    const q4 = answers.q4 || 0;
    const q5 = answers.q5 || 0;
    const q6 = answers.q6 || 0;
    const q7 = answers.q7 || 0;

    // 条件1: Q1-Q2平均分在2-4分
    const avg12 = (q1 + q2) / 2;
    // 条件2: Q3-Q4平均分在2-4分
    const avg34 = (q3 + q4) / 2;
    // 条件3: Q6-Q7平均分在2-4分
    const avg67 = (q6 + q7) / 2;
    // 条件4: Q5必须选择1
    const q5Correct = q5 === 1;

    if (avg12 >= 2 && avg12 <= 4 && avg34 >= 2 && avg34 <= 4 && avg67 >= 2 && avg67 <= 4 && q5Correct) {
      setStep('basicInfo');
    } else {
      setStep('disqualified');
    }
  };

  const progress = (Object.keys(answers).length / questions.length) * 100;

  return (
    <div className="mobile-container">
      <div className="nav-header sticky top-0 z-10 py-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-400 text-sm">自动驾驶接受度研究</span>
          <span className="text-primary font-medium text-sm">筛选问卷</span>
        </div>
        <Progress value={progress} />
      </div>

      <div className="mb-4">
        <span className="tag">筛选问卷</span>
      </div>

      <div className="card-glow p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-2">欢迎参与实验</h2>
        <p className="text-slate-400 text-sm mb-6">请仔细阅读并回答以下问题</p>

        {questions.map((q, qIndex) => (
          <div key={q.id} className="mb-6 last:mb-0">
            <p className="text-slate-200 mb-3 text-sm leading-relaxed">{q.text}</p>
            <div className="flex justify-between items-center gap-1">
              <span className="text-slate-500 text-xs">很不同意</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(val => (
                  <button
                    key={val}
                    onClick={() => handleSelect(q.id, val)}
                    className={`num-btn ${answers[q.id] === val ? 'selected' : ''}`}
                  >
                    {val}
                  </button>
                ))}
              </div>
              <span className="text-slate-500 text-xs">很同意</span>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm text-center">{error}</p>
        </div>
      )}

      <button onClick={handleSubmit} className="btn-primary">
        提交答案
      </button>
    </div>
  );
}
