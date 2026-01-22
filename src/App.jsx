import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { db } from './firebase'; 
import { ref, onValue, set, push, remove } from 'firebase/database';

import TalkTheme from './games/TalkTheme';
import Bingo from './games/Bingo';
import ValueTalk from './games/ValueTalk';
import Feedback from './games/Feedback';
import ShakeGame from './games/ShakeGame';
import Layout from './components/Layout';
import Settings from './components/Settings';
import About from './components/About'; // ★ 追加：UniPort説明ページ
import PairQuiz from './games/PairQuiz';
import Shiritori from './games/Shiritori';

import { THEME_LIST } from './games/TalkTheme/data';
import { BINGO_MISSIONS } from './games/Bingo/data';
import { VALUE_THEME_LIST } from './games/ValueTalk/data';

function App() {
  const [themes, setThemes] = useState([]);
  const [bingoMissions, setBingoMissions] = useState([]);
  const [valueThemes, setValueThemes] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  // Firebase同期ロジック
  useEffect(() => {
    onValue(ref(db, 'themes'), (snapshot) => {
      const data = snapshot.val();
      if (data) setThemes(data);
      else set(ref(db, 'themes'), THEME_LIST.map(t => ({ text: t, enabled: true })));
    });

    onValue(ref(db, 'bingo'), (snapshot) => {
      const data = snapshot.val();
      if (data) setBingoMissions(data);
      else set(ref(db, 'bingo'), BINGO_MISSIONS);
    });

    onValue(ref(db, 'valueThemes'), (snapshot) => {
      const data = snapshot.val();
      if (data) setValueThemes(data);
      else set(ref(db, 'valueThemes'), VALUE_THEME_LIST.map(v => ({ text: v, enabled: true })));
    });

    onValue(ref(db, 'feedbacks'), (snapshot) => {
      const data = snapshot.val();
      setFeedbacks(data ? Object.keys(data).map(key => ({ ...data[key], id: key })) : []);
    });
  }, []);

  const updateThemes = (newData) => set(ref(db, 'themes'), newData);
  const updateBingo = (newData) => set(ref(db, 'bingo'), newData);
  const updateValueThemes = (newData) => set(ref(db, 'valueThemes'), newData);

  return (
    <div style={appContainerStyle}>
      <Routes>
        <Route path="/" element={<Layout title="メニュー" showBackBtn={false}><Home /></Layout>} />
        
        {/* ★ 追加：UniPort紹介ルート */}
        <Route path="/about" element={
          <Layout title="UniPortについて">
            <About />
          </Layout>
        } />

        <Route path="/talk-theme" element={
          <Layout title="ガチャ">
            <TalkTheme key={themes.filter(t => t.enabled).length} themes={themes} setThemes={updateThemes} />
          </Layout>
        } />
        <Route path="/value-talk" element={
          <Layout title="価値観トーク">
            <ValueTalk key={valueThemes.filter(v => v.enabled).length} themes={valueThemes} setValueThemes={updateValueThemes} />
          </Layout>
        } />

        <Route path="/shake-game" element={
          <Layout title="シェイク！">
            <ShakeGame />
          </Layout>
        } />

        <Route path="/bingo" element={<Layout title="ビンゴ"><Bingo missions={bingoMissions} /></Layout>} />
        <Route path="/feedback" element={
          <Layout title="感想掲示板">
            <Feedback feedbacks={feedbacks} onAddFeedback={(e) => push(ref(db, 'feedbacks'), e)} onDeleteFeedback={(id) => remove(ref(db, `feedbacks/${id}`))} />
          </Layout>
        } />
        <Route path="/settings" element={
          <Settings themes={themes} setThemes={updateThemes} bingoMissions={bingoMissions} setBingoMissions={updateBingo} valueThemes={valueThemes} setValueThemes={updateValueThemes} />
        } />
        <Route path="/pair-quiz" element={
            <Layout title="ペアdeクイズ">
              <PairQuiz />
            </Layout>
        } />
        <Route path="/shiritori" element={
          <Layout title="しりとりハント">
            <Shiritori />
          </Layout>
        } />
      </Routes>
    </div>
  );
}

const appContainerStyle = {
  maxWidth: '600px',
  margin: '0 auto',
  minHeight: '100vh',
  backgroundColor: '#fff',
  display: 'flex',
  flexDirection: 'column',
  padding: '0 15px',
  boxSizing: 'border-box'
};

function Home() {
  return (
    <div style={{ textAlign: 'center', width: '100%', padding: '20px 0' }}>
      <h1 style={{ color: '#8c7b75', fontSize: '2rem', marginBottom: '30px' }}>🧊 Icebreak Cafe</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* ★ 追加：UniPort紹介へのリンクボタン */}
        <Link to="/about" style={{...homeButtonStyle, backgroundColor: '#e3f2fd', border: '1px solid #bbdefb'}}>⚓ UniPortについて</Link>
        
        <Link to="/talk-theme" style={homeButtonStyle}>💬 トークテーマガチャ</Link>
        <Link to="/value-talk" style={homeButtonStyle}>🃏 価値観トーク</Link>
        <Link to="/bingo" style={homeButtonStyle}>🎯 共通点ビンゴ</Link>
        <Link to="/pair-quiz" style={{...homeButtonStyle, backgroundColor: '#FF7043', color: '#fff'}}>🤝 ペアdeクイズ</Link>
        <Link to="/shake-game" style={{...homeButtonStyle, backgroundColor: '#FFC107'}}>🍾 シェイクバトル</Link>
        <Link to="/shiritori" style={{...homeButtonStyle, backgroundColor: '#81C784', color: '#fff'}}>🏃 しりとりハント</Link>
        <Link to="/feedback" style={{...homeButtonStyle, backgroundColor: '#8c7b75', color: '#fff'}}>📝 感想掲示板＆バトン</Link>
        <Link to="/settings" style={{...homeButtonStyle, backgroundColor: '#666', color: '#fff', fontSize: '0.9rem'}}>⚙ 設定</Link>
        <Link to="/pair-quiz" style={{...homeButtonStyle, backgroundColor: '#FF7043', color: '#fff'}}>🤝 ペアdeクイズ</Link>
      </div>
    </div>
  );
}

const homeButtonStyle = {
  display: 'block', padding: '18px', backgroundColor: '#f9f9f9', color: '#333',
  textDecoration: 'none', borderRadius: '15px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
};

export default App;