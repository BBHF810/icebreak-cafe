import { useState } from 'react';
import { THEME_LIST } from './data'; // ★さっき作ったデータを読み込む

const TalkTheme = () => {
  const [theme, setTheme] = useState("ボタンを押してね！");
  const [isSpinning, setIsSpinning] = useState(false);

  const spinGacha = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    let count = 0;
    // ルーレット演出
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
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>💬 トークテーマガチャ</h2>
      
      <div style={{
        margin: '20px auto',
        padding: '30px',
        border: '4px solid #4CAF50',
        borderRadius: '15px',
        backgroundColor: '#fff', // 背景は白
        color: '#333',           // ★ここを追加！ (文字を黒っぽい色にする)
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        fontWeight: 'bold'
      }}>
        {theme}
      </div>

      <button 
        onClick={spinGacha} 
        disabled={isSpinning}
        style={{
          padding: '15px 40px',
          fontSize: '1.1rem',
          backgroundColor: isSpinning ? '#ccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '30px',
          cursor: isSpinning ? 'default' : 'pointer',
        }}
      >
        {isSpinning ? "抽選中..." : "ガチャを回す！"}
      </button>
    </div>
  );
};

export default TalkTheme;