'use client';

import { useEffect, useState } from 'react';
import { useExperiment } from '@/contexts/ExperimentContext';

export default function CompletePage() {
  const { data } = useExperiment();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!submitted) {
      submitData();
    }
  }, []);

  const submitData = async () => {
    try {
      const res = await fetch('/api/experiment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        setSubmitted(true);
      } else {
        setSubmitError(result.detail || result.error || '提交失败');
      }
    } catch (err) {
      setSubmitError('网络错误：' + String(err));
    }
  };

  return (
    <div className="mobile-container" style={{ textAlign: 'center', paddingTop: '40px' }}>
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
      <h1 className="page-title">感谢参与！</h1>
      <p className="page-subtitle" style={{ fontSize: '16px', marginBottom: '30px' }}>
        请点击下方按钮领取被试费
      </p>

      <a
        href="https://www.credamo.com/s/ZNBJBj"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <button className="submit-button" style={{ marginBottom: '24px' }}>
          被试费领取
        </button>
      </a>

      <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.8' }}>
          有疑问可联系主试<br />
          Wechat: CHEL_7777
        </p>
      </div>

      {submitError && (
        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(255,82,82,0.1)', borderRadius: '8px' }}>
          <p style={{ color: '#ff5252', fontSize: '12px' }}>{submitError}</p>
        </div>
      )}
    </div>
  );
}
