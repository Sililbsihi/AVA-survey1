'use client';

export default function Progress({ value = 0 }: { value?: number }) {
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${value}%` }} />
    </div>
  );
}
