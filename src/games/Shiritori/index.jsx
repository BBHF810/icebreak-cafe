import { useState, useRef, useEffect } from 'react';

const Shiritori = () => {
  const [history, setHistory] = useState([]); // { id, word, reading, imageUrl }
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [points, setPoints] = useState(0);
  const [nextChar, setNextChar] = useState(""); 
  const [isChanging, setIsChanging] = useState(false); 
  const [errorMsg, setErrorMsg] = useState("");
  const [showHelp, setShowHelp] = useState(false); // ★追加: ヘルプ表示フラグ

  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

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

    if (!selectedImage) {
      setErrorMsg("しゃしん も とってね！📸");
      return;
    }

    const word = inputText.trim();
    const hiraWord = toHiragana(word);
    const firstChar = hiraWord.charAt(0);

    if (nextChar && firstChar !== nextChar) {
      setErrorMsg(`「${nextChar}」からはじまる ことば だよ！`);
      return;
    }
    if (hiraWord.slice(-1) === 'ん') {
      setErrorMsg("「ん」でおわっちゃった！まけちゃうよ〜（つづけられるよ）");
    }

    const newHistory = [...history, { 
      id: Date.now(), 
      word: word, 
      imageUrl: previewUrl 
    }];
    setHistory(newHistory);
    
    if (history.length > 0) {
      setPoints(points + 1);
    }

    const last = getLastChar(hiraWord);
    setNextChar(last);
    
    setInputText("");
    setSelectedImage(null);
    setPreviewUrl("");
    setErrorMsg("");
    setIsChanging(false);
    
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
    setErrorMsg(`「${newChar}」にかわったよ！`);
  };

  return (
    <div style={{ padding: '10px', textAlign: 'center', maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
      
      {/* ★追加: ヘルプボタン */}
      <button 
        onClick={() => setShowHelp(!showHelp)}
        style={{
          position: 'absolute', top: '10px', right: '10px',
          width: '30px', height: '30px', borderRadius: '50%',
          background: '#FF9800', color: '#fff', border: 'none',
          fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', zIndex: 10
        }}
      >
        ?
      </button>

      {/* ★追加: あそびかた説明モーダル */}
      {showHelp && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.8)', zIndex: 100,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }} onClick={() => setShowHelp(false)}>
          <div style={{
            background: '#fff', padding: '20px', borderRadius: '15px', maxWidth: '90%', maxHeight: '90%', overflowY: 'auto', textAlign: 'left'
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ textAlign: 'center', color: '#ff7043', borderBottom: '2px solid #ff7043', paddingBottom: '10px' }}>📖 あそびかた</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '2rem' }}>🔍</span>
                <div>
                  <strong>1. さがす</strong><br/>
                  「しりとり」で つながるものを、へやのなかから さがそう！
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '2rem' }}>📸</span>
                <div>
                  <strong>2. とる</strong><br/>
                  「しゃしん」ボタンをおして、みつけたものを さつえいしてね。
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '2rem' }}>✏️</span>
                <div>
                  <strong>3. かく</strong><br/>
                  なまえをいれて「けってい」をおそう！
                </div>
              </div>
              <div style={{ background: '#e3f2fd', padding: '10px', borderRadius: '8px' }}>
                <strong>🌟 ポイントをつかおう！</strong><br/>
                しりとりがつづくと <strong>ポイント</strong> がたまるよ。<br/>
                3ポイントためると、むずかしいもじを <strong>ちがうもじ</strong> にへんしんできるよ！
              </div>
            </div>
            <button onClick={() => setShowHelp(false)} style={{
              display: 'block', width: '100%', padding: '12px', marginTop: '20px',
              background: '#8c7b75', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.1rem'
            }}>
              わかった！
            </button>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '20px', padding: '15px', background: '#fff', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#8c7b75', margin: '0 0 10px 0' }}>📷 しりとりハント</h2>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fdfbf7', padding: '10px', borderRadius: '8px' }}>
          <div style={{ fontWeight: 'bold' }}>
            ポイント: <span style={{ color: '#FF9800', fontSize: '1.5rem' }}>{points}</span> pt
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
              もじチェンジ (3pt)
            </button>
          )}
        </div>

        {isChanging && nextChar && (
          <div style={{ marginTop: '15px', padding: '10px', border: '2px dashed #2196F3', borderRadius: '8px', background: '#e3f2fd' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#0d47a1' }}>
              にている おと の もじ に かえられるよ！<br/>(3ポイント つかいます)
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
            {getAlternatives(nextChar).length === 0 && <p style={{fontSize: '0.8rem'}}>かえられる もじ が ないよ</p>}
            <button onClick={() => setIsChanging(false)} style={{ marginTop: '10px', background: 'none', border: 'none', color: '#666', textDecoration: 'underline', cursor: 'pointer' }}>やめる</button>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '30px' }}>
        {nextChar && (
          <div style={{ fontSize: '1.2rem', marginBottom: '15px' }}>
            つぎは <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ff5722' }}>{nextChar}</span> だよ！
          </div>
        )}
        
        <form onSubmit={handleAddWord} style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#fafafa', padding: '15px', borderRadius: '10px', border: '1px solid #eee' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ 
              flex: 1, cursor: 'pointer', background: '#8c7b75', color: '#fff', 
              padding: '10px', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'
            }}>
              <span>📸 しゃしん</span>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                capture="environment" 
                onChange={handleImageSelect}
                style={{ display: 'none' }} 
              />
            </label>
            {previewUrl ? (
              <img src={previewUrl} alt="プレビュー" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px', border: '1px solid #ccc' }} />
            ) : (
              <div style={{ width: '50px', height: '50px', background: '#eee', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#999' }}>なし</div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="なまえ（例：とけい）"
              style={{
                flex: 1, padding: '12px', borderRadius: '8px', border: '2px solid #ddd', fontSize: '1rem',
                outline: 'none'
              }}
            />
            <button type="submit" style={{
              padding: '0 20px', background: '#ff7043', color: '#fff', border: 'none',
              borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'
            }}>
              けってい
            </button>
          </div>
        </form>
        {errorMsg && <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '5px' }}>{errorMsg}</p>}
      </div>

      <div style={{ textAlign: 'left', padding: '10px' }}>
        <h3 style={{ fontSize: '1rem', color: '#666', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>📜 みつけたもの</h3>
        <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '10px', marginTop: '10px' }}>
          {history.length === 0 && <p style={{ color: '#999', fontSize: '0.9rem', textAlign: 'center' }}>まだ なにも ないよ。</p>}
          
          {history.map((item, index) => (
            <div key={item.id} style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', 
              background: '#fff', padding: '10px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ccc', width: '20px', textAlign: 'center' }}>
                {index + 1}
              </div>
              
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