'use client';

import { useRef } from 'react';

export default function DisqualifiedPage() {
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
      particle.style.position = 'fixed';
      const angle = randomAngles[i];
      const distance = randomDistances[i];
      particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
      particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.background = ['#f472b6', '#a78bfa', '#60a5fa', '#34d399'][i % 4];
      particle.style.zIndex = '9999';
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 700);
    }
  };

  return (
    <div className="mobile-container" ref={containerRef}>
      <div className="stars-bg" />
      
      <div className="flex-1 flex flex-col justify-center py-12">
        {/* 图标 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-slate-500/20 to-gray-500/20 border-2 border-slate-400/30 mb-6 animate-float">
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-4 tracking-wide">
            感谢参与
          </h1>
          
          <p className="text-white/60 text-base leading-relaxed max-w-[280px] mx-auto">
            您暂时不符合本次实验目标人群
          </p>
          <p className="text-white/40 text-sm mt-2">
            下次实验期待您的参与
          </p>
        </div>

        {/* 分隔线 */}
        <div className="flex items-center gap-4 my-8 px-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* 联系信息 */}
        <div className="glass-card text-center">
          <p className="text-white/50 text-sm mb-3">如有疑问，请联系主试</p>
          <p className="text-indigo-400 font-medium text-lg">微信：CHEL_7777</p>
        </div>

      </div>
    </div>
  );
}
