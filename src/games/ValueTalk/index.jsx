import { useState } from 'react';

const ValueTalk = ({ themes }) => {
  const [theme, setTheme] = useState("お題を引いてね！");
  const [number, setNumber] = useState(null);
  const [isNumberVisible, setIsNumberVisible] = useState(false);

  const drawCard = () => {
    // テーマが空の場合のガード
    if (!themes || themes.length === 0) {
      setTheme("テーマを追加してください！");
      return;
    }

    // ランダムなテーマ
    const randomThemeIndex = Math.floor(Math.random() * themes.length);
    setTheme(themes[randomThemeIndex]);

    // 1〜100のランダムな数字
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    setNumber(randomNumber);
    
    // 数字は最初は隠しておく（周りに見えないように）
    setIsNumberVisible(false);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
      <h2>🃏 価値観トーク</h2>
      <p style={{marginBottom: '20px'}}>数字の大きさを「言葉」で表現しよう！</p>
      
      {/* お題表示エリア */}
      <div style={{
        margin: '0 auto 20px',
        padding: '20px',
        border: '4px solid #FF9800',
        borderRadius: '15px',
        backgroundColor: '#fff',
        color: '#333',
        width: '320px',
        maxWidth: '90%',
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.4rem',
        fontWeight: 'bold',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        wordBreak: 'break-word'
      }}>
        {theme}
      </div>

      {/* 数字表示エリア */}
      {number !== null && (
        <div style={{ 
          marginBottom: '30px', 
          display: 'flex',           /* ★追加：中身をFlex配置にする */
          flexDirection: 'column',    /* ★追加：縦に並べる */
          alignItems: 'center',       /* ★追加：横方向の中央に寄せる */
          width: '100%'               /* ★追加：幅をいっぱいまで広げる */
        }}>
          <p style={{fontSize: '0.9rem', color: '#666'}}>あなたの数字（タップで表示/非表示）</p>
          <button 
            onClick={() => setIsNumberVisible(!isNumberVisible)}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: isNumberVisible ? '#333' : '#ddd',
              color: isNumberVisible ? '#fff' : '#333',
              fontSize: isNumberVisible ? '3rem' : '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 0,
              margin: '0 auto'        /* ★念のため：外側の余白を均等にする */
            }}
          >
            {isNumberVisible ? number : "???"}
          </button>
        </div>
      )}

      <button 
        onClick={drawCard} 
        style={{
          padding: '15px 40px',
          fontSize: '1.2rem',
          backgroundColor: '#FF9800',
          color: 'white',
          border: 'none',
          borderRadius: '30px',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
        }}
      >
        カードを引く
      </button>
    </div>
  );
};

export default ValueTalk;