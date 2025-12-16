import { useNavigate } from 'react-router-dom';

// showBackBtn というプロパティを追加（デフォルトは true）
export default function Layout({ title, children, showBackBtn = true }) {
  const navigate = useNavigate();
  return (
    // Layout自体が背景色を持っているので、minHeightで画面いっぱいに広げます
    <div style={{ minHeight: '100vh', background: '#fdfbf7', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '15px', background: '#fff', display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee' }}>
        {/* showBackBtn が true の時だけボタンを表示 */}
        {showBackBtn && (
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', marginRight: '10px' }}>
            ←
          </button>
        )}
        <span style={{ fontWeight: 'bold', color: '#8c7b75', fontSize: '1.1rem' }}>{title}</span>
      </header>
      <main style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
        {children}
      </main>
    </div>
  );
}