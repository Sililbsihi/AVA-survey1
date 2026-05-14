'use client';

import { useEffect, useState } from 'react';
import { useExperiment } from '@/contexts/ExperimentContext';

export default function CompletePage() {
  const { experimentData: data } = (useExperiment() as any);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!submitted && !submitError) {
      fetch('/api/experiment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            setSubmitted(true);
          } else {
            setSubmitError(result.error || '提交失败');
          }
        })
        .catch(err => {
          setSubmitError(String(err));
        });
    }
  }, [submitted, submitError, data]);

  return (
    <div className="mobile-container" style={{ textAlign: 'center', paddingTop: '40px' }}>
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
      <h1 className="page-title">感谢参与！</h1>
      <p className="page-subtitle" style={{ fontSize: '16px', marginBottom: '30px' }}>
        请点击下方按钮领取被试费
      </p>

        <a
          href="https://www.credamo.com/s/ZNBJBj/"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button className="w-full game-button bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            被试费领取
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Button>
        </a>
        <p className="text-center text-amber-400 text-sm mt-3">点击填写信息，一周内发放</p>
    

      <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.8' }}>
          有疑问可联系主试<br />Wechat: CHEL_7777
        </p>
      </div>

      {submitError && (
        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(255,82,82,0.1)', borderRadius: '8px' }}>
          <p style={{ color: '#ff5252', fontSize: '12px' }}>提交出错：{submitError}</p>
        </div>
      )}
    </div>
  );
}
