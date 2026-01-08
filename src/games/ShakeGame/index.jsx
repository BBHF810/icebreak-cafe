import { useState, useEffect, useRef } from 'react';

const ShakeGame = () => {
  // ★ 修正1: 正しい変数名 setCount に変更
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  // シェイク判定用のフラグ（連続カウント防止）
  const isShaking = useRef(false);

  // iOS向けのセンサー許可リクエスト
  const requestPermission = async () => {
    if (
      typeof DeviceMotionEvent !== 'undefined' &&
      typeof DeviceMotionEvent.requestPermission === 'function'
    ) {
      try {
        const response = await DeviceMotionEvent.requestPermission();
        if (response === 'granted') {
          startGame();
        } else {
          alert('センサーの許可が必要です');
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      startGame();
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setIsFinished(false);
    setCount(0);
    setTimeLeft(10);
    isShaking.current = false;
  };

  // タイマー処理
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsPlaying(false);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // シェイク検知処理
  useEffect(() => {
    if (!isPlaying) return;

    const handleMotion = (event) => {
      const { x, y, z } = event.acceleration; // 重力を含まない加速度
      
      // ★ 修正2: 数値が0の場合も許容するように条件修正
      if (x == null || y == null || z == null) return;

      const acc = Math.abs(x) + Math.abs(y) + Math.abs(z);
      
      // ★ 修正3: シェイク判定ロジックの改善（シュミットトリガー方式）
      // 閾値(15)を超えたらカウントし、閾値(5)を下回るまで次はカウントしない
      if (!isShaking.current && acc > 15) {
        setCount((c) => c + 1);
        isShaking.current = true;
      } else if (isShaking.current && acc < 5) {
        isShaking.current = false;
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [isPlaying]);

  // スコアに応じた「炭酸の高さ」計算 (最大100%まで)
  const sprayHeight = Math.min(count * 3, 100); 

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
            <p style={{ fontSize: '1.5rem' }}>Count: {count}</p>
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
        <div style={{
          width: '60%',
          height: `${sprayHeight}%`,
          backgroundColor: '#ffecb3',
          backgroundImage: 'linear-gradient(to top, #FFC107 0%, #fff 100%)',
          transition: 'height 0.1s linear',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          boxShadow: '0 0 20px rgba(255, 193, 7, 0.5)',
          position: 'relative',
          opacity: 0.8
        }}>
           <div style={{ position: 'absolute', top: '-10px', width: '100%', textAlign: 'center', fontSize: '2rem' }}>
             🫧
           </div>
        </div>
      </div>

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