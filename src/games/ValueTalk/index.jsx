import { useState } from 'react';

const ValueTalk = ({ themes, setValueThemes }) => {
  const [themeText, setThemeText] = useState("お題を引いてね！");
  const [number, setNumber] = useState(null);
  const [isNumberVisible, setIsNumberVisible] = useState(false);

  const activeThemes = themes.filter(v => v.enabled);

  const drawCard = () => {
    if (activeThemes.length === 0) {
      setThemeText("有効なテーマがありません。");
      return;
    }
    const randomIndex = Math.floor(Math.random() * activeThemes.length);
    setThemeText(activeThemes[randomIndex].text);
    setNumber(Math.floor(Math.random() * 100) + 1);
    setIsNumberVisible(false);
  };

  const hideCurrentTheme = () => {
    if (themeText === "お題を引いてね！") return;
    if (window.confirm("このお題を非表示にしますか？（設定画面で戻せます）")) {
      const updated = themes.map(v => v.text === themeText ? { ...v, enabled: false } : v);
      setValueThemes(updated);
      setThemeText("お題を引いてね！");
      setNumber(null);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
      <h2>🃏 価値観トーク</h2>
      <div style={cardDisplayStyle}>{themeText}</div>

      {number !== null && (
        <div style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '10px'}}>あなたの数字（タップで表示）</p>
          <button 
            onClick={() => setIsNumberVisible(!isNumberVisible)}
            style={{
              ...numberButtonStyle, 
              backgroundColor: isNumberVisible ? '#333' : '#ddd', 
              color: isNumberVisible ? '#fff' : '#333'
            }}
          >
            {isNumberVisible ? number : "???"}
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
        <button onClick={drawCard} style={drawButtonStyle}>カードを引く</button>
        {themeText !== "お題を引いてね！" && (
          <button onClick={hideCurrentTheme} style={hideButtonStyle}>× このお題を非表示にする</button>
        )}
      </div>
    </div>
  );
};

// スタイル修正：中央揃えを確実に
const cardDisplayStyle = {
  margin: '0 auto 20px', padding: '20px', border: '4px solid #FF9800', borderRadius: '15px',
  backgroundColor: '#fff', color: '#333', width: '320px', maxWidth: '95%', minHeight: '100px',
  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 'bold'
};

const numberButtonStyle = {
  width: '120px', height: '120px', borderRadius: '50%', border: 'none', 
  fontSize: '3rem', fontWeight: 'bold', cursor: 'pointer',
  display: 'flex', justifyContent: 'center', alignItems: 'center', // 中央揃え
  boxShadow: '0 4px 6px rgba(0,0,0,0.2)', padding: 0
};

const drawButtonStyle = {
  padding: '15px 40px', fontSize: '1.2rem', backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer'
};

const hideButtonStyle = {
  background: 'none', border: 'none', color: '#FF9800', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline'
};

export default ValueTalk;