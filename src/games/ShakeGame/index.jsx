import { useState, useEffect, useRef } from 'react';

const ShakeGame = () => {
  const [count,jw] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10); // 制限時間（秒）
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  
  // センサーの値（前回の加速度を保存して差分をとる）
  const prevAcc = useRef({ x: 0, y: 0, z: 0 });
  const SHAKE_THRESHOLD = 15; // 振りの感度（調整可能）

  // iOS向けのセンサー許可リクエスト
  const requestPermission = async () => {
    if (
      typeof DeviceMotionEvent !== 'undefined' &&
      typeof DeviceMotionEvent.requestPermission === 'function'
    ) {
      try {
        const response = await DeviceMotionEvent.requestPermission();
        if (response === 'granted') {
          setPermissionGranted(true);
          startGame();
        } else {
          alert('センサーの許可が必要です');
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      // AndroidやPCなど許可不要な場合
      setPermissionGranted(true);
      startGame();
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setIsFinished(false);
    setCount(0);
    setTimeLeft(10);
    prevAcc.current = { x: 0, y: 0, z: 0 };
  };

  // タイマー処理
  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
      setIsFinished(true);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  // シェイク検知処理
  useEffect(() => {
    if (!isPlaying) return;

    const handleMotion = (event) => {
      const { x, y, z } = event.acceleration; // 重力を含まない加速度
      if (!x || !y || !z) return;

      const acc = Math.abs(x) + Math.abs(y) + Math.abs(z);
      const prev = Math.abs(prevAcc.current.x) + Math.abs(prevAcc.current.y) + Math.abs(prevAcc.current.z);
      
      // 変化量が閾値を超えたらカウント
      if (Math.abs(acc - prev) > SHAKE_THRESHOLD) {
        setCount((c) => c + 1);
      }

      prevAcc.current = { x, y, z };
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [isPlaying]);

  // スコアに応じた「炭酸の高さ」計算 (最大300回でMAXなど調整)
  const sprayHeight = Math.min(count * 2, 100); 

  return (
    <div style={{ textAlign: 'center', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
      
      {/* ゲーム状態表示エリア */}
      <div style={{ zIndex: 10, marginTop: '20px' }}>
        {!isPlaying && !isFinished && (
          <div>
            <h2 style={{ color: '#8c7b75', marginBottom: '20px' }}>🍾 シェイク！</h2>
            <p style={{ marginBottom: '20px' }}>10秒間で何回振れるか勝負！</p>
            <button onClick={requestPermission} style={startButtonStyle}>
              スタート！
            </button>
          </div>
        )}

        {isPlaying && (
          <div>
            <h1 style={{ fontSize: '4rem', color: '#ff4d4d', margin: '0' }}>{timeLeft}</h1>
            <p style={{ fontWeight: 'bold' }}>スマホを振れ！！</p>
          </div>
        )}

        {isFinished && (
          <div style={{ background: 'rgba(255,255,255,0.9)', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#FF9800' }}>Time Up!</h2>
            <p style={{ fontSize: '1.2rem', margin: '10px 0' }}>記録</p>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#333' }}>{count} <span style={{fontSize: '1rem'}}>回</span></p>
            <button onClick={startGame} style={{...startButtonStyle, marginTop: '10px', backgroundColor: '#8c7b75'}}>もう一回</button>
          </div>
        )}
      </div>

      {/* 視覚エフェクト：炭酸ジュース */}
      <div style={{ 
        position: 'absolute', 
        bottom: 0, 
        width: '100%', 
        height: '100%', 
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center'
      }}>
        {/* 噴き出す液体 */}
        <div style={{
          width: '60%',
          height: `${sprayHeight}%`,
          backgroundColor: '#ffecb3', // ビールやサイダーっぽい色
          backgroundImage: 'linear-gradient(to top, #FFC107 0%, #fff 100%)',
          transition: 'height 0.1s linear',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          boxShadow: '0 0 20px rgba(255, 193, 7, 0.5)',
          position: 'relative',
          opacity: 0.8
        }}>
           {/* 泡の表現（簡易的） */}
           <div style={{ position: 'absolute', top: '-10px', width: '100%', textAlign: 'center', fontSize: '2rem' }}>
             🫧
           </div>
        </div>
      </div>

      {/* ボトルのイメージ（簡易アイコン） */}
      <div style={{ position: 'absolute', bottom: '10px', fontSize: '4rem', zIndex: 5 }}>
        🍾
      </div>
    </div>
  );
};

const startButtonStyle = {
  padding: '15px 40px',
  fontSize: '1.2rem',
  background: '#FF9800',
  color: '#fff',
  border: 'none',
  borderRadius: '30px',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
};

export default ShakeGame;