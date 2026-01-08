import { useState, useEffect, useRef } from 'react';

const ShakeGame = () => {
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  // ★ 追加: アニメーション表示用のスコア
  const [displayScore, setDisplayScore] = useState(0);
  // ★ 追加: アニメーション制御用のref
  const animationRef = useRef(null);
  // ★ 追加: 最新のcountを保持するref（タイマー終了時に正しい値を取得するため）
  const latestCountRef = useRef(count);

  // シェイク判定用のフラグ
  const isShaking = useRef(false);

  // countが更新されたらrefも更新
  useEffect(() => {
    latestCountRef.current = count;
  }, [count]);

  // iOS向けのセンサー許可リクエスト
  const requestPermission = async () => {
    // ... (変更なし)
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
    // アニメーションが動いていたら止める
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    
    setIsPlaying(true);
    setIsFinished(false);
    setCount(0);
    setDisplayScore(0); // ★ 追加: 表示用スコアもリセット
    setTimeLeft(10);
    isShaking.current = false;
  };

  // タイマー処理
  useEffect(() => {
    // ... (変更なし)
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
    // ... (変更なし)
    if (!isPlaying) return;

    const handleMotion = (event) => {
      const { x, y, z } = event.acceleration;
      if (x == null || y == null || z == null) return;
      const acc = Math.abs(x) + Math.abs(y) + Math.abs(z);
      
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

  // ★ 追加: 結果発表のアニメーション処理
  useEffect(() => {
    if (isFinished) {
      setDisplayScore(0);
      const targetScore = latestCountRef.current;
      let currentScore = 0;

      const animate = () => {
        if (currentScore < targetScore) {
          // 残りのスコアに応じて増加スピードを調整（演出）
          const remaining = targetScore - currentScore;
          let increment = 1;
          if (remaining > 50) increment = 4;
          else if (remaining > 20) increment = 2;
          
          currentScore += increment;
          if (currentScore > targetScore) currentScore = targetScore; // 行き過ぎ防止

          setDisplayScore(currentScore);
          animationRef.current = requestAnimationFrame(animate);
        } else {
          cancelAnimationFrame(animationRef.current);
        }
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    
    // クリーンアップ
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isFinished]);


  // ★ 変更: スコアに応じた「炭酸の高さ」計算
  // プレイ中は count、終了後はアニメーションする displayScore を使う
  const scoreForHeight = isFinished ? displayScore : count;
  const sprayHeight = Math.min(scoreForHeight * 3, 100); 

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
            {/* プレイ中はリアルタイムのカウントを表示 */}
            <p style={{ fontSize: '1.5rem' }}>Count: {count}</p>
          </div>
        )}

        {isFinished && (
          <div style={{ background: 'rgba(255,255,255,0.9)', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#FF9800' }}>Time Up!</h2>
            <p style={{ fontSize: '1.2rem', margin: '10px 0' }}>記録</p>
            {/* ★ 変更: アニメーションする displayScore を表示 */}
            <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#333' }}>
              {displayScore} <span style={{fontSize: '1rem'}}>回</span>
            </p>
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
          // ★ 変更: scoreForHeight に基づいて高さが変わる
          height: `${sprayHeight}%`,
          backgroundColor: '#ffecb3',
          backgroundImage: 'linear-gradient(to top, #FFC107 0%, #fff 100%)',
          // ★ 変更: アニメーション中は少し滑らかに動くようにtransitionを調整
          transition: isFinished ? 'height 0.05s linear' : 'height 0.1s linear',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          boxShadow: '0 0 20px rgba(255, 193, 7, 0.5)',
          position: 'relative',
          opacity: 0.8
        }}>
           {/* 泡の表現 */}
           <div style={{ position: 'absolute', top: '-10px', width: '100%', textAlign: 'center', fontSize: '2rem' }}>
             🫧
           </div>
        </div>
      </div>

      {/* ボトルのイメージ */}
      <div style={{ position: 'absolute', bottom: '10px', fontSize: '4rem', zIndex: 5 }}>
        🍾
      </div>
    </div>
  );
};

const startButtonStyle = {
  // ... (変更なし)
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