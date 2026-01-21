import { useState } from 'react';
import { QUIZ_DATA } from './data';

const PairQuiz = () => {
  const [score, setScore] = useState(0);
  const [currentCard, setCurrentCard] = useState(null);
  const [answeredCount, setAnsweredCount] = useState(0);

  // カードを引く処理
  const drawCard = (level) => {
    // 選択されたレベルの質問のみを抽出
    const candidates = QUIZ_DATA.filter(q => q.level === level);
    if (candidates.length === 0) return;
    
    // ランダムに1つ選択
    const randomCard = candidates[Math.floor(Math.random() * candidates.length)];
    setCurrentCard(randomCard);
  };

  // 回答完了処理
  const handleAnswered = () => {
    if (!currentCard) return;
    setScore(score + currentCard.points);
    setAnsweredCount(answeredCount + 1);
    setCurrentCard(null);
  };

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      {/* スコアボード */}
      <div style={scoreBoardStyle}>
        <div>TEAM SCORE</div>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#FF9800' }}>{score}</div>
        <div style={{ fontSize: '0.8rem', color: '#666' }}>回答数: {answeredCount}問</div>
      </div>

      {/* カード表示エリア or 選択ボタン */}
      <div style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0' }}>
        {currentCard ? (
          // 質問カード表示中
          <div style={questionCardStyle}>
            <div style={{ ...badgeStyle, backgroundColor: getLevelColor(currentCard.level) }}>
              Lv.{currentCard.level} ({currentCard.points}点)
            </div>
            <p style={{ fontSize: '1.2rem', margin: '20px 0', lineHeight: '1.6' }}>
              {currentCard.text}
            </p>
            <button onClick={handleAnswered} style={answerButtonStyle}>
              回答してポイントGET!
            </button>
            <button onClick={() => setCurrentCard(null)} style={cancelButtonStyle}>
              パスする
            </button>
          </div>
        ) : (
          // カード選択画面
          <div style={{ width: '100%' }}>
            <p style={{ marginBottom: '15px', fontWeight: 'bold', color: '#8c7b75' }}>質問の難易度を選んでね</p>
            <div style={{ display: 'grid', gap: '15px' }}>
              <button onClick={() => drawCard(1)} style={{ ...levelButtonStyle, borderLeft: '5px solid #4CAF50' }}>
                <span style={{ fontWeight: 'bold', color: '#4CAF50' }}>Lv.1 気軽に</span>
                <span style={{ fontSize: '0.9rem', color: '#888' }}>10点 GET</span>
              </button>
              <button onClick={() => drawCard(2)} style={{ ...levelButtonStyle, borderLeft: '5px solid #2196F3' }}>
                <span style={{ fontWeight: 'bold', color: '#2196F3' }}>Lv.2 ちょっと深く</span>
                <span style={{ fontSize: '0.9rem', color: '#888' }}>30点 GET</span>
              </button>
              <button onClick={() => drawCard(3)} style={{ ...levelButtonStyle, borderLeft: '5px solid #E91E63' }}>
                <span style={{ fontWeight: 'bold', color: '#E91E63' }}>Lv.3 本音で</span>
                <span style={{ fontSize: '0.9rem', color: '#888' }}>50点 GET</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '10px', fontSize: '0.85rem', color: '#666', textAlign: 'left' }}>
        <strong>遊び方：</strong><br />
        1. 2人チームを作ります。<br />
        2. 交代で質問カードを引きます。<br />
        3. 引いた人が相手に質問するか、引いた質問に2人で答えます。<br />
        4. 自己開示できたらポイントゲット！
      </div>
    </div>
  );
};

// ヘルパー関数: レベルごとの色
const getLevelColor = (level) => {
  switch(level) {
    case 1: return '#4CAF50';
    case 2: return '#2196F3';
    case 3: return '#E91E63';
    default: return '#999';
  }
};

// スタイル定義
const scoreBoardStyle = {
  background: '#fff',
  padding: '15px',
  borderRadius: '15px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  marginBottom: '20px',
  border: '1px solid #eee'
};

const levelButtonStyle = {
  width: '100%',
  padding: '20px',
  background: '#fff',
  border: 'none',
  borderRadius: '10px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '1rem',
  transition: 'transform 0.1s',
};

const questionCardStyle = {
  width: '100%',
  background: '#fff',
  padding: '30px 20px',
  borderRadius: '15px',
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  position: 'relative',
  border: '2px solid #FF9800',
  animation: 'popIn 0.3s ease-out'
};

const badgeStyle = {
  position: 'absolute',
  top: '-15px',
  left: '50%',
  transform: 'translateX(-50%)',
  color: 'white',
  padding: '5px 15px',
  borderRadius: '20px',
  fontWeight: 'bold',
  fontSize: '0.9rem',
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
};

const answerButtonStyle = {
  width: '100%',
  padding: '15px',
  backgroundColor: '#FF9800',
  color: 'white',
  border: 'none',
  borderRadius: '30px',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: '10px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
};

const cancelButtonStyle = {
  marginTop: '15px',
  background: 'none',
  border: 'none',
  color: '#999',
  cursor: 'pointer',
  textDecoration: 'underline'
};

export default PairQuiz;