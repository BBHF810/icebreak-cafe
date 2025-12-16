import { useState } from 'react';

export default function Settings({ themes, setThemes, bingoMissions, setBingoMissions }) {
  const [newTheme, setNewTheme] = useState("");
  const [newMission, setNewMission] = useState("");

  // トークテーマの追加
  const addTheme = () => {
    if (newTheme.trim() === "") return;
    setThemes([...themes, newTheme]);
    setNewTheme("");
  };

  // トークテーマの削除
  const removeTheme = (index) => {
    const newThemes = [...themes];
    newThemes.splice(index, 1);
    setThemes(newThemes);
  };

  // ビンゴの追加
  const addMission = () => {
    if (newMission.trim() === "") return;
    // IDは現在時刻などを使って簡易的にユニークにする
    const newItem = { id: Date.now(), text: newMission, checked: false };
    setBingoMissions([...bingoMissions, newItem]);
    setNewMission("");
  };

  // ビンゴの削除
  const removeMission = (id) => {
    setBingoMissions(bingoMissions.filter(m => m.id !== id));
  };

  return (
    <div style={{ width: '100%', maxWidth: '500px' }}>
      <div style={sectionStyle}>
        <h3>💬 トークテーマ編集</h3>
        <div style={inputGroupStyle}>
          <input 
            value={newTheme} 
            onChange={(e) => setNewTheme(e.target.value)} 
            placeholder="新しいテーマ"
            style={inputStyle} 
          />
          <button onClick={addTheme} style={addButtonStyle}>追加</button>
        </div>
        <ul style={listStyle}>
          {themes.map((theme, index) => (
            <li key={index} style={itemStyle}>
              <span>{theme}</span>
              <button onClick={() => removeTheme(index)} style={deleteButtonStyle}>削除</button>
            </li>
          ))}
        </ul>
      </div>

      <div style={sectionStyle}>
        <h3>🎯 ビンゴ編集 (現在 {bingoMissions.length}個)</h3>
        <p style={{fontSize: '0.8rem', color: '#666'}}>※9個ちょうどにすると3x3できれいに並びます</p>
        <div style={inputGroupStyle}>
          <input 
            value={newMission} 
            onChange={(e) => setNewMission(e.target.value)} 
            placeholder="新しいミッション"
            style={inputStyle} 
          />
          <button onClick={addMission} style={addButtonStyle}>追加</button>
        </div>
        <ul style={listStyle}>
          {bingoMissions.map((mission) => (
            <li key={mission.id} style={itemStyle}>
              <span>{mission.text}</span>
              <button onClick={() => removeMission(mission.id)} style={deleteButtonStyle}>削除</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// 簡単なスタイル定義
const sectionStyle = { marginBottom: '40px', textAlign: 'left' };
const inputGroupStyle = { display: 'flex', gap: '10px', marginBottom: '15px' };
const inputStyle = { flex: 1, padding: '8px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px' };
const addButtonStyle = { backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', padding: '8px 16px' };
const listStyle = { listStyle: 'none', padding: 0, margin: 0 };
const itemStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', borderBottom: '1px solid #eee' };
const deleteButtonStyle = { backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '0.8rem', marginLeft: '10px' };