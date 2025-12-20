import { useState } from 'react';

const TalkTheme = ({ themes, setThemes }) => {
  const [currentTheme, setCurrentTheme] = useState("ボタンを押してね");
  const [remainingIndices, setRemainingIndices] = useState([]);

  const activeThemes = themes.filter(t => t.enabled);

  const drawTheme = () => {
    if (activeThemes.length === 0) {
      setCurrentTheme("有効なお題がありません。");
      return;
    }

    let indices = [...remainingIndices];
    if (indices.length === 0) {
      indices = activeThemes.map((_, i) => i);
    }

    const randomIndex = Math.floor(Math.random() * indices.length);
    const themeIndex = indices[randomIndex];
    
    setCurrentTheme(activeThemes[themeIndex].text);
    indices.splice(randomIndex, 1);
    setRemainingIndices(indices);
  };

  const hideCurrentTheme = () => {
    if (currentTheme === "ボタンを押してね") return;
    if (window.confirm("このお題を非表示にしますか？")) {
      const updated = themes.map(t => t.text === currentTheme ? { ...t, enabled: false } : t);
      setThemes(updated);
      setCurrentTheme("ボタンを押してね");
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div style={themeCardStyle}>{currentTheme}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
        <button onClick={drawTheme} style={gachaButtonStyle}>ガチャを回す</button>
        {currentTheme !== "ボタンを押してね" && (
          <button onClick={hideCurrentTheme} style={hideButtonStyle}>× このお題を非表示にする</button>
        )}
      </div>
      <div style={{ marginTop: '20px', color: '#999', fontSize: '0.9rem' }}>
        残りお題: {remainingIndices.length === 0 && currentTheme !== "ボタンを押してね" ? 0 : remainingIndices.length} / {activeThemes.length}
      </div>
    </div>
  );
};

const themeCardStyle = {
  minHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: '#fff', borderRadius: '25px', padding: '30px', marginBottom: '30px',
  fontSize: '1.4rem', fontWeight: 'bold', lineHeight: '1.4',
  boxShadow: '0 10px 25px rgba(140, 123, 117, 0.15)', border: '2px solid #eee'
};

const gachaButtonStyle = {
  padding: '18px 50px', fontSize: '1.2rem', background: '#8c7b75', color: '#fff',
  border: 'none', borderRadius: '35px', cursor: 'pointer', fontWeight: 'bold'
};

const hideButtonStyle = {
  background: 'none', border: 'none', color: '#8c7b75', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline'
};

export default TalkTheme;