import { useState } from 'react';

const TalkTheme = ({ themes, setThemes }) => {
  const [currentTheme, setCurrentTheme] = useState("ボタンを押してね");
  const [remainingIndices, setRemainingIndices] = useState([]);
  const activeThemes = themes.filter(t => t.enabled);

  const drawTheme = () => {
    if (activeThemes.length === 0) return setCurrentTheme("有効なお題がありません。");
    let indices = [...remainingIndices];
    if (indices.length === 0) indices = activeThemes.map((_, i) => i);
    const idx = Math.floor(Math.random() * indices.length);
    setCurrentTheme(activeThemes[indices[idx]].text);
    indices.splice(idx, 1);
    setRemainingIndices(indices);
  };

  const hideTheme = () => {
    if (currentTheme === "ボタンを押してね") return;
    if (window.confirm("このお題を非表示にしますか？")) {
      setThemes(themes.map(t => t.text === currentTheme ? { ...t, enabled: false } : t));
      setCurrentTheme("ボタンを押してね");
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '10px', width: '100%' }}>
      <div style={themeCardStyle}>{currentTheme}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
        <button onClick={drawTheme} style={gachaButtonStyle}>ガチャを回す</button>
        {currentTheme !== "ボタンを押してね" && (
          <button onClick={hideTheme} style={hideButtonStyle}>× このお題を非表示にする</button>
        )}
      </div>
      <div style={{ marginTop: '20px', color: '#999', fontSize: '0.85rem' }}>
        残りお題: {remainingIndices.length === 0 && currentTheme !== "ボタンを押してね" ? 0 : remainingIndices.length} / {activeThemes.length}
      </div>
    </div>
  );
};

const themeCardStyle = {
  width: '100%',             // 画面幅に合わせる
  maxWidth: '450px',
  margin: '0 auto 30px',
  minHeight: '160px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fff',
  borderRadius: '25px',
  padding: '20px',
  fontSize: '1.25rem',      // スマホでも見やすいサイズ
  fontWeight: 'bold',
  lineHeight: '1.5',
  boxShadow: '0 8px 20px rgba(140, 123, 117, 0.12)',
  border: '2px solid #f0f0f0'
};

const gachaButtonStyle = {
  width: '80%',              // スマホで押しやすい幅
  maxWidth: '300px',
  padding: '16px',
  fontSize: '1.1rem',
  background: '#8c7b75',
  color: '#fff',
  border: 'none',
  borderRadius: '30px',
  cursor: 'pointer',
  fontWeight: 'bold',
  boxShadow: '0 4px 12px rgba(140, 123, 117, 0.3)'
};

const hideButtonStyle = { background: 'none', border: 'none', color: '#8c7b75', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' };

export default TalkTheme;