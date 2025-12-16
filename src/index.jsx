import { Routes, Route, Link } from 'react-router-dom';
import TalkTheme from './games/TalkTheme';
import Bingo from './games/Bingo';

// 🏠 トップページ（メニュー画面）の部品
function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>🧊 Icebreak Cafe</h1>
      <p>アイスブレイクへようこそ！<br/>遊びたいゲームを選んでね。</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px' }}>
        <Link to="/talk-theme" style={buttonStyle}>
          💬 トークテーマガチャ
        </Link>
        <Link to="/bingo" style={buttonStyle}>
          🎯 共通点ビンゴ
        </Link>
      </div>
    </div>
  );
}

// 🎨 ボタンの見た目（共通）
const buttonStyle = {
  display: 'block',
  padding: '20px',
  backgroundColor: '#f0f0f0',
  color: '#333',
  textDecoration: 'none',
  borderRadius: '12px',
  fontWeight: 'bold',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

// 🚀 アプリ全体の構成
function App() {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', minHeight: '100vh' }}>
      <Routes>
        {/* トップページ */}
        <Route path="/" element={<Home />} />
        
        {/* ガチャのページ（戻るボタン付き） */}
        <Route path="/talk-theme" element={
          <div>
            <Link to="/" style={{ display: 'inline-block', margin: '10px' }}>&lt; 戻る</Link>
            <TalkTheme />
          </div>
        } />

        {/* ビンゴのページ（戻るボタン付き） */}
        <Route path="/bingo" element={
          <div>
            <Link to="/" style={{ display: 'inline-block', margin: '10px' }}>&lt; 戻る</Link>
            <Bingo />
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;