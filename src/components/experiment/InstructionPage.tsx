'use client';

import { useState } from 'react';
import { useExperiment } from '@/contexts/ExperimentContext';

export default function InstructionPage() {
  const { setStep } = useExperiment();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStart = () => {
    setIsSubmitting(true);
    setTimeout(() => setStep(3), 300);
  };

  return (
    <div className="mobile-container">
      <div className="progress-bar"><div className="progress-fill" style={{ width: '60%' }} /></div>
      <h1 className="page-title">实验即将开始</h1>
      <p className="page-subtitle">请仔细阅读以下说明</p>

      <div className="question-card">
        <div className="question-title" style={{ textAlign: 'center', fontSize: '15px', lineHeight: '1.8' }}>
          接下来的实验中，请您设想自己正处于图片所描述的真实驾驶场景中，并根据您的真实感受作答。
        </div>
      </div>

      <div className="warning-box">
        <p className="warning-text">
          ⚠️ 若未认真阅读图片导致回答错误，只能获得部分被试费。
        </p>
      </div>

      <button className="submit-button" onClick={handleStart} disabled={isSubmitting}>
        {isSubmitting ? '加载中...' : '我已了解，开始实验'}
      </button>
    </div>
  );
}
