'use client';

import { useState, useEffect, useMemo } from 'react';
import { useExperiment } from '@/contexts/ExperimentContext';

const SCENARIOS = [
  { id: 'A', image: '/scenario-low.jpg', label: '场景 A', correctAnswer: '20%' },
  { id: 'B', image: '/scenario-high.jpg', label: '场景 B', correctAnswer: '80%' },
];

export default function ScenarioPage() {
  const { setStep, updateData } = useExperiment();
  const [phase, setPhase] = useState<'viewing' | 'answering'>('viewing');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({
    decision: '',
    acceptSelf: undefined as number | undefined,
    acceptPublic: undefined as number | undefined,
    manipulationCheck: '',
  });

  const shuffled = useMemo(() => {
    const arr = [...SCENARIOS];
    if (Math.random() > 0.5) arr.reverse();
    return arr;
  }, []);

  useEffect(() => {
    updateData({ scenarioOrder: shuffled.map(s => s.id) });
  }, [shuffled, updateData]);

  useEffect(() => {
    setImageLoaded(false);
    const img = new Image();
    img.src = shuffled[currentIdx].image;
    img.onload = () => setImageLoaded(true);
    if (img.complete) setImageLoaded(true);
  }, [currentIdx, shuffled]);

  const current = shuffled[currentIdx];
  const isLast = currentIdx === shuffled.length - 1;

  const handleConfirmView = () => {
    setPhase('answering');
    setAnswers({ decision: '', acceptSelf: undefined, acceptPublic: undefined, manipulationCheck: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const canSubmit = answers.decision && answers.acceptSelf && answers.acceptPublic && answers.manipulationCheck;

  const handleSubmit = async () => {
    if (!canSubmit) { setError('请回答所有问题'); return; }
    setIsSubmitting(true);

    const scenarioKey = current.id === 'A' ? 'scenarioA' : 'scenarioB';
    updateData({
      [scenarioKey]: {
        decision: answers.decision,
        acceptSelf: answers.acceptSelf,
        acceptPublic: answers.acceptPublic,
        manipulationCheck: answers.manipulationCheck,
      },
    });

    if (isLast) {
      setTimeout(() => setStep(4), 300);
    } else {
      setTimeout(() => {
        setCurrentIdx(prev => prev + 1);
        setPhase('viewing');
        setIsSubmitting(false);
      }, 300);
    }
  };

  return (
    <div className="mobile-container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${60 + (currentIdx + 1) * 10}%` }} />
      </div>

      <h1 className="page-title">{current.label}</h1>
      <p className="page-subtitle">情境 {currentIdx + 1} / {shuffled.length}</p>

      {phase === 'viewing' ? (
        <>
          <div className="image-container">
            {!imageLoaded && (
              <div className="image-loading">
                <span className="loading-spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
              </div>
            )}
            <img
              src={current.image}
              alt={current.label}
              className="scenario-image"
              style={{ opacity: imageLoaded ? 1 : 0.3 }}
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          <button className="submit-button" onClick={handleConfirmView} disabled={!imageLoaded}>
            我已仔细阅读，开始作答
          </button>
        </>
      ) : (
        <>
          <div className="question-card">
            <div className="question-title">在该情境下，您是否愿意切换至自动驾驶模式？<span className="required">*</span></div>
            <div className="radio-group">
              {['是', '否'].map(opt => (
                <div key={opt} className={`radio-option ${answers.decision === opt ? 'selected' : ''}`} onClick={() => { setAnswers(p => ({ ...p, decision: opt })); setError(''); }}>
                  <div className="radio-circle" /><span className="radio-label">{opt}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="question-card">
            <div className="question-title">在该情境下，你是否愿意使用自动驾驶汽车？<span className="required">*</span></div>
            <div className="rating-container">
              <span className="rating-label">完全不愿意</span>
              {[1, 2, 3, 4, 5].map(v => (
                <div key={v} className="rating-option">
                  <button className={`rating-button ${answers.acceptSelf === v ? 'selected' : ''}`} onClick={() => { setAnswers(p => ({ ...p, acceptSelf: v })); setError(''); }}>{v}</button>
                </div>
              ))}
              <span className="rating-label">完全愿意</span>
            </div>
          </div>

          <div className="question-card">
            <div className="question-title">在该情境下，你是否愿意与其他人一起乘坐自动驾驶的公共交通？<span className="required">*</span></div>
            <div className="rating-container">
              <span className="rating-label">完全不愿意</span>
              {[1, 2, 3, 4, 5].map(v => (
                <div key={v} className="rating-option">
                  <button className={`rating-button ${answers.acceptPublic === v ? 'selected' : ''}`} onClick={() => { setAnswers(p => ({ ...p, acceptPublic: v })); setError(''); }}>{v}</button>
                </div>
              ))}
              <span className="rating-label">完全愿意</span>
            </div>
          </div>

          <div className="question-card">
            <div className="question-title">请回忆刚才图片中，道路上自动驾驶汽车的比例是多少？<span className="required">*</span></div>
            <div className="radio-group">
              {['20%', '50%', '80%'].map(opt => (
                <div key={opt} className={`radio-option ${answers.manipulationCheck === opt ? 'selected' : ''}`} onClick={() => { setAnswers(p => ({ ...p, manipulationCheck: opt })); setError(''); }}>
                  <div className="radio-circle" /><span className="radio-label">{opt}</span>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="warning-box">
              <p className="warning-text" style={{ color: '#ff5252' }}>{error}</p>
            </div>
          )}

          <button className="submit-button" onClick={handleSubmit} disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? <><span className="loading-spinner" />提交中...</> : (isLast ? '完成实验' : '下一个情境')}
          </button>
        </>
      )}
    </div>
  );
}
