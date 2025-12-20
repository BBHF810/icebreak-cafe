import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { db } from './firebase'; 
import { ref, onValue, push, remove } from 'firebase/database';

import TalkTheme from './games/TalkTheme';
import Bingo from './games/Bingo';
import ValueTalk from './games/ValueTalk';
import Feedback from './games/Feedback';
import Layout from './components/Layout';
import Settings from './components/Settings';

import { THEME_LIST } from './games/TalkTheme/data';
import { BINGO_MISSIONS } from './games/Bingo/data';
import { VALUE_THEME_LIST } from './games/ValueTalk/data';

function App() {
  // --- トークテーマの状態管理 (オブジェクト形式への変換付き) ---
  const [themes, setThemes] = useState(() => {
    const saved = localStorage.getItem('icebreak_themes');
    if (saved) {
      const parsed = JSON.parse(saved);
      // 古い文字列配列だった場合、または形式が違う場合にオブジェクト形式に変換
      return parsed.map(t => typeof t === 'string' ? { text: t, enabled: true } : t);
    }
    // 初期データもオブジェクト形式に変換
    return THEME_LIST.map(t => ({ text: t, enabled: true }));
  });

  const [bingoMissions, setBingoMissions] = useState(() => JSON.parse(localStorage.getItem('icebreak_bingo')) || BINGO_MISSIONS);
  const [valueThemes, setValueThemes] = useState(() => JSON.parse(localStorage.getItem('icebreak_value_themes')) || VALUE_THEME_LIST);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const feedbacksRef = ref(db, 'feedbacks');
    const unsubscribe = onValue(feedbacksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const feedbackList = Object.keys(data).map(key => ({ ...data[key], id: key }));
        setFeedbacks(feedbackList);
      } else {
        setFeedbacks([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const addFeedback = (entry) => { push(ref(db, 'feedbacks'), entry); };
  const deleteFeedback = (id) => {
    if (window.confirm("このメッセージを削除してもよろしいですか？")) {
      remove(ref(db, `feedbacks/${id}`));
    }
  };

  // ローカル保存
  useEffect(() => { localStorage.setItem('icebreak_themes', JSON.stringify(themes)); }, [themes]);
  useEffect(() => { localStorage.setItem('icebreak_bingo', JSON.stringify(bingoMissions)); }, [bingoMissions]);
  useEffect(() => { localStorage.setItem('icebreak_value_themes', JSON.stringify(valueThemes)); }, [valueThemes]);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#fff' }}>
      <Routes>
        <Route path="/" element={<Layout title="メニュー" showBackBtn={false}><Home /></Layout>} />
        <Route path="/talk-theme" element={<Layout title="ガチャ"><TalkTheme key={themes.filter(t => t.enabled).length} themes={themes} /></Layout>} />
        <Route path="/value-talk" element={<Layout title="価値観トーク"><ValueTalk themes={valueThemes} /></Layout>} />
        <Route path="/bingo" element={<Layout title="ビンゴ"><Bingo missions={bingoMissions} /></Layout>} />
        <Route path="/feedback" element={<Layout title="感想掲示板"><Feedback feedbacks={feedbacks} onAddFeedback={addFeedback} onDeleteFeedback={deleteFeedback} /></Layout>} />
        <Route path="/settings" element={<Layout title="設定"><Settings themes={themes} setThemes={setThemes} bingoMissions={bingoMissions} setBingoMissions={setBingoMissions} valueThemes={valueThemes} setValueThemes={setValueThemes} /></Layout>} />
      </Routes>
    </div>
  );
}

function Home() {
  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <h1 style={{ color: '#8c7b75', marginTop: '40px' }}>🧊 Icebreak Cafe</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px', padding: '0 20px' }}>
        <Link to="/talk-theme" style={buttonStyle}>💬 トークテーマガチャ</Link>
        <Link to="/value-talk" style={buttonStyle}>🃏 価値観トーク</Link>
        <Link to="/bingo" style={buttonStyle}>🎯 共通点ビンゴ</Link>
        <Link to="/feedback" style={{...buttonStyle, backgroundColor: '#8c7b75', color: '#fff'}}>📝 感想掲示板＆バトン</Link>
        <Link to="/settings" style={{...buttonStyle, backgroundColor: '#666', color: '#fff'}}>⚙ 設定</Link>
      </div>
    </div>
  );
}

const buttonStyle = {
  display: 'block', padding: '20px', backgroundColor: '#f9f9f9', color: '#333',
  textDecoration: 'none', borderRadius: '15px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
};

export default App;