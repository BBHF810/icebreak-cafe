import { useState, useEffect, useRef } from 'react';

const ShakeGame = () => {
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  // 演出の状態管理: 'idle'(待機), 'buildup'(溜め), 'erupt'(噴出), 'done'(完了)
  const [animationPhase, setAnimationPhase] = useState('idle');
  const [displayScore, setDisplayScore] = useState(0);
  
  const animationRef = useRef(null);
  const latestCountRef = useRef(count);
  const isShaking = useRef(false);

  useEffect(() => {
    latestCountRef.current = count;
  }, [count]);

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
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    
    setIsPlaying(true);
    setIsFinished(false);
    setAnimationPhase('idle');
    setCount(0);
    setDisplayScore(0);
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

  // シェイク検知
  useEffect(() => {
    if (!isPlaying) return;

    const handleMotion = (event) => {
      const { x, y, z } = event.acceleration;
      if (x == null || y == null || z == null) return;
      const acc = Math.abs(x) + Math.abs(y) + Math.abs(z);
      
      // 感度調整
      if (!isShaking.current && acc > 8) {
        setCount((c) => c + 1);
        isShaking.current = true;
      } else if (isShaking.current && acc < 3) {
        isShaking.current = false;
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [isPlaying]);


  // ★ 結果発表のアニメーションシーケンス制御
  useEffect(() => {
    if (isFinished) {
      // 1. まず「溜め」フェーズへ。ジュースをリセット。
      setAnimationPhase('buildup');
      setDisplayScore(0);

      // 2. 1秒後に「噴出」開始
      const timer = setTimeout(() => {
        setAnimationPhase('erupt');
        startScoreAnimation();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isFinished]);

  // スコアのカウントアップアニメーション
  const startScoreAnimation = () => {
    const targetScore = latestCountRef.current;
    const startTime = Date.now();
    const DURATION = 2500; // 2.5秒かけて伸びる

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / DURATION, 1);
      
      // イージング（最初は速く、最後はゆっくり: easeOutExpoっぽい動き）
      // 1 - Math.pow(2, -10 * progress) を使うと勢いよく出てゆっくり止まる
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentScore = Math.floor(targetScore * ease);
      setDisplayScore(currentScore);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setAnimationPhase('done');
      }
    };
    animationRef.current = requestAnimationFrame(animate);
  };


  // ★ ジュースの高さ計算ロジック
  let sprayHeight = 0;
  if (isPlaying) {
    // プレイ中: リアルタイムに少し反応させる（最大でも画面半分くらいまで）
    sprayHeight = Math.min(count * 1, 50); 
  } else if (animationPhase === 'buildup') {
    // 溜め: 一旦0にする（ボトルに戻る）
    sprayHeight = 0;
  } else if (animationPhase === 'erupt' || animationPhase === 'done') {
    // 噴出・完了: アニメーション中のスコアを使って高さを決める（最大100%）
    sprayHeight = Math.min(displayScore * 3, 100);
  }

  return (
    <div style={{ textAlign: 'center', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
      
      {/* メインコンテンツエリア */}
      <div style={{ zIndex: 10, marginTop: '20px', width: '100%' }}>
        
        {/* スタート画面 */}
        {!isPlaying && !isFinished && (
          <div>
            <h2 style={{ color: '#8c7b75', marginBottom: '20px' }}>🍾 シェイク！</h2>
            <p style={{ marginBottom: '20px' }}>10秒間で何回振れるか勝負！</p>
            <button onClick={requestPermission} style={startButtonStyle}>
              スタート！
            </button>
          </div>
        )}

        {/* プレイ中画面 */}
        {isPlaying && (
          <div>
            <h1 style={{ fontSize: '4rem', color: '#ff4d4d', margin: '0' }}>{timeLeft}</h1>
            <p style={{ fontWeight: 'bold' }}>スマホを振れ！！</p>
            <p style={{ fontSize: '1.5rem', opacity: 0.7 }}>Count: {count}</p>
          </div>
        )}

        {/* 結果発表画面 */}
        {isFinished && (
          <div style={{ 
            transition: 'opacity 0.5s', 
            opacity: 1,
            marginTop: '20px'
          }}>
            <h2 style={{ color: '#FF9800', fontSize: '2.5rem', margin: '0 0 20px 0', textShadow: '2px 2px 0 #fff' }}>Time Up!</h2>
            
            {/* スコア表示: 溜め(buildup)の間は隠し、噴出(erupt)から表示 */}
            <div style={{ 
              opacity: animationPhase === 'buildup' ? 0 : 1, 
              transition: 'opacity 0.3s',
              transform: animationPhase === 'buildup' ? 'scale(0.5)' : 'scale(1)',
            }}>
              <div style={{ 
                background: 'rgba(255,255,255,0.9)', 
                padding: '20px 40px', 
                borderRadius: '20px', 
                display: 'inline-block',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
              }}>
                <p style={{ fontSize: '1.2rem', margin: '0', color: '#666' }}>記録</p>
                <p style={{ fontSize: '4rem', fontWeight: 'bold', color: '#333', margin: '5px 0', lineHeight: 1 }}>
                  {displayScore}
                  <span style={{fontSize: '1.5rem', marginLeft: '5px'}}>回</span>
                </p>
              </div>
              
              {/* 完了後に「もう一回」ボタンを表示 */}
              <div style={{ 
                marginTop: '30px', 
                opacity: animationPhase === 'done' ? 1 : 0, 
                transition: 'opacity 0.5s',
                pointerEvents: animationPhase === 'done' ? 'auto' : 'none'
              }}>
                <button onClick={startGame} style={{...startButtonStyle, backgroundColor: '#8c7b75'}}>もう一回</button>
              </div>
            </div>
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
        justifyContent: 'center',
        zIndex: 1
      }}>
        {/* 噴き出す液体 */}
        <div style={{
          width: '70%', // 少し太くしました
          height: `${sprayHeight}%`,
          backgroundColor: '#ffecb3',
          backgroundImage: 'linear-gradient(to top, #FFC107 0%, #fff 120%)',
          // アニメーション制御: 溜め(buildup)の時はスッと戻る、噴出(erupt)の時は滑らかに
          transition: animationPhase === 'buildup' ? 'height 0.3s ease-in' : (animationPhase === 'erupt' ? 'height 0.1s linear' : 'height 0.1s linear'),
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          boxShadow: '0 0 30px rgba(255, 193, 7, 0.6)',
          position: 'relative',
          opacity: 0.9
        }}>
           {/* 泡の表現 */}
           <div style={{ position: 'absolute', top: '-20px', width: '100%', textAlign: 'center', fontSize: '3rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
             🫧
           </div>
           {/* 飛沫のエフェクト（装飾） */}
           {animationPhase === 'erupt' && (
             <>
               <div style={{ position: 'absolute', top: '0', left: '-10px', fontSize: '2rem', animation: 'splash 0.5s infinite' }}>💧</div>
               <div style={{ position: 'absolute', top: '10px', right: '-15px', fontSize: '1.5rem', animation: 'splash 0.7s infinite' }}>💧</div>
             </>
           )}
        </div>
      </div>

      {/* ボトルのイメージ */}
      <div style={{ 
        position: 'absolute', 
        bottom: '10px', 
        fontSize: '5rem', 
        zIndex: 5,
        // 噴出中はボトルを揺らす
        animation: animationPhase === 'erupt' ? 'shake 0.1s infinite' : 'none'
      }}>
        🍾
      </div>

      {/* CSSアニメーション定義 */}
      <style>{`
        @keyframes splash {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-50px) scale(0); opacity: 0; }
        }
        @keyframes shake {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
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