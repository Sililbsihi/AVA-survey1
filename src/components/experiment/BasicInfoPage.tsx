'use client';

import { useState, useRef } from 'react';
import { useExperiment } from '@/contexts/ExperimentContext';
import Progress from '@/components/ui/progress';

const socialQuestions = [
  { id: 'q9', text: '我很少购买最新的产品，除非我的朋友们都认可它们' },
  { id: 'q10', text: '如果我对某产品缺乏经验，我经常会向朋友询问该产品的情况' },
  { id: 'q11', text: '通过购买其他人购买的相同品牌和产品，我可以获得归属感' },
  { id: 'q12', text: '为了确保买到合适的产品或品牌，我经常观察别人在买什么、用什么' },
  { id: 'q13', text: '我的家人或朋友推荐我使用自动驾驶技术' },
  { id: 'q14', text: '我的同事或领导推荐我使用自动驾驶技术' },
  { id: 'q15', text: '我喜欢的明星推荐我使用自动驾驶技术' },
  { id: 'q16', text: '政府出台的相关政策引导我使用自动驾驶技术' },
  { id: 'attentionCheck', text: '此题请选择"很同意"' },
];

const educationOptions = ['初中及以下', '高中/中专', '大专', '本科', '硕士', '博士及以上'];

// 果汁溅开效果
const useRipple = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleRipple = (e: React.MouseEvent<HTMLElement>) => {
    const x = e.clientX;
    const y = e.clientY;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    
    const randomAngles = Array.from({ length: 6 }, (_, i) => (Math.PI * 2 / 6) * i + Math.random() * 0.5);
    const randomDistances = Array.from({ length: 6 }, () => 20 + Math.random() * 15);
    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('span');
      particle.className = 'particle';
      const angle = randomAngles[i];
      const distance = randomDistances[i];
      particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
      particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.position = 'fixed';
      particle.style.background = ['#f472b6', '#a78bfa', '#60a5fa', '#34d399'][i % 4];
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 700);
    }
  };
  
  return { containerRef, handleRipple };
};

export default function BasicInfoPage({ variant = 'info' }: { variant?: string }) {
  const { experimentData, updateBasicInfo, updateSocialInfluence, setStep } = useExperiment();
  const [step, setLocalStep] = useState<'info' | 'social'>(variant === 'socialInfluence' ? 'social' : 'info');
  const { containerRef, handleRipple } = useRipple();
  const [formData, setFormData] = useState({
    name: experimentData.basicInfo.name || '',
    gender: experimentData.basicInfo.gender || '',
    phone: experimentData.basicInfo.phone || '',
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
    if (!formData.name.trim()) return '请填写真实姓名(用于被试费发放)';
    if (!formData.gender) return '请选择性别';
    if (!formData.phone.trim()) return '请填写手机号';
    if (!/^1[3-9]\d{9}$/.test(formData.phone.trim())) return '请输入正确的手机号';
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

  // 社会影响量表页面
  if (step === 'social') {
    const progress = (Object.keys(socialAnswers).length / socialQuestions.length) * 100;
    return (
      <div className="mobile-container" ref={containerRef}>
        <div className="stars-bg" />
        
        <div className="nav-header">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/50 text-xs tracking-wide">自动驾驶接受度研究</span>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30">
              第二部分
            </span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="text-center pt-6 pb-4">
          <p className="text-white/40 text-xs">请根据您的实际情况选择</p>
        </div>

        <div className="flex-1 space-y-3">
          {socialQuestions.map((q, index) => (
            <div key={q.id} className="question-card">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-xs text-indigo-300 font-medium">
                  {index + 9}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white/90 text-sm leading-relaxed mb-3">{q.text}</p>
                  
                  {/* 7选项 - 居中显示，标签在下方 */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-center gap-1">
                      {[1, 2, 3, 4, 5, 6, 7].map(val => (
                        <button
                          key={val}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRipple(e);
                            handleSocialSelect(q.id, val);
                          }}
                          className={`num-option-compact ${socialAnswers[q.id] === val ? 'selected' : ''}`}
                        >
                          <span style={{ position: 'relative', zIndex: 2 }}>{val}</span>
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between px-1">
                      <span className="text-white/30 text-xs">很不同意</span>
                      <span className="text-white/30 text-xs">很同意</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {error && <div className="error-text mt-4">{error}</div>}

        <div className="pt-4 pb-8">
          <button onClick={(e) => { handleRipple(e); handleSocialSubmit(); }} className="btn-glow">
            <span>进入情境实验</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // 基本信息页面
  return (
    <div className="mobile-container" ref={containerRef}>
      <div className="stars-bg" />
      
      <div className="nav-header">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/50 text-xs tracking-wide">自动驾驶接受度研究</span>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            基本信息
          </span>
        </div>
        <Progress value={30} />
      </div>

      <div className="text-center pt-6 pb-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 mb-3">
          <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-white mb-1">基本信息</h1>
        <p className="text-white/40 text-xs">请提供您的基本信息</p>
      </div>

      <div className="flex-1 space-y-4">
        {/* 姓名 */}
        <div className="question-card">
          <span className="question-label">1. 真实姓名</span>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="input-glow"
            placeholder="请输入真实姓名"
          />
        </div>

        {/* 性别 */}
        <div className="question-card">
          <span className="question-label">2. 性别</span>
          <div className="flex gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); handleRipple(e); setFormData(prev => ({ ...prev, gender: '女' })); }}
              className={`option-btn flex-1 ${formData.gender === '女' ? 'selected' : ''}`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              女
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleRipple(e); setFormData(prev => ({ ...prev, gender: '男' })); }}
              className={`option-btn flex-1 ${formData.gender === '男' ? 'selected' : ''}`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              男
            </button>
          </div>
        </div>

        {/* 手机号 */}
        <div className="question-card">
          <span className="question-label">3. 手机号</span>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="input-glow"
            placeholder="请输入手机号（用于发放被试费）"
            maxLength={11}
          />
        </div>

        {/* 年龄 */}
        <div className="question-card">
          <span className="question-label">4. 年龄</span>
          <input
            type="text"
            value={formData.age}
            onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
            className="input-glow"
            placeholder="请输入年龄"
          />
        </div>

        {/* 受教育程度 */}
        <div className="question-card">
          <span className="question-label">5. 受教育程度</span>
          <div className="grid grid-cols-3 gap-2">
            {educationOptions.map(opt => (
              <button
                key={opt}
                onClick={(e) => { e.stopPropagation(); handleRipple(e); setFormData(prev => ({ ...prev, education: opt })); }}
                className={`option-btn text-sm py-3 ${formData.education === opt ? 'selected' : ''}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* 有无驾照 */}
        <div className="question-card">
          <span className="question-label">6. 有无驾照</span>
          <div className="flex gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); handleRipple(e); setFormData(prev => ({ ...prev, hasLicense: '有' })); }}
              className={`option-btn flex-1 ${formData.hasLicense === '有' ? 'selected' : ''}`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              有
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleRipple(e); setFormData(prev => ({ ...prev, hasLicense: '无', drivingYears: '', drivingMileage: '', hasAssistDriving: '' })); }}
              className={`option-btn flex-1 ${formData.hasLicense === '无' ? 'selected' : ''}`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              无
            </button>
          </div>
        </div>

        {/* 驾照相关 - 条件显示 */}
        {formData.hasLicense === '有' && (
          <>
            <div className="question-card">
              <span className="question-label">7. 驾龄（年）</span>
              <input
                type="text"
                value={formData.drivingYears}
                onChange={(e) => setFormData(prev => ({ ...prev, drivingYears: e.target.value }))}
                className="input-glow"
                placeholder="请输入驾龄"
              />
            </div>

            <div className="question-card">
              <span className="question-label">8. 驾驶里程（km）</span>
              <input
                type="text"
                value={formData.drivingMileage}
                onChange={(e) => setFormData(prev => ({ ...prev, drivingMileage: e.target.value }))}
                className="input-glow"
                placeholder="请输入驾驶里程"
              />
            </div>

            <div className="question-card">
              <span className="question-label">9. 有无辅助驾驶经验</span>
              <div className="text-white/50 text-xs mb-3">如自适应巡航、车道保持、自动泊车等</div>
              <div className="flex gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); handleRipple(e); setFormData(prev => ({ ...prev, hasAssistDriving: '有' })); }}
                  className={`option-btn flex-1 ${formData.hasAssistDriving === '有' ? 'selected' : ''}`}
                >
                  有
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleRipple(e); setFormData(prev => ({ ...prev, hasAssistDriving: '无' })); }}
                  className={`option-btn flex-1 ${formData.hasAssistDriving === '无' ? 'selected' : ''}`}
                >
                  无
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {error && <div className="error-text mt-4">{error}</div>}

      <div className="pt-4 pb-8">
        <button onClick={(e) => { handleRipple(e); handleNext(); }} className="btn-glow">
          <span>下一步</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
