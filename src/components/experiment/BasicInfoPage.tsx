'use client';

import { useState } from 'react';
import { useExperiment } from '@/contexts/ExperimentContext';
import Progress from '@/components/ui/progress';

const socialQuestions = [
  { id: 'q9', text: '9. 我很少购买最新的产品，除非我的朋友们都认可它们' },
  { id: 'q10', text: '10. 如果我对某产品缺乏经验，我经常会向朋友询问该产品的情况' },
  { id: 'q11', text: '11. 通过购买其他人购买的相同品牌和产品，我可以获得归属感' },
  { id: 'q12', text: '12. 为了确保买到合适的产品或品牌，我经常观察别人在买什么、用什么' },
  { id: 'q13', text: '13. 我的家人或朋友推荐我使用自动驾驶技术' },
  { id: 'q14', text: '14. 我的同事或领导推荐我使用自动驾驶技术' },
  { id: 'q15', text: '15. 我喜欢的明星推荐我使用自动驾驶技术' },
  { id: 'q16', text: '16. 政府出台的相关政策引导我使用自动驾驶技术' },
  { id: 'attentionCheck', text: '17. 此题请选择"很同意"' },
];

export default function BasicInfoPage({ variant = 'info' }: { variant?: string }) {
  const { experimentData, updateBasicInfo, updateSocialInfluence, setStep } = useExperiment();
  const [step, setLocalStep] = useState<'info' | 'social'>(variant === 'socialInfluence' ? 'social' : 'info');
  const [formData, setFormData] = useState({
    name: experimentData.basicInfo.name || '',
    gender: experimentData.basicInfo.gender || '',
    age: experimentData.basicInfo.age || '',
    education: experimentData.basicInfo.education || '',
    hasLicense: experimentData.basicInfo.hasLicense || '',
    drivingYears: experimentData.basicInfo.drivingYears || '',
    drivingMileage: experimentData.basicInfo.drivingMileage || '',
    hasAssistDriving: experimentData.basicInfo.hasAssistDriving || '',
  });
  const [socialAnswers, setSocialAnswers] = useState<Record<string, number>>({});
  const [error, setError] = useState('');

  const validateInfo = () => {
    if (!formData.name.trim()) return '请填写姓名';
    if (!formData.gender) return '请选择性别';
    if (!formData.age.trim()) return '请填写年龄';
    if (!formData.education) return '请选择受教育程度';
    if (!formData.hasLicense) return '请选择是否有驾照';
    if (formData.hasLicense === '有') {
      if (!formData.drivingYears.trim()) return '请填写驾龄';
      if (!formData.drivingMileage.trim()) return '请填写驾驶里程';
      if (!formData.hasAssistDriving) return '请选择是否有辅助驾驶经验';
    }
    return null;
  };

  const handleNext = () => {
    const validationError = validateInfo();
    if (validationError) {
      setError(validationError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    updateBasicInfo(formData);
    setLocalStep('social');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSocialSubmit = () => {
    for (const q of socialQuestions) {
      if (socialAnswers[q.id] === undefined) {
        setError('请回答所有题目');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }
    updateSocialInfluence(socialAnswers);
    setStep('instruction');
  };

  const handleSocialSelect = (questionId: string, value: number) => {
    setSocialAnswers(prev => ({ ...prev, [questionId]: value }));
    setError('');
  };

  if (step === 'social') {
    const progress = (Object.keys(socialAnswers).length / socialQuestions.length) * 100;
    return (
      <div className="mobile-container">
        <div className="nav-header sticky top-0 z-10 py-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/60 text-sm">自动驾驶接受度研究</span>
            <span className="text-blue-400 font-medium text-sm">社会影响量表</span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="mb-4">
          <span className="tag">社会影响量表</span>
        </div>

        <div className="glass-card p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-6">第二部分：社会影响</h2>

          {socialQuestions.map((q) => (
            <div key={q.id} className="mb-6 last:mb-0">
              <p className="text-white/90 mb-3 text-sm leading-relaxed">{q.text}</p>
              <div className="flex justify-between items-center gap-1">
                <span className="text-white/40 text-xs">很不同意</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map(val => (
                    <button
                      key={val}
                      onClick={() => handleSocialSelect(q.id, val)}
                      className={`num-btn ${socialAnswers[q.id] === val ? 'selected' : ''}`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <span className="text-white/40 text-xs">很同意</span>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl">
            <p className="text-red-300 text-sm text-center">{error}</p>
          </div>
        )}

        <button onClick={handleSocialSubmit} className="btn-primary ripple">
          进入情境实验
        </button>
      </div>
    );
  }

  return (
    <div className="mobile-container">
      <div className="nav-header sticky top-0 z-10 py-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/60 text-sm">自动驾驶接受度研究</span>
          <span className="text-blue-400 font-medium text-sm">基本信息</span>
        </div>
        <Progress value={30} />
      </div>

      <div className="mb-4">
        <span className="tag">基本信息</span>
      </div>

      <div className="glass-card p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-6">第一部分：基本信息</h2>

        <div className="space-y-4">
          <div>
            <label className="text-white/80 text-sm mb-2 block">1. 姓名 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="input-field"
              placeholder="请输入姓名"
            />
          </div>

          <div>
            <label className="text-white/80 text-sm mb-2 block">2. 性别 *</label>
            <div className="flex gap-4">
              <button
                onClick={() => setFormData(prev => ({ ...prev, gender: '女' }))}
                className={`option-btn ${formData.gender === '女' ? 'selected' : ''}`}
              >
                女
              </button>
              <button
                onClick={() => setFormData(prev => ({ ...prev, gender: '男' }))}
                className={`option-btn ${formData.gender === '男' ? 'selected' : ''}`}
              >
                男
              </button>
            </div>
          </div>

          <div>
            <label className="text-white/80 text-sm mb-2 block">3. 年龄 *</label>
            <input
              type="text"
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              className="input-field"
              placeholder="请输入年龄"
            />
          </div>

          <div>
            <label className="text-white/80 text-sm mb-2 block">4. 受教育程度 *</label>
            <div className="space-y-2">
              {['初中及以下', '高中/中专', '大专', '本科', '硕士', '博士及以上'].map(opt => (
                <button
                  key={opt}
                  onClick={() => setFormData(prev => ({ ...prev, education: opt }))}
                  className={`option-btn w-full text-left ${formData.education === opt ? 'selected' : ''}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-white/80 text-sm mb-2 block">5. 有无驾照 *</label>
            <div className="flex gap-4">
              <button
                onClick={() => setFormData(prev => ({ ...prev, hasLicense: '有' }))}
                className={`option-btn ${formData.hasLicense === '有' ? 'selected' : ''}`}
              >
                有
              </button>
              <button
                onClick={() => setFormData(prev => ({ ...prev, hasLicense: '无', drivingYears: '', drivingMileage: '', hasAssistDriving: '' }))}
                className={`option-btn ${formData.hasLicense === '无' ? 'selected' : ''}`}
              >
                无
              </button>
            </div>
          </div>

          {formData.hasLicense === '有' && (
            <>
              <div>
                <label className="text-white/80 text-sm mb-2 block">6. 驾龄（年） *</label>
                <input
                  type="text"
                  value={formData.drivingYears}
                  onChange={(e) => setFormData(prev => ({ ...prev, drivingYears: e.target.value }))}
                  className="input-field"
                  placeholder="请输入驾龄"
                />
              </div>

              <div>
                <label className="text-white/80 text-sm mb-2 block">7. 驾驶里程（km） *</label>
                <input
                  type="text"
                  value={formData.drivingMileage}
                  onChange={(e) => setFormData(prev => ({ ...prev, drivingMileage: e.target.value }))}
                  className="input-field"
                  placeholder="请输入驾驶里程"
                />
              </div>

              <div>
                <label className="text-white/80 text-sm mb-2 block">8. 有无辅助驾驶经验 *</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, hasAssistDriving: '有' }))}
                    className={`option-btn ${formData.hasAssistDriving === '有' ? 'selected' : ''}`}
                  >
                    有
                  </button>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, hasAssistDriving: '无' }))}
                    className={`option-btn ${formData.hasAssistDriving === '无' ? 'selected' : ''}`}
                  >
                    无
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl">
          <p className="text-red-300 text-sm text-center">{error}</p>
        </div>
      )}

      <button onClick={handleNext} className="btn-primary ripple">
        下一题
      </button>
    </div>
  );
}
