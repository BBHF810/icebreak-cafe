import { useNavigate } from 'react-router-dom';

export default function Layout({ title, children }) {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: '#fdfbf7', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '15px', background: '#fff', display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>←</button>
        <span style={{ marginLeft: '10px', fontWeight: 'bold', color: '#8c7b75' }}>{title}</span>
      </header>
      <main style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {children}
      </main>
    </div>
  );
}