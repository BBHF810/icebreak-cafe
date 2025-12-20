import { useState } from 'react';

const Settings = ({ themes, setThemes }) => {
  const [newTheme, setNewTheme] = useState("");

  const addTheme = () => {
    if (!newTheme.trim()) return;
    setThemes([...themes, { text: newTheme, enabled: true }]);
    setNewTheme("");
  };

  const toggleTheme = (index) => {
    const updated = [...themes];
    updated[index].enabled = !updated[index].enabled;
    setThemes(updated);
  };

  const deleteTheme = (index) => {
    if (window.confirm("削除してもよろしいですか？")) {
      setThemes(themes.filter((_, i) => i !== index));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <section style={{ marginBottom: '30px' }}>
        <h3 style={{ borderLeft: '4px solid #8c7b75', paddingLeft: '10px', marginBottom: '15px' }}>
          トークテーマの管理
        </h3>
        
        {/* 新規追加フォーム */}
        <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
          <input 
            value={newTheme}
            onChange={(e) => setNewTheme(e.target.value)}
            placeholder="新しいお題を入力..."
            style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}
          />
          <button onClick={addTheme} style={addButtonStyle}>追加</button>
        </div>

        {/* お題一覧（スクロール可能） */}
        <div style={{ maxHeight: '400px', overflowY: 'auto', background: '#fdfdfd', borderRadius: '12px', border: '1px solid #eee' }}>
          {themes.map((theme, index) => (
            <div key={index} style={{ 
              display: 'flex', alignItems: 'center', padding: '12px', 
              borderBottom: '1px solid #f5f5f5',
              opacity: theme.enabled ? 1 : 0.5 
            }}>
              <input 
                type="checkbox" 
                checked={theme.enabled} 
                onChange={() => toggleTheme(index)}
                style={{ width: '20px', height: '20px', marginRight: '12px', cursor: 'pointer' }}
              />
              <span style={{ 
                flex: 1, 
                fontSize: '0.95rem',
                textDecoration: theme.enabled ? 'none' : 'line-through' 
              }}>
                {theme.text}
              </span>
              <button 
                onClick={() => deleteTheme(index)} 
                style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: '5px' }}
              >
                削除
              </button>
            </div>
          ))}
        </div>
      </section>

      <p style={{ fontSize: '0.8rem', color: '#999', textAlign: 'center' }}>
        ※設定はブラウザに保存されます
      </p>
    </div>
  );
};

const addButtonStyle = {
  padding: '0 20px', background: '#8c7b75', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold'
};

export default Settings;