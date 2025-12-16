import { useState } from 'react';

// propsに valueThemes, setValueThemes を追加
export default function Settings({ themes, setThemes, bingoMissions, setBingoMissions, valueThemes, setValueThemes }) {
  const [newTheme, setNewTheme] = useState("");
  const [newMission, setNewMission] = useState("");
  const [newValueTheme, setNewValueTheme] = useState(""); // 価値観トーク用

  // --- 既存の関数 ---
  const addTheme = () => {
    if (newTheme.trim() === "") return;
    setThemes([...themes, newTheme]);
    setNewTheme("");
  };
  const removeTheme = (index) => {
    const newThemes = [...themes];
    newThemes.splice(index, 1);
    setThemes(newThemes);
  };
  const addMission = () => {
    if (newMission.trim() === "") return;
    const newItem = { id: Date.now(), text: newMission, checked: false };
    setBingoMissions([...bingoMissions, newItem]);
    setNewMission("");
  };
  const removeMission = (id) => {
    setBingoMissions(bingoMissions.filter(m => m.id !== id));
  };

  // --- ★追加: 価値観トーク用の関数 ---
  const addValueTheme = () => {
    if (newValueTheme.trim() === "") return;
    setValueThemes([...valueThemes, newValueTheme]);
    setNewValueTheme("");
  };
  const removeValueTheme = (index) => {
    const newThemes = [...valueThemes];
    newThemes.splice(index, 1);
    setValueThemes(newThemes);
  };

  return (
    <div style={{ width: '100%', maxWidth: '500px' }}>
      {/* 既存: トークテーマ編集 */}
      <div style={sectionStyle}>
        <h3>💬 トークテーマ編集</h3>
        <div style={inputGroupStyle}>
          <input value={newTheme} onChange={(e) => setNewTheme(e.target.value)} placeholder="新しいテーマ" style={inputStyle} />
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

      {/* ★追加: 価値観トーク編集 */}
      <div style={sectionStyle}>
        <h3>🃏 価値観トーク編集</h3>
        <p style={{fontSize: '0.8rem', color: '#666'}}>※「強い動物」「高い買い物」など順位をつけられるお題がおすすめ</p>
        <div style={inputGroupStyle}>
          <input value={newValueTheme} onChange={(e) => setNewValueTheme(e.target.value)} placeholder="新しいお題" style={inputStyle} />
          <button onClick={addValueTheme} style={addButtonStyle}>追加</button>
        </div>
        <ul style={listStyle}>
          {valueThemes.map((theme, index) => (
            <li key={index} style={itemStyle}>
              <span>{theme}</span>
              <button onClick={() => removeValueTheme(index)} style={deleteButtonStyle}>削除</button>
            </li>
          ))}
        </ul>
      </div>

      {/* 既存: ビンゴ編集 */}
      <div style={sectionStyle}>
        <h3>🎯 ビンゴ編集 (現在 {bingoMissions.length}個)</h3>
        <div style={inputGroupStyle}>
          <input value={newMission} onChange={(e) => setNewMission(e.target.value)} placeholder="新しいミッション" style={inputStyle} />
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

// スタイル（変更なし）
const sectionStyle = { marginBottom: '40px', textAlign: 'left' };
const inputGroupStyle = { display: 'flex', gap: '10px', marginBottom: '15px' };
const inputStyle = { flex: 1, padding: '8px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px' };
const addButtonStyle = { backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', padding: '8px 16px' };
const listStyle = { listStyle: 'none', padding: 0, margin: 0 };
const itemStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', borderBottom: '1px solid #eee' };
const deleteButtonStyle = { backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '0.8rem', marginLeft: '10px' };