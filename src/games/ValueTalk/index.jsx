import { useState } from 'react';

const ValueTalk = ({ themes, setValueThemes }) => {
  const [themeText, setThemeText] = useState("お題を引いてね！");
  const [number, setNumber] = useState(null);
  const [isNumberVisible, setIsNumberVisible] = useState(false);
  const activeThemes = themes.filter(v => v.enabled);

  const drawCard = () => {
    if (activeThemes.length === 0) return setThemeText("有効なテーマがありません。");
    setThemeText(activeThemes[Math.floor(Math.random() * activeThemes.length)].text);
    setNumber(Math.floor(Math.random() * 100) + 1);
    setIsNumberVisible(false);
  };

  const hideTheme = () => {
    if (themeText === "お題を引いてね！") return;
    if (window.confirm("このお題を非表示にしますか？")) {
      setValueThemes(themes.map(v => v.text === themeText ? { ...v, enabled: false } : v));
      setThemeText("お題を引いてね！");
      setNumber(null);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '10px', width: '100%' }}>
      <div style={valueCardStyle}>{themeText}</div>
      {number !== null && (
        <div style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{fontSize: '0.85rem', color: '#666', marginBottom: '8px'}}>あなたの数字（タップで表示）</p>
          <button 
            onClick={() => setIsNumberVisible(!isNumberVisible)}
            style={{...circleButtonStyle, backgroundColor: isNumberVisible ? '#333' : '#eee', color: isNumberVisible ? '#fff' : '#333'}}
          >
            {isNumberVisible ? number : "???"}
          </button>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
        <button onClick={drawCard} style={drawButtonStyle}>カードを引く</button>
        {themeText !== "お題を引いてね！" && (
          <button onClick={hideTheme} style={hideButtonStyle}>× このお題を非表示にする</button>
        )}
      </div>
    </div>
  );
};

const valueCardStyle = {
  width: '100%',
  maxWidth: '400px',
  margin: '0 auto 20px',
  padding: '20px',
  border: '3px solid #FF9800',
  borderRadius: '15px',
  backgroundColor: '#fff',
  minHeight: '100px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.25rem',
  fontWeight: 'bold'
};

const circleButtonStyle = {
  width: '110px', height: '110px', borderRadius: '50%', border: 'none',
  fontSize: '2.5rem', fontWeight: 'bold', cursor: 'pointer',
  display: 'flex', justifyContent: 'center', alignItems: 'center', // 中央揃えの修復
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
};

const drawButtonStyle = { padding: '15px 45px', fontSize: '1.1rem', backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '30px', fontWeight: 'bold' };
const hideButtonStyle = { background: 'none', border: 'none', color: '#FF9800', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' };

export default ValueTalk;