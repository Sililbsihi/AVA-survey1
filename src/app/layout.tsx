import type { Metadata, Viewport } from 'next';
import { ExperimentProvider } from '@/contexts/ExperimentContext'; // 1. 导入电箱
import './globals.css';

export const metadata: Metadata = {
  title: '自动驾驶接受度实验',
  description: '自动驾驶接受度研究问卷',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        {/* 2. 用 Provider 把 children 包起来，这样全家都有电了 */}
        <ExperimentProvider>
          {children}
        </ExperimentProvider>
      </body>
    </html>
  );
}
