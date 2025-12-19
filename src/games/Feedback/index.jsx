import { useState } from 'react';

const Feedback = ({ feedbacks, onAddFeedback, onDeleteFeedback }) => {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [baton, setBaton] = useState("");
  const [tab, setTab] = useState("board"); // 'board' or 'form'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment && !baton) return;

    const newEntry = {
      name: name || "匿名さん",
      comment: comment,
      baton: baton,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onAddFeedback(newEntry);
    setComment("");
    setBaton("");
    setTab("board"); 
  };

  return (
    <div style={{ width: '100%', maxWidth: '500px', padding: '0 10px' }}>
      {/* タブ切り替え */}
      <div style={{ display: 'flex', marginBottom: '20px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #8c7b75' }}>
        <button 
          onClick={() => setTab("board")} 
          style={{ flex: 1, padding: '10px', background: tab === "board" ? "#8c7b75" : "#fff", color: tab === "board" ? "#fff" : "#8c7b75", border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
        >
          みんなの掲示板
        </button>
        <button 
          onClick={() => setTab("form")} 
          style={{ flex: 1, padding: '10px', background: tab === "form" ? "#8c7b75" : "#fff", color: tab === "form" ? "#fff" : "#8c7b75", border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
        >
          感想を書く
        </button>
      </div>

      {tab === "form" ? (
        /* 入力フォーム */
        <form onSubmit={handleSubmit} style={{ textAlign: 'left', background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>お名前（ニックネーム可）</label>
            <input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="匿名さん" 
              style={inputStyle} 
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>💬 一言掲示板（今日の感想）</label>
            <textarea 
              value={comment} 
              onChange={(e) => setComment(e.target.value)} 
              placeholder="楽しかったこと、印象に残ったことなど" 
              style={{ ...inputStyle, height: '80px', resize: 'none' }} 
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>🏃 次へのバトン（やってみたいこと）</label>
            <textarea 
              value={baton} 
              onChange={(e) => setBaton(e.target.value)} 
              placeholder="次のお菓子リクエストや、話したいテーマなど" 
              style={{ ...inputStyle, height: '80px', resize: 'none' }} 
            />
          </div>
          <button type="submit" style={submitButtonStyle}>メッセージを送る</button>
        </form>
      ) : (
        /* 掲示板表示 */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {feedbacks.length === 0 ? (
            <p style={{ color: '#999', marginTop: '30px' }}>まだ感想がありません。<br/>最初の感想を書いてみませんか？</p>
          ) : (
            [...feedbacks].reverse().map((f) => (
              <div key={f.id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px dashed #eee', paddingBottom: '4px' }}>
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#8c7b75' }}>{f.name}</span>
                    <span style={{ fontSize: '0.75rem', color: '#999', marginLeft: '10px' }}>{f.date}</span>
                  </div>
                  
                  {/* 削除ボタン */}
                  <button 
                    onClick={() => onDeleteFeedback(f.id)}
                    style={{ border: 'none', background: 'none', color: '#ddd', fontSize: '1.2rem', cursor: 'pointer', padding: '0 5px' }}
                    onMouseOver={(e) => e.target.style.color = '#ff4d4d'}
                    onMouseOut={(e) => e.target.style.color = '#ddd'}
                  >
                    ×
                  </button>
                </div>
                {f.comment && (
                  <div style={{ marginBottom: '10px' }}>
                    <small style={{ color: '#4CAF50', fontWeight: 'bold', fontSize: '0.7rem' }}>💬 感想</small>
                    <p style={{ margin: '2px 0', fontSize: '0.95rem', color: '#333', whiteSpace: 'pre-wrap' }}>{f.comment}</p>
                  </div>
                )}
                {f.baton && (
                  <div>
                    <small style={{ color: '#FF9800', fontWeight: 'bold', fontSize: '0.7rem' }}>🏃 次へのバトン</small>
                    <p style={{ margin: '2px 0', fontSize: '0.95rem', color: '#555', fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>{f.baton}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const labelStyle = { display: 'block', marginBottom: '5px', fontSize: '0.85rem', fontWeight: 'bold', color: '#666' };
const inputStyle = { width: '100%', padding: '12px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' };
const submitButtonStyle = { width: '100%', padding: '14px', background: '#8c7b75', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
const cardStyle = { textAlign: 'left', background: '#fff', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: '5px solid #8c7b75', position: 'relative' };

export default Feedback;