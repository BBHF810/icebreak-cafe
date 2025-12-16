import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import TalkTheme from './games/TalkTheme';
import Bingo from './games/Bingo';
import Layout from './components/Layout';
import Settings from './components/Settings'; // 新しく作った設定画面

// 初期データ
import { THEME_LIST } from './games/TalkTheme/data';
import { BINGO_MISSIONS } from './games/Bingo/data';

function Home() {
  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <h1>🧊 Icebreak Cafe</h1>
      <p>アイスブレイクへようこそ！<br/>遊びたいゲームを選んでね。</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px' }}>
        <Link to="/talk-theme" style={buttonStyle}>
          💬 トークテーマガチャ
        </Link>
        <Link to="/bingo" style={buttonStyle}>
          🎯 共通点ビンゴ
        </Link>
        {/* 設定ボタンを追加 */}
        <Link to="/settings" style={{...buttonStyle, backgroundColor: '#666', color: '#fff'}}>
          pV 設定・編集
        </Link>
      </div>
    </div>
  );
}

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

function App() {
  // データの状態管理（ローカルストレージから読み込む、なければ初期値）
  const [themes, setThemes] = useState(() => {
    const saved = localStorage.getItem('icebreak_themes');
    return saved ?JSON.parse(saved) : THEME_LIST;
  });

  const [bingoMissions, setBingoMissions] = useState(() => {
    const saved = localStorage.getItem('icebreak_bingo');
    return saved ? JSON.parse(saved) : BINGO_MISSIONS;
  });

  // データが変更されたらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('icebreak_themes', JSON.stringify(themes));
  }, [themes]);

  useEffect(() => {
    localStorage.setItem('icebreak_bingo', JSON.stringify(bingoMissions));
  }, [bingoMissions]);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#fff' }}>
      <Routes>
        <Route path="/" element={
          <Layout title="メニュー" showBackBtn={false}>
            <Home />
          </Layout>
        } />
        
        <Route path="/talk-theme" element={
          <Layout title="トークテーマガチャ">
            {/* データを渡す */}
            <TalkTheme themes={themes} />
          </Layout>
        } />

        <Route path="/bingo" element={
          <Layout title="共通点ビンゴ">
            {/* データを渡す */}
            <Bingo missions={bingoMissions} />
          </Layout>
        } />

        {/* 設定画面のルート */}
        <Route path="/settings" element={
          <Layout title="設定">
            <Settings 
              themes={themes} 
              setThemes={setThemes}
              bingoMissions={bingoMissions}
              setBingoMissions={setBingoMissions}
            />
          </Layout>
        } />
      </Routes>
    </div>
  );
}

export default App;