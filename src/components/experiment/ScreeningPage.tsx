'use client';

import { useState } from 'react';
import { useExperiment } from '@/contexts/ExperimentContext';

const questions = [
  "自动驾驶技术会让驾驶变得更加安全",
  "我愿意在日常生活中尝试使用自动驾驶功能",
  "我相信自动驾驶技术能够正确处理复杂的交通状况",
  "自动驾驶技术的发展对社会是有益的",
  "我期待未来能够拥有完全自动驾驶的汽车",
  "学习使用自动驾驶系统对我来说并不困难",
  "如果条件允许，我倾向于选择有自动驾驶功能的车辆"
];

const scaleLabels = ['很不同意', '不同意', '中立', '同意', '很同意'];

export default function ScreeningPage() {
  const { setStep } = useExperiment();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [error, setError] = useState('');

  const handleAnswer = (value: number) => {
    // 筛选条件：如果是前几题就表现出极度反感（很不同意/不同意），可以视情况筛选
    // 这里设置：如果选了 1 或 2 (很不同意/不同意)，依然允许继续，但在最后逻辑中可以拦截
    const newAnswers = [...answers, value];
    
    if (currentIdx < questions.length - 1) {
      setAnswers(newAnswers);
      setCurrentIdx(currentIdx + 1);
      setError('');
    } else {
      // 最后一题答完后的逻辑
      const averageScore = newAnswers.reduce((a, b) => a + b, 0) / questions.length;
      
      // 筛选逻辑：如果平均分太低（比如小于 3），说明不是目标群体
      if (averageScore < 2.5) {
        setError('抱歉，根据您的回答，您暂不符合本次实验的参与要求。');
      } else {
        (setStep as any)('instruction');
      }
    }
  };

  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="min-h-[80vh] flex flex-col justify-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
          筛选问卷
        </h1>
        <p className="text-slate-400">第 {currentIdx + 1} / {questions.length} 题</p>
      </div>

      {/* 游戏化进度条 */}
      <div className="w-full bg-slate-800 h-2 rounded-full mb-8 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="glow-border bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 border border-slate-700 shadow-2xl">
        <h2 className="text-xl text-white font-medium mb-8 leading-relaxed text-center">
          {questions[currentIdx]}
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => handleAnswer(value)}
              className="group relative flex items-center justify-between p-4 rounded-2xl bg-slate-700/30 border border-slate-600 hover:border-blue-500 hover:bg-slate-700/50 transition-all duration-200 active:scale-95"
            >
              <span className="text-slate-300 group-hover:text-white font-medium">
                {scaleLabels[value - 1]}
              </span>
              <div className="w-6 h-6 rounded-full border-2 border-slate-500 group-hover:border-blue-500 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 opacity-0 group-active:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
