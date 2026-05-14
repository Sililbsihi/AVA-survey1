'use client';

import { useState } from 'react';
import { useExperiment } from '@/contexts/ExperimentContext';

const questions = [
  { key: 'q1', text: '我愿意使用自动驾驶' },
  { key: 'q2', text: '我愿意和其他人一起使用自动驾驶的公共交通' },
  { key: 'q3', text: '如果有新技术，我会想尝试一下' },
  { key: 'q4', text: '在同龄人中，我通常是最先尝试新技术的人' },
  { key: 'q5', text: '此题选择"很不同意"', attention: true },
  { key: 'q6', text: '我非常了解自动驾驶汽车的功能和用途' },
  { key: 'q7', text: '相比于周围的人，我对自动驾驶技术有更多的了解' },
];

const scaleLabels = ['很不同意', '不同意', '中立', '同意', '很同意'];

export default function ScreeningPage() {
  const { setStep } = useExperiment();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value];
    
    if (currentIdx < questions.length - 1) {
      setAnswers(newAnswers);
      setCurrentIdx(currentIdx + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // --- 严格筛选逻辑 ---
      const q = newAnswers;
      // 注意：数组索引 0=q1, 1=q2, 2=q3, 3=q4, 4=q5, 5=q6, 6=q7
      
      const avgA = (q[0] + q[1]) / 2; // q1, q2
      const avgB = (q[2] + q[3]) / 2; // q3, q4
      const avgC = (q[5] + q[6]) / 2; // q6, q7
      
      // 注意力题 q5 必须选 "很不同意" (对应数值 1)
      const attentionCheckPassed = q[4] === 1;

      const isQualified = 
        avgA >= 2 && avgA <= 4 &&
        avgB >= 2 && avgB <= 4 &&
        avgC >= 2 && avgC <= 4 &&
        attentionCheckPassed;

      if (isQualified) {
        (setStep as any)('instruction');
      } else {
        // 静默拦截
        alert("感谢您的参与！目前该样本组名额已满。");
      }
    }
  };

  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 px-6 py-12 flex flex-col items-center">
      {/* 顶部进度条 */}
      <div className="w-full max-w-md mb-12">
        <div className="flex justify-between items-end mb-3">
          <span className="text-blue-400 font-mono text-[10px] tracking-[0.2em] uppercase">Experiment Screening</span>
          <span className="text-slate-500 font-mono text-xs">{currentIdx + 1} / {questions.length}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden p-[1px]">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.4)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 题目卡片 */}
      <div className="w-full max-w-md">
        <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-[2rem] p-10 shadow-2xl relative overflow-hidden">
          {/* 背景装饰球 */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
             <div className="min-h-[120px] mb-8 flex items-center justify-center">
                <h2 className="text-2xl font-bold text-white text-center leading-snug tracking-tight">
                  {questions[currentIdx].text}
                </h2>
             </div>

            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  className="w-full group relative flex items-center p-5 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:border-blue-500/50 hover:bg-blue-600/5 transition-all duration-300 active:scale-[0.97]"
                >
                  <div className="w-5 h-5 rounded-full border-2 border-slate-600 group-hover:border-blue-500 flex items-center justify-center mr-4 transition-all">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 scale-0 group-active:scale-100 transition-transform" />
                  </div>
                  <span className="text-slate-400 group-hover:text-blue-100 font-medium transition-colors">
                    {scaleLabels[value - 1]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* 底部小字说明 */}
        <p className="mt-8 text-center text-slate-600 text-xs font-light tracking-widest uppercase">
          Autonomous Driving Acceptability Study
        </p>
      </div>
    </div>
  );
}
