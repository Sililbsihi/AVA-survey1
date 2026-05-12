'use client';

import { useState } from 'react';
import { useExperiment } from '@/contexts/ExperimentContext';

const basicQuestions = [
  { id: 'name', type: 'input', label: '真实姓名', placeholder: '请输入您的真实姓名' },
  { id: 'gender', type: 'radio', label: '性别', options: ['女', '男'] },
  { id: 'age', type: 'input', label: '年龄', placeholder: '请输入您的年龄', inputMode: 'numeric' },
  { id: 'phone', type: 'input', label: '手机号', placeholder: '请输入您的手机号', inputMode: 'numeric' },
  { id: 'education', type: 'select', label: '受教育程度', options: ['初中及以下', '高中/中专', '大专', '本科', '硕士', '博士及以上'] },
  { id: 'hasLicense', type: 'radio', label: '有无驾照', options: ['有', '无'] },
  { id: 'drivingYears', type: 'input', label: '驾龄（年）', placeholder: '请输入您的驾龄', inputMode: 'numeric', condition: { questionId: 'hasLicense', value: '有' } },
  { id: 'drivingKm', type: 'input', label: '驾驶里程（km）', placeholder: '请输入您的驾驶里程', inputMode: 'numeric', condition: { questionId: 'hasLicense', value: '有' } },
  { id: 'hasAssistDrive', type: 'radio', label: '有无辅助驾驶经验（自适应巡航、车道保持、自动泊车、自动紧急制动等）', options: ['有', '无'], condition: { questionId: 'hasLicense', value: '有' } },
];

const socialQuestions = [
  { id: 'q9', text: '我很少购买最新的产品，除非我的朋友们都认可它们' },
  { id: 'q10', text: '如果我对某产品缺乏经验，我经常会向朋友询问该产品的情况' },
  { id: 'q11', text: '通过购买其他人购买的相同品牌和产品，我可以获得归属感' },
  { id: 'q12', text: '为了确保买到合适的产品或品牌，我经常观察别人在买什么、用什么' },
  { id: 'q13', text: '我的家人或朋友推荐我使用自动驾驶技术' },
  { id: 'q14', text: '我的同事或领导推荐我使用自动驾驶技术' },
  { id: 'q15', text: '我喜欢的明星推荐我使用自动驾驶技术' },
  { id: 'q16', text: '政府出台的相关政策引导我使用自动驾驶技术' },
  { id: 'q17', text: '此题请选择"很同意"' },
];

export default function BasicInfoPage() {
  const { setStep, updateData, data } = useExperiment();
  const [answers, setAnswers] = useState<Record<string, string | number | undefined>>({});
  const [currentSection, setCurrentSection] = useState<'basic' | 'social'>('basic');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBasicInput = (id: string, value: string) => {
    const processedValue = id === 'phone' || id === 'age' ? value.replace(/\D/g, '') : value;
    setAnswers(prev => ({ ...prev, [id]: processedValue }));
    setError('');
  };

  const handleRadio = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
    setError('');
  };

  const handleSocialSelect = (id: string, value: number) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
    setError('');
  };

  const canSubmitBasic = basicQuestions.every(q => {
    if (q.condition && answers[q.condition.questionId] !== q.condition.value) return true;
    return answers[q.id] !== undefined;
  });

  const socialAnswered = socialQuestions.filter(q => answers[q.id] !== undefined).length;

  const handleBasicSubmit = () => {
    const unanswered = basicQuestions.filter(q => {
      if (q.condition && answers[q.condition.questionId] !== q.condition.value) return false;
      return answers[q.id] === undefined;
    });
    if (unanswered.length > 0) {
      setError('请回答所有问题');
      return;
    }
    setCurrentSection('social');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSocialSubmit = () => {
    const unanswered = socialQuestions.filter(q => answers[q.id] === undefined);
    if (unanswered.length > 0) {
      setError('请回答所有问题');
      return;
    }
    // 检查注意力题q17必须是5
    if (answers.q17 !== 5) {
      setError('抱歉，您的答卷未通过注意力检测');
      setIsSubmitting(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      return;
    }
    setIsSubmitting(true);
    updateData({
      name: answers.name as string,
      gender: answers.gender as string,
      age: answers.age as string,
      phone: answers.phone as string,
      education: answers.education as string,
      hasLicense: answers.hasLicense as string,
      drivingYears: answers.drivingYears as string,
      drivingKm: answers.drivingKm as string,
      hasAssistDrive: answers.hasAssistDrive as string,
      q9: answers.q9 as number,
      q10: answers.q10 as number,
      q11: answers.q11 as number,
      q12: answers.q12 as number,
      q13: answers.q13 as number,
      q14: answers.q14 as number,
      q15: answers.q15 as number,
      q16: answers.q16 as number,
      q17: answers.q17 as number,
    });
    setTimeout(() => setStep(2), 300);
  };

  return (
    <div className="mobile-container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: currentSection === 'basic' ? '25%' : '50%' }} />
      </div>
      <div className="breadcrumb">
        基本信息
        <span className="breadcrumb-separator">›</span>
        <span>{currentSection === 'basic' ? '基本信息' : '第一部分'}</span>
      </div>

      {currentSection === 'basic' ? (
        <>
          <h1 className="page-title">基本信息</h1>
          <p className="page-subtitle">请填写真实信息</p>

          {basicQuestions.map(q => {
            if (q.condition && answers[q.condition.questionId] !== q.condition.value) return null;
            return (
              <div key={q.id} className="question-card">
                <div className="question-title">
                  {q.label}
                  {q.type !== 'radio' && <span className="required">*</span>}
                </div>
                {q.type === 'input' && (
                  <input
                    type="text"
                    className="input-field"
                    placeholder={q.placeholder}
                    value={(answers[q.id] as string) || ''}
                    onChange={e => handleBasicInput(q.id, e.target.value)}
                    inputMode={q.inputMode as any}
                  />
                )}
                {q.type === 'select' && (
                  <select
                    className="select-field"
                    value={(answers[q.id] as string) || ''}
                    onChange={e => handleBasicInput(q.id, e.target.value)}
                  >
                    <option value="">请选择</option>
                    {q.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}
                {q.type === 'radio' && (
                  <div className="radio-group">
                    {q.options?.map(opt => (
                      <div
                        key={opt}
                        className={`radio-option ${answers[q.id] === opt ? 'selected' : ''}`}
                        onClick={() => handleRadio(q.id, opt)}
                      >
                        <div className="radio-circle" />
                        <span className="radio-label">{opt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {error && (
            <div className="warning-box">
              <p className="warning-text" style={{ color: '#ff5252' }}>{error}</p>
            </div>
          )}

          <button className="submit-button" onClick={handleBasicSubmit} disabled={!canSubmitBasic}>
            下一步
          </button>
        </>
      ) : (
        <>
          <h1 className="page-title">第一部分</h1>
          <p className="page-subtitle">已完成 {socialAnswered}/{socialQuestions.length} 题</p>

          {socialQuestions.map((q, idx) => (
            <div key={q.id} className="question-card">
              <div className="question-title">
                {idx + 1}. {q.text}
                <span className="required">*</span>
              </div>
              <div className="rating-container">
                <span className="rating-label">很不同意</span>
                {[1, 2, 3, 4, 5, 6, 7].map(value => (
                  <div key={value} className="rating-option">
                    <button
                      className={`rating-button ${answers[q.id] === value ? 'selected' : ''}`}
                      onClick={() => handleSocialSelect(q.id, value)}
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
            <div className="warning-box">
              <p className="warning-text" style={{ color: '#ff5252' }}>{error}</p>
            </div>
          )}

          <button className="submit-button" onClick={handleSocialSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <><span className="loading-spinner" />提交中...</>
            ) : '下一步'}
          </button>
        </>
      )}
    </div>
  );
}
