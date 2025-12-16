import { useState } from 'react';
import { THEME_LIST } from './data';

const TalkTheme = () => {
  const [theme, setTheme] = useState("ボタンを押してね！");
  const [isSpinning, setIsSpinning] = useState(false);

  const spinGacha = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    let count = 0;
    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * THEME_LIST.length);
      setTheme(THEME_LIST[randomIndex]);
      count++;

      if (count > 20) {
        clearInterval(intervalId);
        setIsSpinning(false);
      }
    }, 100);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
      <h2>💬 トークテーマガチャ</h2>
      
      <div style={{
        margin: '20px auto',
        padding: '30px',
        border: '4px solid #4CAF50',
        borderRadius: '15px',
        backgroundColor: '#fff',
        color: '#333',
        minHeight: '150px',      /* ★高さを少し広げました */
        width: '90%',            /* ★横幅を親要素の90%に固定 */
        maxWidth: '400px',       /* ★ただし広がりすぎないように最大幅を設定 */
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',      /* ★文字を大きくしました (1.2rem -> 1.5rem) */
        fontWeight: 'bold',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)' /* 少し影をつけてリッチに */
      }}>
        {theme}
      </div>

      <button 
        onClick={spinGacha} 
        disabled={isSpinning}
        style={{
          marginTop: '20px',
          padding: '15px 40px',
          fontSize: '1.2rem',
          backgroundColor: isSpinning ? '#ccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '30px',
          cursor: isSpinning ? 'default' : 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
        }}
      >
        {isSpinning ? "抽選中..." : "ガチャを回す！"}
      </button>
    </div>
  );
};

export default TalkTheme;