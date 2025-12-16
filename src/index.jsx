// index.jsx という名前なら、フォルダ名だけで自動的に読み込まれます
import TalkTheme from './games/TalkTheme'; 
import Bingo from './games/Bingo';

function App() {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '50px' }}>
      <h1>🧊 Icebreak Cafe</h1>
      
      {/* 動作確認用に2つとも表示 */}
      <TalkTheme />
      <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid #ccc' }} />
      <Bingo />
      
    </div>
  );
}

export default App;