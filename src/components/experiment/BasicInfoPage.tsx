'use client';

import { useState } from 'react';
import { useExperiment } from '@/contexts/ExperimentContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { BasicInfoData, SocialInfluenceData } from '@/types/experiment';

const educationOptions = [
  '初中及以下',
  '高中/中专',
  '大专',
  '本科',
  '硕士',
  '博士及以上',
];

const basicInfoQuestions = [
  {
    key: 'name' as keyof BasicInfoData,
    type: 'text',
    label: '真实姓名',
    placeholder: '请输入您的真实姓名',
  },
  {
    key: 'age' as keyof BasicInfoData,
    type: 'number',
    label: '年龄',
    placeholder: '请输入您的年龄',
  },
  {
    key: 'phone' as keyof BasicInfoData,
    type: 'text',
    label: '手机号',
    placeholder: '请输入您的手机号',
  },
  {
    key: 'drivingExperienceYears' as keyof BasicInfoData,
    type: 'number',
    label: '驾龄（年）',
    placeholder: '请输入您的驾龄',
    condition: (data: BasicInfoData) => data.hasDriverLicense === 'yes',
  },
  {
    key: 'drivingMileage' as keyof BasicInfoData,
    type: 'number',
    label: '驾驶里程（km）',
    placeholder: '请输入总驾驶里程',
    condition: (data: BasicInfoData) => data.hasDriverLicense === 'yes',
  },
];

const socialInfluenceQuestions = [
  {
    key: 'q9' as keyof SocialInfluenceData,
    text: '我很少购买最新的产品，除非我的朋友们都认可它们',
  },
  {
    key: 'q10' as keyof SocialInfluenceData,
    text: '如果我对某产品缺乏经验，我经常会向朋友询问该产品的情况',
  },
  {
    key: 'q11' as keyof SocialInfluenceData,
    text: '通过购买其他人购买的相同品牌和产品，我可以获得归属感',
  },
  {
    key: 'q12' as keyof SocialInfluenceData,
    text: '为了确保买到合适的产品或品牌，我经常观察别人在买什么、用什么',
  },
  {
    key: 'q13' as keyof SocialInfluenceData,
    text: '我的家人或朋友推荐我使用自动驾驶技术',
  },
  {
    key: 'q14' as keyof SocialInfluenceData,
    text: '我的同事或领导推荐我使用自动驾驶技术',
  },
  {
    key: 'q15' as keyof SocialInfluenceData,
    text: '我喜欢的明星推荐我使用自动驾驶技术',
  },
  {
    key: 'q16' as keyof SocialInfluenceData,
    text: '政府出台的相关政策引导我使用自动驾驶技术',
  },
  {
    key: 'q17' as keyof SocialInfluenceData,
    text: '此题请选择"很同意"',
  },
];

export default function BasicInfoPage() {
  const { step, setStep, experimentData, updateBasicInfo, updateSocialInfluence } = useExperiment();
  const isSocialInfluence = step === 'social-influence';
  
  const [currentBasic, setCurrentBasic] = useState(0);
  const [basicError, setBasicError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [currentSocial, setCurrentSocial] = useState(0);
  const [socialError, setSocialError] = useState('');

  const basicInfo = experimentData.basicInfo;
  const socialInfluence = experimentData.socialInfluence;

  const visibleBasicQuestions = basicInfoQuestions.filter(q => !q.condition || q.condition(basicInfo));

  const handleBasicInput = (key: keyof BasicInfoData, value: string) => {
    if (key === 'name') {
      updateBasicInfo({ name: value });
    } else if (key === 'phone') {
      updateBasicInfo({ phone: value });
    } else if (key === 'age' || key === 'drivingExperienceYears' || key === 'drivingMileage') {
      const numValue = value ? parseInt(value) : null;
      updateBasicInfo({ [key]: numValue });
    }
    setBasicError('');
  };

  const handleGenderSelect = (value: string) => {
    updateBasicInfo({ gender: value });
    setBasicError('');
  };

  const handleEducationSelect = (value: string) => {
    updateBasicInfo({ education: value });
    setBasicError('');
  };

  const handleLicenseSelect = (value: string) => {
    updateBasicInfo({ hasDriverLicense: value });
    if (value === 'no') {
      updateBasicInfo({ drivingExperienceYears: null, drivingMileage: null });
    }
    setBasicError('');
  };

  const handleAssistExpSelect = (value: string) => {
    updateBasicInfo({ hasAssistDrivingExp: value });
    setBasicError('');
  };

  const validateBasicInfo = () => {
    if (!basicInfo.name?.trim()) return '请填写真实姓名';
    if (!basicInfo.gender) return '请选择性别';
    if (!basicInfo.age || basicInfo.age < 1 || basicInfo.age > 120) return '请填写有效年龄';
    if (!basicInfo.education) return '请选择受教育程度';
    if (!basicInfo.phone?.trim()) return '请填写手机号';
    if (!basicInfo.hasDriverLicense) return '请选择有无驾照';
    if (basicInfo.hasDriverLicense === 'yes') {
      if (!basicInfo.drivingExperienceYears || basicInfo.drivingExperienceYears < 0) return '请填写有效驾龄';
      if (!basicInfo.drivingMileage || basicInfo.drivingMileage < 0) return '请填写有效驾驶里程';
    }
    if (!basicInfo.hasAssistDrivingExp) return '请选择有无辅助驾驶经验（自适应巡航、车道保持、自动泊车、自动紧急制动等）';
    return null;
  };

  const handleBasicNext = () => {
    const error = validateBasicInfo();
    if (error) {
      setBasicError(error);
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setStep('social-influence');
      setIsSubmitting(false);
      window.scrollTo(0, 0);
    }, 300);
  };

  const handleSocialSelect = (key: keyof SocialInfluenceData, value: number) => {
    updateSocialInfluence({ [key]: value });
    setSocialError('');
  };

  const handleSocialNext = () => {
    const key = socialInfluenceQuestions[currentSocial].key;
    if (socialInfluence[key] === null) {
      setSocialError('请选择一个选项');
      return;
    }

    if (currentSocial < socialInfluenceQuestions.length - 1) {
      setCurrentSocial(currentSocial + 1);
      window.scrollTo(0, 0);
    } else {
      const allAnswered = socialInfluenceQuestions.every(q => socialInfluence[q.key] !== null);
      if (allAnswered) {
        setIsSubmitting(true);
        setTimeout(() => {
          setStep('instruction');
          setIsSubmitting(false);
          window.scrollTo(0, 0);
        }, 300);
      } else {
        setSocialError('请回答所有问题');
      }
    }
  };

  const handleSocialPrevious = () => {
    if (currentSocial > 0) {
      setCurrentSocial(currentSocial - 1);
      window.scrollTo(0, 0);
    } else {
      setStep('basic-info');
      window.scrollTo(0, 0);
    }
  };

  if (!isSocialInfluence) {
    const answeredCount = [
      basicInfo.name?.trim(),
      basicInfo.gender,
      basicInfo.age,
      basicInfo.education,
      basicInfo.hasDriverLicense,
      basicInfo.hasAssistDrivingExp,
    ].filter(Boolean).length;

    return (
      <div className="mobile-container">
        <div className="flex items-center justify-center gap-2 mb-6">
          {['基本信息', '第一部分'].map((label, index) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                index === 0 ? 'bg-primary text-white' : 'bg-slate-600 text-slate-300'
              }`}>
                {index + 1}
              </div>
              <span className={`text-xs ${index === 0 ? 'text-slate-300' : 'text-slate-500'}`}>{label}</span>
              {index < 1 && <div className="w-8 h-px bg-slate-600" />}
            </div>
          ))}
        </div>

        <div className="glow-border bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 mb-6">
          <div className="text-center mb-5">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 mb-3">
              第一部分 · 基本信息
            </span>
          </div>

          <p className="text-sm text-slate-400 mb-6">请填写您的基本信息</p>

          <div className="space-y-5">
            {basicInfoQuestions.map((q, index) => {
              if (q.condition && !q.condition(basicInfo)) return null;
              
              return (
                <div key={q.key}>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    {q.label} <span className="text-red-400">*</span>
                  </label>
                  {q.type === 'text' || q.type === 'number' ? (
                    <Input
                      type={q.type}
                      placeholder={q.placeholder}
                      value={basicInfo[q.key as keyof BasicInfoData] as string ?? ''}
                      onChange={(e) => handleBasicInput(q.key, e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  ) : null}
                </div>
              );
            })}

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                性别 <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-3">
                {['男', '女'].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleGenderSelect(option)}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                      basicInfo.gender === option
                        ? 'bg-primary text-white'
                        : 'bg-slate-700/50 text-slate-300 border border-slate-600'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                受教育程度 <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {educationOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleEducationSelect(option)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                      basicInfo.education === option
                        ? 'bg-primary text-white'
                        : 'bg-slate-700/50 text-slate-300 border border-slate-600'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                是否持有驾照 <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-3">
                {[
                  { value: 'yes', label: '有' },
                  { value: 'no', label: '无' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleLicenseSelect(option.value)}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                      basicInfo.hasDriverLicense === option.value
                        ? 'bg-primary text-white'
                        : 'bg-slate-700/50 text-slate-300 border border-slate-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {basicInfo.hasDriverLicense === 'yes' && (
              <div className="space-y-4 bg-slate-700/30 rounded-xl p-4">
                <p className="text-xs text-slate-400">请填写您的驾驶信息</p>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    驾龄（年）<span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="请输入驾龄"
                    value={basicInfo.drivingExperienceYears ?? ''}
                    onChange={(e) => handleBasicInput('drivingExperienceYears', e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    驾驶里程（km）<span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="请输入总驾驶里程"
                    value={basicInfo.drivingMileage ?? ''}
                    onChange={(e) => handleBasicInput('drivingMileage', e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                有无辅助驾驶经验 <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-3">
                {[
                  { value: 'yes', label: '有' },
                  { value: 'no', label: '无' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAssistExpSelect(option.value)}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                      basicInfo.hasAssistDrivingExp === option.value
                        ? 'bg-primary text-white'
                        : 'bg-slate-700/50 text-slate-300 border border-slate-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {basicError && (
            <p className="text-red-400 text-sm text-center mt-4">{basicError}</p>
          )}

          <Button
            onClick={handleBasicNext}
            disabled={isSubmitting}
            className="w-full mt-6 bg-primary hover:bg-primary/90 text-white"
          >
            {isSubmitting ? '提交中...' : '下一页'}
          </Button>
        </div>
      </div>
    );
  }

  const currentQ = socialInfluenceQuestions[currentSocial];
  const progress = ((currentSocial + 1) / socialInfluenceQuestions.length) * 100;

  return (
    <div className="mobile-container">
      <div className="flex items-center justify-center gap-2 mb-6">
        {['基本信息', '第一部分'].map((label, index) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              index === 1 ? 'bg-primary text-white' : 'bg-slate-600 text-slate-300'
            }`}>
              {index + 1}
            </div>
            <span className={`text-xs ${index === 1 ? 'text-slate-300' : 'text-slate-500'}`}>{label}</span>
            {index < 1 && <div className="w-8 h-px bg-slate-600" />}
          </div>
        ))}
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>第 {currentSocial + 1} / {socialInfluenceQuestions.length} 题</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-1.5">
          <div
            className="bg-primary h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="glow-border bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 mb-6">
        <div className="text-center mb-5">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 mb-3">
            第一部分
          </span>
        </div>

        <p className="text-lg text-center mb-8 leading-relaxed">
          {currentQ.text}
        </p>

        <div className="flex justify-between gap-1 mb-6 px-1">
          {['很不同意', '不同意', '中立', '同意', '很同意'].map((label, index) => (
            <span key={label} className="text-xs text-slate-400 text-center flex-1">
              {label}
            </span>
          ))}
        </div>

        <div className="flex justify-between gap-2 px-1">
          {[1, 2, 3, 4, 5].map((value) => {
            const isSelected = socialInfluence[currentQ.key as keyof SocialInfluenceData] === value;
            return (
              <button
                key={value}
                onClick={() => handleSocialSelect(currentQ.key, value)}
                disabled={isSubmitting}
                className={`w-12 h-12 rounded-full text-sm font-bold transition-all ${
                  isSelected
                    ? 'bg-primary text-white scale-110'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {value}
              </button>
            );
          })}
        </div>

        {socialError && (
          <p className="text-red-400 text-sm text-center mt-4">{socialError}</p>
        )}

        <Button
          onClick={handleSocialNext}
          disabled={isSubmitting}
          className="w-full mt-6 bg-primary hover:bg-primary/90 text-white"
        >
          {currentSocial < socialInfluenceQuestions.length - 1 ? '下一页' : '下一页'}
        </Button>

        <button
          onClick={handleSocialPrevious}
          className="w-full mt-3 py-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          返回上一页
        </button>
      </div>
    </div>
  );
}
