import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { db } from './firebase'; 
import { ref, onValue, push, remove } from 'firebase/database'; // removeを追加

import TalkTheme from './games/TalkTheme';
import Bingo from './games/Bingo';
import ValueTalk from './games/ValueTalk';
import Feedback from './games/Feedback';
import Layout from './components/Layout';
import Settings from './components/Settings';

import { THEME_LIST } from './games/TalkTheme/data';
import { BINGO_MISSIONS } from './games/Bingo/data';
import { VALUE_THEME_LIST } from './games/ValueTalk/data';

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

function App() {
  const [themes, setThemes] = useState(() => JSON.parse(localStorage.getItem('icebreak_themes')) || THEME_LIST);
  const [bingoMissions, setBingoMissions] = useState(() => JSON.parse(localStorage.getItem('icebreak_bingo')) || BINGO_MISSIONS);
  const [valueThemes, setValueThemes] = useState(() => JSON.parse(localStorage.getItem('icebreak_value_themes')) || VALUE_THEME_LIST);

  // Firebaseで管理する感想データ
  const [feedbacks, setFeedbacks] = useState([]);

  // Firebaseからリアルタイムに読み込む
  useEffect(() => {
    const feedbacksRef = ref(db, 'feedbacks');
    const unsubscribe = onValue(feedbacksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const feedbackList = Object.keys(data).map(key => {
          // ★ 修正ポイント
          // Firebaseの自動生成キー(key)を確実にIDとして使うために、
          // スプレッド構文の後ろに id: key を書きます（これで確実に上書きします）
          return {
            ...data[key],
            id: key 
          };
        });
        setFeedbacks(feedbackList);
      } else {
        setFeedbacks([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Firebaseに投稿を追加
  const addFeedback = (entry) => {
    const feedbacksRef = ref(db, 'feedbacks');
    push(feedbacksRef, entry);
  };

  // ★ 追加: Firebaseのデータを削除
  const deleteFeedback = (id) => {
    // 診断用：削除しようとしているパスをログに出す
    console.log("削除対象のパス:", `feedbacks/${id}`);
    
    if (window.confirm("このメッセージを削除してもよろしいですか？")) {
      const feedbackRef = ref(db, `feedbacks/${id}`);
      remove(feedbackRef)
        .then(() => alert("削除完了の通信に成功しました。コンソールを確認してください。"))
        .catch((error) => alert("通信エラー: " + error.message));
    }
  };

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
            <Feedback 
              feedbacks={feedbacks} 
              onAddFeedback={addFeedback} 
              onDeleteFeedback={deleteFeedback} // 削除関数を渡す
            />
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

const buttonStyle = {
  display: 'block', padding: '20px', backgroundColor: '#f0f0f0', color: '#333',
  textDecoration: 'none', borderRadius: '12px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

export default App;