import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ExperimentProvider } from '@/contexts/ExperimentContext';

export const metadata: Metadata = {
  title: {
    default: '自动驾驶接受度实验',
    template: '%s | 自动驾驶实验',
  },
  description: '自动驾驶技术接受度研究问卷调查',
  keywords: ['自动驾驶', '问卷调查', '实验研究'],
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased min-h-screen overflow-x-hidden">
        <ExperimentProvider>
          {children}
        </ExperimentProvider>
      </body>
    </html>
  );
}
