import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { db } from './firebase'; 
import { ref, onValue, set, push, remove } from 'firebase/database'; // setを追加

import TalkTheme from './games/TalkTheme';
import Bingo from './games/Bingo';
import ValueTalk from './games/ValueTalk';
import Feedback from './games/Feedback';
import Layout from './components/Layout';
import Settings from './components/Settings';

import { THEME_LIST } from './games/TalkTheme/data'; //
import { BINGO_MISSIONS } from './games/Bingo/data'; //
import { VALUE_THEME_LIST } from './games/ValueTalk/data'; //

function App() {
  const [themes, setThemes] = useState([]);
  const [bingoMissions, setBingoMissions] = useState([]);
  const [valueThemes, setValueThemes] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  // --- Firebase 同期処理 ---

  useEffect(() => {
    // 1. トークテーマの同期
    const themesRef = ref(db, 'themes');
    onValue(themesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setThemes(data);
      } else {
        // DBが空なら初期データをセット
        const initial = THEME_LIST.map(t => ({ text: t, enabled: true }));
        set(themesRef, initial);
      }
    });

    // 2. ビンゴミッションの同期
    const bingoRef = ref(db, 'bingo');
    onValue(bingoRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setBingoMissions(data);
      } else {
        set(bingoRef, BINGO_MISSIONS);
      }
    });

    // 3. 価値観トークの同期
    const valueRef = ref(db, 'valueThemes');
    onValue(valueRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setValueThemes(data);
      } else {
        const initial = VALUE_THEME_LIST.map(v => ({ text: v, enabled: true }));
        set(valueRef, initial);
      }
    });

    // 4. 感想掲示板の同期 (既存)
    const feedbacksRef = ref(db, 'feedbacks');
    const unsubscribeFeedback = onValue(feedbacksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setFeedbacks(Object.keys(data).map(key => ({ ...data[key], id: key })));
      } else {
        setFeedbacks([]);
      }
    });

    return () => unsubscribeFeedback();
  }, []);

  // --- データ更新関数 (Firebaseへ書き込む) ---

  const updateThemes = (newData) => set(ref(db, 'themes'), newData);
  const updateBingo = (newData) => set(ref(db, 'bingo'), newData);
  const updateValueThemes = (newData) => set(ref(db, 'valueThemes'), newData);

  const addFeedback = (entry) => push(ref(db, 'feedbacks'), entry);
  const deleteFeedback = (id) => {
    if (window.confirm("このメッセージを削除してもよろしいですか？")) {
      remove(ref(db, `feedbacks/${id}`));
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#fff' }}>
      <Routes>
        <Route path="/" element={<Layout title="メニュー" showBackBtn={false}><Home /></Layout>} />
        <Route path="/talk-theme" element={
          <Layout title="ガチャ">
            <TalkTheme 
              key={themes.filter(t => t.enabled).length} 
              themes={themes} 
              setThemes={updateThemes} 
            />
          </Layout>
        } />
        <Route path="/value-talk" element={
          <Layout title="価値観トーク">
            <ValueTalk 
              key={valueThemes.filter(v => v.enabled).length} 
              themes={valueThemes} 
              setValueThemes={updateValueThemes} 
            />
          </Layout>
        } />
        <Route path="/bingo" element={<Layout title="ビンゴ"><Bingo missions={bingoMissions} /></Layout>} />
        <Route path="/feedback" element={<Layout title="感想掲示板"><Feedback feedbacks={feedbacks} onAddFeedback={addFeedback} onDeleteFeedback={deleteFeedback} /></Layout>} />
        <Route path="/settings" element={
          <Settings 
            themes={themes} setThemes={updateThemes} 
            bingoMissions={bingoMissions} setBingoMissions={updateBingo} 
            valueThemes={valueThemes} setValueThemes={updateValueThemes} 
          />
        } />
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