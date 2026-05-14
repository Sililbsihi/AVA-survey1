'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState<{ total: number; today: number } | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== 'admin123') {
      setError('密码错误');
      return;
    }
    
    setIsAuthenticated(true);
    setError('');
    
    try {
      const response = await fetch(`/api/experiment/stats?password=${password}`);
      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('获取统计数据失败:', err);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(`/api/experiment/export?password=${password}`);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `experiment_data_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('导出失败:', err);
      alert('导出失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h1 className="text-2xl font-bold text-white mb-6 text-center">
              数据管理后台
            </h1>
            
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-slate-300 mb-2">管理密码</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="请输入密码"
                />
              </div>
              
              {error && (
                <p className="text-red-400 text-sm mb-4">{error}</p>
              )}
              
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                登录
              </button>
            </form>
            
            <p className="text-slate-500 text-sm mt-4 text-center">
              默认密码: admin123
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">数据管理后台</h1>
              <p className="text-slate-400 mt-1">自动驾驶接受度实验</p>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <p className="text-slate-400 mb-2">总样本数</p>
            <p className="text-4xl font-bold text-white">{stats?.total || 0}</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <p className="text-slate-400 mb-2">今日新增</p>
            <p className="text-4xl font-bold text-blue-400">{stats?.today || 0}</p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">数据导出</h2>
          <p className="text-slate-400 mb-4">
            导出的数据为 Excel 格式，便于 SPSS 分析
          </p>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                导出中...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                导出 Excel 数据
              </>
            )}
          </button>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">使用说明</h2>
          <ul className="space-y-2 text-slate-400">
            <li>1. 点击「导出 Excel 数据」按钮下载完整数据</li>
            <li>2. Excel 文件包含所有题目的原始答案</li>
            <li>3. 数据按提交时间倒序排列</li>
            <li>4. 如需分析，可直接导入 SPSS</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
