import { useState, useRef, useEffect } from 'react';

const Shiritori = () => {
  const [history, setHistory] = useState([]); // { id, word, reading, imageUrl }
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // 選択された画像ファイル
  const [previewUrl, setPreviewUrl] = useState(""); // プレビュー用URL
  const [points, setPoints] = useState(0);
  const [nextChar, setNextChar] = useState(""); 
  const [isChanging, setIsChanging] = useState(false); 
  const [errorMsg, setErrorMsg] = useState("");

  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // メモリリーク防止：コンポーネントが消えるときにObjectUrlを解放
  useEffect(() => {
    return () => {
      history.forEach(item => {
        if (item.imageUrl) URL.revokeObjectURL(item.imageUrl);
      });
    };
  }, [history]);

  const toHiragana = (str) => {
    return str.replace(/[\u30a1-\u30f6]/g, function(match) {
      var chr = match.charCodeAt(0) - 0x60;
      return String.fromCharCode(chr);
    });
  };

  const getLastChar = (str) => {
    const hira = toHiragana(str);
    let last = hira.slice(-1);
    const smallToBig = {
      'ぁ': 'あ', 'ぃ': 'い', 'ぅ': 'う', 'ぇ': 'え', 'ぉ': 'お',
      'っ': 'つ', 'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ', 'ゎ': 'わ'
    };
    if (smallToBig[last]) last = smallToBig[last];
    if (last === 'ー' && hira.length > 1) {
      let prev = hira.slice(-2, -1);
      if (smallToBig[prev]) prev = smallToBig[prev];
      return prev; 
    }
    return last;
  };

  // 画像選択時の処理
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleAddWord = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // ★画像必須チェック（任意にする場合はこのifを外してください）
    if (!selectedImage) {
      setErrorMsg("証拠写真も撮影してね！");
      return;
    }

    const word = inputText.trim();
    const hiraWord = toHiragana(word);
    const firstChar = hiraWord.charAt(0);

    if (nextChar && firstChar !== nextChar) {
      setErrorMsg(`「${nextChar}」から始まる言葉を入力してね！`);
      return;
    }
    if (hiraWord.slice(-1) === 'ん') {
      setErrorMsg("「ん」で終わってしまった！ゲームオーバー？（続行可能）");
    }

    // 履歴に追加（画像URLを含む）
    // プレビュー用のURLをそのまま履歴用に使います（本来はサーバーアップロード等を行いますが、今回はローカル表示のみ）
    const newHistory = [...history, { 
      id: Date.now(), 
      word: word, 
      imageUrl: previewUrl // 確定したURLを保存
    }];
    setHistory(newHistory);
    
    if (history.length > 0) {
      setPoints(points + 1);
    }

    const last = getLastChar(hiraWord);
    setNextChar(last);
    
    // リセット
    setInputText("");
    setSelectedImage(null);
    setPreviewUrl(""); // 次のためにプレビューは消すが、ObjectUrl自体は履歴で使うのでrevokeしない
    setErrorMsg("");
    setIsChanging(false);
    
    // ファイル入力をクリア
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getAlternatives = (char) => {
    const target = toHiragana(char);
    const rows = [
      { vowel: 'a', chars: 'あかさたなはまやらわがざだばぱ' },
      { vowel: 'i', chars: 'いきしちにひみりぎじぢびぴ' },
      { vowel: 'u', chars: 'うくすつぬふむゆるぐずづぶぷ' },
      { vowel: 'e', chars: 'えけせてねへめれげぜでべぺ' },
      { vowel: 'o', chars: 'おこそとのほもよろをごぞどぼぽ' },
    ];
    const found = rows.find(r => r.chars.includes(target));
    if (!found) return [];
    return found.chars.split('').filter(c => c !== target);
  };

  const handleChangeChar = (newChar) => {
    if (points < 3) return;
    setPoints(points - 3);
    setNextChar(newChar);
    setIsChanging(false);
    setErrorMsg(`「${newChar}」に変更しました！`);
  };

  return (
    <div style={{ padding: '10px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px', padding: '15px', background: '#fff', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#8c7b75', margin: '0 0 10px 0' }}>📷 しりとりハント</h2>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fdfbf7', padding: '10px', borderRadius: '8px' }}>
          <div style={{ fontWeight: 'bold' }}>
            現在のポイント: <span style={{ color: '#FF9800', fontSize: '1.5rem' }}>{points}</span> pt
          </div>
          {history.length > 0 && (
            <button 
              onClick={() => setIsChanging(!isChanging)}
              disabled={points < 3}
              style={{
                background: points >= 3 ? '#2196F3' : '#ccc',
                color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '20px',
                fontWeight: 'bold', fontSize: '0.8rem', cursor: points >= 3 ? 'pointer' : 'not-allowed'
              }}
            >
              文字変更 (3pt)
            </button>
          )}
        </div>

        {/* 文字変更パネル */}
        {isChanging && nextChar && (
          <div style={{ marginTop: '15px', padding: '10px', border: '2px dashed #2196F3', borderRadius: '8px', background: '#e3f2fd' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#0d47a1' }}>
              今の母音と同じ文字に変更できます（消費: 3pt）
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px' }}>
              {getAlternatives(nextChar).map(c => (
                <button
                  key={c}
                  onClick={() => handleChangeChar(c)}
                  style={{
                    width: '35px', height: '35px', borderRadius: '50%', border: '1px solid #2196F3',
                    background: '#fff', color: '#2196F3', fontWeight: 'bold', cursor: 'pointer'
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
            {getAlternatives(nextChar).length === 0 && <p style={{fontSize: '0.8rem'}}>変更候補がありません</p>}
            <button onClick={() => setIsChanging(false)} style={{ marginTop: '10px', background: 'none', border: 'none', color: '#666', textDecoration: 'underline', cursor: 'pointer' }}>キャンセル</button>
          </div>
        )}
      </div>

      {/* 入力エリア */}
      <div style={{ marginBottom: '30px' }}>
        {nextChar && (
          <div style={{ fontSize: '1.2rem', marginBottom: '15px' }}>
            次は <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ff5722' }}>{nextChar}</span> のものを探せ！
          </div>
        )}
        
        <form onSubmit={handleAddWord} style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#fafafa', padding: '15px', borderRadius: '10px', border: '1px solid #eee' }}>
          
          {/* 画像入力とプレビュー */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ 
              flex: 1, cursor: 'pointer', background: '#8c7b75', color: '#fff', 
              padding: '10px', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'
            }}>
              <span>📸 写真を撮る</span>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                capture="environment" // スマホで外カメラを優先起動
                onChange={handleImageSelect}
                style={{ display: 'none' }} 
              />
            </label>
            {previewUrl ? (
              <img src={previewUrl} alt="プレビュー" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px', border: '1px solid #ccc' }} />
            ) : (
              <div style={{ width: '50px', height: '50px', background: '#eee', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#999' }}>未選択</div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="それは何？（例：とけい）"
              style={{
                flex: 1, padding: '12px', borderRadius: '8px', border: '2px solid #ddd', fontSize: '1rem',
                outline: 'none'
              }}
            />
            <button type="submit" style={{
              padding: '0 20px', background: '#ff7043', color: '#fff', border: 'none',
              borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'
            }}>
              決定
            </button>
          </div>
        </form>
        {errorMsg && <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '5px' }}>{errorMsg}</p>}
      </div>

      {/* 履歴（写真付き） */}
      <div style={{ textAlign: 'left', padding: '10px' }}>
        <h3 style={{ fontSize: '1rem', color: '#666', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>📜 発見記録</h3>
        <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '10px', marginTop: '10px' }}>
          {history.length === 0 && <p style={{ color: '#999', fontSize: '0.9rem', textAlign: 'center' }}>まだ何も見つかっていません。</p>}
          
          {history.map((item, index) => (
            <div key={item.id} style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', 
              background: '#fff', padding: '10px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ccc', width: '20px', textAlign: 'center' }}>
                {index + 1}
              </div>
              
              {/* サムネイル画像 */}
              {item.imageUrl && (
                <img 
                  src={item.imageUrl} 
                  alt={item.word} 
                  style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }} 
                />
              )}
              
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>
                {item.word}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shiritori;