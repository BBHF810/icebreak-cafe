import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { db } from './firebase'; // ★追加
import { ref, onValue, push } from 'firebase/database'; // ★追加
import TalkTheme from './games/TalkTheme';
import Bingo from './games/Bingo';
import ValueTalk from './games/ValueTalk';
import Feedback from './games/Feedback';
import Layout from './components/Layout';
import Settings from './components/Settings';

// 初期データ（THEME_LIST, BINGO_MISSIONS, VALUE_THEME_LIST は以前のまま）
import { THEME_LIST } from './games/TalkTheme/data';
import { BINGO_MISSIONS } from './games/Bingo/data';
import { VALUE_THEME_LIST } from './games/ValueTalk/data';

function App() {
  // ローカルストレージを使うデータ（テーマ設定など）
  const [themes, setThemes] = useState(() => JSON.parse(localStorage.getItem('icebreak_themes')) || THEME_LIST);
  const [bingoMissions, setBingoMissions] = useState(() => JSON.parse(localStorage.getItem('icebreak_bingo')) || BINGO_MISSIONS);
  const [valueThemes, setValueThemes] = useState(() => JSON.parse(localStorage.getItem('icebreak_value_themes')) || VALUE_THEME_LIST);

  // ★ Firebaseで管理するデータ（感想）
  const [feedbacks, setFeedbacks] = useState([]);

  // ★ 追加: Firebaseからリアルタイムに読み込む処理
  useEffect(() => {
    const feedbacksRef = ref(db, 'feedbacks');
    const unsubscribe = onValue(feedbacksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Firebaseのオブジェクト形式を配列に変換
        const feedbackList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setFeedbacks(feedbackList);
      } else {
        setFeedbacks([]);
      }
    });
    return () => unsubscribe(); // 画面を閉じるときに接続を切る
  }, []);

  // ★ 追加: Firebaseに保存する処理
  const addFeedback = (entry) => {
    const feedbacksRef = ref(db, 'feedbacks');
    push(feedbacksRef, entry);
  };

  // ローカル設定の保存（useEffectはそのまま）
  useEffect(() => { localStorage.setItem('icebreak_themes', JSON.stringify(themes)); }, [themes]);
  useEffect(() => { localStorage.setItem('icebreak_bingo', JSON.stringify(bingoMissions)); }, [bingoMissions]);
  useEffect(() => { localStorage.setItem('icebreak_value_themes', JSON.stringify(valueThemes)); }, [valueThemes]);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#fff' }}>
      <Routes>
        <Route path="/" element={<Layout title="メニュー" showBackBtn={false}><Home /></Layout>} />
        <Route path="/talk-theme" element={<Layout title="ガチャ"><TalkTheme themes={themes} /></Layout>} />
        <Route path="/value-talk" element={<Layout title="価値観トーク"><ValueTalk themes={valueThemes} /></Layout>} />
        <Route path="/bingo" element={<Layout title="ビンゴ"><Bingo missions={bingoMissions} /></Layout>} />
        <Route path="/feedback" element={
          <Layout title="感想掲示板">
            {/* リアルタイム掲示板へ */}
            <Feedback feedbacks={feedbacks} onAddFeedback={addFeedback} />
          </Layout>
        } />
        <Route path="/settings" element={
          <Layout title="設定">
            <Settings themes={themes} setThemes={setThemes} bingoMissions={bingoMissions} setBingoMissions={setBingoMissions} valueThemes={valueThemes} setValueThemes={setValueThemes} />
          </Layout>
        } />
      </Routes>
    </div>
  );
}

// Homeコンポーネントは以前作成した「感想ボタン」があるものを使ってください
function Home() {
  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <h1>🧊 Icebreak Cafe</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px' }}>
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
  display: 'block', padding: '20px', backgroundColor: '#f0f0f0', color: '#333',
  textDecoration: 'none', borderRadius: '12px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

export default App;