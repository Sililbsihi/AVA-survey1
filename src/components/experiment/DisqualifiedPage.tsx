'use client';

export default function DisqualifiedPage() {
  return (
    <div className="mobile-container" style={{ textAlign: 'center', paddingTop: '60px' }}>
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>🙏</div>
      <h1 className="page-title">感谢参与</h1>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', lineHeight: '1.8', marginTop: '16px', padding: '0 20px' }}>
        您暂时不符合本次实验目标人群，<br />下次实验期待您的参与
      </p>
    </div>
  );
}
