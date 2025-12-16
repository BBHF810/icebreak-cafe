import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TalkThemeGame from './games/TalkTheme';
import Layout from './components/Layout';

const games = [
  { id: 'talk-theme', name: '🗣 トークテーマガチャ', desc: '話題に困ったらポチッと！', component: <TalkThemeGame /> },
];

function Menu() {
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#8c7b75', textAlign: 'center', margin: '40px 0' }}>CAFE GAMES</h1>
      <div style={{ display: 'grid', gap: '15px' }}>
        {games.map((game) => (
          <Link key={game.id} to={`/game/${game.id}`} style={{ textDecoration: 'none' }}>
            <div style={{ padding: '20px', border: '2px solid #d4a373', borderRadius: '12px', background: '#fff', color: '#4a4a4a', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <h2 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>{game.name}</h2>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#888' }}>{game.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        {games.map((game) => (
          <Route key={game.id} path={`/game/${game.id}`} element={<Layout title={game.name}>{game.component}</Layout>} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}