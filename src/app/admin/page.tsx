'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stats, setStats] = useState<{ total: number } | null>(null);
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsLoggedIn(true);
      fetchStats();
    } else {
      setError('密码错误');
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/experiment/stats');
      const data = await res.json();
      setStats(data);
    } catch {}
  };

  const handleExport = async () => {
    try {
      const res = await fetch('/api/experiment/export', {
        headers: { authorization: 'Bearer admin123' },
      });
      if (!res.ok) throw new Error('导出失败');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'experiment_data.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setError('导出失败');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="mobile-container" style={{ paddingTop: '40px', textAlign: 'center' }}>
        <h1 className="page-title">管理后台</h1>
        <div style={{ marginTop: '24px' }}>
          <input
            type="password"
            className="input-field"
            placeholder="请输入密码"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
          {error && <p style={{ color: '#ff5252', marginTop: '8px', fontSize: '14px' }}>{error}</p>}
          <button className="submit-button" style={{ marginTop: '16px' }} onClick={handleLogin}>登录</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container" style={{ paddingTop: '20px' }}>
      <h1 className="page-title">数据管理</h1>
      <p className="page-subtitle">自动驾驶接受度实验</p>

      {stats && (
        <div className="question-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', fontWeight: '700', background: 'linear-gradient(135deg, #00d4ff, #7b2ff7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {stats.total}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginTop: '4px' }}>总参与人数</div>
        </div>
      )}

      <button className="submit-button" style={{ marginTop: '16px' }} onClick={handleExport}>
        导出Excel数据
      </button>

      <button
        className="submit-button"
        style={{ marginTop: '12px', background: 'rgba(255,255,255,0.1)' }}
        onClick={fetchStats}
      >
        刷新统计
      </button>
    </div>
  );
}
