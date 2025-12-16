import { useState } from 'react';

const THEMES = [
  "最近買った一番高いものは？",
  "子供の頃の将来の夢は？",
  "自分へのご褒美といえば？",
  "実は苦手な食べ物は？",
  "今一番行きたい旅行先は？",
  "最近「ついてないな」と思ったこと",
  "おすすめのスマホアプリは？",
  "学生のうちにやっておきたいことは？",
];

export default function TalkThemeGame() {
  const [theme, setTheme] = useState("スタートボタンを押してね");
  const [isAnimating, setIsAnimating] = useState(false);

  const handleGacha = () => {
    setIsAnimating(true);
    let count = 0;
    const interval = setInterval(() => {
      setTheme(THEMES[Math.floor(Math.random() * THEMES.length)]);
      count++;
      if (count > 10) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 50);
  };

  return (
    <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
      <div style={{
        minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.5rem', fontWeight: 'bold', background: '#fff', borderRadius: '20px',
        padding: '20px', margin: '40px 0', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', color: '#4a4a4a'
      }}>
        {theme}
      </div>
      <button onClick={handleGacha} disabled={isAnimating} style={{
        background: '#d4a373', color: '#fff', border: 'none', padding: '15px 50px',
        fontSize: '1.2rem', borderRadius: '50px', cursor: isAnimating ? 'wait' : 'pointer',
        opacity: isAnimating ? 0.7 : 1, boxShadow: '0 4px 10px rgba(212, 163, 115, 0.4)'
      }}>
        {isAnimating ? '抽選中...' : '話題をチェンジ'}
      </button>
    </div>
  );
}