import { useState } from 'react';

// propsとして themes を受け取る
const TalkTheme = ({ themes }) => {
  const [theme, setTheme] = useState("ボタンを押してね！");
  const [isSpinning, setIsSpinning] = useState(false);

  const spinGacha = () => {
    if (isSpinning) return;
    // テーマが空の場合のガード
    if (!themes || themes.length === 0) {
      setTheme("テーマを追加してください！");
      return;
    }

    setIsSpinning(true);

    let count = 0;
    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * themes.length);
      setTheme(themes[randomIndex]);
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
        
        /* ★ここから：サイズ固定の設定 */
        minHeight: '150px',      /* 高さは最低150px */
        width: '300px',          /* 横幅は320pxで固定しようとする */
        maxWidth: '90%',         /* ただし画面が狭いときは画面の90%に収める */
        /* ★ここまで */

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        wordBreak: 'break-word'  /* 長い単語でも折り返す */
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