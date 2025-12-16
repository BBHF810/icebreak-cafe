import { useState } from 'react'; // ★useEffectは使わないので削除

const Bingo = ({ missions }) => {
  // ★useEffectを使わず、ここで直接初期化する
  // (画面が開かれた瞬間に1回だけ実行されます)
  const [gameMissions, setGameMissions] = useState(() => {
    return missions.map(m => ({
      ...m,
      checked: false // ゲーム開始時は常にチェックなし
    }));
  });

  const toggleCheck = (id) => {
    setGameMissions(gameMissions.map(mission => 
      mission.id === id ? { ...mission, checked: !mission.checked } : mission
    ));
  };

  return (
    <div style={{ textAlign: 'center', padding: '10px' }}>
      <h2>🎯 共通点ビンゴ</h2>
      <p style={{ fontSize: '0.9rem' }}>タップしてマスを埋めよう！</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        maxWidth: '350px',
        margin: '20px auto'
      }}>
        {gameMissions.map((mission) => (
          <div
            key={mission.id}
            onClick={() => toggleCheck(mission.id)}
            style={{
              aspectRatio: '1 / 1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: mission.checked ? '#FFD700' : '#f9f9f9',
              color: mission.checked ? '#d32f2f' : '#333',
              border: mission.checked ? '3px solid #FF8C00' : '1px solid #ddd',
              borderRadius: '8px',
              padding: '5px',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'all 0.2s',
              wordBreak: 'break-word'
            }}
          >
            {mission.checked ? "OK!" : mission.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bingo;