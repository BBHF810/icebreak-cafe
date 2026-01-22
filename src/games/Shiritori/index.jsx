// src/games/Shiritori/index.jsx
import { useState, useRef, useEffect } from 'react';

const Shiritori = () => {
  const [history, setHistory] = useState([]); // { id, word, reading }
  const [inputText, setInputText] = useState("");
  const [points, setPoints] = useState(0);
  const [nextChar, setNextChar] = useState(""); // 次の頭文字
  const [isChanging, setIsChanging] = useState(false); // 文字変更モード
  const [errorMsg, setErrorMsg] = useState("");

  const inputRef = useRef(null);

  // ひらがな変換ヘルパー
  const toHiragana = (str) => {
    return str.replace(/[\u30a1-\u30f6]/g, function(match) {
      var chr = match.charCodeAt(0) - 0x60;
      return String.fromCharCode(chr);
    });
  };

  // 最後の文字を取得する（小文字は大文字に、長音は前の母音に...は簡易的に無視してそのまま取得）
  // ※より厳密にする場合は長音処理などを追加してください
  const getLastChar = (str) => {
    const hira = toHiragana(str);
    let last = hira.slice(-1);
    
    // 小文字を大文字に変換するマップ
    const smallToBig = {
      'ぁ': 'あ', 'ぃ': 'い', 'ぅ': 'う', 'ぇ': 'え', 'ぉ': 'お',
      'っ': 'つ', 'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ', 'ゎ': 'わ'
    };
    if (smallToBig[last]) last = smallToBig[last];
    
    // 長音「ー」の場合、その前の文字の母音に合わせるのが一般的だが、
    // ここでは簡易的に「その前の文字」を末尾とする（「ミキサー」→「サ」）
    if (last === 'ー' && hira.length > 1) {
      let prev = hira.slice(-2, -1);
      if (smallToBig[prev]) prev = smallToBig[prev];
      // さらに前の文字の母音列判定が必要だが、今回は簡易的に前の文字自体を返す
      return prev; 
    }
    return last;
  };

  const handleAddWord = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const word = inputText.trim();
    const hiraWord = toHiragana(word);
    const firstChar = hiraWord.charAt(0);

    // バリデーション
    if (nextChar && firstChar !== nextChar) {
      setErrorMsg(`「${nextChar}」から始まる言葉を入力してね！`);
      return;
    }
    if (hiraWord.slice(-1) === 'ん') {
      setErrorMsg("「ん」で終わってしまった！ゲームオーバー？（続行可能）");
      // ここでリセットするかはルール次第。今回は警告のみで通す
    }

    // 登録処理
    const newHistory = [...history, { id: Date.now(), word: word }];
    setHistory(newHistory);
    
    // ポイント加算（初回以外）
    if (history.length > 0) {
      setPoints(points + 1);
    }

    // 次の文字を設定
    const last = getLastChar(hiraWord);
    setNextChar(last);
    
    setInputText("");
    setErrorMsg("");
    setIsChanging(false);
  };

  // 母音ごとの文字リスト
  const vowelMap = {
    'a': ['あ','か','さ','た','な','は','ま','や','ら','わ','が','ざ','だ','ば','ぱ'],
    'i': ['い','き','し','ち','に','ひ','み','り','ぎ','じ','ぢ','び','ぴ'],
    'u': ['う','く','す','つ','ぬ','ふ','む','ゆ','ru','ぐ','ず','づ','ぶ','ぷ'], // 'ru' is typo fix intended 'る'
    'e': ['え','け','せ','て','ね','へ','め','れ','げ','ぜ','で','べ','ぺ'],
    'o': ['お','こ','そ','と','の','ほ','も','よ','ろ','を','ご','ぞ','ど','ぼ','ぽ']
  };
  // 'ru' fix above: actually lets write strictly below inside the function

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
        <h2 style={{ color: '#8c7b75', margin: '0 0 10px 0' }}>🏃 しりとりハント</h2>
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

      {/* メインゲームエリア */}
      <div style={{ marginBottom: '30px' }}>
        {nextChar && (
          <div style={{ fontSize: '1.2rem', marginBottom: '15px' }}>
            次は <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ff5722' }}>{nextChar}</span> から！
          </div>
        )}
        
        <form onSubmit={handleAddWord} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={history.length === 0 ? "最初に見つけたものは？" : "近くにあるものでしりとり！"}
            style={{
              flex: 1, padding: '15px', borderRadius: '8px', border: '2px solid #ddd', fontSize: '1rem',
              outline: 'none'
            }}
          />
          <button type="submit" style={{
            padding: '0 20px', background: '#8c7b75', color: '#fff', border: 'none',
            borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'
          }}>
            決定
          </button>
        </form>
        {errorMsg && <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '5px' }}>{errorMsg}</p>}
      </div>

      {/* 履歴 */}
      <div style={{ textAlign: 'left', padding: '10px' }}>
        <h3 style={{ fontSize: '1rem', color: '#666', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>📜 しりとり履歴</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
          {history.length === 0 && <p style={{ color: '#999', fontSize: '0.9rem' }}>まだ履歴がありません。</p>}
          {history.map((item, index) => (
            <div key={item.id} style={{ display: 'flex', items: 'center' }}>
              <span style={{ 
                background: '#fff', padding: '5px 12px', borderRadius: '15px', 
                border: '1px solid #eee', fontSize: '0.9rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                {item.word}
              </span>
              {index < history.length - 1 && <span style={{ margin: '0 2px', color: '#ccc' }}>→</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shiritori;