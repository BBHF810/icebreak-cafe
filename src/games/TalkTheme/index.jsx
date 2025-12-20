import { useState} from 'react';

const TalkTheme = ({ themes }) => {
  const [currentTheme, setCurrentTheme] = useState("ボタンを押してね");
  const [remainingIndices, setRemainingIndices] = useState([]);

  // 有効なお題（enabled: true）のみを抽出
  const activeThemes = themes.filter(t => t.enabled);

  const drawTheme = () => {
    if (activeThemes.length === 0) {
      setCurrentTheme("有効なお題がありません。設定でチェックを入れてください。");
      return;
    }

    let indices = [...remainingIndices];
    
    // 全て使い切ったらリストをリセット
    if (indices.length === 0) {
      indices = activeThemes.map((_, i) => i);
    }

    // 残りのリストからランダムに1つ選ぶ
    const randomIndex = Math.floor(Math.random() * indices.length);
    const themeIndex = indices[randomIndex];
    
    setCurrentTheme(activeThemes[themeIndex].text);

    // 選ばれたものを残りリストから削除
    indices.splice(randomIndex, 1);
    setRemainingIndices(indices);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div style={themeCardStyle}>
        {currentTheme}
      </div>
      
      <button onClick={drawTheme} style={gachaButtonStyle}>
        ガチャを回す
      </button>

      <div style={{ marginTop: '20px', color: '#999', fontSize: '0.9rem' }}>
        残りお題: {remainingIndices.length === 0 && currentTheme !== "ボタンを押してね" ? 0 : remainingIndices.length} / {activeThemes.length}
        {remainingIndices.length === 0 && currentTheme !== "ボタンを押してね" && (
          <p style={{ color: '#8c7b75', fontSize: '0.8rem' }}>※次で全てのお題がリセットされます</p>
        )}
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
  border: 'none', borderRadius: '35px', cursor: 'pointer', fontWeight: 'bold',
  boxShadow: '0 5px 15px rgba(140, 123, 117, 0.3)', transition: 'transform 0.1s'
};

export default TalkTheme;