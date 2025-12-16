import { useState } from 'react';
import { BINGO_MISSIONS } from './data'; // ★データを読み込む

const Bingo = () => {
  // 初期値としてデータを読み込む
  const [missions, setMissions] = useState(BINGO_MISSIONS);

  const toggleCheck = (id) => {
    setMissions(missions.map(mission => 
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
        {missions.map((mission) => (
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
              transition: 'all 0.2s'
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