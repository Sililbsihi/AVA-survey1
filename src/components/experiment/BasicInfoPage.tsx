'use client';

import { useState } from 'react';
import { useExperiment } from '@/contexts/ExperimentContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const educationOptions = ['初中及以下', '高中/中专', '大专', '本科', '硕士', '博士及以上'];

export default function BasicInfoPage() {
  const { step, setStep, experimentData, updateBasicInfo, updateSocialInfluence } = useExperiment();
  const isSocialInfluence = step === 'social-influence';
  
  const [currentBasic, setCurrentBasic] = useState(0);
  const [basicError, setBasicError] = useState('');
  const [currentSocial, setCurrentSocial] = useState(0);
  const [socialError, setSocialError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const basicInfo = experimentData.basicInfo;
  const socialInfluence = experimentData.socialInfluence;

  const socialQuestions = [
    { key: 'q9', text: '我很少购买最新的产品，除非我的朋友们都认可它们' },
    { key: 'q10', text: '如果我对某产品缺乏经验，我经常会向朋友询问该产品的情况' },
    { key: 'q11', text: '通过购买其他人购买的相同品牌和产品，我可以获得归属感' },
    { key: 'q12', text: '为了确保买到合适的产品或品牌，我经常观察别人在买什么、用什么' },
    { key: 'q13', text: '我的家人或朋友推荐我使用自动驾驶技术' },
    { key: 'q14', text: '我的同事或领导推荐我使用自动驾驶技术' },
    { key: 'q15', text: '我喜欢的明星推荐我使用自动驾驶技术' },
    { key: 'q16', text: '政府出台的相关政策引导我使用自动驾驶技术' },
    { key: 'q17', text: '此题选择"很同意"', attention: true },
  ];

  const handleBasicNext = () => {
    if (!basicInfo.name?.trim()) { setBasicError('请填写真实姓名'); return; }
    if (!basicInfo.gender) { setBasicError('请选择性别'); return; }
    if (!basicInfo.age || basicInfo.age < 1 || basicInfo.age > 120) { setBasicError('请填写有效年龄'); return; }
    if (!basicInfo.education) { setBasicError('请选择受教育程度'); return; }
    if (!basicInfo.phone?.trim()) { setBasicError('请填写手机号'); return; }
    if (!basicInfo.hasDriverLicense) { setBasicError('请选择有无驾照'); return; }
    if (basicInfo.hasDriverLicense === 'yes') {
      if (!basicInfo.drivingExperienceYears || !basicInfo.drivingMileage) { setBasicError('请填写驾驶信息'); return; }
    }
    if (!basicInfo.hasAssistDrivingExp) { setBasicError('请选择有无辅助驾驶经验'); return; }
    setIsSubmitting(true);
    setTimeout(() => { setStep('social-influence'); setIsSubmitting(false); window.scrollTo(0, 0); }, 300);
  };

  const handleSocialSelect = (key: string, value: number) => {
    updateSocialInfluence({ [key]: value });
    setSocialError('');
  };

  const handleSocialNext = () => {
    const key = socialQuestions[currentSocial].key;
    if (socialInfluence[key as keyof typeof socialInfluence] === null) { setSocialError('请选择一个选项'); return; }
    if (currentSocial < socialQuestions.length - 1) {
      setCurrentSocial(currentSocial + 1);
      window.scrollTo(0, 0);
    } else {
      setIsSubmitting(true);
      setTimeout(() => { setStep('instruction'); setIsSubmitting(false); window.scrollTo(0, 0); }, 300);
    }
  };

  const handleSocialPrev = () => {
    if (currentSocial > 0) { setCurrentSocial(currentSocial - 1); window.scrollTo(0, 0); }
    else { setStep('basic-info'); window.scrollTo(0, 0); }
  };

  if (!isSocialInfluence) {
    return (
      <div className="mobile-container">
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold text-white mb-2">基本信息</h1>
        </div>

        <div className="glow-border bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 mb-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">真实姓名 <span className="text-red-400">*</span></label>
              <Input placeholder="请输入" value={basicInfo.name} onChange={e => updateBasicInfo({ name: e.target.value })} className="bg-slate-700/50 border-slate-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">性别 <span className="text-red-400">*</span></label>
              <div className="flex gap-3">
                {['男', '女'].map(opt => (
                  <button key={opt} onClick={() => updateBasicInfo({ gender: opt })} className={`flex-1 py-2.5 rounded-lg text-sm ${basicInfo.gender === opt ? 'bg-primary text-white' : 'bg-slate-700/50 text-slate-300 border border-slate-600'}`}>{opt}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">年龄 <span className="text-red-400">*</span></label>
              <Input type="number" placeholder="请输入" value={basicInfo.age ?? ''} onChange={e => updateBasicInfo({ age: e.target.value ? parseInt(e.target.value) : null })} className="bg-slate-700/50 border-slate-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">手机号 <span className="text-red-400">*</span></label>
              <Input placeholder="请输入" value={basicInfo.phone} onChange={e => updateBasicInfo({ phone: e.target.value })} className="bg-slate-700/50 border-slate-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">受教育程度 <span className="text-red-400">*</span></label>
              <div className="grid grid-cols-2 gap-2">
                {educationOptions.map(opt => (
                  <button key={opt} onClick={() => updateBasicInfo({ education: opt })} className={`py-2 px-3 rounded-lg text-xs ${basicInfo.education === opt ? 'bg-primary text-white' : 'bg-slate-700/50 text-slate-300 border border-slate-600'}`}>{opt}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">是否持有驾照 <span className="text-red-400">*</span></label>
              <div className="flex gap-3">
                {[{ value: 'yes', label: '有' }, { value: 'no', label: '无' }].map(opt => (
                  <button key={opt.value} onClick={() => updateBasicInfo({ hasDriverLicense: opt.value })} className={`flex-1 py-2.5 rounded-lg text-sm ${basicInfo.hasDriverLicense === opt.value ? 'bg-primary text-white' : 'bg-slate-700/50 text-slate-300 border border-slate-600'}`}>{opt.label}</button>
                ))}
              </div>
            </div>

            {basicInfo.hasDriverLicense === 'yes' && (
              <div className="space-y-4 bg-slate-700/30 rounded-xl p-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">驾龄（年）<span className="text-red-400">*</span></label>
                  <Input type="number" placeholder="请输入" value={basicInfo.drivingExperienceYears ?? ''} onChange={e => updateBasicInfo({ drivingExperienceYears: e.target.value ? parseInt(e.target.value) : null })} className="bg-slate-700/50 border-slate-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">驾驶里程（km）<span className="text-red-400">*</span></label>
                  <Input type="number" placeholder="请输入" value={basicInfo.drivingMileage ?? ''} onChange={e => updateBasicInfo({ drivingMileage: e.target.value ? parseInt(e.target.value) : null })} className="bg-slate-700/50 border-slate-600" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">有无辅助驾驶经验 <span className="text-red-400">*</span></label>
              <div className="flex gap-3">
                {[{ value: 'yes', label: '有' }, { value: 'no', label: '无' }].map(opt => (
                  <button key={opt.value} onClick={() => updateBasicInfo({ hasAssistDrivingExp: opt.value })} className={`flex-1 py-2.5 rounded-lg text-sm ${basicInfo.hasAssistDrivingExp === opt.value ? 'bg-primary text-white' : 'bg-slate-700/50 text-slate-300 border border-slate-600'}`}>{opt.label}</button>
                ))}
              </div>
            </div>
          </div>

          {basicError && <p className="text-red-400 text-sm text-center mt-4">{basicError}</p>}
          <Button onClick={handleBasicNext} disabled={isSubmitting} className="w-full mt-6 bg-primary hover:bg-primary/90">{isSubmitting ? '提交中...' : '下一页'}</Button>
        </div>
      </div>
    );
  }

  const currentQ = socialQuestions[currentSocial];
  const progress = ((currentSocial + 1) / socialQuestions.length) * 100;

  return (
    <div className="mobile-container">
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold text-white mb-2">第一部分</h1>
        <p className="text-sm text-slate-400">请根据您的真实想法作答</p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>第 {currentSocial + 1} / {socialQuestions.length} 题</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-1.5">
          <div className="bg-primary h-1.5 rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="glow-border bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 mb-6">
        <p className="text-lg text-center mb-8 leading-relaxed">{currentQ.text}</p>

        <div className="space-y-3">
