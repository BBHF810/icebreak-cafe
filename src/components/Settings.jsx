import { useState } from 'react';
import Layout from './Layout';

const Settings = ({ 
  themes, setThemes, 
  bingoMissions, setBingoMissions, 
  valueThemes, setValueThemes 
}) => {
  const [newTheme, setNewTheme] = useState("");
  const [newBingo, setNewBingo] = useState("");
  const [newValue, setNewValue] = useState("");

  const addTheme = () => {
    if (!newTheme.trim()) return;
    setThemes([...themes, { text: newTheme, enabled: true }]);
    setNewTheme("");
  };

  const addBingo = () => {
    if (!newBingo.trim()) return;
    setBingoMissions([...bingoMissions, { id: Date.now(), text: newBingo, checked: false }]);
    setNewBingo("");
  };

  const addValue = () => {
    if (!newValue.trim()) return;
    setValueThemes([...valueThemes, { text: newValue, enabled: true }]);
    setNewValue("");
  };

  return (
    <Layout title="設定">
      <div style={{ padding: '20px', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
        
        {/* 1. トークテーマ管理 */}
        <section style={sectionStyle}>
          <h3 style={titleStyle}>💬 トークテーマ管理</h3>
          <div style={inputGroupStyle}>
            <input value={newTheme} onChange={(e) => setNewTheme(e.target.value)} placeholder="新お題..." style={inputStyle} />
            <button onClick={addTheme} style={addButtonStyle}>追加</button>
          </div>
          <div style={listStyle}>
            {themes.map((t, i) => (
              <div key={i} style={{...listItemStyle, opacity: t.enabled ? 1 : 0.4}}>
                {/* チェックボックスを削除し、非表示中のものは「復元」ボタンを表示 */}
                <span style={{flex: 1}}>{t.text} {!t.enabled && "(非表示中)"}</span>
                {!t.enabled && (
                  <button onClick={() => {
                    const updated = [...themes];
                    updated[i].enabled = true;
                    setThemes(updated);
                  }} style={{...deleteButtonStyle, color: '#8c7b75', marginRight: '10px'}}>復元</button>
                )}
                <button onClick={() => setThemes(themes.filter((_, idx) => idx !== i))} style={deleteButtonStyle}>削除</button>
              </div>
            ))}
          </div>
        </section>

        {/* 2. ビンゴ管理（復活） */}
        <section style={sectionStyle}>
          <h3 style={titleStyle}>🎯 ビンゴのミッション</h3>
          <div style={inputGroupStyle}>
            <input value={newBingo} onChange={(e) => setNewBingo(e.target.value)} placeholder="新ミッション..." style={inputStyle} />
            <button onClick={addBingo} style={addButtonStyle}>追加</button>
          </div>
          <div style={listStyle}>
            {bingoMissions.map((m) => (
              <div key={m.id} style={listItemStyle}>
                <span style={{flex: 1}}>{m.text}</span>
                <button onClick={() => setBingoMissions(bingoMissions.filter(item => item.id !== m.id))} style={deleteButtonStyle}>削除</button>
              </div>
            ))}
          </div>
        </section>

        {/* 3. 価値観トーク管理 */}
        <section style={sectionStyle}>
          <h3 style={titleStyle}>🃏 価値観トーク管理</h3>
          <div style={inputGroupStyle}>
            <input value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="新お題..." style={inputStyle} />
            <button onClick={addValue} style={addButtonStyle}>追加</button>
          </div>
          <div style={listStyle}>
            {valueThemes.map((v, i) => (
              <div key={i} style={{...listItemStyle, opacity: v.enabled ? 1 : 0.4}}>
                <input type="checkbox" checked={v.enabled} onChange={() => {
                  const updated = [...valueThemes];
                  updated[i].enabled = !updated[i].enabled;
                  setValueThemes(updated);
                }} />
                <span style={{flex: 1, marginLeft: '10px'}}>{v.text}</span>
                <button onClick={() => setValueThemes(valueThemes.filter((_, idx) => idx !== i))} style={deleteButtonStyle}>削除</button>
              </div>
            ))}
          </div>
        </section>

      </div>
    </Layout>
  );
};

const sectionStyle = { marginBottom: '30px' };
const titleStyle = { borderLeft: '4px solid #8c7b75', paddingLeft: '10px', marginBottom: '10px', fontSize: '1.1rem' };
const inputGroupStyle = { display: 'flex', gap: '5px', marginBottom: '10px' };
const inputStyle = { flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd' };
const addButtonStyle = { padding: '0 15px', background: '#8c7b75', color: '#fff', border: 'none', borderRadius: '8px' };
const listStyle = { background: '#f9f9f9', borderRadius: '10px', padding: '10px', maxHeight: '200px', overflowY: 'auto' };
const listItemStyle = { display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eee' };
const deleteButtonStyle = { background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' };

export default Settings;