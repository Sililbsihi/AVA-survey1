'use client';

import { useState } from 'react';
import { useExperiment } from '@/contexts/ExperimentContext';

const questions = [
  { id: 'q1', text: '我愿意使用自动驾驶' },
  { id: 'q2', text: '我愿意和其他人一起使用自动驾驶的公共交通' },
  { id: 'q3', text: '如果有新技术，我会想尝试一下' },
  { id: 'q4', text: '在同龄人中，我通常是最先尝试新技术的人' },
  { id: 'q5', text: '此题请选择"很同意"' },
  { id: 'q6', text: '我非常了解自动驾驶汽车的功能和用途' },
  { id: 'q7', text: '相比于周围的人，我对自动驾驶技术有更多的了解' },
];

export default function ScreeningPage() {
  const { setStep, updateData, data } = useExperiment();
  const [answers, setAnswers] = useState<Record<string, number | undefined>>({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setError('');
  };

  const canSubmit = questions.every(q => answers[q.id] !== undefined);

  const handleSubmit = async () => {
    if (!canSubmit) {
      setError('请回答所有问题');
      return;
    }

    // 检查Q5必须是1
    if (answers.q5 !== 1) {
      setError('抱歉，您不符合本次实验要求');
      setIsSubmitting(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      return;
    }

    // 检查Q1-Q2平均分
    const avg12 = ((answers.q1 || 0) + (answers.q2 || 0)) / 2;
    if (avg12 < 2 || avg12 > 4) {
      setError('抱歉，您不符合本次实验要求');
      setIsSubmitting(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      return;
    }

    // 检查Q3-Q4平均分
    const avg34 = ((answers.q3 || 0) + (answers.q4 || 0)) / 2;
    if (avg34 < 2 || avg34 > 4) {
      setError('抱歉，您不符合本次实验要求');
      setIsSubmitting(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      return;
    }

    // 检查Q6-Q7平均分
    const avg67 = ((answers.q6 || 0) + (answers.q7 || 0)) / 2;
    if (avg67 < 2 || avg67 > 4) {
      setError('抱歉，您不符合本次实验要求');
      setIsSubmitting(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      return;
    }

    setIsSubmitting(true);
    updateData({
      q1: answers.q1,
      q2: answers.q2,
      q3: answers.q3,
      q4: answers.q4,
      q5: answers.q5,
      q6: answers.q6,
      q7: answers.q7,
    });
    setTimeout(() => setStep(1), 300);
  };

  return (
    <div className="mobile-container">
      <div className="progress-bar"><div className="progress-fill" style={{ width: '10%' }} /></div>
      <h1 className="page-title">筛选问卷</h1>
      <p className="page-subtitle">请根据您的真实想法作答</p>

      {questions.map((q, qIndex) => (
        <div key={q.id} className="question-card">
          <div className="question-title">
            {qIndex + 1}. {q.text}
            <span className="required">*</span>
          </div>
          <div className="rating-container">
            <span className="rating-label">很不同意</span>
            {[1, 2, 3, 4, 5].map(value => (
              <div key={value} className="rating-option">
                <button
                  className={`rating-button ${answers[q.id] === value ? 'selected' : ''}`}
                  onClick={() => handleSelect(q.id, value)}
                >
                  {value}
                </button>
              </div>
            ))}
            <span className="rating-label">很同意</span>
          </div>
        </div>
      ))}

      {error && (
        <div className="warning-box" style={{ background: 'rgba(255, 82, 82, 0.1)', borderColor: 'rgba(255, 82, 82, 0.3)' }}>
          <p style={{ color: '#ff5252', textAlign: 'center' }}>{error}</p>
        </div>
      )}

      <button
        className="submit-button"
        onClick={handleSubmit}
        disabled={!canSubmit || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="loading-spinner" />
            提交中...
          </>
        ) : '提交'}
      </button>
    </div>
  );
}
